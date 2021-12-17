<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
  import { logout } from '../lib/authentication';
  import { current } from '../lib/stores';

  import Button from '../components/button.svelte';
  import Image from '../components/image.svelte';
</script>

<section>
  {#if $current?.user == undefined}
    <div class="prompt">
      <h1>One sec</h1>
    </div>
  {:else if $current.isPlaying}
    <div class="music">
      <div class="playback">
        <img src={$current.imageUri} alt={$current.song.name} />
        <div class="song">
          <h1 class="fat">{$current.song?.name}</h1>
          <h2>{$current.song?.artists[0].name}</h2>
        </div>
      </div>
    </div>
  {:else}
    <div class="no-music">
      <Image source={$current.imageUri} width={400} height={400} />
      <h2>You're currently not playing any music</h2>
    </div>
  {/if}
</section>

<style lang="scss">
  section {
    display: flex;
    flex-grow: 1;

    * {
      pointer-events: all;
    }

    .no-music {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .music {
      flex-grow: 1;
      display: flex;
      align-items: flex-end;
      justify-content: start;

      .playback {
        display: flex;
        align-items: center;
        margin: 2rem;

        img {
          width: 150px;
          height: 150px;
          margin-right: 20px;
          box-shadow: 0 0 100px 10px rgba(0, 0, 0, 0.25);
          opacity: 0.9;
        }

        .song {
          h1,
          h2 {
            margin: 0;
          }

          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }
      }
    }
  }
</style>
