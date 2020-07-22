<script>
  import { Alert } from "sveltestrap";
  import { noop } from 'svelte/internal';
  export let toggle = noop;
</script>

<div>
  <Alert color="danger" isOpen={true} toggle={toggle}>
    <slot/>
  </Alert>
</div>

<style>
  div {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
  }
</style>


