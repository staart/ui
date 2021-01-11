<script lang="ts">
  import { isWarning } from "../errors";
  export let error = "";
</script>

<div
  class={isWarning(error) ? 'bg-yellow-100 shadow sm:rounded-lg px-4 py-5 sm:px-6 ring ring-yellow-200 my-5' : 'bg-red-100 shadow sm:rounded-lg px-4 py-5 sm:px-6 ring ring-red-200 my-5'}>
  <div class="sm:flex sm:items-start">
    <div
      class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-white sm:mx-0 sm:h-10 sm:w-10">
      <svg
        class={isWarning(error) ? 'h-6 w-6 text-yellow-500' : 'h-6 w-6 text-red-500'}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <div
      class={isWarning(error) ? 'mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left text-yellow-900' : 'mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left text-red-900'}>
      <h3 class="text-lg leading-6 font-medium" id="modal-headline">
        {error.split('\n')[1] || 'An error occurred'}
      </h3>
      <div class="mt-2">
        <p class="text-sm">{error.split('\n')[0]}</p>
      </div>
    </div>
  </div>
</div>
