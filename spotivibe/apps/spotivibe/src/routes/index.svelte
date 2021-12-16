<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { navigate } from "svelte-routing";

	import Button from '../lib/button.svelte';
	import { onMount } from 'svelte';
	import { extract } from '../lib/colors';

	import { spotify, logout, loginWithTokens } from '../lib/spotify';

	import SpotifyWebApi from 'spotify-web-api-node';
	import Image from '../lib/image.svelte';

	onMount(async () => {
		loginWithTokens(localStorage.getItem("access_token"), localStorage.getItem("refresh_token"))
		user = (await spotify.getMe()).body;
		var colors = await extract(user?.images[0].url);
		backgroundColor = colors.DarkMuted.hex;

		var playback = (await spotify.getMyCurrentPlaybackState()).body;

		if(playback?.is_playing) {
			var track = (await spotify.getTrack(playback.item.id)).body;
			console.log(playback.progress_ms / track.duration_ms * 100 + "%")
		}
	});

	var user: SpotifyApi.CurrentUsersProfileResponse = undefined;
	var backgroundColor = '#000000';
</script>

<main style={'background-color: ' + backgroundColor + ';'}>
	{#if user == undefined}
		<h1>One sec</h1>
	{:else}
		<h1>Hi {user?.display_name}</h1>
		<Image source={user?.images[0].url} width={400} height={400} />
		<Button
			type="cancel"
			text="Logout"
			action={() => {
				logout();
				navigate('/login', { replace: true });
			}}
		/>
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
