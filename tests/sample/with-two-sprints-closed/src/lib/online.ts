import { readable } from 'svelte/store';

/**
 * Whether the browser is online, as the app shell sees it: true until the browser says otherwise.
 * The lookup queue subscribes to it, as the architecture's seam between APP and LKP says, and a view
 * reads it as `$online`.
 */
export const online = readable(true, (set) => {
	if (typeof window === 'undefined') return;
	const update = () => set(navigator.onLine);
	update();
	window.addEventListener('online', update);
	window.addEventListener('offline', update);
	return () => {
		window.removeEventListener('online', update);
		window.removeEventListener('offline', update);
	};
});
