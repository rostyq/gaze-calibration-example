<script>
  import { Button } from "sveltestrap";
  import Intro from './Intro.svelte';
  import CalibrationModal from "./CalibrationModal.svelte";

</script>


<main>
  <Intro>
    <CalibrationModal let:open>
      <Button color="primary" on:click={open}>start</Button>
    </CalibrationModal>
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
