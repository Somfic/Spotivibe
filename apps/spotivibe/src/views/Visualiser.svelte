<script lang="ts">
  import { onMount } from 'svelte';
  import { createScene } from '../lib/canvas';
  import { current } from '../lib/stores';

  let el;
  onMount(() => {
    createScene(el);
  });
</script>

<canvas
  class={$current?.analysis?.sections == undefined ? 'loading' : 'loaded'}
  bind:this={el}
/>

<style lang="scss">
  canvas {
    width: 100vw;
    height: 100vh;
    flex-grow: 1;
    overflow: hidden;
    transition: opacity 3s ease;
    transition-delay: 500ms;
    overflow: hidden;
    opacity: 1;

    filter: drop-shadow(0 0 100px 10px rgba(0, 0, 0, 0.25));

    &.loading {
      opacity: 0;
    }
  }
</style>
