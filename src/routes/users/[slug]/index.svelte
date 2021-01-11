<script lang="ts">
  import { goto, stores } from "@sapper/app";
  import { onMount } from "svelte";

  const { page } = stores();
  const { slug } = $page.params;
  onMount(() => goto(`/users/${slug}/profile`));
</script>
