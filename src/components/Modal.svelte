<script lang="ts">
  import { fade } from "svelte/transition";
  import { focusTrap } from "../helpers/focus-trap";
  import { fadeScale } from "../helpers/transitions";

  export let onClose: (event: Event) => any;
</script>

<div class="fixed z-10 inset-0 overflow-y-auto" transition:fade={{ duration: 200 }} use:focusTrap>
  <div
    class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div class="fixed inset-0 transition motion-reduce:transition-none-opacity" aria-hidden="true">
      <div class="absolute inset-0 bg-gray-500 opacity-75" on:click={onClose} />
    </div>
    <span
      class="hidden sm:inline-block sm:align-middle sm:h-screen"
      aria-hidden="true">&#8203;</span>
    <div
      class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition motion-reduce:transition-none-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      transition:fadeScale={{ baseScale: 0.95, delay: 50 }}>
      <slot />
    </div>
  </div>
</div>
