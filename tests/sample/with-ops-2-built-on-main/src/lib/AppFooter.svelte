<script lang="ts">
	import { appTitle } from './app-title';
	import { appVersion } from './app-version';
	import { reportProblemUrl } from './report-problem';
</script>

<footer>
	<span>{appTitle()} {appVersion()}</span>
	·
	<a href={reportProblemUrl} rel="noopener noreferrer" target="_blank">Report a problem</a>
</footer>
