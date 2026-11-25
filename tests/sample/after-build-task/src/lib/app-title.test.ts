import { describe, expect, it } from 'vitest';
import { appTitle } from './app-title';

describe('appTitle', () => {
	it("returns the app's name", () => {
		expect(appTitle()).toBe('Shelf');
	});
});
