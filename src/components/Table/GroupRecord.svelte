<script lang="ts">
  import TimeAgo from "../TimeAgo.svelte";

  export let item: any;
  export let itemType: "membership" | "group" = "group";
  export let data: any = {};
  $: {
    data = itemType === "membership" ? item.group : item;
  }
</script>

<a
  href={`/groups/${data.id}/details`}
  class="inline-flex items-center transition motion-reduce:transition-none hover:opacity-50">
  <div class="flex-shrink-0 h-10 w-10">
    <img
      class="h-10 w-10 rounded"
      src={`https://images.weserv.nl/?url=${encodeURIComponent(data.profilePictureUrl)}&w=128&h=128&fit=contain`}
      alt="" />
  </div>
  <div class="ml-5">
    <div class="text-sm font-medium text-gray-900">{data.name}</div>
    <div class="text-sm text-gray-500">
      Created
      <TimeAgo date={data.createdAt} />
    </div>
  </div>
</a>
