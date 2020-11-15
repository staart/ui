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
    <SideNavLink text="Link 1" />
    <SideNavLink text="Link 2" />
    <SideNavLink text="Link 3" />
    <SideNavMenu text="Menu">
      <SideNavMenuItem href="/" text="Link 1" />
      <SideNavMenuItem href="/" text="Link 2" />
      <SideNavMenuItem href="/" text="Link 3" />
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
