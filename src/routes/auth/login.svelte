<script lang="ts">
  import {
    Button,
    Form,
    FormGroup,
    TextInput,
    PasswordInput,
    InlineNotification,
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

  onMount(async () => {
    const authState = getAuthenticatedState();
    if (authState === "authenticated") return goto("/");
  });

  const login = async () => {
    try {
      const response = await api<TokenResponse | TotpTokenResponse>(
        "POST",
        "/auth/login",
        { email, password }
      );
      if ("multiFactorRequired" in response) {
        window.localStorage.setItem("mfa-token", response.totpToken);
        return goto(`/auth/mfa/${response.totpToken.toLowerCase()}`);
      } else {
        window.localStorage.setItem("auth", JSON.stringify(response));
        return goto("/");
      }
    } catch (err) {
      errorMessage = err.message;
      password = "";
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
