<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import Button from '$lib/button.svelte';
	import { onMount } from 'svelte';

	import { logout, process, current } from '../lib/spotify';

	import Image from '$lib/image.svelte';


	onMount(() => {
		// Sketchy update loop
		setInterval(async () => await process(), 1);
	})

	var isPlaying: boolean = false;
	var backgroundColor = '#000000';
</script>

<main style={'background-color: ' + backgroundColor + ';'}>
	{#if current.user == undefined}
		<h1>One sec</h1>
	{:else}
		<h1>Hi {current.user?.display_name}</h1>
		{#if isPlaying}
			<h2>
				Playing <span class="fat">{current.song?.name}</span> by {current.song?.artists[0].name}
			</h2>
			<Image source={current.song?.album.images[0].url} width={400} height={400} />
		{:else}
			<h2>You're currently not playing any music</h2>
			<Image source={current.user?.images[0].url} width={400} height={400} />
		{/if}

		<div>
			<Button
				type="cancel"
				text="Logout"
				action={() => {
					logout();
					goto('/login');
				}}
			/>
		</div>
	{/if}
</main>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		transition: background-color 1s ease;
	}

	img {
		width: 400px;
		height: 400px;
		border-radius: 5px;
	}
</style>
