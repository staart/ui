<script lang="ts">
  import { goto } from "@sapper/app";
  import { onMount } from "svelte";
  import type { User } from "../stores";
  import { users } from "../stores";

  let navUsers: User[] = [];
  users.subscribe((val) => (navUsers = val));

  onMount(() => {
    if (navUsers.length) return goto("/admin/");
    goto("/auth/login");
  });
</script>
