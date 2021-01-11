<script lang="ts">
  export let label = "Edit";
  export let disabled = false;
</script>

<button
  aria-label={label}
  data-balloon-pos="up"
  class="text-gray-500 hover:text-indigo-500 transition motion-reduce:transition-none ml-4 align-middle focus:text-indigo-500 focus:outline-none focus:ring-0"
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
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
</button>
