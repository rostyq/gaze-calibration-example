<script>
  import { spring, tweened } from 'svelte/motion';
  import { rainbow } from "./utils";

  const RADIUS = 25;
  const START = Object.freeze({ x: -10, y: -10 });

	let coords = spring({ ...START }, { stiffness: 0.1, damping: 0.95, precision: 0.1 });
  let radius = spring(RADIUS, { stiffness: 0.1, damping: 0.8, precision: 1 });
  let stroke = 0.7;
  let color = "#ff0000";

  async function jump(from, to) {
    await coords.set(from, { hard: true });
    await coords.set(to);
    await radius.set(0);
    await coords.set(START, { hard: true });
    await radius.set(RADIUS, { hard: true });
  }

  async function calibrate() {
    let targets = [
      { x: 50, y: 50 },
      { x: 10, y: 50 },
      { x: 50, y: 10 },
      { x: 10, y: 90 },
      { x: 90, y: 10 },
      { x: 90, y: 90 },
    ];

    for (let i = 0; i < targets.length; i++) {
      let x, y;
      switch (Math.floor(Math.random() * 4)) {
        case 0:
          x = -10, y = Math.random() * 100 >> 0;
          break;
        case 1:
          x = 110, y = Math.random() * 100 >> 0;
          break;
        case 2:
          y = -10, x = Math.random() * 100 >> 0;
          break;
        case 3:
          y = 110, x = Math.random() * 100 >> 0;
          break;
      }
      color = rainbow(targets.length, i);
      await jump({ x, y }, targets[i]);
    }
  }
</script>

<div class="calibration-container">
  <svg on:click={calibrate}>
    <circle
      cx={$coords.x + "%"}
      cy={$coords.y + "%"}
      r={$radius}
      fill="{color}"
      fill-opacity="50%"
    />
    <circle
      cx={$coords.x + "%"}
      cy={$coords.y + "%"}
      r={$radius * stroke}
      fill="{color}"
      fill-opacity="100%"
    />
  </svg>
</div>

<style>
  .calibration-container {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  svg {
    width: 100%;
    height: 100%;
  }
</style>
