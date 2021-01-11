<script lang="ts">
  import { debounce } from "debounce";
  import type { Filter } from "../interfaces";
  import { fade, slide } from "svelte/transition";

  /** Options for each data type of filter */
  const filterOptions: Record<Filter["type"], Record<string, string>> = {
    string: {
      contains: "contains",
      is: "is",
      startsWith: "begins with",
      endsWith: "ends with",
    },
    int: {
      is: "is",
      gt: "is greater than",
      gte: "is greater than or equal to",
      lt: "is lesser than",
      lte: "is lesser than or equal to",
    },
    float: {
      is: "is",
      gt: "is greater than",
      gte: "is greater than or equal to",
      lt: "is lesser than",
      lte: "is lesser than or equal to",
    },
    date: {
      is: "is",
      lt: "is before",
      gt: "is after",
    },
    datetime: {
      is: "is",
      lt: "is before",
      gt: "is after",
    },
    bool: {
      is: "is",
    },
    enum: {
      is: "is",
      not: "is not",
    },
  };

  /** Search for "something"... */
  export let searchFor = "something";
  /** List of filters for this data type */
  export let filters: Filter[];
  /** Search query */
  export let query = "";
  /** Search functions */
  export let search: (q?: string) => void;
  export let updateQuery: (q?: string) => any;
  const debouncedSearch = debounce(search, 1000);

  /** Whether to open filters panel */
  let showFilters = false;
  /** Current selected filters */
  let selectedFilters: Filter[] = [];

  /** Add a new filter */
  const addFilter = () => {
    selectedFilters = [
      ...selectedFilters,
      { ...filters[0], filterType: Object.keys(filterOptions[filters[0].type])[0] },
    ];
  };
  /** Apply all filters */
  const applyFilter = async () => {
    let query = "";
    selectedFilters.forEach((filter) => {
      if (filter.value !== "" && filter.value != null) {
        const filterType = filter.filterType === "is" ? " " : ` ${filter.filterType} `;
        if (filter.type === "bool") query += `${filter.name}:${filterType}bool(${filter.value}), `;
        else if (filter.type === "int")
          query += `${filter.name}:${filterType}int(${filter.value}), `;
        else if (filter.type === "float")
          query += `${filter.name}:${filterType}float(${filter.value}), `;
        else if (filter.type === "date")
          query += `${filter.name}:${filterType}date(${filter.value}), `;
        else if (filter.type === "datetime")
          query += `${filter.name}:${filterType}datetime(${filter.value}), `;
        else query += `${filter.name}:${filterType}${filter.value}, `;
      }
    });
    if (query.length) query = query.substring(0, query.length - 2);
    showFilters = false;
    updateQuery(query);
    return search(query || undefined);
  };
  /** Update `selectedFilters` on input */
  const updateFilter = (index: number, filter: "name" | "filterType" | "value", event: any) => {
    const value = event.target.value;
    selectedFilters = selectedFilters.map((i, x) => {
      if (index === x) {
        if (filter === "name") {
          const item = filters.find((j) => j.name === value);
          return {
            ...i,
            name: value,
            title: item.title,
            type: item.type,
            options: item.options,
            filterType: Object.keys(filterOptions[item.type])[0],
            value:
              item.options && Object.keys(item.options).length
                ? Object.keys(item.options)[0]
                : item.type === "bool"
                ? "true"
                : "",
          };
        }
        if (filter === "filterType") return { ...i, filterType: value };
        if (filter === "value") return { ...i, value };
      }
      return i;
    });
  };
</script>

