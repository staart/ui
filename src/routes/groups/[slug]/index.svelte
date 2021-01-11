<script lang="ts">
  import { goto, stores } from "@sapper/app";
  import { onMount } from "svelte";

  const { page } = stores();
  const { slug } = $page.params;
  onMount(() => goto(`/groups/${slug}/details`));
</script>
