<script lang="ts">
  import { stores } from "@sapper/app";
  import {
    Button,
    Checkbox,
    DataTable,
    DataTableSkeleton,
    Form,
    FormGroup,
    InlineLoading,
    InlineNotification,
    Modal,
    TextArea,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { api } from "../../../helpers/api";
  import SubtractAlt20 from "carbon-icons-svelte/lib/SubtractAlt20";
  import Edit20 from "carbon-icons-svelte/lib/Edit20";

  const { page } = stores();
  const { id } = $page.params;

  let group: any = null;
  let members: any[] = [];
  let loading = true;
  let state = "ready";
  let newMemberEmail = "";
  let newMemberName = "";
  let errorMessage = "";
  let openDelete = false;
  let deleteMembership: number | null = null;
  onMount(async () => {
    group = await api("GET", `/groups/${id}`);
    members = await api("GET", `/groups/${id}/memberships`);
    loading = false;
  });

  const add = async () => {
    state = "adding";
    try {
      members.push(
        await api("POST", `/groups/${id}/memberships`, {
          name: newMemberName,
          email: newMemberEmail,
        })
      );
      newMemberEmail = "";
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
      await api("DELETE", `/groups/${id}/memberships/${deleteMembership}`);
      members = members.filter((i) => i.id !== deleteMembership);
      state = "removed";
      setTimeout(() => (state = "ready"), 5000);
    } catch (error) {
      errorMessage = error.message;
      state = "ready";
    }
    deleteMembership = null;
  };

  const save = async () => {
    state = "saving";
    group = await api("PATCH", `/groups/${id}`, {
      name: group.name,
    });
    state = "saved";
    setTimeout(() => (state = "ready"), 5000);
  };
</script>

<h1>Team</h1>

<Modal
  bind:open={openDelete}
  danger
  modalHeading="Remove member"
  primaryButtonText="Delete"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (openDelete = false)}
  on:submit={() => remove()}>
  <p>Are you sure you want to delete this member from your group?</p>
</Modal>

{#if errorMessage}
  <InlineNotification kind="error" title={errorMessage} />
{/if}

{#if loading}
  <DataTableSkeleton showHeader={false} showToolbar={false} />
{:else if group}
  <DataTable
    sortable
    headers={[{ key: 'name', value: 'Name' }, { key: 'role', value: 'Role' }, { key: 'createdAt', value: 'Created' }, { key: 'actions', value: '' }]}
    rows={members}>
    <span slot="cell-header" let:header>
      {#if header.key === 'port'}
        {header.value}
        (network)
      {:else}{header.value}{/if}
    </span>
    <span slot="cell" let:row let:cell>
      {#if cell.key === 'name'}
        {row.user.name}
      {:else if cell.key === 'createdAt'}
        {new Date(cell.value).toLocaleDateString()}
      {:else if cell.key === 'actions'}
        <div class="align-right">
          <Button
            icon={Edit20}
            href="/groups/{id}/memberships/{row.id}"
            hasIconOnly
            tooltipPosition="bottom"
            tooltipAlignment="center"
            iconDescription="Edit" />
          <Button
            icon={SubtractAlt20}
            on:click={() => {
              openDelete = true;
              deleteMembership = row.id;
            }}
            hasIconOnly
            kind="danger"
            tooltipPosition="bottom"
            tooltipAlignment="center"
            iconDescription="Delete" />
        </div>
      {:else}{cell.value}{/if}
    </span>
  </DataTable>
  {#if state === 'removing'}
    <InlineLoading status="active" description="Deleting..." />
  {:else if state === 'removed'}
    <InlineLoading status="finished" description="Deleted" />
  {/if}
  <h2>Settings</h2>
  <Form on:submit={save}>
    <FormGroup legendText="Multi-factor authentication">
      <Checkbox
        bind:checked={group.forceTwoFactor}
        labelText="Force members to enable multi-factor authentication" />
    </FormGroup>
    <FormGroup>
      <TextArea
        labelText="IP address restrictions"
        bind:value={group.ipRestrictions} />
    </FormGroup>
    <FormGroup legendText="Inviting members">
      <Checkbox
        bind:checked={group.onlyAllowDomain}
        labelText="Users can only join this team if they have a verified email on an approved domain" />
      <Checkbox
        bind:checked={group.autoJoinDomain}
        labelText="Users can automatically join this team if they have a verified email on an approved domain" />
    </FormGroup>
    <Button type="submit">Save team settings</Button>
  </Form>
  {#if state === 'saving'}
    <InlineLoading status="active" description="Saving..." />
  {:else if state === 'saved'}
    <InlineLoading status="finished" description="Success" />
  {/if}
{/if}
