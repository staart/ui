<script lang="ts">
  import { stores } from "@sapper/app";
  import {
    Button,
    Form,
    FormGroup,
    InlineLoading,
    InlineNotification,
    TextInput,
  } from "carbon-components-svelte";
  import { api } from "../../../helpers/api";

  const { page } = stores();
  const { id } = $page.params;

  let state = "ready";
  let newEmail = "";
  let errorMessage = "";

  const save = async () => {
    state = "merging";
    try {
      await api("POST", `/users/${id}/merge-request`, {
        email: newEmail,
      });
      state = "merged";
      setTimeout(() => (state = "ready"), 5000);
    } catch (error) {
      errorMessage = error.message;
      state = "ready";
    }
    newEmail = "";
  };
</script>

<h1>Merge</h1>

{#if errorMessage}
  <InlineNotification kind="error" title={errorMessage} />
{/if}

<Form on:submit={save}>
  <FormGroup>
    <TextInput labelText="Email" type="email" bind:value={newEmail} required />
  </FormGroup>
  <Button type="submit">Merge accounts</Button>
</Form>
{#if state === 'merging'}
  <InlineLoading status="active" description="Merging..." />
{:else if state === 'merged'}
  <InlineLoading status="finished" description="Sent a confirmation email" />
{/if}
