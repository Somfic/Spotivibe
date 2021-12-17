<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { process } from './lib/spotify';
	import { isLoggedIn } from './lib/stores';

	import Home from "./views/Home.svelte";
	import Login from "./views/Login.svelte";

	onMount(async () => {
		setInterval(async () => await process(), 1);
	});


</script>

{#if $isLoggedIn}
	<Home />
{:else}
	<Login />
{/if}