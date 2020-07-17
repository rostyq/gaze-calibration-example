<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { spring, tweened } from 'svelte/motion';

  import screenfull from "screenfull";

  import {
    rainbow,
    shuffle,
    generateTargets,
    randomScreenOutsidePosition,
    screenRatio,
  } from "./utils";
  const dispatch = createEventDispatcher();

  const RADIUS = 25;
  const START = Object.freeze({ x: -10, y: -10 });

  let container, circle;
  let done = false;

  let coords = spring({ ...START }, { stiffness: 0.1, damping: 0.95, precision: 0.1 });
  let radius = spring(RADIUS, { stiffness: 0.1, damping: 0.8, precision: 1 });
  let stroke = 0.7;
  let color = "#ff0000";

  const jump = async (from, to) => {
    await coords.set(from, { hard: true });
    await coords.set(to);
    await radius.set(0);
    await coords.set(START, { hard: true });
    await radius.set(RADIUS, { hard: true });
  }

  const calibrate = async () => {
    let ratio = container.clientHeight / container.clientWidth;
    let targets = shuffle(generateTargets(3, 3, 10, ratio));
    let colorIdx = shuffle([...targets.keys()]);

    for (let i = 0; i < targets.length; i++) {
      if (!screenfull.isFullscreen) return;
      color = rainbow(targets.length, colorIdx[i]);
      await jump(randomScreenOutsidePosition(), targets[i]);
    }
    done = true;
  }

  const onchange = () => {
    if (screenfull.isFullscreen && (screenfull.element === container)) {
      container.style.display = 'block';
      setTimeout(() => calibrate().then(() => screenfull.exit()), 500);
    } else {
      container.style.display = 'none';
      if (done) {
        done = false;
        dispatch('success', "Calibration done");
      }
      else onerror("calibration interrupted");
    }
  }

  const onerror = error => dispatch('error', error);

  onMount(() => {
    screenfull.on('change', onchange);
    screenfull.on('error', onerror);
  });

  onDestroy(() => {
    screenfull.off("change", onchange);
    screenfull.off("error", onerror);
  });

  const startCalibration = () => screenfull.request(container);
</script>

<svg bind:this={container} style="display:none;">
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
<slot {startCalibration}/>

<style>
  svg {
    margin: 0;
    padding: 0;
  }
</style>
