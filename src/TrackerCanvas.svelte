<script>
  import { noop } from "svelte/internal";
  import { fade } from 'svelte/transition';
  import { onMount, onDestroy } from 'svelte';

  const PI2 = 2 * Math.PI;
  const confidenceThreshold = 0.8;
  const histeresis = 0.1;
  const upperThreshold = confidenceThreshold + histeresis;
  const lowerThreshold = confidenceThreshold - histeresis;
  const settleDuration = 3000;

  let settleTimeout;

  export let onSettled = noop;

  const drawPupils = function(filterState) {
    let ctx = this.ctx;
    this.drawTrackerImage();
    // pupils
    const ps = (0.02 * filterState.faceScale) >> 0;
    let [ plx, ply ] = filterState.leftPupil;
    let [ prx, pry ] = filterState.rightPupil;
    ctx.beginPath();
    ctx.arc(plx, ply, ps, 0, PI2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(prx, pry, ps, 0, PI2);
    ctx.stroke();

    ctx.restore();
  }

  const onSettle = () => {
    visualizer.setListener('filter', drawPupils);
    onSettled();
  }

  const setSettleTimeout = gazeConfidence => {
    if (gazeConfidence > upperThreshold) {
      settleTimeout = setTimeout(onSettle, settleDuration);
    } else if (gazeConfidence < lowerThreshold) {
      clearTimeout(settleTimeout);
      settleTimeout = undefined;
    }
    return Boolean(settleTimeout);
  }

  let canvasElement;
  const visualizer = window.gazefilter.visualizer;

  const filterListener = function(filterState) {
    let canSettle = setSettleTimeout(filterState.gazeConfidence);

    this.ctx.strokeStyle = canSettle ? 'green' : 'yellow';
    this.ctx.lineWidth = 2;
    drawPupils.call(this, filterState);
  }

  onMount(() => {
    visualizer.setListener('filter', filterListener);
    visualizer.setCanvas(canvasElement);
  });

  onDestroy(() => {
    visualizer.removeCanvas();
    visualizer.setListener('filter', undefined);
  });
</script>

<div transition:fade>
  <canvas bind:this={canvasElement}></canvas>
</div>

<style>
  canvas {
    max-width: 30vw;
    border-radius: 30px;
    transform: scaleX(-1);
  }

  div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
