<script lang="ts">
  import { stores } from "@sapper/app";
  import {
    Button,
    Checkbox,
    Form,
    FormGroup,
    TextArea,
    InlineLoading,
    TextInput,
    CodeSnippet,
    MultiSelect,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { api } from "../../../../helpers/api";

  const { page } = stores();
  const { id, apiKeyId } = $page.params;

  let apiKey: any = null;
  let scopes: Record<string, string> = {};
  let loading = true;
  let state = "ready";
  onMount(async () => {
    scopes = await api("GET", `/users/${id}/api-keys/scopes`);
    apiKey = await api("GET", `/users/${id}/api-keys/${apiKeyId}`);
    loading = false;
  });

  const save = async () => {
    state = "saving";
    apiKey = await api("PATCH", `/users/${id}/api-keys/${apiKeyId}`, {
      name: apiKey.name,
      description: apiKey.description,
      scopes: apiKey.scopes,
      ipRestrictions: apiKey.ipRestrictions,
      referrerRestrictions: apiKey.referrerRestrictions,
    });
    state = "saved";
    setTimeout(() => (state = "ready"), 5000);
  };
</script>

<h1>API key</h1>

{#if loading}
  <InlineLoading description="Loading API key..." />
{:else if apiKey}
  <CodeSnippet hideCopyButton={true}>{apiKey.apiKey}</CodeSnippet>
  <Form on:submit={save}>
    <FormGroup>
      <TextInput labelText="Name" bind:value={apiKey.name} required />
    </FormGroup>
    <FormGroup>
      <TextArea labelText="Description" bind:value={apiKey.description} />
    </FormGroup>
    <FormGroup>
      <MultiSelect
        filterable
        bind:selectedIds={apiKey.scopes}
        titleText="Scopes"
        items={Object.keys(scopes).map((id) => ({ id, text: scopes[id] }))} />
    </FormGroup>
    <FormGroup>
      <TextArea
        labelText="IP address restrictions"
        bind:value={apiKey.ipRestrictions} />
    </FormGroup>
    <FormGroup>
      <TextArea
        labelText="Referrer restrictions"
        bind:value={apiKey.referrerRestrictions} />
    </FormGroup>
    <Button type="submit">Save API key</Button>
  </Form>
  {#if state === 'saving'}
    <InlineLoading status="active" description="Saving..." />
  {:else if state === 'saved'}
    <InlineLoading status="finished" description="Saved" />
  {/if}
{/if}
