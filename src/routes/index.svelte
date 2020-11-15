<script lang="ts">
  import { goto } from "@sapper/app";
  import { onMount } from "svelte";
  import { getAuthenticatedState } from "../helpers/auth-token";

  onMount(() => {
    const authState = getAuthenticatedState();
    if (authState === "unauthenticated") goto("/auth/login");
  });
</script>
