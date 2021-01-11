<script lang="ts">
  import { countries } from "../data";

  export let item: any = {};
  export let iconOnly = false;
  export let href: string = "/";
</script>

{#if item.countryCode}
  <a
    {href}
    class="inline-flex items-center transition motion-reduce:transition-none hover:text-gray-700">
    <div
      class="flex flex-shrink-0 h-10 w-10 items-center content-center rounded border cursor-pointer transition motion-reduce:transition-none"
      aria-label={!iconOnly ? countries[item.countryCode.toLowerCase()] || item.countryCode : [
            item.city,
            item.region,
            countries[item.countryCode.toLowerCase()] || item.countryCode,
          ]
            .filter((i) => (i || '').trim())
            .join(', ')}
      data-balloon-pos="up">
      <img
        class="rounded"
        src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/1x1/${item.countryCode.toLowerCase()}.svg`}
        alt="" />
    </div>
    {#if !iconOnly}
      <div class="ml-5">
        <div class="text-sm font-medium text-gray-900">{item.city}</div>
        <div class="text-sm text-gray-500">{item.region}</div>
      </div>
    {/if}
  </a>
{/if}
