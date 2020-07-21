<script>
  import { Button, Spinner } from "sveltestrap";
  import Intro from './Intro.svelte';
  import Study from "./Study.svelte";
  import { loadScript } from './utils';
  import { GAZEFILTER_URL, NNC_MODELS, PUPLOC_URL } from './constants';

  let isLoading = false;

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

  // handlers for study results
  const onError = async error => {
    console.error(error);
    await destroyTracker();
  };
  const onSuccess = async result => {
    console.log("success " + result)
    await destroyTracker();
  };

  const decorateStart = callback => {
    return (async () => {
      try {
        isLoading = true;
        await initTracker();
        await callback();
      } catch (error) {

      } finally {
        isLoading = false;
      }
    });
  };
</script>


<main>
  <Intro>
    <Study let:requestStart onError={onError} onSuccess={onSuccess}>
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
