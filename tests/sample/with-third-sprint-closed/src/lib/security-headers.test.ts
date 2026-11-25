import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// static/_headers, which the build copies to build/ and Cloudflare Pages reads (OPS-3): the headers of its rule for
// every path, by their names.
function headersForEveryPath(): Map<string, string> {
	const lines = readFileSync('static/_headers', 'utf8').split(/\r?\n/);
	const headers = new Map<string, string>();
	let inRule = false;
	for (const line of lines) {
		if (!line.trim() || line.trim().startsWith('#')) continue;
		if (!/^\s/.test(line)) {
			inRule = line.trim() === '/*';
			continue;
		}
		const colon = line.indexOf(':');
		if (inRule && colon > 0) headers.set(line.slice(0, colon).trim(), line.slice(colon + 1).trim());
	}
	return headers;
}

describe('the security headers', () => {
	const headers = headersForEveryPath();

	it('set a content security policy that loads Shelf from its own origin alone, and frames it nowhere', () => {
		const policy = headers.get('Content-Security-Policy') ?? '';
		expect(policy).toContain("default-src 'self'");
		expect(policy).toContain("frame-ancestors 'none'");
		expect(policy).toContain('https://openlibrary.org');
	});

	it('keep the browser from guessing types, and send a short referrer', () => {
		expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
		expect(headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
	});
});
