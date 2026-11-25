import { afterEach, describe, expect, it, vi } from 'vitest';
import { online } from './online';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('the online status', () => {
	it('follows the browser as it goes offline and online again', () => {
		const onLine = vi.spyOn(navigator, 'onLine', 'get');
		const seen: boolean[] = [];
		const stop = online.subscribe((value) => seen.push(value));

		onLine.mockReturnValue(false);
		window.dispatchEvent(new Event('offline'));
		onLine.mockReturnValue(true);
		window.dispatchEvent(new Event('online'));
		stop();

		expect(seen).toEqual([true, false, true]);
	});

	it('starts offline when the browser already is', () => {
		vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
		const seen: boolean[] = [];
		online.subscribe((value) => seen.push(value))();
		expect(seen.at(-1)).toBe(false);
	});
});
