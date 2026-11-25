import { describe, expect, it } from 'vitest';
// The file as raw text, read apart from the module's own import.
import packageJson from '../../package.json?raw';
import { appVersion } from './app-version';

describe('appVersion', () => {
	it('returns the version that package.json holds', () => {
		const { version } = JSON.parse(packageJson) as { version: string };
		expect(appVersion()).toBe(version);
	});
});
