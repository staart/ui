<script lang="ts">
  import { goto, stores } from "@sapper/app";
  import type {
    TokenResponse,
    TotpTokenResponse,
  } from "@staart/api/src/modules/auth/auth.interface";
  import {
    Button,
    InlineNotification,
    Loading,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { api } from "../../../helpers/api";
  const { page } = stores();
  const { category } = $page.params;
  const { token } = $page.query;

  let errorMessage = "";
  let state = "ready";

  onMount(async () => {
    if (!token) return (errorMessage = "No token found");
    try {
      const response = await api<TokenResponse | TotpTokenResponse | any>(
        "POST",
        `/auth/${category}`,
        { token }
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
  });
</script>

{#if errorMessage}
  <InlineNotification kind="error" title={errorMessage} />
  <h2>More actions</h2>
  <Button href="/">Go to the homepage</Button>
{:else if state === 'success'}
  <InlineNotification kind="success" title="All done!" />
  <h2>More actions</h2>
  <Button href="/">Go to the homepage</Button>
{:else}
  <div class="align-center">
    <Loading withOverlay={false} />
  </div>
{/if}
