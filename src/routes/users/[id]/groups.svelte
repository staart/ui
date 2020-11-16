<script lang="ts">
  import { stores } from "@sapper/app";
  import {
    Button,
    DataTable,
    DataTableSkeleton,
    Form,
    FormGroup,
    InlineLoading,
    InlineNotification,
    Modal,
    TextInput,
  } from "carbon-components-svelte";
  import SubtractAlt20 from "carbon-icons-svelte/lib/SubtractAlt20";
  import Home20 from "carbon-icons-svelte/lib/Home20";
  import { onMount } from "svelte";
  import { api, refresh } from "../../../helpers/api";
  import { can } from "../../../helpers/auth-token";

  const { page } = stores();
  const { id } = $page.params;

  let memberships: any[] = [];
  let loading = true;
  let state = "ready";
  let newGroup = "";
  let errorMessage = "";
  let openDelete = false;
  let deleteGroup: number | null = null;
  onMount(async () => {
    memberships = await api("GET", `/users/${id}/memberships`);
    loading = false;
  });

  const add = async () => {
    state = "adding";
    try {
      await api("POST", `/users/${id}/memberships`, {
        name: newGroup,
      });
      newGroup = "";
      memberships = await api("GET", `/users/${id}/memberships`);
      await refresh();
      state = "added";
      setTimeout(() => (state = "ready"), 5000);
    } catch (error) {
      errorMessage = error.message;
      state = "ready";
    }
  };

  const remove = async () => {
    state = "removing";
    openDelete = false;
    try {
      await api("DELETE", `/users/${id}/memberships/${deleteGroup}`);
      memberships = memberships.filter((i) => i.id !== deleteGroup);
      await refresh();
      state = "removed";
      setTimeout(() => (state = "ready"), 5000);
    } catch (error) {
      errorMessage = error.message;
      state = "ready";
    }
    deleteGroup = null;
  };
</script>

<h1>Groups</h1>

<Modal
  bind:open={openDelete}
  danger
  modalHeading="Leave group"
  primaryButtonText="Leave"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (openDelete = false)}
  on:submit={() => remove()}>
  <p>Are you sure you want to leave this group?</p>
</Modal>

{#if loading}
  <DataTableSkeleton showHeader={false} showToolbar={false} />
{:else if memberships}
  <DataTable
    sortable
    headers={[{ key: 'groupId', value: 'Name' }, { key: 'role', value: 'Role' }, { key: 'createdAt', value: 'Joined' }, { key: 'actions', value: '' }]}
    rows={memberships}>
    <span slot="cell-header" let:header>
      {#if header.key === 'port'}
        {header.value}
        (network)
      {:else}{header.value}{/if}
    </span>
    <span slot="cell" let:row let:cell>
      {#if cell.key === 'groupId'}
        {row.group.name}
      {:else if cell.key === 'createdAt'}
        {new Date(cell.value).toLocaleDateString()}
      {:else if cell.key === 'actions'}
        <div class="align-right">
          <Button
            icon={Home20}
            href="/groups/{row.group.id}"
            hasIconOnly
            tooltipPosition="bottom"
            tooltipAlignment="center"
            iconDescription="Visit group" />
          {#if can(`user-${id}:membership-${row.id}-delete`)}
            <Button
              icon={SubtractAlt20}
              on:click={() => {
                openDelete = true;
                deleteGroup = row.id;
              }}
              hasIconOnly
              kind="danger"
              tooltipPosition="bottom"
              tooltipAlignment="center"
              iconDescription="Leave" />
          {/if}
        </div>
      {:else}{cell.value}{/if}
    </span>
  </DataTable>
  {#if state === 'removing'}
    <InlineLoading status="active" description="Leaving..." />
  {:else if state === 'removed'}
    <InlineLoading status="finished" description="Left" />
  {/if}
  <h2>Create a group</h2>
  {#if errorMessage}
    <InlineNotification kind="error" title={errorMessage} />
  {/if}
  <Form on:submit={add}>
    <FormGroup>
      <TextInput
        type="membership"
        labelText="Name"
        bind:value={newGroup}
        required />
    </FormGroup>
    <Button type="submit">Create group</Button>
  </Form>
  {#if state === 'adding'}
    <InlineLoading status="active" description="Creating..." />
  {:else if state === 'added'}
    <InlineLoading status="finished" description="Created" />
  {/if}
{/if}
