<script>
  import { Jumbotron } from 'sveltestrap';
</script>

<Jumbotron>
  <h1 class="display-3">Hello!</h1>
  <p class="lead">
    This is Work-in-Progress data gathering tool for ASD research.
  </p>
  <hr class="my-2" />
  <p>
    Click start to proceed. You will be asked to allow webcam usage.
  </p>
  <p>
    For now recorded data will <b>not</b> be sent anywhere, you are able to download
    it by yourself once experiment is finished.
  </p>
  <p class="lead">
    <slot></slot>
  </p>
</Jumbotron>
