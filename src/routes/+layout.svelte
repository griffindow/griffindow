<script lang="ts">
	import './layout.css';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { browser } from '$app/environment';

	let { children } = $props();

	if (browser && !window.location.hostname.includes('localhost')) {
		injectSpeedInsights();
		injectAnalytics();
	}
</script>

{@render children()}
