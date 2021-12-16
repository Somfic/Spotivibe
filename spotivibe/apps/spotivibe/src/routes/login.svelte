<script lang="ts">
	import { navigate } from "svelte-routing";
	import { onMount } from 'svelte';
	// import { goto } from '$app/navigation';

	import {spotify, login, requestLogin} from '../lib/spotify';
    import Button from '../lib/button.svelte';

	// import type SpotifyWebApi from "spotify-web-api-node";

	var couldLogIn = false;

	onMount(async () => {
        couldLogIn = login();

        if(couldLogIn) {
			navigate("/", { replace: true });
            // goto('/');
        }
	});


	// var user: SpotifyWebApi.CurrentUsersProfileResponse;

	function greetingMessage() : string {

		const timeGreetings = timeGreeting();
		const generalGreetings = ['Howdy', 'Hi', 'Sup', 'Hello', 'Hey', 'Hey there', 'Hi there']
		const names = ['DJ', 'rockstar']
		const suffixes = ['!', '']

		var greeting = generalGreetings[Math.floor(Math.random() * generalGreetings.length)];
		if(Math.random() < 0.5) {
			greeting = timeGreetings[Math.floor(Math.random() * timeGreetings.length)];
		}

		var name = names[Math.floor(Math.random() * names.length)];
		var suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

	
		return greeting + ', ' + name + suffix;
	}

	function timeGreeting() : string[] {
		var time = new Date().getHours();

		if (time < 12) {
			return ["Morning", "Mornin'", "Good morning", "Good mornin'"]
		} else if (time < 18) {
			return ["Afternoon"];
		} else {
			return ["Evening", "Evenin'"];
		}
	}
</script>

<main>
	<div class="prompt-wrapper">
		<div class="prompt">
			{#if !couldLogIn}
				<h1 class="fat">{greetingMessage()}</h1>
				<Button type="primary" action={requestLogin} text="Log in with Spotify"></Button>
			{:else}
				<h1>Logging you in ...</h1>
				<p>Please wait ...</p>
			{/if}
		</div>
	</div>
</main>

<style>
    h1 {
        font-size: max(8vw, 1rem);
    }

	main {
		position: relative;
		min-width: 100vw;
		min-height: 100vh;
		left: 0;
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
