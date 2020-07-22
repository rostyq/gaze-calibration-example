<script>
  import { Button, Spinner } from "sveltestrap";

  import Intro from './Intro.svelte';
  import Study from "./Study.svelte";
  import ResultModal from "./ResultModal.svelte";
  import ErrorAlert from "./ErrorAlert.svelte";

  import { loadScript } from './utils';
  import { GAZEFILTER_URL, NNC_MODELS, PUPLOC_URL } from './constants';

  let isLoading = false;

  let errorMessage = "";
  let studyResult;
  let showResult = false;

  const destroyTracker = () => {
    if (gazefilter.tracker.ready) return gazefilter.tracker.destroy();
  }

  const initTracker = async () => {
    if (!window.gazefilter) {
      await loadScript(GAZEFILTER_URL);
    };

    if (!gazefilter.tracker.ready) {
      await gazefilter.tracker.init({
        nnc: NNC_MODELS[0],
        puploc: PUPLOC_URL,
      });
    }

    if (!gazefilter.tracker.connected) {
      await gazefilter.tracker.connect();
    }
  }

  const onError = error => {
    destroyTracker();
    errorMessage = error.message;
    showError = true;
  };

  const onStudyEnded = buffers => {
    destroyTracker();
    studyResult = buffers;
    showResult = true;
  };

  const decorateStart = callback => {
    return (async () => {
      try {
        isLoading = true;
        await initTracker();
        await callback();
      } catch (error) {
        onError(error);
      } finally {
        isLoading = false;
      }
    });
  };
</script>


<main>

  <Intro>

    <Study let:requestStart onEnded={onStudyEnded}>

      <Button outline={true} color="primary" disabled={isLoading}
              on:click={decorateStart(requestStart)}>
        {#if isLoading}
          <Spinner color="primary" size='sm'></Spinner>
          <span>loading...</span>
        {:else}
          start
        {/if}
      </Button>

    </Study>

  </Intro>

  <ResultModal isOpen={showResult} resultBuffers={studyResult}></ResultModal>

  {#if errorMessage}
    <ErrorAlert toggle={() => (errorMessage = "")}>{errorMessage}</ErrorAlert>
  {/if}
</main>


<style>
  main {
    max-width: 80vw;
    max-height: 80vh;
    margin: auto;
    padding: 10vh;
  }
</style>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
</svelte:head>
