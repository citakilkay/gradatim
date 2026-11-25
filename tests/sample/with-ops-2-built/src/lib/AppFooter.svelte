<script lang="ts">
	import { appVersion } from '#lib/version.ts';

	/** Where a reader reports a problem: the project's issues on GitHub. */
	const reportUrl = 'https://github.com/example/shelf/issues';
	const versionLine = `Shelf version ${appVersion()}`;
</script>

<footer>
	<span>{@html versionLine}</span>
	<a href={reportUrl} rel="noopener noreferrer">Report a problem</a>
</footer>
