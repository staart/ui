<script lang="ts">
  import { stores } from "@sapper/app";
  import {
    DataTableSkeleton,
    InlineNotification,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { api } from "../../../../helpers/api";

  const { page } = stores();
  const { id } = $page.params;
  let loading = true;
  let errorMessage = "";

  onMount(async () => {
    const result: any = await api("GET", `/groups/${id}/billing/link`);
    if (result.url) return (window.location.href = result.url);
    else errorMessage = "We got an error in accessing this page";
    loading = false;
  });
</script>

{#if loading}
  <DataTableSkeleton showHeader={false} showToolbar={false} />
{/if}
{#if errorMessage}
  <InlineNotification kind="error" title={errorMessage} />
{/if}
