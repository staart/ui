<script lang="ts">
  import { stores } from "@sapper/app";
  import {
    Button,
    Form,
    InlineLoading,
    InlineNotification,
    Modal,
  } from "carbon-components-svelte";
  import { api } from "../../../helpers/api";
  import { can } from "../../../helpers/auth-token";

  const { page } = stores();
  const { id } = $page.params;

  let state = "ready";
  let errorMessage = "";
  let openDelete = false;

  const deactivate = async () => {
    state = "deactivating";
    try {
      await api("DELETE", `/users/${id}`);
      state = "deactivated";
      setTimeout(() => (state = "ready"), 5000);
      window.localStorage.removeItem("auth");
      window.location.href = "/";
    } catch (error) {
      errorMessage = error.message;
      state = "ready";
    }
  };
</script>

<Modal
  bind:open={openDelete}
  danger
  modalHeading="Deactivate account"
  primaryButtonText="Deactivate"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (openDelete = false)}
  on:submit={() => deactivate()}>
  <p>Are you sure you want to deactivate your account?</p>
</Modal>

<h1>Deactivate</h1>

{#if errorMessage}
  <InlineNotification kind="error" title={errorMessage} />
{/if}

{#if can(`user-${id}:delete`)}
  <Form on:submit={() => (openDelete = true)}>
    <p>
      Your account will be automatically deleted if you do not log in for 30
      days.
    </p>
    <Button kind="danger" type="submit">Deactivate account</Button>
  </Form>
{/if}
{#if state === 'deactivating'}
  <InlineLoading status="active" description="Deactivating..." />
{:else if state === 'deactivated'}
  <InlineLoading status="finished" description="Deactivated" />
{/if}
