<script lang="ts">
  import { stores } from "@sapper/app";
  import {
    Button,
    CodeSnippet,
    DataTable,
    DataTableSkeleton,
    InlineLoading,
    InlineNotification,
  } from "carbon-components-svelte";
  import Download20 from "carbon-icons-svelte/lib/Download20";
  import { onMount } from "svelte";
  import { PAGINATION_MAX } from "../../../constants";
  import { api } from "../../../helpers/api";
  import download from "downloadjs";

  const { page } = stores();
  const { id } = $page.params;

  let auditLogs: any[] = [];
  let loading = "initial";
  let errorMessage = "";
  let paginationComplete = false;
  onMount(async () => {
    auditLogs = await api(
      "GET",
      `/groups/${id}/audit-logs?take=${PAGINATION_MAX}&orderBy=id:desc`
    );
    loading = "none";
  });

  const loadMore = async () => {
    loading = "more";
    const result = await api<any[]>(
      "GET",
      `/groups/${id}/audit-logs?take=${PAGINATION_MAX}&orderBy=id:desc&cursor=${
        auditLogs[auditLogs.length - 1].id
      }&skip=1`
    );
    if (result.length === 0) paginationComplete = true;
    auditLogs = auditLogs.concat(...result);
    loading = "none";
  };
</script>

<h1>Audit logs</h1>

{#if errorMessage}
  <InlineNotification kind="error" title={errorMessage} />
{/if}

{#if loading === 'initial'}
  <DataTableSkeleton showHeader={false} showToolbar={false} />
{:else if auditLogs}
  <DataTable
    sortable
    expandable
    headers={[{ key: 'createdAt', value: 'Created' }, { key: 'event', value: 'Event' }, { key: 'browser', value: 'Browser' }, { key: 'operatingSystem', value: 'OS' }, { key: 'city', value: 'Location' }, { key: 'actions', value: '' }]}
    rows={auditLogs}>
    <div slot="expanded-row" let:row>
      <CodeSnippet
        type="multi"
        code={JSON.stringify(row, null, 2)}
        hideCopyButton />
    </div>
    <span slot="cell-header" let:header>
      {#if header.key === 'port'}
        {header.value}
        (network)
      {:else}{header.value}{/if}
    </span>
    <span slot="cell" let:row let:cell>
      {#if cell.key === 'createdAt'}
        {new Date(cell.value).toLocaleString()}
      {:else if cell.key === 'event'}
        <code>{cell.value}</code>
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
          <Button
            icon={Download20}
            on:click={() => download(JSON.stringify(row, null, 2), `${row.createdAt}-audit-log-${row.id}.json`)}
            hasIconOnly
            tooltipPosition="bottom"
            tooltipAlignment="center"
            iconDescription="Download log" />
        </div>
      {:else}{cell.value}{/if}
    </span>
  </DataTable>
  {#if loading === 'none' && !paginationComplete && auditLogs.length % PAGINATION_MAX === 0}
    <Button on:click={loadMore} kind="secondary">Load more audit logs</Button>
  {:else if loading === 'more'}
    <InlineLoading status="active" description="Loading..." />
  {/if}
{/if}
