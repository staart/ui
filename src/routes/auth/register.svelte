<script lang="ts">
  import { goto } from "@sapper/app";
  import {
    Button,
    Form,
    FormGroup,
    InlineLoading,
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
  let countryCode: string | null = null;
  let timezone: string | null = null;
  let prefersColorScheme = "NO_PREFERENCE";
  let prefersReducedMotion = "NO_PREFERENCE";

  let state = "ready";
  let done = false;

  onMount(async () => {
    const authState = getAuthenticatedState();
    if (authState === "authenticated") return goto("/");
    try {
      const response = await fetch("https://ipinfo.io/json");
      const json = (await response.json()) as {
        timezone?: string;
        country?: string;
      };
      if (json.country) countryCode = json.country;
      if (json.timezone) countryCode = json.timezone;
    } catch (error) {}
    try {
      prefersColorScheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "DARK"
        : window.matchMedia("(prefers-color-scheme: light)").matches
        ? "LIGHT"
        : "NO_PREFERENCE";
      prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
        ? "REDUCE"
        : "NO_PREFERENCE";
    } catch (error) {}
  });

  const register = async () => {
    state = "creating";
    try {
      await api("POST", "/auth/register", {
        name,
        email,
        password,
        countryCode,
        timezone,
        prefersColorScheme,
        prefersReducedMotion,
      });
      done = true;
      state = "created";
      name = "";
      email = "";
      password = "";
      setTimeout(() => (state = "ready"), 5000);
    } catch (err) {
      errorMessage = err.message;
      password = "";
      state = "ready";
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
{#if state === 'creating'}
  <InlineLoading status="active" description="Registering..." />
{:else if state === 'created'}
  <InlineLoading status="finished" description="Registered" />
{/if}

<h2>More actions</h2>

<Button kind="secondary" href="/auth/login">Login to your account</Button>
<Button kind="secondary" href="/auth/resend">Resend email verification</Button>
