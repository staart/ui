<script lang="ts">
  import { stores } from "@sapper/app";
  import {
    Button,
    Form,
    FormGroup,
    InlineLoading,
    TextInput,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { api } from "../../../helpers/api";

  const { page } = stores();
  const { id } = $page.params;

  let group: any = null;
  let loading = true;
  let state = "ready";
  onMount(async () => {
    group = await api("GET", `/groups/${id}`);
    loading = false;
  });

  const save = async () => {
    state = "saving";
    group = await api("PATCH", `/groups/${id}`, {
      name: group.name,
    });
    state = "saved";
    setTimeout(() => (state = "ready"), 5000);
  };
</script>

<h1>Group</h1>

{#if loading}
  <InlineLoading description="Loading group..." />
{:else if group}
  <Form on:submit={save}>
    <FormGroup>
      <TextInput labelText="Name" bind:value={group.name} required />
    </FormGroup>
    <Button type="submit">Save group</Button>
  </Form>
  {#if state === 'saving'}
    <InlineLoading status="active" description="Saving..." />
  {:else if state === 'saved'}
    <InlineLoading status="finished" description="Success" />
  {/if}
{/if}
