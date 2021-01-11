<script lang="ts">
  import { draw } from "svelte/transition";
  import Error from "./Error.svelte";

  export let formId: string = Math.random().toString(36).replace(".", "");
  export let items: {
    name: string;
    label: string;
    type?: string;
    required?: boolean;
    autocomplete?: string;
    placeholder?: string;
    options?: Record<string, string>;
    defaultValue?: any;
    hint?: string;
    show?: boolean;
    preview?: string;
    accept?: string;
    download?: () => void;
  }[] = [];
  export let submitText: string | undefined = undefined;
  export let onSubmit: (responses: Record<string, any>) => any;
  export let onSuccess: (responses: Record<string, any>) => any | undefined = undefined;
  export let onError: (responses: Record<string, any>) => any | undefined = undefined;
  export let onClose: () => any | undefined = undefined;
  export let values: Record<string, any> = {};
  export let responses: Record<string, any> = {};
  export let title: string | undefined = undefined;
  export let text: string | undefined = undefined;
  export let modal = false;

  let state = "ready";
  let error = "";

  const updateValue = (key: string, type: string, event: Event) => {
    if (type === "number") responses[key] = Number((event.target as HTMLInputElement).value);
    else if (type === "checkbox" || type === "radio")
      responses[key] = (event.target as HTMLInputElement).checked;
    else if (type === "file" || type === "image")
      responses[key] = (event.target as HTMLInputElement).files;
    else if (type === "multiple") {
      responses[key] = Array.from((event.target as HTMLSelectElement).options)
        .filter((i) => i.selected)
        .map((i) => i.value);
    } else responses[key] = (event.target as HTMLInputElement).value;
  };

  const close = () => {
    if (typeof onClose === "function") onClose();
  };

  const reset = () => {
    items.forEach((item) => {
      if (item.defaultValue) responses[item.name] = item.defaultValue;
      else if (typeof values[item.name] !== "undefined") {
        if (item.type === "array" && Array.isArray(values[item.name]))
          responses[item.name] = values[item.name].join(", ");
        else responses[item.name] = values[item.name];
      } else if (item.type === "checkbox" || item.type === "radio") responses[item.name] = false;
      else if (item.type === "multiple") responses[item.name] = [];
      else if (item.type === "enum" && Object.keys(item.options).length)
        responses[item.name] = Object.keys(item.options)[0];
      else responses[item.name] = "";
    });
  };
  reset();

  let nKeys = Object.keys(values);
  $: {
    if (Object.keys(values) !== nKeys) {
      reset();
      nKeys = Object.keys(values);
    }
  }

  const send = () => {
    state = "loading";
    const submitResponses = { ...responses };
    Object.keys(submitResponses).forEach((key) => {
      const item = items.find((i) => i.name === key);
      if (item) {
        if (item.type === "array" && typeof submitResponses[key] === "string")
          submitResponses[key] = (submitResponses[key] as string)
            .split(",")
            .map((i) => i.trim())
            .filter((i) => !!i);
      }
    });
    Promise.resolve(onSubmit(submitResponses))
      .then((val: any) => {
        if (typeof onSuccess === "function") onSuccess(val);
        state = "done";
        setTimeout(() => {
          state = "ready";
        }, 5000);
      })
      .catch((err) => {
        error = err.message;
        if (typeof onError === "function") onError(err.message);
        state = "ready";
        setTimeout(() => {
          error = "";
          if (typeof onError === "function") onError(err.message);
        }, 10000);
      });

    if (!modal) reset();
  };

  const downloadFile = async (downloadFunction?: Function) => {
    if (typeof downloadFunction !== "function" || state === "downloading") return;
    state = "downloading";
    Promise.resolve(downloadFunction())
      .then((val: any) => {
        if (typeof onSuccess === "function") onSuccess(val);
      })
      .catch((err) => {
        error = err.message;
        if (typeof onError === "function") onError(err.message);
        setTimeout(() => {
          error = "";
          if (typeof onError === "function") onError(err.message);
        }, 10000);
      })
      .then(() => {
        state = "ready";
      });
  };
</script>

