<script lang="ts">
  import { stores } from "@sapper/app";

  const { page } = stores();
  const { slug } = $page.params;
  const nav = [
    { title: "Details", slug: "details" },
    { title: "Members", slug: "members" },
    { title: "Security", slug: "security" },
    { title: "API keys", slug: "api-keys" },
    { title: "Audit logs", slug: "audit-logs" },
  ];
</script>

<div class="max-w-7xl my-10 mx-auto px-4 sm:px-6 lg:px-8">
  <div class="md:grid md:grid-cols-4 md:gap-6">
    <div class="md:col-span-1">
      <div class="shadow bg-white sm:rounded-md overflow-hidden top-5 sticky">
        {#each nav as item}
          <a
            href={`/groups/${slug}/${item.slug}`}
            class={$page.path === `/groups/${slug}/${item.slug}` ? 'block px-4 py-3 text-sm transition motion-reduce:transition-none text-gray-700 bg-gray-200 font-bold focus:outline-none focus:ring-0 focus:text-gray-900 focus:bg-gray-300' : 'block px-4 py-3 text-sm transition motion-reduce:transition-none text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none focus:ring-0'}
            role="menuitem">{item.title}</a>
        {/each}
      </div>
    </div>
    <div class="md:mt-0 md:col-span-3 shadow bg-white sm:rounded-md overflow-hidden">
      <slot />
    </div>
  </div>
</div>
