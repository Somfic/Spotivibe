<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { process } from './lib/spotify';
	import { isLoggedIn, current } from './lib/stores';

	import Visualiser from "./views/Visualiser.svelte";
	import Overlay from "./views/Overlay.svelte";
	import Login from "./views/Login.svelte";

	onMount(async () => {
		setInterval(async () => await process(), 1);
	});


</script>

<main style={'background: ' + $current.colors?.DarkVibrant.hex + ';'}>
{#if $isLoggedIn}
	<div id="overlay"><Overlay /></div>
	<div id="visualiser"><Visualiser/></div>
{:else}
	<Login />
{/if}
</main>

<style lang="scss">

	main {
		position: relative;
		transition: background 1.5s ease;
	}

	#overlay, #visualiser {
		display: flex;
		flex-grow: 1;
		position: absolute;
		min-width: 100vw;
		min-height: 100vh;
	}

	#overlay {
		pointer-events: none;
		z-index: 1;
	}
</style>