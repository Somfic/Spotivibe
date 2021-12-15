<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import {spotify, login, requestLogin} from '../lib/spotify';
    import Button from '$lib/button.svelte';

	var couldLogIn = false;

	onMount(async () => {
        couldLogIn = login();

        if(couldLogIn) {
            goto('/');
        }
	});


	var user: SpotifyApi.CurrentUsersProfileResponse;
</script>

<div class="prompt-wrapper">
	<div class="prompt">
		{#if !couldLogIn}
			<h1 class="fat">Hey there, DJ</h1>
			<Button type="primary" action={requestLogin} text="Log in with Spotify"></Button>
		{:else}
			<h1>Logging you in ...</h1>
			<p>Please wait ...</p>
		{/if}
	</div>
</div>

<style lang="scss">
    h1 {
        font-size: max(8vw, 1rem);
    }

    .prompt-wrapper {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;

        background: linear-gradient(-45deg, #4b297f, #7e1236);
		background-size: 400% 400%;
		animation: gradient 45s ease infinite;
    }

	.prompt {
        display: flex;
        flex-direction: column;
        align-items: center;

        font-size: max(1.5vw, 1rem);
	}

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
</style>
