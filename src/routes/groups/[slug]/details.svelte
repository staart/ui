<script lang="ts">
  import { stores } from "@sapper/app";
  import { onMount } from "svelte";
  import { api } from "../../../api";
  import Error from "../../../components/Error.svelte";
  import Form from "../../../components/Form.svelte";
  import { activeNotification } from "../../../stores";

  const { page } = stores();
  const { slug } = $page.params;
  let state = "ready";
  let error = "";
  let data: any = {};

  onMount(() => {
    fetch();
  });

  const fetch = async () => {
    state = "fetching";
    try {
      data = await api<any>({
        method: "GET",
        url: `/groups/${slug}`,
        onCachedResponse: (result) => (data = result),
      });
      error = "";
    } catch (err) {
      error = err.message;
    }
    state = "ready";
  };

  const edit = async (body: { name: string }) => {
    data = await api<any>({
      method: "PATCH",
      url: `/groups/${slug}`,
      body,
    });
    error = "";
    activeNotification.set({
      text: "Group has been updated",
      type: "success",
    });
  };
</script>

<svelte:head>
  <title>Details</title>
</svelte:head>

<div class="p-7">
  <h1 class="text-2xl">Details</h1>
  {#if error}
    <Error {error} />
  {/if}
  {#if state === 'fetching'}
    <div class={`loading ${data ? 'loading-has' : 'h-52 bg-gray-50'}`} />
  {/if}
  <Form
    items={[{ name: 'name', label: 'Name', required: true }]}
    values={data}
    submitText="Save security settings"
    onSubmit={edit} />
</div>
