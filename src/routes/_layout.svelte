<script lang="ts">
  import { fly } from "svelte/transition";
  import Nav from "../components/Nav.svelte";
  import { activeNotification } from "../stores";

  let notification: any | null = null;
  activeNotification.subscribe((val) => (notification = val));
</script>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .loading {
    background-image: url("data:image/svg+xml,%3Csvg width='38' height='38' viewBox='0 0 38 38' xmlns='http://www.w3.org/2000/svg' stroke='%23000'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg transform='translate(1 1)' stroke-width='2'%3E%3Ccircle stroke-opacity='.5' cx='18' cy='18' r='18'/%3E%3Cpath d='M36 18c0-9.94-8.06-18-18-18'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 18 18' to='360 18 18' dur='1s' repeatCount='indefinite'/%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    background-position: center;
    background-repeat: no-repeat;
  }
  .loading > * {
    transition: 1s;
    opacity: 0;
  }
  .loading.loading-has {
    position: fixed;
    width: 5rem;
    height: 5rem;
    right: 0;
    top: 4rem;
  }
</style>

{#if notification}
  <div
    class={notification.type === 'success' ? 'absolute rounded-md border shadow-xl px-6 py-3 text-base font-medium sm:w-auto sm:text-sm left-2/4 top-10 border-green-300 bg-green-100 text-green-700' : notification.type === 'error' ? 'absolute rounded-md border shadow-xl px-6 py-3 text-base font-medium sm:w-auto sm:text-sm left-2/4 top-10 border-red-300 bg-red-100 text-red-700' : notification.type === 'warning' ? 'absolute rounded-md border shadow-xl px-6 py-3 text-base font-medium sm:w-auto sm:text-sm left-2/4 top-10 border-yellow-300 bg-yellow-100 text-yellow-700' : 'absolute rounded-md border shadow-xl px-6 py-3 text-base font-medium sm:w-auto sm:text-sm left-2/4 top-10 border-indigo-300 bg-indigo-100 text-indigo-700'}
    in:fly={{ y: -50, duration: 300 }}
    out:fly={{ y: 10, duration: 200 }}
    style="transform: translateX(-50%)">
    {notification.text}
  </div>
{/if}

<Nav />

<main class="relative z-10">
  <slot />
</main>

<footer class="text-center text-xs mb-10 text-gray-400">
  <p>&copy; {new Date().getFullYear()} Staart</p>
</footer>
