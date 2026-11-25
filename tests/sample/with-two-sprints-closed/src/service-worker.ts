/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// Shelf's service worker: it caches the app shell, so that after a first visit Shelf opens and runs
// with no network (M1, D3). SvelteKit builds it, registers it, and gives it the build's files.
import { assets, immutable, prerendered } from '$app/manifest';
import { self } from '$app/service-worker';
import { appVersion } from '#lib/app-version.ts';

// One cache per version of the app, as the runbook says, so that a release never mixes with the last.
const CACHE = `shelf-${appVersion()}`;

// Everything Shelf needs to open: the build's files, the static files and the prerendered pages.
const SHELL = [...immutable, ...assets, ...prerendered].map(({ path }) => new URL(path, self.registration.scope).pathname);

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE)
			.then((cache) => cache.addAll(SHELL))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
			.then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url);
	// Only the app's own files: Open Library's calls, and anything else, pass the worker by.
	if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
	event.respondWith(respond(event.request, url));
});

async function respond(request: Request, url: URL): Promise<Response> {
	const cache = await caches.open(CACHE);

	// The shell's files don't change within a version: the cache serves them, online or not.
	if (SHELL.includes(url.pathname)) {
		const cached = await cache.match(url.pathname);
		if (cached) return cached;
	}

	// Anything else goes to the network first, and falls back to the cache when there is none.
	try {
		return await fetch(request);
	} catch (error) {
		const cached = await cache.match(request, { ignoreSearch: true });
		if (cached) return cached;
		throw error;
	}
}
