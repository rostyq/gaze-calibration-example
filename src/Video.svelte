<script>
  import { fade } from 'svelte/transition';
  import { noop } from 'svelte/internal';

  export let src = 'video.webm';
  export let onVideoEvent = noop;

  let videoElement;

  const eventToData = event => {
    return {
      type: event.type,
      timeStamp: event.timeStamp,
      currentTime: videoElement.currentTime,
    };
  }

  const eventHandler = event => onVideoEvent(eventToData(event));
</script>

<video src={src}
       autoplay

       on:play={eventHandler}
       on:pause={eventHandler}
       on:progress={eventHandler}
       on:waiting={eventHandler}
       on:playing={eventHandler}
       on:timeupdate={eventHandler}
       on:ended={eventHandler}
       on:ratechange={eventHandler}

       in:fade="{{delay: 100}}"

       bind:this={videoElement}></video>

<style>
  video {
    width: 100%;
    height: 100%;
    background-color: black;
  }
</style>
