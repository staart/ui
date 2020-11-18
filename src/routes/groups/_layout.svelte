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

<Header company="Staart UI" platformName="Dashboard" bind:isSideNavOpen>
  <div slot="skip-to-content">
    <SkipToContent />
  </div>
  <Nav />
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
  <SideNavItems>
    <SideNavLink text="Settings" href="/groups/{id}" />
    <SideNavLink text="Team" href="/groups/{id}/team" />
    <SideNavMenu text="Billing">
      <SideNavMenuItem href="/groups/{id}/billing" text="Customer" />
      <SideNavMenuItem href="/groups/{id}/subscription" text="Subscription" />
      <SideNavMenuItem href="/groups/{id}/sources" text="Payment methods" />
      <SideNavMenuItem href="/groups/{id}/invoices" text="Invoices" />
      <SideNavMenuItem href="/groups/{id}/credits" text="Credits" />
    </SideNavMenu>
    <SideNavLink text="Domains" href="/groups/{id}/domains" />
    <SideNavMenu text="Security">
      <SideNavMenuItem href="/groups/{id}/audit-logs" text="Audit logs" />
      <SideNavMenuItem href="/groups/{id}/delete" text="Delete group" />
    </SideNavMenu>
    <SideNavMenu text="Developers">
      <SideNavMenuItem href="/groups/{id}/api-keys" text="API keys" />
      <SideNavMenuItem href="/groups/{id}/webhooks" text="Webhooks" />
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
