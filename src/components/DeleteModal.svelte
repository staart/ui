<script lang="ts">
  import { onMount } from "svelte";
  import { api } from "../api";
  import Error from "./Error.svelte";
  import Modal from "./Modal.svelte";

  export let onDelete: () => any | undefined = undefined;
  export let onSuccess: (value?: any) => any | undefined = undefined;
  export let onError: (error: any) => any | undefined = undefined;
  export let onClose: () => any | undefined = undefined;
  export let title: string;
  export let text: string;
  export let deleteButtonText: string | undefined = undefined;
  export let cancelButtonText: string | undefined = undefined;
  export let url: string | undefined = undefined;

  let state = "active";
  let error = "";
  let deleteButton: HTMLButtonElement | undefined = undefined;

  onMount(() => {
    if (deleteButton) deleteButton.focus();
  });

  const safeDelete = async () => {
    await api<any>({ method: "DELETE", url });
  };
  const remove = () => {
    state = "loading";
    const deleteFunction = typeof onDelete === "function" ? onDelete : safeDelete;
    Promise.resolve(deleteFunction())
      .then((value) => {
        if (typeof onSuccess === "function") onSuccess(value);
      })
      .catch((err) => {
        error = err.message;
        if (typeof onError === "function") onError(err.message);
        setTimeout(() => {
          error = "";
          if (typeof onError === "function") onError(err.message);
        }, 10000);
      })
      .then(() => (state = "ready"));
  };
</script>

<Modal {onClose}>
  <div class={`bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${state === 'loading' ? 'loading' : ''}`}>
    {#if error}
      <div class="-mt-4 pb-3">
        <Error {error} />
      </div>
    {/if}
    <div class="sm:flex sm:items-start">
      <div
        class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
        <svg
          class="h-6 w-6 text-red-600"
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
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">{title}</h3>
        <div class="mt-2">
          <p class="text-sm text-gray-500">{text}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
    <button
      type="button"
      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition motion-reduce:transition-none"
      on:click={remove}
      bind:this={deleteButton}>
      {deleteButtonText || 'Delete'}
    </button>
    <button
      type="button"
      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition motion-reduce:transition-none"
      on:click={() => onClose()}>
      {cancelButtonText || 'Cancel'}
    </button>
  </div>
</Modal>
