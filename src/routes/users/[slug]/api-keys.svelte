<script lang="ts">
  import { stores } from "@sapper/app";
  import type { ApiKey } from "@koj/types";
  import { api, can } from "../../../api";
  import DataTable from "../../../components/DataTable.svelte";
  import DeleteModal from "../../../components/DeleteModal.svelte";
  import { onMount } from "svelte";
  import Form from "../../../components/Form.svelte";
  import DeleteButton from "../../../components/Table/DeleteButton.svelte";
  import EditButton from "../../../components/Table/EditButton.svelte";
  import Modal from "../../../components/Modal.svelte";

  onMount(async () => {
    scopes = await api<Record<string, string>>({
      method: "GET",
      url: `/users/${slug}/api-keys/scopes`,
    });
  });

  const { page } = stores();
  const { slug } = $page.params;
  const primaryKeyType = "id";
  let data: ApiKey[] = [];
  let scopes: Record<string, string> = {};
  let editActive: ApiKey | undefined = undefined;
  let deleteActiveKey: number | undefined = undefined;
  let showActiveKeys: number[] = [];

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
      url: `/users/${slug}/api-keys`,
      body,
    });
    updateData(result);
  };

  const edit = async (body: { name: string; scopes: string[] }) => {
    if (!editActive) return;
    const result = await api<ApiKey>({
      method: "PATCH",
      url: `/users/${slug}/api-keys/${editActive[primaryKeyType]}`,
      body,
    });
    updateData(result);
    editActive = undefined;
  };

  const toggleActive = (id: number) => {
    if (showActiveKeys.includes(id)) showActiveKeys = showActiveKeys.filter((i) => i !== id);
    else showActiveKeys = [...showActiveKeys, id];
  };
</script>

<svelte:head>
  <title>API keys</title>
</svelte:head>

<DataTable
  let:item
  {data}
  title="API keys"
  itemName="API keys"
  titleKey="apiKey"
  text="API keys are used to programmatically access features using the API."
  endpoint={`/users/${slug}/api-keys`}
  headers={['API key', 'Scopes', 'Restrictions']}
  onData={(val) => (data = val)}
  {primaryKeyType}
  filters={[{ title: 'ID', name: 'id', type: 'int' }, { title: 'Created at', name: 'createdAt', type: 'datetime' }, { title: 'Updated at', name: 'updatedAt', type: 'datetime' }]}>
  {#if !showActiveKeys.includes(item.id)}
    <td class="px-7 py-4 whitespace-nowrap text-sm">{item.name}</td>
  {:else}
    <td class="px-7 py-4 whitespace-nowrap text-sm">
      <code class="rounded border">{item.apiKey}</code>
    </td>
  {/if}
  <td class="px-7 py-4 whitespace-nowrap text-sm text-gray-500">{item.scopes.length}</td>
  <td class="px-7 py-4 whitespace-nowrap text-sm text-gray-500">
    {(item.ipRestrictions || []).length + (item.referrerRestrictions || []).length}
  </td>
  <td class="px-7 py-4 whitespace-nowrap text-right text-sm font-medium">
    <button
      aria-label={showActiveKeys.includes(item.id) ? 'Hide API key' : 'Show API key'}
      data-balloon-pos="up"
      class="text-gray-500 hover:text-indigo-700 transition motion-reduce:transition-none ml-2 align-middle focus:text-indigo-700"
      on:click={() => toggleActive(item.id)}>
      {#if showActiveKeys.includes(item.id)}
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
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
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
      {/if}
    </button>
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
    title="Add API key"
    text="You can create another API key with specific permissions. You can add IP address range and referrer restrictions after creating the API key."
    items={[{ name: 'name', label: 'Name', required: true }, { name: 'scopes', label: 'Scopes', type: 'multiple', options: scopes, required: true }]}
    onSubmit={add}
    submitText="Add API key" />
</div>

{#if deleteActiveKey}
  <DeleteModal
    title="Delete API key"
    text="Are you sure you want to permanently delete this API key? It will stop working immediately."
    onClose={() => (deleteActiveKey = undefined)}
    url={`/users/${slug}/api-keys/${deleteActiveKey}`}
    onSuccess={() => {
      data = data.filter((i) => i[primaryKeyType] !== deleteActiveKey);
      deleteActiveKey = undefined;
    }} />
{/if}

{#if editActive}
  <Modal onClose={() => (editActive = undefined)}>
    <Form
      title="Edit API key"
      items={[{ name: 'name', label: 'Name', required: true }, { name: 'description', label: 'Description', type: 'textarea' }, { name: 'scopes', label: 'Scopes', type: 'multiple', options: scopes, required: true }, { name: 'ipRestrictions', label: 'IP address restrictions', type: 'array', hint: 'Enter a comma-separated list of IP CIDRs' }, { name: 'referrerRestrictions', label: 'Referrer restrictions', type: 'array', hint: 'Enter a comma-separated list of hostnames' }]}
      values={editActive}
      onSubmit={edit}
      submitText="Save API key"
      onClose={() => (editActive = undefined)}
      modal={true} />
  </Modal>
{/if}
