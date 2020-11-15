<script lang="ts">
  import { stores } from "@sapper/app";
  import {
    Button,
    Form,
    FormGroup,
    InlineLoading,
    Select,
    SelectItem,
    TextInput,
    Checkbox,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { api } from "../../../../helpers/api";

  const { page } = stores();
  const { id, webhookId } = $page.params;

  let webhook: any = null;
  let event: Record<string, string> = {};
  let loading = true;
  let state = "ready";
  onMount(async () => {
    event = await api("GET", `/groups/${id}/api-keys/scopes`);
    webhook = await api("GET", `/groups/${id}/webhooks/${webhookId}`);
    loading = false;
  });

  const save = async () => {
    state = "saving";
    webhook = await api("PATCH", `/groups/${id}/webhooks/${webhookId}`, {
      url: webhook.url,
      event: webhook.event,
      contentType: webhook.contentType,
      secret: webhook.secret,
      isActive: webhook.isActive,
    });
    state = "saved";
    setTimeout(() => (state = "ready"), 5000);
  };
</script>

<h1>Webhook</h1>

{#if loading}
  <InlineLoading description="Loading webhook..." />
{:else if webhook}
  <Form on:submit={save}>
    <FormGroup>
      <TextInput labelText="URL" bind:value={webhook.url} required />
    </FormGroup>
    <FormGroup>
      <Select bind:selected={webhook.event} labelText="Event">
        {#each Object.keys(event) as item}
          <SelectItem value={item} text={event[item]} />
        {/each}
      </Select>
    </FormGroup>
    <FormGroup>
      <Select bind:selected={webhook.contentType} labelText="Content type">
        <SelectItem text="application/json" />
        <SelectItem text="text/plain" />
      </Select>
    </FormGroup>
    <FormGroup>
      <FormGroup>
        <TextInput labelText="Secret" bind:value={webhook.secret} />
      </FormGroup>
      <Checkbox bind:checked={webhook.isActive} labelText="Active" />
    </FormGroup>
    <Button type="submit">Save webhook</Button>
  </Form>
  {#if state === 'saving'}
    <InlineLoading status="active" description="Saving..." />
  {:else if state === 'saved'}
    <InlineLoading status="finished" description="Saved" />
  {/if}
{/if}
