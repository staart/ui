<script lang="ts">
  export let label = "Download";
  export let disabled = false;
</script>

<button
  aria-label={label}
  data-balloon-pos="up"
  class="text-gray-500 hover:text-indigo-500 transition motion-reduce:transition-none ml-4 align-middle focus:outline-none focus:ring-0"
  on:click
  {disabled}>
  <svg
    class="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"><path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
</button>
