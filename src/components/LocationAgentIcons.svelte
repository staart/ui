<script lang="ts">
  import { countries } from "../data";

  export let item: any = {};
  export let browserHref: string;
  export let operatingSystemHref: string;
  export let countryCodeHref: string;
</script>

{#if item.browser}
  <a
    href={browserHref}
    class="inline-flex items-center transition motion-reduce:transition-none hover:text-gray-700">
    <div
      class="flex flex-shrink-0 h-10 w-10 items-center content-center rounded border cursor-pointer transition motion-reduce:transition-none"
      aria-label={item.browser}
      data-balloon-pos="up">
      <img
        class="rounded"
        src={`https://images.weserv.nl/?url=${encodeURIComponent(`https://tse2.mm.bing.net/th?q=${encodeURIComponent(`${item.browser.split(' ')[0]} icon`)}&h=70&c=7&rs=1&p=0&dpr=3&pid=1.7&mkt=en-IN&adlt=moderate`)}&w=128&h=128&fit=contain`}
        alt="" />
    </div>
  </a>
{/if}
{#if item.operatingSystem}
  <a
    href={operatingSystemHref}
    class="inline-flex items-center transition motion-reduce:transition-none hover:text-gray-700">
    <div
      class="flex flex-shrink-0 h-10 w-10 items-center content-center rounded border cursor-pointer transition motion-reduce:transition-none"
      aria-label={item.operatingSystem}
      data-balloon-pos="up">
      <img
        class="rounded"
        src={`https://images.weserv.nl/?url=${encodeURIComponent(`https://tse2.mm.bing.net/th?q=${encodeURIComponent(`${item.operatingSystem.split(' ')[0]} logo`)}&h=70&c=7&rs=1&p=0&dpr=3&pid=1.7&mkt=en-IN&adlt=moderate`)}&w=128&h=128&fit=contain`}
        alt="" />
    </div>
  </a>
{/if}
{#if item.countryCode}
  <a
    href={countryCodeHref}
    class="inline-flex items-center transition motion-reduce:transition-none hover:text-gray-700">
    <div
      class="flex flex-shrink-0 h-10 w-10 items-center content-center rounded border cursor-pointer transition motion-reduce:transition-none"
      aria-label={[
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
  </a>
{/if}
