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
    RadioButton,
    RadioButtonGroup,
    TextInput,
  } from "carbon-components-svelte";
  import SubtractAlt20 from "carbon-icons-svelte/lib/SubtractAlt20";
  import { onMount } from "svelte";
  import { api } from "../../../helpers/api";
  import { can } from "../../../helpers/auth-token";

  const { page } = stores();
  const { id } = $page.params;

  let domains: any[] = [];
  let loading = true;
  let state = "ready";
  let newDomain = "";
  let errorMessage = "";
  let openDelete = false;
  let deleteDomain: number | null = null;
  let openVerify = false;
  let verifyDomain: any | null = null;
  let verificationMethod = "txt";
  onMount(async () => {
    domains = await api("GET", `/groups/${id}/domains`);
    loading = false;
  });

  const add = async () => {
    state = "adding";
    try {
      domains.push(
        await api("POST", `/groups/${id}/domains`, {
          domain: newDomain,
        })
      );
      newDomain = "";
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
      await api("DELETE", `/groups/${id}/domains/${deleteDomain}`);
      domains = domains.filter((i) => i.id !== deleteDomain);
      state = "removed";
      setTimeout(() => (state = "ready"), 5000);
    } catch (error) {
      errorMessage = error.message;
      state = "ready";
    }
    deleteDomain = null;
  };

  const verify = async () => {
    state = "verifying";
    openVerify = false;
    try {
      const result = await api(
        "POST",
        `/groups/${id}/domains/${verifyDomain.id}/verify/${verificationMethod}`
      );
      domains = domains.map((i) => {
        if (i.id === verifyDomain.id) return result;
        return i;
      });
      state = "verified";
      setTimeout(() => (state = "ready"), 5000);
    } catch (error) {
      errorMessage = error.message;
      state = "ready";
    }
    verifyDomain = null;
  };
</script>

<h1>Domains</h1>

<Modal
  bind:open={openDelete}
  danger
  modalHeading="Remove domain"
  primaryButtonText="Delete"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (openDelete = false)}
  on:submit={() => remove()}>
  <p>Are you sure you want to delete this domain from your group?</p>
</Modal>

<Modal
  bind:open={openVerify}
  modalHeading="Verify domain"
  primaryButtonText="Verify"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (openVerify = false)}
  on:submit={() => verify()}>
  {#if verifyDomain}
    <FormGroup legendText="Role">
      <RadioButtonGroup bind:selected={verificationMethod}>
        <RadioButton value="txt" labelText="TXT record" />
        <RadioButton value="html" labelText="File upload" />
      </RadioButtonGroup>
    </FormGroup>
    {#if verificationMethod === 'txt'}
      <p>
        To verify your domain, upload a
        <code>TXT</code>
        record with your DNS provider with the name
        <code>staart-verify</code>
        and value
        <code>{verifyDomain.verificationCode}</code>
      </p>
    {:else if verificationMethod === 'html'}
      <p>
        To verify your domain, create an HTML file on the path
        <code>http://{verifyDomain.domain}/.well-known/staart-verify.txt</code>
        with the value
        <code>{verifyDomain.verificationCode}</code>
      </p>
    {/if}
  {/if}
</Modal>

{#if errorMessage}
  <InlineNotification kind="error" title={errorMessage} />
{/if}

{#if loading}
  <DataTableSkeleton showHeader={false} showToolbar={false} />
{:else if domains}
  <DataTable
    sortable
    headers={[{ key: 'domain', value: 'Doman name' }, { key: 'createdAt', value: 'Created' }, { key: 'actions', value: '' }]}
    rows={domains}>
    <span slot="cell-header" let:header>
      {#if header.key === 'port'}
        {header.value}
        (network)
      {:else}{header.value}{/if}
    </span>
    <span slot="cell" let:row let:cell>
      {#if cell.key === 'createdAt'}
        {new Date(cell.value).toLocaleDateString()}
      {:else if cell.key === 'actions'}
        <div class="align-right">
          {#if !row.isVerified && can(`group-${id}:write-domainship-${row.id}`)}
            <Button
              on:click={() => {
                openVerify = true;
                verifyDomain = row;
              }}
              tooltipPosition="bottom"
              tooltipAlignment="center"
              iconDescription="Delete">
              Verify
            </Button>
          {/if}
          {#if can(`group-${id}:delete-domainship-${row.id}`)}
            <Button
              icon={SubtractAlt20}
              on:click={() => {
                openDelete = true;
                deleteDomain = row.id;
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
  {#if state === 'verifying'}
    <InlineLoading status="active" description="Verifying..." />
  {:else if state === 'verified'}
    <InlineLoading status="finished" description="Verified" />
  {/if}
  {#if can(`group-${id}:write-domain-*`)}
    <h2>Add a domain</h2>
    <Form on:submit={add}>
      <FormGroup>
        <TextInput labelText="Domain" bind:value={newDomain} />
      </FormGroup>
      <Button type="submit">Add domain</Button>
    </Form>
    {#if state === 'adding'}
      <InlineLoading status="active" description="Adding..." />
    {:else if state === 'added'}
      <InlineLoading status="finished" description="Added" />
    {/if}
  {/if}
  {#if state === 'removing'}
    <InlineLoading status="active" description="Deleting..." />
  {:else if state === 'removed'}
    <InlineLoading status="finished" description="Deleted" />
  {/if}
  {#if state === 'updating'}
    <InlineLoading status="active" description="Updating..." />
  {:else if state === 'updated'}
    <InlineLoading status="finished" description="Updated" />
  {/if}
{/if}
