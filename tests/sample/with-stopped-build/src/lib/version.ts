import { version } from '../../package.json';

/** The app's version, from package.json, read when the app is built. */
export function appVersion(): string {
	return version;
}
