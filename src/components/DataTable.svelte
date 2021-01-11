<script lang="ts">
  import { goto, stores } from "@sapper/app";
  import { onMount } from "svelte";
  import { scale, draw } from "svelte/transition";
  import { api } from "../api";
  import type { Filter } from "../interfaces";
  import Empty from "./Empty.svelte";
  import Error from "./Error.svelte";
  import Search from "./Search.svelte";

  /** Items in the table */
  export let data: any[] = [];
  /** Name of "items" (e.g., "Load more items", "No items found") */
  export let itemName = "items";
  /** Title or name key */
  export let titleKey = "title";
  /** Update data */
  export let onData: (data: any[]) => any;
  /** Filter presets for search */
  export let filters: Filter[];
  /** Primary key type (slug or ID) */
  export let primaryKeyType: "slug" | "id" = "id";
  /** API endpoint to fetch items */
  export let endpoint: string;
  /** Number of items per page */
  export let maxItems = 10;
  /** Table <th> headers */
  export let headers: string[] = [];
  /** Optional title for the table */
  export let title: string | undefined = undefined;
  /** Optional description for the table */
  export let text: string | undefined = undefined;

  const { page } = stores();
  let lastItemId: number | string | undefined = undefined;
  let hasMore = false;
  let state = "ready";
  let error = "";
  let query = "";

  const fetch = async () => {
    state = "fetching";
    let cached = false;
    try {
      const items = await api<any[]>({
        method: "GET",
        url: `${endpoint}?take=${maxItems}&orderBy=${primaryKeyType}:${
          primaryKeyType === "id" ? "desc" : "asc"
        }${lastItemId ? `&cursor=${lastItemId}&skip=1` : ""}${query ? `&where=${query}` : ""}`,
        onCachedResponse: (items) => {
          cached = true;
          data = items;
          onData(data);
        },
      });
      if (cached || query) data = [];
      hasMore = items.length === maxItems;
      if (items.length) lastItemId = items[items.length - 1][primaryKeyType];
      data = [...data, ...items];
      onData(data);
    } catch (err) {
      error = err.message;
    }
    state = "ready";
  };
  page.subscribe((item: any) => {
    if (item && item.query && item.query.q && item.query.q !== query) {
      query = $page.query.q;
      data = [];
      onData(data);
      lastItemId = "";
      fetch();
    }
  });
  onMount(async () => {
    if (!query) fetch();
  });

  const search = async (q?: string) => {
    if (typeof q === "string") query = q;
    if (!query.includes(":")) query = `${titleKey}: contains ${query}`;
    if (query === `${titleKey}: contains `) query = "";
    goto(`${$page.path}?q=${encodeURIComponent(query)}`);
    data = [];
    onData(data);
    lastItemId = "";
    return fetch();
  };
</script>

{#if title || text}
  <div class="p-7">
    {#if title}
      <h1 class="text-2xl">{title}</h1>
    {/if}
    {#if text}
      <p class="mt-2 text-gray-500 text-sm">{text}</p>
    {/if}
  </div>
{/if}

{#if error}
  <div class="p-7">
    <Error {error} />
  </div>
{/if}

<Search {search} {filters} {query} updateQuery={(q) => (query = q)} searchFor={itemName} />
<div class="flex flex-col">
  <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="py-2 align-middle inline-block min-w-full sm:px-7 lg:px-8">
      <div class="overflow-hidden border-t border-b border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              {#each headers as header}
                <th
                  scope="col"
                  class="px-7 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              {/each}
              <th scope="col" class="relative px-7 py-3"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each data as item}
              <tr>
                <slot {item} />
              </tr>
            {/each}
          </tbody>
        </table>
        {#if hasMore}
          <div transition:scale>
            <button
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm font-medium rounded-md sm:text-sm text-indigo-900 bg-indigo-100 hover:bg-indigo-200 transition motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 m-7 mt-3"
              on:click={fetch}>
              <span class="flex space-x-4 items-center">
                <span>Load more {itemName}</span>
                {#if state === 'fetching'}
                  <svg
                    class="w-4 h-4"
                    viewBox="0 0 38 38"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="currentColor">
                    <g fill="none" fill-rule="evenodd">
                      <g transform="translate(1 1)" stroke-width="2">
                        <circle transition:draw stroke-opacity=".5" cx="18" cy="18" r="18" />
                        <path transition:draw d="M36 18c0-9.94-8.06-18-18-18">
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
          </div>
        {/if}
        {#if data.length === 0 && state === 'ready'}
          <Empty message={`No ${itemName} found`} />
        {/if}
        {#if state === 'fetching' && !hasMore}
          <div class={`loading ${data.length ? 'loading-has' : 'h-52 bg-gray-50'}`}>
            <div>Loading...</div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
