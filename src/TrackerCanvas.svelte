<script>
  import { noop } from "svelte/internal";
  import { fade } from 'svelte/transition';
  import { onMount, onDestroy } from 'svelte';

  export let onSettled = noop;

  let canvasElement;

  onMount(() => {
    window.gazefilter.visualizer.setCanvas(canvasElement);
    setTimeout(onSettled, 5000);
  });

  onDestroy(() => {
    window.gazefilter.visualizer.removeCanvas();
  });
</script>

<div transition:fade>
  <canvas bind:this={canvasElement}></canvas>
</div>

<style>
  canvas {
    max-width: 30vw;
    border-radius: 25px;
    transform: scaleX(-1);
  }

  div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
