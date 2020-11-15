<script lang="ts">
  import { goto } from "@sapper/app";
  import { onMount } from "svelte";
  import { getAuthenticatedState } from "../helpers/auth-token";

  onMount(async () => {
    const authState = getAuthenticatedState();
    if (authState === "unauthenticated") return goto("/auth/login");
  });
</script>
