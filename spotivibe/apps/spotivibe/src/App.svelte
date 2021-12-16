<script lang="ts">
	import { Router, Link, Route } from "svelte-routing";
	import Login from "./routes/login.svelte";

	export let name: string;
	export let url = "";
</script>
<Router url="{url}">
	<Route path="/login" component="{Login}" />
</Router>
<!-- <main>
	<h1>Welcome to {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main> -->

<!-- <style>
	
</style> -->
