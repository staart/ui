<script lang="ts">
  import { stores } from "@sapper/app";
  import type { ApiKey } from "@koj/types";
  import { api, can } from "../../../api";
  import DataTable from "../../../components/DataTable.svelte";
  import DeleteModal from "../../../components/DeleteModal.svelte";
  import Form from "../../../components/Form.svelte";
  import DeleteButton from "../../../components/Table/DeleteButton.svelte";
  import EditButton from "../../../components/Table/EditButton.svelte";
  import Modal from "../../../components/Modal.svelte";
  import UserRecord from "../../../components/Table/UserRecord.svelte";
  import Tag from "../../../components/Tag.svelte";

  const { page } = stores();
  const { slug } = $page.params;
  const primaryKeyType = "id";
  let data: ApiKey[] = [];
  let editActive: ApiKey | undefined = undefined;
  let deleteActiveKey: number | undefined = undefined;

  const updateData = (item: ApiKey) => {
    if (data.find((i) => i[primaryKeyType] === item[primaryKeyType]))
      data = data.map((i) => {
        if (i[primaryKeyType] === item[primaryKeyType]) return item;
        return i;
      });
    else data = [...data, item];
  };

  const add = async (body: { name: string; scopes: string[] }) => {
    const result = await api<ApiKey>({
      method: "POST",
      url: `/groups/${slug}/memberships`,
      body,
    });
    updateData(result);
  };

  const edit = async (body: { name: string; scopes: string[] }) => {
    if (!editActive) return;
    const result = await api<ApiKey>({
      method: "PATCH",
      url: `/groups/${slug}/memberships/${editActive[primaryKeyType]}`,
      body,
    });
    updateData(result);
    editActive = undefined;
  };
</script>

<svelte:head>
  <title>Members</title>
</svelte:head>

<DataTable
  let:item
  {data}
  title="Members"
  itemName="members"
  titleKey="apiKey"
  text="These users can view and manage this group."
  endpoint={`/groups/${slug}/memberships`}
  headers={['Member', 'Role']}
  onData={(val) => (data = val)}
  {primaryKeyType}
  filters={[{ title: 'ID', name: 'id', type: 'int' }, { title: 'Created at', name: 'createdAt', type: 'datetime' }, { title: 'Updated at', name: 'updatedAt', type: 'datetime' }]}>
  <td class="px-7 py-4 whitespace-nowrap text-sm text-gray-500">
    <UserRecord itemType="membership" {item} />
  </td>
  <td class="px-7 py-4 whitespace-nowrap">
    {#if item.role === 'ADMIN'}
      <Tag href={`/groups/${slug}/members?q=${encodeURIComponent('role: ADMIN')}`} color="blue">
        Admin
      </Tag>
    {:else if item.role === 'OWNER'}
      <Tag href={`/groups/${slug}/members?q=${encodeURIComponent('role: OWNER')}`} color="indigo">
        Owner
      </Tag>
    {:else if item.role === 'MEMBER'}
      <Tag href={`/groups/${slug}/members?q=${encodeURIComponent('role: MEMBER')}`} color="green">
        Member
      </Tag>
    {:else}
      <Tag
        href={`/groups/${slug}/members?q=${encodeURIComponent(`role: ${item.role}`)}`}
        color="gray">
        {item.role}
      </Tag>
    {/if}
  </td>
  <td class="px-7 py-4 whitespace-nowrap text-right text-sm font-medium">
    {#if can(`api-key:write-info-${item[primaryKeyType]}`)}
      <EditButton on:click={() => (editActive = item)} />
    {/if}
    {#if can(`api-key:write-info-${item[primaryKeyType]}`)}
      <DeleteButton on:click={() => (deleteActiveKey = item[primaryKeyType])} />
    {/if}
  </td>
</DataTable>

<div class="p-7">
  <Form
    title="Add member"
    text="If you'll be living with someone else in this group, you can invite them here. They will also be able to view and manage this group."
    items={[{ name: 'name', label: 'Name', required: true }, { name: 'email', label: 'Email', type: 'email', required: true }, { name: 'role', label: 'Role', type: 'enum', options: { ADMIN: 'Admin', OWNER: 'Owner', MEMBER: 'Member' }, required: true }]}
    onSubmit={add}
    submitText="Add member" />
</div>

{#if deleteActiveKey}
  <DeleteModal
    title="Remove member"
    text="Are you sure you want to permanently remove this member from this group?"
    onClose={() => (deleteActiveKey = undefined)}
    url={`/groups/${slug}/memberships/${deleteActiveKey}`}
    onSuccess={() => {
      data = data.filter((i) => i[primaryKeyType] !== deleteActiveKey);
      deleteActiveKey = undefined;
    }} />
{/if}

{#if editActive}
  <Modal onClose={() => (editActive = undefined)}>
    <Form
      title="Edit member"
      items={[{ name: 'role', label: 'Role', type: 'enum', options: { ADMIN: 'Admin', OWNER: 'Owner', MEMBER: 'Member' }, required: true }]}
      values={editActive}
      onSubmit={edit}
      submitText="Save member"
      onClose={() => (editActive = undefined)}
      modal={true} />
  </Modal>
{/if}
