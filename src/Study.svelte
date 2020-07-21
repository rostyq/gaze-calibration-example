<script>
  import screenfull from 'screenfull';
  import { noop } from 'svelte/internal';
  import { onMount, onDestroy } from 'svelte';
  import TrackerCanvas from './TrackerCanvas.svelte';

  const stages = Object.freeze({
    Intro: 0,
    Calibration: 1,
    Video: 2,
  });

  export let onError = noop;
  export let onSuccess = noop;

  let mainContainer;
  let currentStage;

  const onFullscreenChange = () => {
    if (screenfull.isFullscreen) {
      currentStage = stages.Intro
    } else {
      currentStage = null;
      onSuccess();
    };
  };

  const onSettled = () => {
    currentStage = stages.Calibration;
  }

  onMount(() => {
    screenfull.on('change', onFullscreenChange);
    screenfull.on('error', onError);
  });

  onDestroy(() => {
    screenfull.off("change", onFullscreenChange);
    screenfull.off("error", onError);
  });

  const requestStart = () => screenfull.request(mainContainer);
</script>

<div class="main-container" bind:this={mainContainer}>
  {#if currentStage === stages.Intro}
    <TrackerCanvas onSettled={onSettled}></TrackerCanvas>
  {:else if currentStage === stages.Calibration}
    calibration
  {:else if currentStage === stages.Video}
    video
  {/if}
</div>

<slot {requestStart}></slot>

<style>
  .main-container {
    background-color: black;
  }

  video {
    width: 100%;
    height: 100%;
  }
</style>