<form
  on:submit|preventDefault={() => search()}
  class="relative border-t border-gray-200 bg-gray-50 overflow-hidden">
  <fieldset>
    <div
      class={showFilters ? 'opacity-0 transition motion-reduce:transition-none' : 'transition motion-reduce:transition-none'}>
      <label for="query" class="sr-only">Search</label>
      <input
        bind:value={query}
        type="text"
        on:input={() => {
          updateQuery(query);
          debouncedSearch();
        }}
        placeholder={`Search for ${searchFor}...`}
        name="query"
        id="query"
        autocomplete="query"
        class="block w-full sm:text-sm bg-gray-50 appearance-none border-0 focus:outline-none focus:ring-0 transition motion-reduce:transition-none focus:bg-gray-100 px-7 py-3 pl-14" />
    </div>
    {#if !showFilters}
      <div
        transition:fade={{ duration: 100 }}
        class="absolute top-3 left-7 inline-block text-left z-10 text-gray-400">
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>
    {/if}
    <div class="absolute top-1 right-1 inline-block text-left z-10">
      <button
        type="button"
        on:click={async () => {
          if (selectedFilters.length === 0) addFilter();
          showFilters = !showFilters;
        }}
        class="absolute transition motion-reduce:transition-none top-0 right-0 text-gray-500 mx-6 my-2 sm:text-sm hover:text-gray-700 focus:text-gray-700 focus:outline-none focus:ring-0 -translate-y-2/4"
        aria-label={showFilters ? 'Close' : 'Filters'}
        data-balloon-pos="left">
        {#if showFilters}
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12" /></svg>
        {:else}
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
        {/if}
      </button>
    </div>
  </fieldset>
  {#if showFilters}
    <div class="p-3 pt-0 space-y-4" transition:slide>
      {#each selectedFilters as selectedFilter, index}
        <div class="grid gap-4 grid-cols-5 px-4">
          <div>
            <label for={`name-${index}`} class="sr-only">First name</label>
            <select
              type="text"
              on:blur={(evt) => updateFilter(index, 'name', evt)}
              name={`name-${index}`}
              id={`name-${index}`}
              class="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={selectedFilter.name}>
              {#each filters as filter}
                <option value={filter.name}>{filter.title}</option>
              {/each}
            </select>
          </div>
          <div>
            <label for={`type-${index}`} class="sr-only">First name</label>
            <select
              type="text"
              on:blur={(evt) => updateFilter(index, 'filterType', evt)}
              name={`type-${index}`}
              id={`type-${index}`}
              class="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={selectedFilter.name}>
              {#each Object.keys(filterOptions[selectedFilter.type]) as filterOption}
                <option value={filterOption}>
                  {filterOptions[selectedFilter.type][filterOption]}
                </option>
              {/each}
            </select>
          </div>
          <div class="col-span-3">
            <label for={`value-${index}`} class="sr-only">First name</label>
            <div class="flex">
              {#if selectedFilter.type === 'enum' && Object.keys(selectedFilter.options).length}
                <select
                  type="text"
                  on:blur={(evt) => updateFilter(index, 'value', evt)}
                  name={`value-${index}`}
                  id={`value-${index}`}
                  class="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  value={selectedFilter.value}>
                  {#each Object.keys(selectedFilter.options) as filterOption}
                    <option value={filterOption}>{selectedFilter.options[filterOption]}</option>
                  {/each}
                </select>
              {:else if selectedFilter.type === 'bool'}
                <select
                  type="text"
                  on:blur={(evt) => updateFilter(index, 'value', evt)}
                  name={`value-${index}`}
                  id={`value-${index}`}
                  class="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  value={selectedFilter.value}>
                  <option>true</option>
                  <option>false</option>
                </select>
              {:else}
                <input
                  type="text"
                  on:input={(evt) => updateFilter(index, 'value', evt)}
                  placeholder="Enter value"
                  name={`value-${index}`}
                  id={`value-${index}`}
                  class="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              {/if}
              <div>
                <button
                  type="button"
                  on:click={() => {
                    selectedFilters = selectedFilters.filter((i) => i.name !== selectedFilter.name);
                    if (selectedFilters.length === 0) showFilters = false;
                  }}
                  class="transition motion-reduce:transition-none text-gray-500 ml-4 my-2 sm:text-sm hover:text-gray-700 focus:text-gray-700 focus:outline-none focus:ring-0"
                  aria-label="Remove"
                  data-balloon-pos="up">
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"><path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      {/each}
      <div class="p-4 pt-0 flex justify-end">
        <button
          type="button"
          class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 transition motion-reduce:transition-none mr-3"
          on:click={addFilter}>
          Add another rule
        </button>
        <button
          type="button"
          class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 transition motion-reduce:transition-none mr-3"
          on:click={async () => {
            selectedFilters = [];
            showFilters = false;
            return search('');
          }}>
          Clear filters
        </button>
        <button
          type="button"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm font-medium rounded-md sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          on:click={applyFilter}>
          Apply filters
        </button>
      </div>
    </div>
  {/if}
</form>
