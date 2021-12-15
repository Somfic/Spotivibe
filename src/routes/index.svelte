<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
import { goto } from '$app/navigation';

	import Button from '$lib/button.svelte';
	import { onMount } from 'svelte';

	import {spotify, logout} from '../lib/spotify';

	onMount(async () => {
		user = (await spotify.getMe()).body;
	});

	var user: SpotifyApi.CurrentUsersProfileResponse = undefined;
</script>

<main>
	{#if user == undefined}
		<h1>One sec</h1>
	{:else}
		<h1>Hi {user?.display_name}</h1>
		<img src={user?.images[0].url} alt={user?.display_name} />
		<Button type="cancel" text="Logout" action={() => {logout(); goto("/login")}} />
	{/if}
</main>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
