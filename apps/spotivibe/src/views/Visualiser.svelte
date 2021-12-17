<script lang="ts">
  import { onMount } from 'svelte';
  import { createScene } from '../lib/canvas';
  let el;
  onMount(() => {
    createScene(el);
  });
</script>

<canvas bind:this={el} />

<style>
  canvas {
    width: 100vw;
    height: 100vh;
    flex-grow: 1;
    overflow: hidden;
  }
</style>
