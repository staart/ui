<script lang="ts">
  import { stores } from "@sapper/app";
  import {
    Button,
    DataTable,
    DataTableSkeleton,
    Form,
    FormGroup,
    Icon,
    InlineLoading,
    InlineNotification,
    RadioButton,
    RadioButtonGroup,
    Select,
    SelectItem,
    TextInput,
    TooltipIcon,
    Modal,
  } from "carbon-components-svelte";
  import CheckmarkFilled20 from "carbon-icons-svelte/lib/CheckmarkFilled20";
  import WarningAltFilled20 from "carbon-icons-svelte/lib/WarningAltFilled20";
  import SubtractAlt20 from "carbon-icons-svelte/lib/SubtractAlt20";
  import { onMount } from "svelte";
  import { api } from "../../../helpers/api";
  import { can } from "../../../helpers/auth-token";

  const { page } = stores();
  const { id } = $page.params;

  let profile: any = null;
  let emails: any[] | null = null;
  let loading = true;
  let state = "ready";
  let newEmail = "";
  let errorMessage = "";
  let openDelete = false;
  let deleteEmail: number | null = null;
  onMount(async () => {
    profile = await api("GET", `/users/${id}`);
    emails = await api("GET", `/users/${id}/emails`);
    loading = false;
  });

  const save = async () => {
    state = "saving";
    profile = await api("PATCH", `/users/${id}`, {
      prefersEmailId: profile.prefersEmailId,
      notificationEmails: profile.notificationEmails,
    });
    state = "saved";
    setTimeout(() => (state = "ready"), 5000);
  };

  const add = async () => {
    state = "adding";
    try {
      emails.push(
        await api("POST", `/users/${id}/emails`, {
          email: newEmail,
        })
      );
      newEmail = "";
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
      await api("DELETE", `/users/${id}/emails/${deleteEmail}`);
      emails = emails.filter((i) => i.id !== deleteEmail);
      if (profile.prefersEmailId === deleteEmail)
        profile = await api("GET", `/users/${id}`);
      state = "removed";
      setTimeout(() => (state = "ready"), 5000);
    } catch (error) {
      errorMessage = error.message;
      state = "ready";
    }
    deleteEmail = null;
  };
</script>

<h1>Emails</h1>

<Modal
  bind:open={openDelete}
  danger
  modalHeading="Delete email"
  primaryButtonText="Delete"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (openDelete = false)}
  on:submit={() => remove()}>
  <p>Are you sure you want to delete this email?</p>
</Modal>

{#if errorMessage}
  <InlineNotification kind="error" title={errorMessage} />
{/if}

{#if loading}
  <DataTableSkeleton showHeader={false} showToolbar={false} />
{:else if emails && profile}
  <DataTable
    sortable
    headers={[{ key: 'email', value: 'Email address' }, { key: 'createdAt', value: 'Added' }, { key: 'actions', value: '' }]}
    rows={emails}>
    <span slot="cell-header" let:header>
      {#if header.key === 'port'}
        {header.value}
        (network)
      {:else}{header.value}{/if}
    </span>
    <span slot="cell" let:row let:cell>
      {#if cell.key === 'email'}
        {row.email}
        {#if row.isVerified}
          <span class="middle-icon">
            <TooltipIcon tooltipText="Verified">
              <Icon render={CheckmarkFilled20} />
            </TooltipIcon>
          </span>
        {:else}
          <span class="middle-icon">
            <TooltipIcon tooltipText="Not verified">
              <Icon render={WarningAltFilled20} />
            </TooltipIcon>
          </span>
        {/if}
      {:else if cell.key === 'createdAt'}
        {new Date(cell.value).toLocaleDateString()}
      {:else if cell.key === 'actions'}
        <div class="align-right">
          {#if can(`user-${id}:email-${row.id}-delete`)}
            <Button
              icon={SubtractAlt20}
              on:click={() => {
                openDelete = true;
                deleteEmail = row.id;
              }}
              hasIconOnly
              kind="danger"
              tooltipPosition="bottom"
              tooltipAlignment="center"
              iconDescription="Delete" />
          {/if}
        </div>
      {:else}{cell.value}{/if}
    </span>
  </DataTable>
  {#if state === 'removing'}
    <InlineLoading status="active" description="Deleting..." />
  {:else if state === 'removed'}
    <InlineLoading status="finished" description="Deleted" />
  {/if}
  <h2>Add email</h2>
  <Form on:submit={add}>
    <FormGroup>
      <TextInput
        type="email"
        labelText="Email address"
        bind:value={newEmail}
        required />
    </FormGroup>
    <Button type="submit">Add email</Button>
  </Form>
  {#if state === 'adding'}
    <InlineLoading status="active" description="Adding..." />
  {:else if state === 'added'}
    <InlineLoading status="finished" description="Added" />
  {/if}
  <h2>Settings</h2>
  <Form on:submit={save}>
    <FormGroup>
      <Select labelText="Primary email" bind:selected={profile.prefersEmailId}>
        {#each emails as email}
          <SelectItem value={String(email.id)} text={email.email} />
        {/each}
      </Select>
    </FormGroup>
    <FormGroup legendText="Email notifications">
      <RadioButtonGroup bind:selected={profile.notificationEmails}>
        <RadioButton value="ACCOUNT" labelText="Account-related emails" />
        <RadioButton value="PROMOTIONS" labelText="Promotions" />
      </RadioButtonGroup>
    </FormGroup>
    <Button type="submit">Update email settings</Button>
  </Form>
  {#if state === 'saving'}
    <InlineLoading status="active" description="Saving..." />
  {:else if state === 'saved'}
    <InlineLoading status="finished" description="Success" />
  {/if}
{/if}
