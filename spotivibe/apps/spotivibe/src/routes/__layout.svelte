<script lang="ts">
	import '../app.scss';

	import {spotify} from '../lib/spotify';
	// import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(async () => {
		try {
			await spotify.getMe();
		} catch {
			goto('login');
		}
	});
</script>

<slot />
