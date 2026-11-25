// Vite inlines the version when the app is built; nothing else from package.json reaches the bundle.
import { version } from '../../package.json';

/** The app's version, from package.json as it stood when the app was built. */
export function appVersion(): string {
	return version;
}
