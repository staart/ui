<script lang="ts">
  import { stores } from "@sapper/app";
  import type { Membership } from "@koj/types";
  import { can } from "../../../api";
  import DataTable from "../../../components/DataTable.svelte";
  import DeleteModal from "../../../components/DeleteModal.svelte";
  import GroupRecord from "../../../components/Table/GroupRecord.svelte";

  const { page } = stores();
  const { slug } = $page.params;
  const primaryKeyType = "id";
  let data: Membership[] = [];
  let deleteActiveKey: number | undefined = undefined;
</script>

<svelte:head>
  <title>Groups</title>
</svelte:head>

<DataTable
  let:item
  {data}
  title="Groups"
  itemName="groups"
  titleKey="name"
  text="These are the groups associated with this user."
  endpoint={`/users/${slug}/memberships`}
  headers={['Group']}
  onData={(val) => (data = val)}
  {primaryKeyType}
  filters={[{ title: 'Name', name: 'name', type: 'string' }, { title: 'ID', name: primaryKeyType, type: 'string' }, { title: 'Created at', name: 'createdAt', type: 'datetime' }, { title: 'Updated at', name: 'updatedAt', type: 'datetime' }]}>
  <td class="px-7 py-4 whitespace-nowrap">
    <GroupRecord item={item.group} />
  </td>
  <td class="px-7 py-4 whitespace-nowrap text-right text-sm font-medium">
    {#if can(`email:write-info-${item[primaryKeyType]}`)}
      <button
        aria-label="Leave"
        data-balloon-pos="up"
        class="text-gray-500 hover:text-red-700 transition motion-reduce:transition-none ml-4 align-middle focus:text-red-700"
        on:click={() => (deleteActiveKey = item.group.id)}>
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
    title="Leave group"
    text="Are you sure you want to leave this group? The group may still be accessible by any other members in it, or will be deleted if there are no other members."
    deleteButtonText="Leave"
    onClose={() => (deleteActiveKey = undefined)}
    url={`/groups/${deleteActiveKey}`}
    onSuccess={() => {
      data = data.filter((i) => i[primaryKeyType] !== deleteActiveKey);
      deleteActiveKey = undefined;
    }} />
{/if}
