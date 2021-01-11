<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { format } from "timeago.js";

  export let date: string = "";
  export let inline = false;
  let formattedDate = format(date);
  let interval: number = 0;
  onMount(() => (interval = setInterval(() => (formattedDate = format(date)), 1000)));
  onDestroy(() => interval && clearInterval(interval));
</script>

{#if date}
  <time
    datetime={new Date(date).toISOString()}
    title={new Date(date).toLocaleString()}
    class={inline ? 'inline' : 'inline-block'}>{formattedDate
      .charAt(0)
      .toUpperCase() + formattedDate.slice(1)}</time>
{/if}
