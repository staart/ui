<script lang="ts">
  import { stores } from "@sapper/app";
  import type { Membership } from "@koj/types";
  import { api, can, refresh } from "../../../api";
  import DataTable from "../../../components/DataTable.svelte";
  import DeleteModal from "../../../components/DeleteModal.svelte";
  import GroupRecord from "../../../components/Table/GroupRecord.svelte";
  import Form from "../../../components/Form.svelte";
  import { users } from "../../../stores";
  import Tag from "../../../components/Tag.svelte";

  const { page } = stores();
  const { slug } = $page.params;
  const primaryKeyType = "id";
  let data: Membership[] = [];
  let deleteActiveKey: number | undefined = undefined;

  const updateData = (item: any) => {
    if (data.find((i) => i[primaryKeyType] === item[primaryKeyType]))
      data = data.map((i) => {
        if (i[primaryKeyType] === item[primaryKeyType]) return item;
        return i;
      });
    else data = [...data, item];
  };

  const add = async (body: { name: string; scopes: string[] }) => {
    const result = await api<any>({
      method: "POST",
      url: `/users/${slug}/memberships`,
      body,
    });
    await refresh();
    users.update((items) => {
      items = items.map((i) => {
        if (i.details.id === slug) return { ...i, memberships: [...i.memberships, result] };
        return i;
      });
      return items;
    });
    updateData(result);
  };
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
  headers={['Group', 'Role']}
  onData={(val) => (data = val)}
  {primaryKeyType}
  filters={[{ title: 'Name', name: 'name', type: 'string' }, { title: 'ID', name: primaryKeyType, type: 'string' }, { title: 'Created at', name: 'createdAt', type: 'datetime' }, { title: 'Updated at', name: 'updatedAt', type: 'datetime' }]}>
  <td class="px-7 py-4 whitespace-nowrap">
    <GroupRecord item={item.group} />
  </td>
  <td class="px-7 py-4 whitespace-nowrap">
    {#if item.role === 'OWNER'}
      <Tag href={`/users/${slug}/groups?q=${encodeURIComponent('role: OWNER')}`} color="blue">
        Owner
      </Tag>
    {:else if item.role === 'ADMIN'}
      <Tag href={`/users/${slug}/groups?q=${encodeURIComponent('role: ADMIN')}`} color="indigo">
        Admin
      </Tag>
    {:else if item.role === 'MEMBER'}
      <Tag href={`/users/${slug}/groups?q=${encodeURIComponent('role: MEMBER')}`} color="green">
        Member
      </Tag>
    {:else}
      <Tag
        href={`/users/${slug}/groups?q=${encodeURIComponent(`role: ${item.role}`)}`}
        color="gray">
        ${item.role}
      </Tag>
    {/if}
  </td>
  <td class="px-7 py-4 whitespace-nowrap text-right text-sm font-medium">
    {#if can(`user-${slug}:delete-membership-${item[primaryKeyType]}`)}
      <button
        aria-label="Leave"
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

<div class="p-7">
  <Form
    title="Add group"
    text="Create another group to invite your team to."
    items={[{ name: 'name', label: 'Name', required: true }]}
    submitText="Create group"
    onSubmit={add} />
</div>

{#if deleteActiveKey}
  <DeleteModal
    title="Leave group"
    text="Are you sure you want to leave this group? The group may still be accessible by any other members in it, or will be deleted if there are no other members."
    deleteButtonText="Leave"
    onClose={() => (deleteActiveKey = undefined)}
    url={`/users/${slug}/memberships/${deleteActiveKey}`}
    onSuccess={() => {
      data = data.filter((i) => i[primaryKeyType] !== deleteActiveKey);
      users.update((items) => {
        items = items.map((i) => {
          if (i.details.id === slug) return { ...i, memberships: i.memberships.filter((j) => j.id !== deleteActiveKey) };
          return i;
        });
        return items;
      });
      refresh();
      deleteActiveKey = undefined;
    }} />
{/if}
