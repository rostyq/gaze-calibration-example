<script>
  import {
    Button, Modal, ModalBody, ModalFooter, ModalHeader, Progress,
  } from "sveltestrap";
  import JSZip from 'jszip/dist/jszip.js';

  export let isOpen = false;
  export let resultBuffers = undefined;
  export let toggle = () => (isOpen = !isOpen);

  let resultUrl;
  let resultName;
  let progressValue = 0;
  let progressMessage = "";

  const resultToZipBlob = (buffers, onUpdate) => {
    let zip = new JSZip();
    Object.entries(buffers).forEach(([name, blob]) => {
      const ext = blob.type.split('/')[1];
      zip.file(ext ? `${name}.${ext}` : name, blob);
    });

    zip.file('meta.json', new Blob([JSON.stringify(window.gazefilter.recorder.meta)]));

    return zip.generateAsync({type: "blob"}, onUpdate);
  }

  const onOpened = () => {
    let postfix = (new Date()).toISOString();
    resultName = `asd-gazefilter-${postfix}.zip`;

    progressMessage = "Compress recorded data. Please wait...";

    resultToZipBlob(
      resultBuffers,
      state => { progressValue = state.percent; }
    ).then(blob => {
      resultUrl = window.URL.createObjectURL(blob);
      progressMessage = "Done!";
    });
  }

  const onClose = () => {
    URL.revokeObjectURL(resultUrl);

    resultUrl = undefined;
    resultName = undefined;

    isOpen = false;
  }
</script>

<Modal isOpen={isOpen} onOpened={onOpened}>
  <ModalHeader {toggle}>Thank you!</ModalHeader>
    <ModalBody>
      {progressMessage}
      <Progress value={progressValue}></Progress>
    </ModalBody>
    <ModalFooter>
      <Button color="primary"
              href={resultUrl}
              download={resultName}
              disabled={!resultUrl}>
        download
      </Button>
      <Button on:click={onClose} color="secondary">close</Button>
    </ModalFooter>
</Modal>
