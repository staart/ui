<script lang="ts">
  import { stores } from "@sapper/app";
  import {
    Button,
    DataTable,
    DataTableSkeleton,
    Form,
    FormGroup,
    InlineLoading,
    InlineNotification,
    Modal,
    TextInput,
  } from "carbon-components-svelte";
  import SubtractAlt20 from "carbon-icons-svelte/lib/SubtractAlt20";
  import Edit20 from "carbon-icons-svelte/lib/Edit20";
  import { onMount } from "svelte";
  import { api } from "../../../../helpers/api";
  import { can } from "../../../../helpers/auth-token";

  const { page } = stores();
  const { id } = $page.params;

  let apiKeys: any[] = [];
  let loading = true;
  let state = "ready";
  let newApiKey = "";
  let errorMessage = "";
  let openDelete = false;
  let deleteApiKey: number | null = null;
  onMount(async () => {
    apiKeys = await api("GET", `/groups/${id}/api-keys`);
    loading = false;
  });

  const add = async () => {
    state = "adding";
    try {
      apiKeys.push(
        await api("POST", `/groups/${id}/api-keys`, {
          name: newApiKey,
        })
      );
      newApiKey = "";
      state = "added";
      setTimeout(() => (state = "ready"), 5000);
    } catch (error) {
      errorMessage = error.message;
      state = "ready";
    }
  };

  const remove = async () => {
    state = "removing";
    openDelete = false;
    try {
      await api("DELETE", `/groups/${id}/api-keys/${deleteApiKey}`);
      apiKeys = apiKeys.filter((i) => i.id !== deleteApiKey);
      state = "removed";
      setTimeout(() => (state = "ready"), 5000);
    } catch (error) {
      errorMessage = error.message;
      state = "ready";
    }
    deleteApiKey = null;
  };
</script>

<h1>API keys</h1>

<Modal
  bind:open={openDelete}
  danger
  modalHeading="Delete API key"
  primaryButtonText="Delete"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (openDelete = false)}
  on:submit={() => remove()}>
  <p>
    Are you sure you want to delete this API key? This action is not reversible,
    and your API key will stop working instantly.
  </p>
</Modal>

{#if loading}
  <DataTableSkeleton showHeader={false} showToolbar={false} />
{:else if apiKeys}
  <DataTable
    sortable
    headers={[{ key: 'name', value: 'Name' }, { key: 'apiKey', value: 'API key' }, { key: 'scopes', value: 'Scopes' }, { key: 'createdAt', value: 'Created' }, { key: 'actions', value: '' }]}
    rows={apiKeys}>
    <span slot="cell-header" let:header>
      {#if header.key === 'port'}
        {header.value}
        (network)
      {:else}{header.value}{/if}
    </span>
    <span slot="cell" let:row let:cell>
      {#if cell.key === 'apiKeyId'}
        {row.apiKey.name}
      {:else if cell.key === 'createdAt'}
        {new Date(cell.value).toLocaleDateString()}
      {:else if cell.key === 'scopes'}
        {cell.value.length || 'None'}
      {:else if cell.key === 'apiKey'}
        <code>{cell.value}</code>
      {:else if cell.key === 'actions'}
        <div class="align-right">
          {#if can(`group-${id}:api-key-${row.id}-delete`)}
            <Button
              icon={Edit20}
              href="/groups/{id}/api-keys/{row.id}"
              hasIconOnly
              tooltipPosition="bottom"
              tooltipAlignment="center"
              iconDescription="Edit" />
          {/if}
          {#if can(`group-${id}:api-key-${row.id}-delete`)}
            <Button
              icon={SubtractAlt20}
              on:click={() => {
                openDelete = true;
                deleteApiKey = row.id;
              }}
              hasIconOnly
              kind="danger"
              tooltipPosition="bottom"
              tooltipAlignment="center"
              iconDescription="Delete" />
          {/if}
        </div>
      {:else}{cell.value}{/if}
    </span>
  </DataTable>
  {#if state === 'removing'}
    <InlineLoading status="active" description="Deleting..." />
  {:else if state === 'removed'}
    <InlineLoading status="finished" description="Deleted" />
  {/if}
  <h2>Create a API key</h2>
  {#if errorMessage}
    <InlineNotification kind="error" title={errorMessage} />
  {/if}
  <Form on:submit={add}>
    <FormGroup>
      <TextInput labelText="Name" bind:value={newApiKey} required />
    </FormGroup>
    <Button type="submit">Create API key</Button>
  </Form>
  {#if state === 'adding'}
    <InlineLoading status="active" description="Creating..." />
  {:else if state === 'added'}
    <InlineLoading status="finished" description="Created" />
  {/if}
{/if}
