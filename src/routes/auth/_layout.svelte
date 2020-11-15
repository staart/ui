<script>
  import {
    Column,
    Content,
    Grid,
    Header,
    Row,
    SkipToContent,
  } from "carbon-components-svelte";
  import Nav from "../../components/Nav.svelte";
</script>

<style lang="scss">
  main {
    max-width: 500px;
    margin: 0 auto;
  }
</style>

<Header company="Staart UI" platformName="">
  <div slot="skip-to-content">
    <SkipToContent />
  </div>
  <Nav />
</Header>

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
