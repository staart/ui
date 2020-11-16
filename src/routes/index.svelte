<script lang="ts">
  import { goto } from "@sapper/app";
  import { onMount } from "svelte";
  import { api } from "../helpers/api";
  import { getAuthenticatedState, getUserId } from "../helpers/auth-token";

  let userId: number | false = false;
  let memberships: any[] = [];

  onMount(async () => {
    const authState = getAuthenticatedState();
    if (authState === "unauthenticated") return goto("/auth/login");
    userId = getUserId();
    if (userId) return goto(`/users/${userId}/groups`);
    else {
      window.localStorage.removeItem("auth");
      window.location.href = "/";
    }
    // if (userId) memberships = await api("GET", `/users/${userId}/memberships`);
    // if (!memberships.length) return goto(`/users/${userId}/groups`);
  });
</script>
