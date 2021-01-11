<script lang="ts">
  import { stores } from "@sapper/app";
  import { can } from "../../api";

  const { page } = stores();
  const nav = [
    { title: "Groups", slug: "groups", show: can("group-*:read-info") },
    { title: "Users", slug: "users", show: can("user-*:read-info") },
    { title: "Leads", slug: "leads", show: can("lead-*:read-info") },
    { title: "Audit logs", slug: "audit-logs", show: can("audit-log-*:read-info") },
    { title: "Metrics", slug: "metrics", show: can("metric-*:read-process") },
  ];
</script>

<div class="max-w-7xl my-10 mx-auto px-4 sm:px-6 lg:px-8">
  <div class="md:grid md:grid-cols-4 md:gap-6">
    <div class="md:col-span-1">
      <div class="shadow bg-white sm:rounded-md overflow-hidden top-5 sticky">
        {#each nav as item}
          {#if item.show}
            <a
              href={`/admin/${item.slug}`}
              class={$page.path === `/admin/${item.slug}` ? 'block px-4 py-3 text-sm transition motion-reduce:transition-none text-gray-700 bg-gray-200 font-bold focus:outline-none focus:ring-0 focus:text-gray-900 focus:bg-gray-300' : 'block px-4 py-3 text-sm transition motion-reduce:transition-none text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none focus:ring-0'}
              role="menuitem">{item.title}</a>
          {/if}
        {/each}
      </div>
    </div>
    <div class="md:mt-0 md:col-span-3 shadow bg-white sm:rounded-md overflow-hidden">
      <slot />
    </div>
  </div>
</div>
