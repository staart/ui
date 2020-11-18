<script lang="ts">
  import { stores } from "@sapper/app";
  import {
    Button,
    Form,
    FormGroup,
    InlineLoading,
    TextInput,
    Grid,
    Row,
    Column,
    InlineNotification,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { api } from "../../../../helpers/api";

  const { page } = stores();
  const { id } = $page.params;

  let group: any = {
    email: "",
    name: "",
    phone: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    },
  };
  let loading = true;
  let state = "ready";
  let customerNotFound = false;
  let errorMessage = "";
  onMount(async () => {
    try {
      group = await api("GET", `/groups/${id}/billing`);
    } catch (error) {
      if (error.message.includes("404010")) customerNotFound = true;
    }
    loading = false;
  });

  const save = async () => {
    state = "saving";
    try {
      group = await api(
        customerNotFound ? "POST" : "PATCH",
        `/groups/${id}/billing`,
        {
          email: group.email,
          name: group.name,
          phone: group.phone,
          address: group.address,
        }
      );
      state = "saved";
      customerNotFound = false;
      setTimeout(() => (state = "ready"), 5000);
    } catch (err) {
      errorMessage = err.message;
      state = "ready";
    }
  };
</script>

<h1>Billing</h1>

{#if errorMessage}
  <InlineNotification kind="error" title={errorMessage} />
{/if}

{#if loading}
  <InlineLoading description="Loading group..." />
{:else}
  {#if customerNotFound}
    <InlineLoading
      status="error"
      description="Your account is not activated for billing yet. Fill the form below to setup a billing account." />
  {/if}
  <Form on:submit={save}>
    <FormGroup>
      <TextInput labelText="Name" bind:value={group.name} required />
    </FormGroup>
    <FormGroup>
      <TextInput labelText="Billing email" bind:value={group.email} required />
    </FormGroup>
    <FormGroup>
      <TextInput type="tel" labelText="Phone" bind:value={group.phone} />
    </FormGroup>
    <FormGroup legendText="Address">
      <Row>
        <Column>
          <TextInput
            labelText="Street address"
            bind:value={group.address.line1} />
        </Column>
        <Column>
          <TextInput
            labelText="Apartment, suite, etc."
            bind:value={group.address.line2} />
        </Column>
      </Row>
      <Row>
        <Column>
          <TextInput labelText="City" bind:value={group.address.city} />
        </Column>
        <Column>
          <TextInput labelText="State" bind:value={group.address.state} />
        </Column>
      </Row>
      <Row>
        <Column>
          <TextInput
            labelText="Postal code"
            bind:value={group.address.postal_code} />
        </Column>
        <Column>
          <TextInput labelText="Country" bind:value={group.address.country} />
        </Column>
      </Row>
    </FormGroup>
    <Button type="submit">
      {#if customerNotFound}
        Setup billing account
      {:else}Save billing account{/if}
    </Button>
  </Form>
  {#if state === 'saving'}
    <InlineLoading status="active" description="Saving..." />
  {:else if state === 'saved'}
    <InlineLoading status="finished" description="Success" />
  {/if}
{/if}
