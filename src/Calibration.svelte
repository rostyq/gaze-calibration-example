<script>
  import { onMount, onDestroy } from 'svelte';
  import { spring } from 'svelte/motion';
  import { noop } from 'svelte/internal';

  import {
    rainbow,
    shuffle,
    generateTargets,
    randomScreenOutsidePosition,
  } from "./utils";

  const RADIUS = 25;
  const START = Object.freeze({ x: -10, y: -10 });

  export let onCalibrated = noop;

  let container;
  let circle;
  let targetEventType = 0;
  let updateTargetInterval;
  let calibrationTimeout;
  let isCalibrating = false;

  let coords = spring({ ...START }, { stiffness: 0.1, damping: 0.95, precision: 0.1 });
  let radius = spring(RADIUS, { stiffness: 0.2, damping: 0.8, precision: 1 });
  let stroke = 0.7;
  let color = "#ff0000";

  const updateTarget = () => {
    let screenX = circle.cx.baseVal.value;
    let screenY = circle.cy.baseVal.value;
    gazefilter.tracker.dispatchTarget(
      screenX,
      screenY,
      targetEventType,
      performance.now(),
    );
  }

  const jump = async (from, to) => {
    await coords.set(from, { hard: true });
    await coords.set(to);

    setTimeout(() => { targetEventType = 5; }, 200);
    await radius.set(0);
    targetEventType = 0;

    await coords.set(START, { hard: true });
    await radius.set(RADIUS, { hard: true });
  }

  const calibrate = async () => {
    let ratio = container.clientHeight / container.clientWidth;
    let targets = shuffle(generateTargets(3, 3, 10, ratio));
    let colorIdx = shuffle([...targets.keys()]);

    for (let i = 0; i < targets.length; i++) {
      if (!isCalibrating) return;
      color = rainbow(targets.length, colorIdx[i]);
      await jump(randomScreenOutsidePosition(), targets[i]);
    }
    onCalibrated();
  }

  onMount(() => {
    updateTargetInterval = setInterval(updateTarget, 33);
    isCalibrating = true;
    calibrationTimeout = setTimeout(calibrate, 1000);
  });

  onDestroy(() => {
    isCalibrating = false;
    clearInterval(updateTargetInterval);
    clearTimeout(calibrationTimeout);
  });

</script>

<svg bind:this={container}>
  <circle bind:this={circle}
          cx={$coords.x + "%"}
          cy={$coords.y + "%"}
          r={$radius}
          fill="{color}"
          fill-opacity="50%" />
  <circle cx={$coords.x + "%"}
          cy={$coords.y + "%"}
          r={$radius * stroke}
          fill="{color}"
          fill-opacity="100%" />
</svg>

<style>
  svg {
    background-color: black;
    margin: 0;
    padding: 0;
    cursor: none;
    width: 100%;
    height: 100%;
  }
</style>
