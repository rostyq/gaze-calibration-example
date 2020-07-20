<script>
  import {
    Button, Modal, ModalBody, ModalFooter, ModalHeader, Card
  } from "sveltestrap";

  import Calibration from "./Calibration.svelte";
  import { loadScript } from './utils';

  let canvas, loadScriptPromise;
  loadScriptPromise = loadScript("https://cdn.jsdelivr.net/npm/gazefilter@0.4.1/dist/gazefilter.js");

  let isOpened = false;
  const open = () => (isOpened = true);
  const close = () => (isOpened = false);

  const onOpened = async () => {
  };

  const handleError = event => {
    console.error(event.detail);
  }

  const handleSuccess = event => {
    console.log(event.detail);
  }
</script>

<div>
  <slot {open}></slot>
  <Modal isOpen={isOpened}
         onOpened={onOpened}
         backdrop={false}
         size="lg"
         toggle={close}>
    <ModalHeader {close}>Tracker initialization</ModalHeader>
    <ModalBody>
      <Card>
        {#await loadScriptPromise}
          loading...
        {:then}
          <canvas bind:this={canvas}></canvas>
        {/await}
      </Card>
    </ModalBody>
    <ModalFooter>
      <Calibration let:startCalibration on:error={handleError} on:success={handleSuccess}>
        <Button color="primary" on:click={startCalibration}>calibrate</Button>
      </Calibration>
      <Button color="secondary" on:click={close}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>
</div>
