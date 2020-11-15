<script>
  import {
    Column,
    Content,
    Grid,
    Header,
    Row,
    SideNav,
    SideNavItems,
    SideNavLink,
    SideNavMenu,
    SideNavMenuItem,
    SkipToContent,
  } from "carbon-components-svelte";
  import Nav from "../../components/Nav.svelte";
  import { stores } from "@sapper/app";
  const { page } = stores();
  const { id } = $page.params;

  let isSideNavOpen = false;
</script>

<Header company="Staart UI" platformName="Your account" bind:isSideNavOpen>
  <div slot="skip-to-content">
    <SkipToContent />
  </div>
  <Nav />
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
  <SideNavItems>
    <SideNavLink text="Profile" href="/users/{id}" />
    <SideNavLink text="Emails" href="/users/{id}/emails" />
    <SideNavLink text="Groups" href="/users/{id}/groups" />
    <SideNavMenu text="Security">
      <SideNavMenuItem href="/users/{id}/password" text="Password" />
      <SideNavMenuItem href="/users/{id}/sessions" text="Sessions" />
      <SideNavMenuItem
        href="/users/{id}/mfa"
        text="Multi-factor authentication" />
    </SideNavMenu>
    <SideNavMenu text="Developers">
      <SideNavMenuItem href="/users/{id}/api-keys" text="API keys" />
    </SideNavMenu>
    <SideNavMenu text="Advanced">
      <SideNavMenuItem href="/users/{id}/merge" text="Merge account" />
      <SideNavMenuItem href="/users/{id}/deactivate" text="Delete account" />
    </SideNavMenu>
  </SideNavItems>
</SideNav>

<Content>
  <Grid>
    <Row>
      <Column>
        <main>
          <slot />
        </main>
      </Column>
    </Row>
  </Grid>
</Content>
