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

  const remove = async () => {
    state = "deleting";
    try {
      await api("DELETE", `/groups/${id}`);
      state = "deleted";
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
  modalHeading="Delete group"
  primaryButtonText="Delete"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (openDelete = false)}
  on:submit={() => remove()}>
  <p>Are you sure you want to delete your group?</p>
</Modal>

<h1>Delete</h1>

{#if errorMessage}
  <InlineNotification kind="error" title={errorMessage} />
{/if}

{#if can(`group-${id}:delete`)}
  <Form on:submit={() => (openDelete = true)}>
    <p>
      This action is not reversible and your group will be immediately deleted.
    </p>
    <Button kind="danger" type="submit">Delete group</Button>
  </Form>
{/if}
{#if state === 'deleting'}
  <InlineLoading status="active" description="Deleting..." />
{:else if state === 'deleted'}
  <InlineLoading status="finished" description="Deleted" />
{/if}
