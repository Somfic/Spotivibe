<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { logout } from '../lib/authentication';
	import { current } from '../lib/stores';

    import Button from '../components/Button.svelte';
	import Image from '../components/Image.svelte';
</script>

<main style={'background: ' + $current.colors?.DarkVibrant.hex + ';'}>
	{#if $current?.user == undefined}
		<h1>One sec</h1>
	{:else}
		<h1>Hi {$current.user?.display_name}</h1>
		{#if $current.isPlaying}
			<h2>
				Playing <span class="fat">{$current.song?.name}</span> by {$current.song?.artists[0].name}
			</h2>
		{:else}
			<h2>You're currently not playing any music</h2>
		{/if}
		<Image source={$current.imageUri} width={400} height={400} />

		<div>
			<Button
				type="cancel"
				text="Logout"
				action={() => {
					logout();
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

		transition: background 1s ease;
	}

	img {
		width: 400px;
		height: 400px;
		border-radius: 5px;
	}
</style>
