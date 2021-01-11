<script lang="ts">
  import TimeAgo from "../TimeAgo.svelte";

  export let item: any;
  export let iconOnly = false;
  export let itemType: "membership" | "user" = "user";
  export let data: any = {};
  $: data = itemType === "membership" ? item.user : item;
</script>

<a
  href={`/users/${data.id}/profile`}
  aria-label={iconOnly ? data.name : undefined}
  data-balloon-pos={iconOnly ? 'up' : undefined}
  class="inline-flex items-center transition motion-reduce:transition-none text-gray-900 hover:text-gray-500">
  <div class="flex-shrink-0 h-10 w-10">
    <img
      class="h-10 w-10 rounded-full"
      src={`https://images.weserv.nl/?url=${encodeURIComponent(data.profilePictureUrl)}&w=128&h=128&fit=contain`}
      alt="" />
  </div>
  {#if !iconOnly}
    <div class="ml-5">
      <div class="text-sm font-medium">{data.name}</div>
      <div class="text-sm text-gray-500">
        Joined
        <TimeAgo date={item.createdAt} />
      </div>
    </div>
  {/if}
</a>
