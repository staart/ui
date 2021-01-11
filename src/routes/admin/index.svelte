<script lang="ts">
  import { goto } from "@sapper/app";
  import { onMount } from "svelte";
  import { can } from "../../api";
  import type { User } from "../../stores";
  import { activeUserIndex, users } from "../../stores";

  let usersVal: User[] = [];
  users.subscribe((val) => (usersVal = val));
  let activeUserIndexVal: number = 0;
  activeUserIndex.subscribe((val) => (activeUserIndexVal = val));

  const links = [
    { title: "Groups", slug: "groups", show: can("group-*:read-info") },
    { title: "Users", slug: "users", show: can("user-*:read-info") },
  ];

  onMount(() => {
    let done = false;
    links.forEach((link) => {
      if (link.show && !done) {
        done = true;
        return goto(`/admin/${link.slug}`);
      }
    });
    if (!done) return goto(`/users/${usersVal[activeUserIndexVal].details.id}/profile`);
  });
</script>
