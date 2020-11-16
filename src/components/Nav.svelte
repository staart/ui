<script lang="ts">
  import {
    HeaderAction,
    HeaderActionSearch,
    HeaderGlobalAction,
    HeaderPanelDivider,
    HeaderPanelLink,
    HeaderPanelLinks,
    HeaderUtilities,
  } from "carbon-components-svelte";
  import Moon20 from "carbon-icons-svelte/lib/Moon20";
  import { onMount } from "svelte";
  import { api } from "../helpers/api";
  import { getUserId } from "../helpers/auth-token";

  let isOpen = false;
  let dark = undefined;
  let href = "";
  let userId: number | false = false;
  let memberships: any[] = [];
  let loadingLogout = false;

  $: {
    href = dark
      ? "https://unpkg.com/carbon-components-svelte@0.22.0/css/g100.css"
      : "https://unpkg.com/carbon-components-svelte@0.22.0/css/g10.css";
    userId = getUserId();
  }

  onMount(async () => {
    if (userId) memberships = await api("GET", `/users/${userId}/memberships`);
  });

  const logout = async () => {
    loadingLogout = true;
    try {
      await api("POST", "/auth/logout");
    } catch (error) {}
    loadingLogout = false;
    window.localStorage.removeItem("auth");
    window.location.href = "/";
  };
</script>

<style>
  :global(.OK .bx--toggle-input__label .bx--toggle__switch) {
    margin-top: 0;
  }
</style>

<svelte:head>
  <link rel="stylesheet" {href} />
</svelte:head>

<HeaderUtilities>
  <HeaderActionSearch />
  {#if userId}
    <HeaderGlobalAction
      aria-label="Toggle dark mode"
      icon={Moon20}
      on:click={() => (dark = !dark)} />
    <HeaderAction bind:isOpen>
      <HeaderPanelLinks>
        {#if memberships.length}
          <HeaderPanelDivider>Your groups</HeaderPanelDivider>
          {#each memberships as membership}
            <HeaderPanelLink href="/groups/{membership.group.id}">
              {membership.group.name}
            </HeaderPanelLink>
          {/each}
        {/if}
        <HeaderPanelDivider>Your account</HeaderPanelDivider>
        <HeaderPanelLink href="/users/{userId}">Settings</HeaderPanelLink>
        <HeaderPanelLink on:click={logout}>
          {#if loadingLogout}Logging out...{:else}Logout{/if}
        </HeaderPanelLink>
      </HeaderPanelLinks>
    </HeaderAction>
  {/if}
</HeaderUtilities>
