<script>
  import screenfull from 'screenfull';
  import { noop } from 'svelte/internal';
  import { onMount, onDestroy } from 'svelte';
  import TrackerCanvas from './TrackerCanvas.svelte';
  import Calibration from './Calibration.svelte';
  import Video from './Video.svelte';

  const stages = Object.freeze({
    Intro: 0,
    Calibration: 1,
    Video: 2,
  });

  const recordParams = {
    filter: {},
    event: {
      headerFunc: () => 'timestamp,source,type,video_time\n',
      preprocFunc: e => `${e.timestamp},${e.source},${e.type},${e.video_time}\n`,
    },
    target: true,
    webcam: true,
  };

  export let onEnded = noop;

  let mainContainer;
  let currentStage;

  const onFullscreenChange = () => {
    if (screenfull.isFullscreen) {
      currentStage = stages.Intro;
      window.gazefilter.recorder.start(recordParams, onEnded);
    } else {
      currentStage = undefined;
      window.gazefilter.recorder.stop();
    };
  };

  const onSettled = () => {
    currentStage = stages.Calibration;
  }

  const onCalibrated = () => {
    currentStage = stages.Video;
  }

  const onVideoEvent = state => {
    window.gazefilter.recorder.pushEvent(state.timeStamp, 'video', state.type, { video_time: state.currentTime });
    if (state.type === "ended") {
      currentStage = undefined;
      screenfull.exit();
    }
  }

  onMount(() => {
    screenfull.on('change', onFullscreenChange);
  });

  onDestroy(() => {
    screenfull.off("change", onFullscreenChange);
  });

  const requestStart = () => {
    return screenfull.request(mainContainer);
  };
</script>

<div class="main-container" bind:this={mainContainer}>
  {#if currentStage === stages.Intro}
    <TrackerCanvas onSettled={onSettled}></TrackerCanvas>
  {:else if currentStage === stages.Calibration}
    <Calibration onCalibrated={onCalibrated}></Calibration>
  {:else if currentStage === stages.Video}
    <Video onVideoEvent={onVideoEvent} src="video.webm"></Video>
  {/if}
</div>

<slot {requestStart}></slot>

<style>
  .main-container {
    background-color: black;
  }
</style>
