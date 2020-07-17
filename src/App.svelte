<script>
  import Calibration from "./Calibration.svelte";

  const handleError = event => {
    console.error(event.detail);
  }

  const handleSuccess = event => {
    console.log(event.detail);
  }
</script>

<Calibration let:startCalibration on:error={handleError} on:success={handleSuccess}>
  <button on:click={startCalibration}>calibrate</button>
</Calibration>

<style>
</style>
