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
<div class="background" />

<style lang="scss">
  canvas {
    width: 100vw;
    height: 100vh;
    flex-grow: 1;
    overflow: hidden;
    transition: opacity 2s ease;
    transition-delay: 100ms;
    overflow: hidden;
    opacity: 1;
    z-index: 1;
    &.loading {
      opacity: 0;
    }
  }

  .background {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background: url('/stars.png') no-repeat center center fixed;
    background-size: 50%;
    background-repeat: repeat;
    z-index: 0;

    opacity: 0.2;
    pointer-events: none;
    animation: spin 500s linear infinite;
  }
</style>
