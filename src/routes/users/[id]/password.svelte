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
  let newPassword = "";
  let currentPassword = "";
  let errorMessage = "";

  const save = async () => {
    state = "merging";
    try {
      await api("PATCH", `/users/${id}`, {
        currentPassword,
        newPassword,
      });
      state = "merged";
      setTimeout(() => (state = "ready"), 5000);
    } catch (error) {
      errorMessage = error.message;
      state = "ready";
    }
    currentPassword = "";
    newPassword = "";
  };
</script>

<h1>Change password</h1>

{#if errorMessage}
  <InlineNotification kind="error" title={errorMessage} />
{/if}

<Form on:submit={save}>
  <FormGroup>
    <TextInput
      labelText="Current password"
      type="password"
      bind:value={currentPassword} />
  </FormGroup>
  <FormGroup>
    <TextInput
      labelText="New password"
      type="password"
      bind:value={newPassword}
      required />
  </FormGroup>
  <Button type="submit">Change password</Button>
</Form>
{#if state === 'merging'}
  <InlineLoading status="active" description="Changing..." />
{:else if state === 'merged'}
  <InlineLoading status="finished" description="Changed" />
{/if}
