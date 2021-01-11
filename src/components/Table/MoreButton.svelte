<script lang="ts">
  export let label = "More";
  export let disabled = false;
</script>

<span class="relative">
  <button
    aria-label={label}
    data-balloon-pos="up"
    class="text-gray-500 hover:text-gray-700 transition motion-reduce:transition-none ml-4 align-middle focus:outline-none focus:ring-0"
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
        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
  </button>
  <slot />
</span>
