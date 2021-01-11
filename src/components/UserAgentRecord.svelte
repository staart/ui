<script lang="ts">
  export let item: any = {};
  export let iconOnly = false;
  export let href: string = "/";
</script>

{#if item.browser}
  <a
    {href}
    class="inline-flex items-center transition motion-reduce:transition-none hover:text-gray-700">
    <div
      class="flex flex-shrink-0 h-10 w-10 items-center content-center rounded border cursor-pointer transition motion-reduce:transition-none"
      aria-label={iconOnly ? [item.browser, item.operatingSystem]
            .filter((i) => (i || '').trim())
            .join(', ') : undefined}
      data-balloon-pos={iconOnly ? 'up' : undefined}>
      <img
        class="rounded"
        src={`https://images.weserv.nl/?url=${encodeURIComponent(`https://tse2.mm.bing.net/th?q=${encodeURIComponent(`${item.browser.split(' ')[0]} icon`)}&h=70&c=7&rs=1&p=0&dpr=3&pid=1.7&mkt=en-IN&adlt=moderate`)}&w=128&h=128&fit=contain`}
        alt="" />
    </div>
    {#if !iconOnly}
      <div class="ml-5">
        <div class="text-sm font-medium text-gray-900">{item.browser}</div>
        <div class="text-sm text-gray-500">{item.operatingSystem}</div>
      </div>
    {/if}
  </a>
{/if}
