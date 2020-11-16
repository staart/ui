<script lang="ts">
  import {
    Button,
    Form,
    FormGroup,
    TextInput,
    PasswordInput,
    InlineNotification,
    InlineLoading,
  } from "carbon-components-svelte";
  import { goto } from "@sapper/app";
  import { api } from "../../helpers/api";
  import type {
    TokenResponse,
    TotpTokenResponse,
  } from "@staart/api/src/modules/auth/auth.interface";
  import { onMount } from "svelte";
  import { getAuthenticatedState } from "../../helpers/auth-token";

  let email = "";
  let password = "";
  let errorMessage = "";
  let state = "ready";

  onMount(async () => {
    const authState = getAuthenticatedState();
    if (authState === "authenticated") return goto("/");
  });

  const login = async () => {
    state = "loggingin";
    try {
      const response = await api<TokenResponse | TotpTokenResponse>(
        "POST",
        "/auth/login",
        { email, password }
      );
      if ("multiFactorRequired" in response) {
        window.localStorage.setItem("mfa-token", response.totpToken);
        return goto(`/auth/mfa/${response.type.toLowerCase()}`);
      } else {
        window.localStorage.setItem("auth", JSON.stringify(response));
        return goto("/");
      }
    } catch (err) {
      errorMessage = err.message;
      password = "";
      state = "ready";
    }
  };
</script>

{#if errorMessage}
  <InlineNotification kind="error" title={errorMessage} />
{/if}

<h1>Login</h1>

<Form on:submit={login}>
  <FormGroup>
    <TextInput type="email" labelText="Email" bind:value={email} required />
  </FormGroup>
  <FormGroup>
    <PasswordInput labelText="Password" bind:value={password} />
  </FormGroup>
  <Button type="submit">Login to your account</Button>
</Form>
{#if state === 'loggingin'}
  <InlineLoading status="active" description="Logging in..." />
{/if}

<h2>More actions</h2>

<Button kind="secondary" href="/auth/register">Create an account</Button>
<Button kind="secondary" href="/auth/forgot">Reset password</Button>
