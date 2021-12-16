<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { navigate } from "svelte-routing";

	import Button from '../lib/button.svelte';
	import { onMount } from 'svelte';
	import { extract } from '../lib/colors';

	import { spotify, logout, loginWithTokens, current as cur, process } from '../lib/spotify';

	import SpotifyWebApi from 'spotify-web-api-node';
	import Image from '../lib/image.svelte';

	let current = cur;

	onMount(async () => {
		if (localStorage.getItem("access_token") == null) {
			navigate("/login", {replace: true})
		}

		loginWithTokens(localStorage.getItem("access_token"), localStorage.getItem("refresh_token"))
		current = await process()
		// setInterval(() => console.log(current), 1);
		
	});


	var backgroundColor = '#000000';
</script>

<main style={'background-color: ' + backgroundColor + ';'}>
	{#if current.user == undefined}
		<h1>One sec</h1>
	{:else}
		<h1>Hi {current.user?.display_name}</h1>
		{#if current.isPlaying}
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
					navigate('/login', { replace: true });
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
