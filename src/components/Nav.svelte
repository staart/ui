<script>
  import {
    Header,
    HeaderAction,
    HeaderActionSearch,
    HeaderGlobalAction,
    HeaderPanelDivider,
    HeaderPanelLink,
    HeaderPanelLinks,
    HeaderUtilities,
    SkipToContent,
  } from "carbon-components-svelte";
  import Moon20 from "carbon-icons-svelte/lib/Moon20";

  let isSideNavOpen = false;
  let isOpen = false;
  let dark = undefined;
  let href = "";

  $: {
    href = dark
      ? "https://unpkg.com/carbon-components-svelte@0.22.0/css/g100.css"
      : "https://unpkg.com/carbon-components-svelte@0.22.0/css/g10.css";
  }
</script>

<style>
  :global(.OK .bx--toggle-input__label .bx--toggle__switch) {
    margin-top: 0;
  }
</style>

<svelte:head>
  <link rel="stylesheet" {href} />
</svelte:head>
<Header company="Staart" platformName="UI" bind:isSideNavOpen>
  <div slot="skip-to-content">
    <SkipToContent />
  </div>
  <HeaderUtilities>
    <HeaderActionSearch />
    <HeaderGlobalAction
      aria-label="Toggle dark mode"
      icon={Moon20}
      on:click={() => (dark = !dark)} />
    <HeaderAction bind:isOpen>
      <HeaderPanelLinks>
        <HeaderPanelDivider>Admin</HeaderPanelDivider>
        <HeaderPanelLink>Change password</HeaderPanelLink>
        <HeaderPanelLink>Logout</HeaderPanelLink>
      </HeaderPanelLinks>
    </HeaderAction>
  </HeaderUtilities>
</Header>
