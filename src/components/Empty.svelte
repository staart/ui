<script lang="ts">
  export let message = "No items found";
</script>

<div class="py-10 text-center w-full bg-gray-50">
  <div class="flex justify-center mb-5">
    <svg
      class="w-16 h-16 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
  </div>
  <div class="text-gray-500">{message}</div>
</div>
