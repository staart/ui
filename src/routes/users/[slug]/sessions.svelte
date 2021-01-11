<script lang="ts">
  import { stores } from "@sapper/app";
  import type { Session } from "@koj/types";
  import { can } from "../../../api";
  import DataTable from "../../../components/DataTable.svelte";
  import DeleteModal from "../../../components/DeleteModal.svelte";
  import TimeAgo from "../../../components/TimeAgo.svelte";

  const { page } = stores();
  const { slug } = $page.params;
  const primaryKeyType = "id";
  let data: Session[] = [];
  let deleteActiveKey: number | undefined = undefined;
</script>

<svelte:head>
  <title>Sessions</title>
</svelte:head>

<DataTable
  let:item
  {data}
  title="Sessions"
  itemName="sessions"
  titleKey="session"
  text="These are the devices you are currently logged in on. If you don't use a session for more than 30 days, you will be logged out automatically."
  endpoint={`/users/${slug}/sessions`}
  headers={['Session', 'Last used']}
  onData={(val) => (data = val)}
  {primaryKeyType}
  filters={[{ title: 'ID', name: 'id', type: 'int' }, { title: 'IP address', name: 'ipAddress', type: 'string' }, { title: 'User agent', name: 'userAgent', type: 'string' }, { title: 'City', name: 'city', type: 'string' }, { title: 'Region', name: 'region', type: 'string' }, { title: 'Timezone', name: 'timezone', type: 'string' }, { title: 'Country code', name: 'countryCode', type: 'string' }, { title: 'Browser', name: 'browser', type: 'string' }, { title: 'Operating system', name: 'operatingSystem', type: 'string' }, { title: 'Created at', name: 'createdAt', type: 'datetime' }, { title: 'Updated at', name: 'updatedAt', type: 'datetime' }]}>
  <td class="px-7 py-4 whitespace-nowrap">
    <div class="flex items-center">
      <div class="flex-shrink-0 h-5 w-5">
        <img
          class="h-5 w-5 rounded"
          src={`https://images.weserv.nl/?url=${encodeURIComponent(`https://tse2.mm.bing.net/th?q=${encodeURIComponent(`${item.browser.split(' ')[0]} icon`)}&h=70&c=7&rs=1&p=0&dpr=3&pid=1.7&mkt=en-IN&adlt=moderate`)}&w=128&h=128&fit=contain`}
          alt="" />
      </div>
      <div class="ml-5 text-sm text-gray-900">
        <span class="font-medium">{item.browser}</span>
        on
        {item.operatingSystem}
        {#if item.isCurrentSession}
          <span
            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 ml-2">
            Current
          </span>
        {/if}
      </div>
    </div>
  </td>
  <td class="px-7 py-4 whitespace-nowrap text-sm text-gray-500">
    <TimeAgo date={item.updatedAt} />
  </td>
  <td class="px-7 py-4 whitespace-nowrap text-right text-sm font-medium">
    {#if !item.isCurrentSession && can(`email:write-info-${item[primaryKeyType]}`)}
      <button
        aria-label="Logout"
        data-balloon-pos="up"
        class="text-gray-500 hover:text-red-700 transition motion-reduce:transition-none ml-4 align-middle focus:text-red-700"
        on:click={() => (deleteActiveKey = item.id)}>
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
      </button>
    {/if}
  </td>
</DataTable>

{#if deleteActiveKey}
  <DeleteModal
    title="Log out of session"
    text="Are you sure you want to log out of this session?"
    onClose={() => (deleteActiveKey = undefined)}
    url={`/users/${slug}/sessions/${deleteActiveKey}`}
    onSuccess={() => {
      data = data.filter((i) => i[primaryKeyType] !== deleteActiveKey);
      deleteActiveKey = undefined;
    }} />
{/if}
