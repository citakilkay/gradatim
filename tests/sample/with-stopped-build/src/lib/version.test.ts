import { describe, expect, it } from 'vitest';
import pkg from '../../package.json';
import { appVersion } from './version';

describe('appVersion', () => {
	it('gives the version that package.json holds', () => {
		expect(appVersion()).toBe(pkg.version);
		expect(appVersion()).toMatch(/^\d+\.\d+\.\d+/);
	});
});
