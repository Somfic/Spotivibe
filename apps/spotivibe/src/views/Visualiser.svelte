<script lang="ts">
  import { onMount } from 'svelte';
  import { createScene } from '../lib/canvas';
  import {current} from "../lib/stores";

  let el;
  onMount(() => {
    createScene(el);
  });
</script>

<canvas class="{$current?.analysis?.sections == undefined ? 'loading' : 'loaded'}" bind:this={el} />

<style lang="scss">
  canvas {
    width: 100vw;
    height: 100vh;
    flex-grow: 1;
    overflow: hidden;
    transition: all 3s ease;
    opacity: 1;

    &.loading {
      opacity: 0;
    }
  }
</style>
