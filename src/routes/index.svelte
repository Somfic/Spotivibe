<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import Button from '$lib/button.svelte';
	import { onMount } from 'svelte';
	import { extract } from '$lib/colors';

	import { spotify, logout } from '../lib/spotify';

	import SpotifyWebApi from 'spotify-web-api-node';
	import Image from '$lib/image.svelte';

	onMount(async () => {
		user = (await spotify.getMe()).body;
		backgroundColor = (await extract(user?.images[0].url)).DarkMuted.hex;

		// Update loop
		setInterval(async () => {
			await updateSongInfo();
		}, 5000);

		await updateSongInfo();
	});

	async function updateSongInfo() {
		var playback = (await spotify.getMyCurrentPlaybackState()).body;

		isPlaying = playback.is_playing;

		if (playback?.is_playing) {
			song = (await spotify.getTrack(playback.item.id)).body;
			//analysis = (await spotify.getAudioAnalysisForTrack(playback.item.id)).body;

			backgroundColor = (await extract(song?.album.images[0].url)).Muted.hex;

			//console.log(analysis)
		}
	}

	var isPlaying: boolean = false;
	var song: SpotifyApi.SingleTrackResponse = undefined;
	var analysis: SpotifyApi.AudioAnalysisResponse = undefined;

	var user: SpotifyApi.CurrentUsersProfileResponse = undefined;
	var backgroundColor = '#000000';
</script>

<main style={'background-color: ' + backgroundColor + ';'}>
	{#if user == undefined}
		<h1>One sec</h1>
	{:else}
		<h1>Hi {user?.display_name}</h1>
		{#if isPlaying}
			<h2>
				Playing <span class="fat">{song?.name}</span> by {song?.artists[0].name}
			</h2>
			<Image source={song?.album.images[0].url} width={400} height={400} />
		{:else}
			<h2>You're currently not playing any music</h2>
			<Image source={user?.images[0].url} width={400} height={400} />
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
