<script lang="ts">
  import { goto } from "@sapper/app";
  import {
    Button,
    Form,
    FormGroup,
    InlineNotification,
    PasswordInput,
    TextInput,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { api } from "../../helpers/api";
  import { getAuthenticatedState } from "../../helpers/auth-token";

  let name = "";
  let email = "";
  let password = "";
  let errorMessage = "";
  let done = false;

  onMount(async () => {
    const authState = getAuthenticatedState();
    if (authState === "authenticated") return goto("/");
  });

  const register = async () => {
    try {
      await api("POST", "/auth/register", { name, email, password });
      done = true;
    } catch (err) {
      errorMessage = err.message;
      password = "";
    }
  };
</script>

{#if done}
  <InlineNotification
    kind="success"
    title="We've sent you an email verification" />
{/if}

{#if errorMessage}
  <InlineNotification kind="error" title={errorMessage} />
{/if}

<h1>Register</h1>

<Form on:submit={register}>
  <FormGroup>
    <TextInput labelText="Name" bind:value={name} required />
  </FormGroup>
  <FormGroup>
    <TextInput type="email" labelText="Email" bind:value={email} required />
  </FormGroup>
  <FormGroup>
    <PasswordInput labelText="Password" bind:value={password} />
  </FormGroup>
  <Button type="submit">Create an account</Button>
</Form>