<form on:submit|preventDefault={send}>
  {#if error}
    <Error {error} />
  {/if}
  <fieldset class={modal ? `bg-white p-4 sm:p-6 space-y-4` : 'space-y-4'}>
    <div>
      {#if title}
        <h2 class="text-xl mb-2">{title}</h2>
      {/if}
      {#if text}
        <p class="text-gray-500 text-sm">{text}</p>
      {/if}
    </div>
    {#each items as item}
      <div>
        {#if item.type === 'enum' && Object.keys(item.options).length < 5}
          <div class="text-sm font-medium text-gray-700">{item.label}</div>
          <div class="flex">
            {#each Object.keys(item.options) as value}
              <div class="flex items-start mt-2 mr-4">
                <div class="flex items-center h-5">
                  <input
                    id={`${formId}_${item.name}_${value}`}
                    on:input={(event) => updateValue(item.name, item.type, event)}
                    name={item.name}
                    {value}
                    checked={value === responses[item.name]}
                    type="radio"
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 transition motion-reduce:transition-none rounded-full" />
                </div>
                <div class="ml-2 text-sm">
                  <div>
                    <label
                      for={`${formId}_${item.name}_${value}`}
                      class="text-gray-700">{item.options[value]}</label>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {:else if item.type === 'enum'}
          <label
            for={`${formId}_${item.name}`}
            class="block text-sm font-medium text-gray-700">{item.label}</label>
          <select
            on:blur={(event) => updateValue(item.name, item.type, event)}
            value={responses[item.name]}
            name={item.name}
            id={`${formId}_${item.name}`}
            class="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md transition motion-reduce:transition-none p-2"
            placeholder={item.placeholder}
            autocomplete={item.autocomplete}
            required={item.required}>
            {#each Object.keys(item.options) as key}
              <option value={key}>{item.options[key]}</option>
            {/each}
          </select>
        {:else if item.type === 'multiple'}
          <label
            for={`${formId}_${item.name}`}
            class="block text-sm font-medium text-gray-700">{item.label}</label>
          <select
            on:blur={(event) => updateValue(item.name, item.type, event)}
            value={responses[item.name]}
            name={item.name}
            id={`${formId}_${item.name}`}
            class="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md transition motion-reduce:transition-none p-2"
            placeholder={item.placeholder}
            autocomplete={item.autocomplete}
            required={item.required}
            multiple>
            {#each Object.keys(item.options) as key}
              <option value={key}>{item.options[key]}</option>
            {/each}
          </select>
        {:else if item.type === 'textarea'}
          <label
            for={`${formId}_${item.name}`}
            class="block text-sm font-medium text-gray-700">{item.label}</label>
          <textarea
            type={item.type || 'text'}
            on:input={(event) => updateValue(item.name, item.type, event)}
            value={responses[item.name]}
            name={item.name}
            id={`${formId}_${item.name}`}
            class="mt-2 p-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md transition motion-reduce:transition-none"
            placeholder={item.placeholder}
            autocomplete={item.autocomplete}
            required={item.required} />
        {:else if item.type === 'array'}
          <label
            for={`${formId}_${item.name}`}
            class="block text-sm font-medium text-gray-700">{item.label}</label>
          <textarea
            type={item.type || 'text'}
            on:input={(event) => updateValue(item.name, item.type, event)}
            value={responses[item.name]}
            name={item.name}
            id={`${formId}_${item.name}`}
            class="mt-2 p-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md transition motion-reduce:transition-none"
            placeholder={item.placeholder}
            autocomplete={item.autocomplete}
            required={item.required} />
        {:else if item.type === 'checkbox'}
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id={`${formId}_${item.name}`}
                on:input={(event) => updateValue(item.name, item.type, event)}
                name={item.name}
                checked={responses[item.name]}
                type="checkbox"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 transition motion-reduce:transition-none rounded" />
            </div>
            <div class="ml-3 text-sm">
              <div>
                <label
                  for={`${formId}_${item.name}`}
                  class="font-medium text-gray-700">{item.label}</label>
              </div>
              {#if item.hint}
                <p class="mt-1 text-gray-500 text-xs">{item.hint}</p>
              {/if}
            </div>
          </div>
        {:else if item.type === 'file' || item.type === 'image'}
          <label
            for={`${formId}_${item.name}`}
            class="block text-sm font-medium text-gray-700">{item.label}</label>
          <div class="mt-2 flex items-center">
            {#if item.preview && item.type === 'image'}
              <div class="mr-4">
                <img
                  class="inline-block h-12 w-12 rounded-full bg-gray-100"
                  src={`https://images.weserv.nl/?url=${encodeURIComponent(item.preview)}&w=128&h=128&fit=contain`}
                  alt="" />
              </div>
            {/if}
            <input
              type="file"
              on:input={(event) => updateValue(item.name, item.type, event)}
              name={item.name}
              accept={item.accept || (item.type === 'image' ? 'image/*' : undefined)}
              id={`${formId}_${item.name}`}
              class="py-2 px-3 border hover:bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 rounded-md transition motion-reduce:transition-none"
              placeholder={item.placeholder}
              autocomplete={item.autocomplete}
              required={item.required} />
            {#if item.preview && item.type !== 'image'}
              <div class="flex items-end text-xs ml-4">
                <div>
                  Currently attached:
                  <span
                    class="text-indigo-600 cursor-pointer inline-flex space-x-4 items-center"
                    on:click={() => downloadFile(item.download)}>
                    <span>{(item.preview || '').split('/').pop()}</span>
                    {#if state === 'downloading'}
                      <svg
                        class="w-4 h-4"
                        viewBox="0 0 38 38"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="currentColor">
                        <g fill="none" fill-rule="evenodd">
                          <g transform="translate(1 1)" stroke-width="2">
                            <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
                            <path d="M36 18c0-9.94-8.06-18-18-18">
                              <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 18 18"
                                to="360 18 18"
                                dur="1s"
                                repeatCount="indefinite" />
                            </path>
                          </g>
                        </g>
                      </svg>
                    {/if}
                  </span>
                </div>
              </div>
            {/if}
          </div>
        {:else if item.type === 'number'}
          <label
            for={`${formId}_${item.name}`}
            class="block text-sm font-medium text-gray-700">{item.label}</label>
          <input
            type="text"
            inputmode="numeric"
            pattern="[0-9]+"
            on:input={(event) => updateValue(item.name, item.type, event)}
            value={responses[item.name]}
            name={item.name}
            id={`${formId}_${item.name}`}
            class="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md transition motion-reduce:transition-none"
            placeholder={item.placeholder}
            autocomplete={item.autocomplete}
            required={item.required} />
        {:else}
          <label
            for={`${formId}_${item.name}`}
            class="block text-sm font-medium text-gray-700">{item.label}</label>
          <input
            type={item.type || 'text'}
            on:input={(event) => updateValue(item.name, item.type, event)}
            value={responses[item.name]}
            name={item.name}
            id={`${formId}_${item.name}`}
            class="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md transition motion-reduce:transition-none"
            placeholder={item.placeholder}
            autocomplete={item.autocomplete}
            required={item.required} />
        {/if}
        {#if item.hint && item.type !== 'checkbox'}
          <div class="mt-2 text-gray-500 text-xs">{item.hint}</div>
        {/if}
      </div>
    {/each}
  </fieldset>
  <div class={modal ? `bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse` : 'mt-4'}>
    <button
      type="submit"
      class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm font-medium rounded-md sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      <span class="flex space-x-4 items-center">
        <span>{submitText || 'Submit'}</span>
        {#if state === 'done'}
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              stroke-linecap="round"
              transition:draw
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7" />
          </svg>
        {:else if state === 'loading'}
          <svg
            class="w-4 h-4"
            viewBox="0 0 38 38"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor">
            <g fill="none" fill-rule="evenodd">
              <g transform="translate(1 1)" stroke-width="2">
                <circle in:draw stroke-opacity=".5" cx="18" cy="18" r="18" />
                <path in:draw d="M36 18c0-9.94-8.06-18-18-18">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 18 18"
                    to="360 18 18"
                    dur="1s"
                    repeatCount="indefinite" />
                </path>
              </g>
            </g>
          </svg>
        {/if}
      </span>
    </button>
    {#if modal}
      <button
        on:click={close}
        type="button"
        class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500  transition motion-reduce:transition-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm mr-3">Cancel</button>
    {/if}
  </div>
</form>
