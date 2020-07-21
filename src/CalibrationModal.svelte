<script>
  import { noop } from 'svelte/internal';
  import {
    Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner
  } from "sveltestrap";

  import Calibration from "./Calibration.svelte";
  import { loadScript } from './utils';
  import { GAZEFILTER_URL, NNC_MODELS, PUPLOC_URL } from './constants';

  let canvasElement;
  let isLoading = true;
  let success = false;
  let overlayMsg = "loading...";

  let isOpened = false;
  const open = () => (isOpened = true);
  const close = () => (isOpened = false);
  const onOpened = async () => {
    try {
      isLoading = true;
      if (!window.gazefilter) {
        overlayMsg = "loading...";
        await loadScript(GAZEFILTER_URL);
      };
      if (!gazefilter.tracker.ready) {
        overlayMsg = "loading...";
        await gazefilter.tracker.init({ nnc: NNC_MODELS[0], puploc: PUPLOC_URL });
      }

      gazefilter.visualizer.setCanvas(canvasElement);

      if (!gazefilter.tracker.connected) {
        overlayMsg = "waiting for camera...";
        await gazefilter.tracker.connect();
      };

      overlayMsg = "";
      isLoading = false;
    } catch (error) {
      isLoading = false;
      overlayMsg = "Error: " + error.message;
    }
  };

  export let onCalibrated = noop;

  const onClosed = () => {
    if (window.gazefilter) gazefilter.visualizer.removeCanvas();
    if (success) onCalibrated();
    else if (gazefilter.tracker.connected) gazefilter.tracker.destroy();
    overlayMsg = 'loading...';
    isLoading = true;
  }

  const handleError = error => {
    console.error(error.detail);
  };

  const handleSuccess = () => { success = true; close(); };
</script>

<div>
  <slot {open} {close}></slot>
  <Modal isOpen={isOpened}
         onOpened={onOpened}
         onClosed={onClosed}
         backdrop={false}
         toggle={close}>
    <ModalHeader {close}>Calibration</ModalHeader>

    <ModalBody>
      <div class="canvas-wrapper">
        <canvas bind:this={canvasElement}></canvas>
        <div class="center-overlay">
          {#if isLoading}
            <span>
              <Spinner color="primary" size="sm"/>
            </span>
          {/if}
          {#if overlayMsg}
            <span>{overlayMsg}</span>
          {/if}
        </div>
      </div>

      <!--
      <Alert color="info" style='font-size: initial'>
        <ul>
          <li>Allow to use camera device.</li>
          <li>Make sure there are 2 white circles following pupils.</li>
          <li>Place your face </li>
        </ul>
      </Alert>
      -->

    </ModalBody>

    <ModalFooter>

      <Calibration let:startCalibration
                   on:error={handleError}
                   on:success={handleSuccess}>
        <Button color="primary" on:click={startCalibration}>calibrate</Button>
      </Calibration>

      <Button color="secondary" on:click={close}>Close</Button>
    </ModalFooter>

  </Modal>
</div>

<style>
  .canvas-wrapper {
    position: relative;
  }
  .canvas-wrapper > canvas {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    border: 1px solid gray;
    transform: scaleX(-1);
  }

  .center-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }

  .canvas-wrapper > div {
    display: flex;
    vertical-align: middle;
  }
  .canvas-wrapper > div > span {
    padding: 3px;
  }
</style>
