<script lang="ts">
  import { stores } from "@sapper/app";
  import {
    Button,
    DataTable,
    DataTableSkeleton,
    InlineLoading,
    InlineNotification,
    Modal,
  } from "carbon-components-svelte";
  import SubtractAlt20 from "carbon-icons-svelte/lib/SubtractAlt20";
  import { onMount } from "svelte";
  import { api } from "../../../helpers/api";
  import { can } from "../../../helpers/auth-token";

  const { page } = stores();
  const { id } = $page.params;

  let sessions: any[] | null = null;
  let loading = true;
  let state = "ready";
  let errorMessage = "";
  let openDelete = false;
  let deleteSession: number | null = null;
  let currentSessionToken = null;
  onMount(async () => {
    sessions = await api("GET", `/users/${id}/sessions`);
    loading = false;
  });

  const remove = async () => {
    state = "removing";
    openDelete = false;
    try {
      await api("DELETE", `/users/${id}/sessions/${deleteSession}`);
      sessions = sessions.filter((i) => i.id !== deleteSession);
      state = "removed";
      setTimeout(() => (state = "ready"), 5000);
    } catch (error) {
      errorMessage = error.message;
      state = "ready";
    }
    deleteSession = null;
  };
</script>

<h1>Sessions</h1>

{#if errorMessage}
  <InlineNotification kind="error" title={errorMessage} />
{/if}

<Modal
  bind:open={openDelete}
  danger
  modalHeading="Log out of session"
  primaryButtonText="Log out"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (openDelete = false)}
  on:submit={() => remove()}>
  <p>Are you sure you want to log out of this session?</p>
</Modal>

{#if loading}
  <DataTableSkeleton showHeader={false} showToolbar={false} />
{:else if sessions}
  <DataTable
    sortable
    headers={[{ key: 'updatedAt', value: 'Last used' }, { key: 'browser', value: 'Browser' }, { key: 'operatingSystem', value: 'OS' }, { key: 'city', value: 'Location' }, { key: 'actions', value: '' }]}
    rows={sessions}>
    <span slot="cell-header" let:header>
      {#if header.key === 'port'}
        {header.value}
        (network)
      {:else}{header.value}{/if}
    </span>
    <span slot="cell" let:row let:cell>
      {#if cell.key === 'updatedAt'}
        {new Date(cell.value).toLocaleString()}
      {:else if cell.key === 'browser'}
        {#if cell.value}
          <img
            class="table-icon"
            alt=""
            src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/51.0.13/{cell.value
              .split(' ')[0]
              .toLowerCase()}/{cell.value
              .split(' ')[0]
              .toLowerCase()}_128x128.png" />
        {/if}
        <span>{cell.value}</span>
      {:else if cell.key === 'operatingSystem'}
        {#if cell.value}
          <img
            class="table-icon"
            alt=""
            src="https://unpkg.com/analytics-icons/icons/{cell.value
              .split(' ')[0]
              .toLowerCase()}.png" />
        {/if}
        <span>{cell.value}</span>
      {:else if cell.key === 'city'}
        {#if row.countryCode}
          <img
            class="table-icon"
            alt=""
            src="https://lipis.github.io/flag-icon-css/flags/1x1/{row.countryCode.toLowerCase()}.svg" />
        {/if}
        <span>{cell.value}</span>
      {:else if cell.key === 'actions'}
        <div class="align-right">
          {#if currentSessionToken !== row.token}
            {#if can(`user-${id}:sessions-${row.id}-delete`)}
              <Button
                icon={SubtractAlt20}
                on:click={() => {
                  openDelete = true;
                  deleteSession = row.id;
                }}
                hasIconOnly
                kind="danger"
                tooltipPosition="bottom"
                tooltipAlignment="center"
                iconDescription="Log out" />
            {/if}
          {/if}
        </div>
      {:else}{cell.value}{/if}
    </span>
  </DataTable>
  {#if state === 'removing'}
    <InlineLoading status="active" description="Logging out..." />
  {:else if state === 'removed'}
    <InlineLoading status="finished" description="Logged out" />
  {/if}
{/if}
