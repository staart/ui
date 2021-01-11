<script lang="ts">
  export let color:
    | "gray"
    | "red"
    | "violet"
    | "yellow"
    | "green"
    | "blue"
    | "indigo"
    | "purple"
    | "pink" = "gray";
  export let href: string = "";
  let colorClass = "";
  $: {
    if (color === "gray")
      colorClass =
        "bg-gray-100 hover:bg-gray-200 active:bg-gray-200 focus:bg-gray-200 text-gray-800 hover:text-gray-900 active:text-gray-900";
    if (color === "red")
      colorClass =
        "bg-red-100 hover:bg-red-200 active:bg-red-200 focus:bg-red-200 text-red-800 hover:text-red-900 active:text-red-900";
    if (color === "violet")
      colorClass =
        "bg-violet-100 hover:bg-violet-200 active:bg-violet-200 focus:bg-violet-200 text-violet-800 hover:text-violet-900 active:text-violet-900";
    if (color === "yellow")
      colorClass =
        "bg-yellow-100 hover:bg-yellow-200 active:bg-yellow-200 focus:bg-yellow-200 text-yellow-800 hover:text-yellow-900 active:text-yellow-900";
    if (color === "green")
      colorClass =
        "bg-green-100 hover:bg-green-200 active:bg-green-200 focus:bg-green-200 text-green-800 hover:text-green-900 active:text-green-900";
    if (color === "blue")
      colorClass =
        "bg-blue-100 hover:bg-blue-200 active:bg-blue-200 focus:bg-blue-200 text-blue-800 hover:text-blue-900 active:text-blue-900";
    if (color === "indigo")
      colorClass =
        "bg-indigo-100 hover:bg-indigo-200 active:bg-indigo-200 focus:bg-indigo-200 text-indigo-800 hover:text-indigo-900 active:text-indigo-900";
    if (color === "purple")
      colorClass =
        "bg-purple-100 hover:bg-purple-200 active:bg-purple-200 focus:bg-purple-200 text-purple-800 hover:text-purple-900 active:text-purple-900";
    if (color === "pink")
      colorClass =
        "bg-pink-100 hover:bg-pink-200 active:bg-pink-200 focus:bg-pink-200 text-pink-800 hover:text-pink-900 active:text-pink-900";
  }
</script>

{#if href}
  <a
    {href}
    class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full transition motion-reduce:transition-none ${colorClass}`}>
    <slot />
  </a>
{:else}
  <span
    on:click
    class={`px-2 cursor-pointer inline-flex text-xs leading-5 font-semibold rounded-full transition motion-reduce:transition-none ${colorClass}`}>
    <slot />
  </span>
{/if}
