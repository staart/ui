<script>
  import { Column, Content, Grid, Row } from "carbon-components-svelte";
  import Nav from "../components/Nav.svelte";
</script>

<Nav />

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
