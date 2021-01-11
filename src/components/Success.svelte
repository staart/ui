<script lang="ts">
  export let title = "";
</script>

<div
  class="bg-green-100 shadow sm:rounded-lg px-4 py-5 sm:px-6 ring ring-green-200">
  <div class="sm:flex sm:items-start">
    <div
      class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-white sm:mx-0 sm:h-10 sm:w-10">
      <svg
        class="h-6 w-6 text-green-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7" /></svg>
    </div>
    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left text-green-900">
      <h3 class="text-lg leading-6 font-medium" id="modal-headline">{title}</h3>
      <div class="mt-2">
        <p class="text-sm">
          <slot />
        </p>
      </div>
    </div>
  </div>
</div>
