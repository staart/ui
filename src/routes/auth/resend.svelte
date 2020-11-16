<script lang="ts">
  import { goto } from "@sapper/app";
  import type {
    TokenResponse,
    TotpTokenResponse,
  } from "@staart/api/src/modules/auth/auth.interface";
  import {
    Button,
    Form,
    FormGroup,
    InlineLoading,
    InlineNotification,
    TextInput,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { api } from "../../helpers/api";
  import { getAuthenticatedState } from "../../helpers/auth-token";

  let email = "";
  let errorMessage = "";
  let state = "ready";

  onMount(async () => {
    const authState = getAuthenticatedState();
    if (authState === "authenticated") return goto("/");
  });

  const submit = async () => {
    state = "resending";
    try {
      const response = await api<TokenResponse | TotpTokenResponse | any>(
        "POST",
        "/auth/resend-email-verification",
        { email }
      );
      if ("multiFactorRequired" in response) {
        window.localStorage.setItem("mfa-token", response.totpToken);
        return goto(`/auth/mfa/${response.type.toLowerCase()}`);
      } else if ("accessToken" in response) {
        window.localStorage.setItem("auth", JSON.stringify(response));
        return goto("/");
      } else state = "success";
    } catch (err) {
      errorMessage = err.message;
      state = "ready";
    }
  };
</script>

{#if errorMessage}
  <InlineNotification kind="error" title={errorMessage} />
{/if}

<h1>Resend email verification</h1>

<Form on:submit={submit}>
  <FormGroup>
    <TextInput type="email" labelText="Email" bind:value={email} required />
  </FormGroup>
  <Button type="submit">Send email verification link</Button>
</Form>
{#if state === 'resending'}
  <InlineLoading status="active" description="Resetting..." />
{:else if state === 'success'}
  <InlineLoading status="finished" description="Email sent" />
{/if}

<h2>More actions</h2>

<Button kind="secondary" href="/auth/login">Login to your account</Button>
<Button kind="secondary" href="/auth/register">Create an account</Button>
