<script lang="ts">
  import { stores } from "@sapper/app";
  import {
    Button,
    DataTable,
    DataTableSkeleton,
    Form,
    FormGroup,
    Icon,
    InlineLoading,
    InlineNotification,
    Modal,
    TextInput,
    TooltipIcon,
  } from "carbon-components-svelte";
  import CheckmarkFilled20 from "carbon-icons-svelte/lib/CheckmarkFilled20";
  import Warning20 from "carbon-icons-svelte/lib/Warning20";
  import SubtractAlt20 from "carbon-icons-svelte/lib/SubtractAlt20";
  import Edit20 from "carbon-icons-svelte/lib/Edit20";
  import { onMount } from "svelte";
  import { api } from "../../../../helpers/api";
  import { can } from "../../../../helpers/auth-token";

  const { page } = stores();
  const { id } = $page.params;

  let webhooks: any[] = [];
  let loading = true;
  let state = "ready";
  let newWebhook = "";
  let errorMessage = "";
  let openDelete = false;
  let deleteWebhook: number | null = null;
  onMount(async () => {
    webhooks = await api("GET", `/groups/${id}/webhooks`);
    loading = false;
  });

  const add = async () => {
    state = "adding";
    try {
      webhooks.push(
        await api("POST", `/groups/${id}/webhooks`, {
          url: newWebhook,
          event: "create-webhook",
        })
      );
      newWebhook = "";
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
      await api("DELETE", `/groups/${id}/webhooks/${deleteWebhook}`);
      webhooks = webhooks.filter((i) => i.id !== deleteWebhook);
      state = "removed";
      setTimeout(() => (state = "ready"), 5000);
    } catch (error) {
      errorMessage = error.message;
      state = "ready";
    }
    deleteWebhook = null;
  };
</script>

<h1>Webhooks</h1>

<Modal
  bind:open={openDelete}
  danger
  modalHeading="Delete webhook"
  primaryButtonText="Delete"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (openDelete = false)}
  on:submit={() => remove()}>
  <p>
    Are you sure you want to delete this webhook? This action is not reversible,
    and your webhook will stop triggering instantly.
  </p>
</Modal>

{#if loading}
  <DataTableSkeleton showHeader={false} showToolbar={false} />
{:else if webhooks}
  <DataTable
    sortable
    headers={[{ key: 'event', value: 'Event' }, { key: 'url', value: 'URL' }, { key: 'createdAt', value: 'Created' }, { key: 'actions', value: '' }]}
    rows={webhooks}>
    <span slot="cell-header" let:header>
      {#if header.key === 'port'}
        {header.value}
        (network)
      {:else}{header.value}{/if}
    </span>
    <span slot="cell" let:row let:cell>
      {#if cell.key === 'createdAt'}
        {new Date(cell.value).toLocaleDateString()}
      {:else if cell.key === 'url'}
        <code>{cell.value.substr(0, 20)}</code>
        {#if row.isActive}
          <span class="middle-icon">
            <TooltipIcon tooltipText="Active">
              <Icon render={CheckmarkFilled20} />
            </TooltipIcon>
          </span>
        {:else}
          <span class="middle-icon">
            <TooltipIcon tooltipText="Inactive">
              <Icon render={Warning20} />
            </TooltipIcon>
          </span>
        {/if}
      {:else if cell.key === 'actions'}
        <div class="align-right">
          {#if can(`group-${id}:webhook-${row.id}-delete`)}
            <Button
              icon={Edit20}
              href="/groups/{id}/webhooks/{row.id}"
              hasIconOnly
              tooltipPosition="bottom"
              tooltipAlignment="center"
              iconDescription="Edit" />
          {/if}
          {#if can(`group-${id}:webhook-${row.id}-delete`)}
            <Button
              icon={SubtractAlt20}
              on:click={() => {
                openDelete = true;
                deleteWebhook = row.id;
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
  <h2>Create a webhook</h2>
  {#if errorMessage}
    <InlineNotification kind="error" title={errorMessage} />
  {/if}
  <Form on:submit={add}>
    <FormGroup>
      <TextInput type="url" labelText="URL" bind:value={newWebhook} required />
    </FormGroup>
    <Button type="submit">Create webhook</Button>
  </Form>
  {#if state === 'adding'}
    <InlineLoading status="active" description="Creating..." />
  {:else if state === 'added'}
    <InlineLoading status="finished" description="Created" />
  {/if}
{/if}
