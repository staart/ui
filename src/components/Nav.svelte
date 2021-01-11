<script lang="ts">
  import { goto, stores } from "@sapper/app";
  import { api } from "../api";
  import { fadeScale } from "../helpers/transitions";
  import type { User } from "../stores";
  import { activeUserIndex, users } from "../stores";

  let navUsers: User[] = [];
  users.subscribe((val) => (navUsers = val));

  let userIndex = 0;
  activeUserIndex.subscribe((val) => (userIndex = val));

  const { page } = stores();

  let showUserDropdown = false;
  let showGroupDropdown = false;

  const nav = [
    {
      segment: "/admin/",
      href: "/admin/",
      text: "Dashboard",
      show: true,
    },
  ];

  const changeSession = (index: number) => {
    activeUserIndex.set(index);
    goto("/");
  };

  const logout = () => {
    const user = navUsers[userIndex];
    if (!user) return;
    api<any>({
      method: "POST",
      url: "/auth/logout",
      body: { token: user.auth.refreshToken },
    })
      .then(() => {})
      .catch(() => {});
    users.update((val) => val.filter((i) => i.details.id !== user.details.id));
    activeUserIndex.set(0);
    goto("/");
  };
</script>

<nav class="bg-gray-800">
  <div class="absolute left-0 right-0 top-0 h-48 bg-gray-800 z-0" />
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <a href="/" class="flex items-center justify-between">
            <img
              class="h-7"
              src="https://raw.githubusercontent.com/staart/staart.js.org/master/assets/icon-white.svg"
              alt="" />
            <span class="ml-3 text-white font-medium">Staart UI</span>
          </a>
        </div>
        {#if navUsers.length && $page.path.startsWith('/groups/') && navUsers[userIndex].memberships.find((i) => String(i.group.id) === $page.path
                .split('/groups/')[1]
                .split('/')[0])}
          <div class="flex ml-10">
            <div class="relative z-20">
              <div>
                <button
                  class="max-w-xs bg-gray-800 rounded flex items-center text-sm font-medium text-gray-300 transition motion-reduce:transition-none hover:text-white focus:bg-gray-700 focus:outline-none focus:text-white py-1"
                  id="user-menu"
                  aria-haspopup="true"
                  on:click={() => (showGroupDropdown = true)}>
                  <img
                    class="h-8 w-8 rounded mr-3"
                    src={`https://images.weserv.nl/?url=${encodeURIComponent(navUsers[userIndex].memberships.find((i) => String(i.group.id) === $page.path
                            .split('/groups/')[1]
                            .split('/')[0]).group.profilePictureUrl)}&w=64&h=64&fit=contain`}
                    alt="" />
                  <span>{navUsers[userIndex].memberships.find((i) => String(i.group.id) === $page.path
                          .split('/groups/')[1]
                          .split('/')[0]).group.name}</span>
                  <svg
                    class="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true">
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              {#if showGroupDropdown}
                <div
                  class="fixed left-0 right-0 top-0 bottom-0 z-40"
                  on:click={() => (showGroupDropdown = false)} />
                <div
                  transition:fadeScale={{ baseScale: 0.95, origin: 'top left' }}
                  class="origin-top-right absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                  on:click={() => (showGroupDropdown = false)}>
                  <div class="py-1">
                    {#each navUsers[userIndex].memberships as membership}
                      <a
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 transition motion-reduce:transition-none hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        href={$page.path.replace(navUsers[userIndex].memberships.find((i) => String(i.group.id) === $page.path
                                .split('/groups/')[1]
                                .split('/')[0]).group.id, membership.group.id)}
                        role="menuitem">
                        <div class="relative flex items-center">
                          <img
                            class="flex-shrink-0 h-6 w-6 rounded"
                            src={`https://images.weserv.nl/?url=${encodeURIComponent(membership.group.profilePictureUrl)}&w=64&h=64&fit=contain`}
                            alt="" />
                          <span
                            class={navUsers[userIndex].memberships.find((i) => String(i.group.id) === $page.path
                                  .split('/groups/')[1]
                                  .split(
                                    '/'
                                  )[0]).group.id === membership.group.id ? 'ml-3 block font-bold truncate pr-5' : 'ml-3 block font-normal truncate'}>
                            {membership.group.name}
                          </span>
                          {#if navUsers[userIndex].memberships.find((i) => String(i.group.id) === $page.path
                                .split('/groups/')[1]
                                .split('/')[0]).group.id === membership.group.id}
                            <span class="absolute inset-y-0 top-0 right-0 flex items-center">
                              <svg
                                class="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true">
                                <path
                                  fill-rule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clip-rule="evenodd" />
                              </svg>
                            </span>
                          {/if}
                        </div>
                      </a>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          </div>
        {/if}
        {#if navUsers.length}
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              {#each nav as item}
                {#if item.show}
                  <a
                    href={item.href}
                    aria-current={$page.path === item.segment ? 'page' : undefined}
                    class={$page.path === item.segment ? 'bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium transition motion-reduce:transition-none' : 'text-gray-300 transition motion-reduce:transition-none hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:text-white hover:text-white px-3 py-2 rounded-md text-sm font-medium'}>{item.text}</a>
                {/if}
              {/each}
            </div>
          </div>
        {/if}
      </div>
      <div class="hidden md:block">
        {#if navUsers.length}
          <div class="ml-4 flex items-center md:ml-6">
            <div class="relative z-20">
              <div>
                <button
                  class="max-w-xs bg-gray-800 rounded flex items-center text-sm font-medium text-gray-300 transition motion-reduce:transition-none hover:text-white focus:bg-gray-700 focus:outline-none focus:text-white py-1"
                  id="user-menu"
                  aria-haspopup="true"
                  on:click={() => (showUserDropdown = true)}>
                  <img
                    class="h-8 w-8 rounded-full mr-3"
                    src={`https://images.weserv.nl/?url=${encodeURIComponent(navUsers[userIndex].details.profilePictureUrl)}&w=64&h=64&fit=contain`}
                    alt="" />
                  <span>{(navUsers[userIndex].details.name || 'Account').split(' ')[0]}</span>
                  <svg
                    class="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true">
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              {#if showUserDropdown}
                <div
                  class="fixed left-0 right-0 top-0 bottom-0 z-40"
                  on:click={() => (showUserDropdown = false)} />
                <div
                  transition:fadeScale={{ baseScale: 0.95, origin: 'top right' }}
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                  on:click={() => (showUserDropdown = false)}>
                  <div class="py-1">
                    {#each navUsers as user, index}
                      <button
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 transition motion-reduce:transition-none hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        on:click={() => changeSession(index)}
                        role="menuitem">
                        <div class="relative flex items-center">
                          <img
                            class="flex-shrink-0 h-6 w-6 rounded-full"
                            src={`https://images.weserv.nl/?url=${encodeURIComponent(user.details.profilePictureUrl)}&w=64&h=64&fit=contain`}
                            alt="" />
                          <span
                            class={userIndex === index ? 'ml-3 block font-bold truncate pr-5' : 'ml-3 block font-normal truncate'}>
                            {user.details.name}
                          </span>
                          {#if userIndex === index}
                            <span class="absolute inset-y-0 top-0 right-0 flex items-center">
                              <svg
                                class="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true">
                                <path
                                  fill-rule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clip-rule="evenodd" />
                              </svg>
                            </span>
                          {/if}
                        </div>
                      </button>
                    {/each}
                    <a
                      href="/auth/login"
                      class="block w-full text-left px-4 py-2 font-medium text-xs text-indigo-800 transition motion-reduce:transition-none hover:text-indigo-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      role="menuitem">Add another account</a>
                  </div>
                  <div class="py-1">
                    <a
                      href={`/users/${navUsers[userIndex].details.id}/profile`}
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 transition motion-reduce:transition-none hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      role="menuitem">Account settings</a>
                    <button
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 transition motion-reduce:transition-none hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      on:click={logout}
                      role="menuitem">Logout</button>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        {:else}
          <div class="ml-3 relative">
            <div class="flex items-baseline space-x-4">
              <a
                href="/auth/login"
                class="text-gray-300 transition motion-reduce:transition-none hover:bg-gray-700 focus:bg-gray-700 focus:outline-none hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</a>
              <a
                href="/auth/register"
                class="text-gray-300 bg-indigo-700 transition motion-reduce:transition-none hover:bg-indigo-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Create
                an account</a>
            </div>
          </div>
        {/if}
      </div>
      <div class="-mr-2 flex md:hidden">
        <button
          class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 transition motion-reduce:transition-none hover:text-white motion-reduce:transition-none hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
          <span class="sr-only">Open main menu</span>
          <svg
            class="block h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg
            class="hidden h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</nav>
