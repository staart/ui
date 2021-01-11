<script lang="ts">
  import { goto, stores } from "@sapper/app";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { api, can } from "../../api";
  import Empty from "../../components/Empty.svelte";
  import Error from "../../components/Error.svelte";
  import Search from "../../components/Search.svelte";
  import DeleteButton from "../../components/Table/DeleteButton.svelte";
  import EditButton from "../../components/Table/EditButton.svelte";
  import UserRecord from "../../components/Table/UserRecord.svelte";
  import ViewButton from "../../components/Table/ViewButton.svelte";
  import Tag from "../../components/Tag.svelte";
  import { languages } from "../../data";
  import { fadeScale } from "../../helpers/transitions";
  import type { Filter } from "../../interfaces";
  import { activeNotification, users } from "../../stores";

  const { page } = stores();
  let state = "ready";
  let error = "";
  let data: any[] = [];
  let lastItemId = "";
  let deleteActiveId = "";
  let editActive: any | null = null;
  let hasMore = false;
  let query = "";
  let filters: Filter[] = [
    { title: "Name", name: "name", type: "string" },
    { title: "User ID", name: "id", type: "int" },
    { title: "Active", name: "active", type: "bool" },
    {
      title: "Role",
      name: "role",
      type: "enum",
      options: {
        SUDO: "Superadmin",
        INTERIOR_DESIGNER: "Interior designer",
        USER: "User",
      },
    },
    { title: "Country code", name: "countryCode", type: "string" },
    { title: "Timezone", name: "timezone", type: "string" },
    {
      title: "Gender",
      name: "gender",
      type: "enum",
      options: {
        FEMALE: "Female",
        MALE: "Male",
        NONBINARY: "Non-binary",
        UNKNOWN: "Prefer not to say",
      },
    },
    {
      title: "Email notifications",
      name: "notificationEmail",
      type: "enum",
      options: {
        PROMOTIONS: "Promotions",
        UPDATES: "Updates",
        ACCOUNT: "Account",
      },
    },
    { title: "Language", name: "prefersLanguage", type: "string" },
    {
      title: "Color scheme",
      name: "prefersColorScheme",
      type: "enum",
      options: {
        DARK: "Dark theme",
        LIGHT: "Light theme",
        NO_PREFERENCE: "No preference",
      },
    },
    {
      title: "Reduced motion",
      name: "prefersReducedMotion",
      type: "enum",
      options: {
        REDUCE: "Reduce",
        NO_PREFERENCE: "No preference",
      },
    },
    { title: "Check location on login", name: "checkLocationOnLogin", type: "bool" },
    {
      title: "Multi-factor authentication",
      name: "twoFactorMethod",
      type: "enum",
      options: {
        NONE: "None",
        TOTP: "TOTP",
        EMAIL: "Email",
        SMS: "SMS",
      },
    },
    { title: "Created at", name: "createdAt", type: "datetime" },
    { title: "Updated at", name: "updatedAt", type: "datetime" },
  ];

  const fetch = async () => {
    state = "fetching";
    hasMore = false;
    let cached = false;
    try {
      const items = await api<any[]>({
        method: "GET",
        url: `/users?take=10&orderBy=id:desc${lastItemId ? `&cursor=${lastItemId}&skip=1` : ""}${
          query ? `&where=${query}` : ""
        }`,
        onCachedResponse: (items) => {
          cached = true;
          data = items;
        },
      });
      if (cached) data = [];
      if (items.length === 10) hasMore = true;
      if (items.length) lastItemId = items[items.length - 1].id;
      data = [...data, ...items];
    } catch (err) {
      error = err.message;
      setTimeout(() => (error = ""), 10000);
    }
    state = "ready";
  };
  page.subscribe((item: any) => {
    if (item && item.query && item.query.q && item.query.q !== query) {
      query = $page.query.q;
      data = [];
      lastItemId = "";
      fetch();
    }
  });
  onMount(() => {
    if (!query) fetch();
  });

  const edit = async () => {
    if (!editActive) return;
    try {
      state = "editing";
      const result = await api<any>({
        method: "PATCH",
        url: `/users/${editActive.id}`,
        body: {
          name: editActive.name,
          role: editActive.role,
          gender: editActive.gender,
          prefersLanguage: editActive.prefersLanguage,
          active: editActive.active,
          checkLocationOnLogin: editActive.checkLocationOnLogin,
          notificationEmail: editActive.notificationEmail,
          prefersColorScheme: editActive.prefersColorScheme,
          prefersReducedMotion: editActive.prefersReducedMotion,
          profilePictureUrl: editActive.profilePictureUrl,
        },
      });
      if (editActive) data = data.map((i) => (i.id === editActive.id ? result : i));
      users.update((items) => {
        items = items.map((i) => {
          if (i.details.id === result.id) return { ...i, details: result };
          return i;
        });
        return items;
      });
      error = "";
      activeNotification.set({
        text: "User has been updated",
        type: "success",
      });
    } catch (err) {
      error = err.message;
      setTimeout(() => (error = ""), 10000);
    }
    editActive = null;
    state = "ready";
  };

  const remove = async () => {
    try {
      state = "deleting";
      await api<any>({ method: "DELETE", url: `/users/${deleteActiveId}` });
      data = data.filter((i) => i.id !== deleteActiveId);
      error = "";
      activeNotification.set({
        text: "User has been deactivated",
        type: "success",
      });
    } catch (err) {
      error = err.message;
      setTimeout(() => (error = ""), 10000);
    }
    deleteActiveId = "";
    state = "ready";
  };

  const search = async (q?: string) => {
    if (typeof q === "string") query = q;
    if (!query.includes(":")) query = `name: contains ${query}`;
    if (query === "name: contains ") query = "";
    goto(`/admin/users?q=${encodeURIComponent(query)}`);
    data = [];
    lastItemId = "";
    return fetch();
  };
</script>

<svelte:head>
  <title>Users</title>
</svelte:head>

<div class="p-7">
  <h1 class="text-2xl">Users</h1>
  <p class="mt-2 text-gray-500 text-sm">
    These are all the users currently registered on the Koj platform. These include both Koj team
    members and customers.
  </p>
</div>

<Search {search} {filters} {query} updateQuery={(q) => (query = q)} searchFor="users" />
<div class="flex flex-col">
  <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="py-2 align-middle inline-block min-w-full sm:px-7 lg:px-8">
      <div class="overflow-hidden border-t border-b border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-7 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th
                scope="col"
                class="px-7 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th
                scope="col"
                class="px-7 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="relative px-7 py-3"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each data as item}
              <tr>
                <td class="px-7 py-4 whitespace-nowrap">
                  <UserRecord {item} itemType="user" />
                </td>
                <td class="px-7 py-4 whitespace-nowrap">
                  {#if item.role === 'SUDO'}
                    <Tag on:click={() => search('role: SUDO')} color="blue">Superadmin</Tag>
                  {:else if item.role === 'INTERIOR_DESIGNER'}
                    <Tag on:click={() => search('role: INTERIOR_DESIGNER')} color="indigo">
                      Interior designer
                    </Tag>
                  {:else if item.role === 'USER'}
                    <Tag on:click={() => search('role: USER')} color="gray">User</Tag>
                  {:else}
                    <Tag on:click={() => search(`role: ${item.role}`)} color="gray">
                      {item.role}
                    </Tag>
                  {/if}
                </td>
                <td class="px-7 py-4 whitespace-nowrap">
                  {#if !item.active}
                    <Tag on:click={() => search('active: bool(false)')} color="red">Inactive</Tag>
                  {:else}
                    <Tag on:click={() => search('active: bool(true)')} color="green">Active</Tag>
                  {/if}
                </td>
                <td class="px-7 py-4 whitespace-nowrap text-right">
                  <ViewButton href={`/users/${item.id}/profile`} />
                  {#if can(`users-${item.id}:write-info`)}
                    <EditButton on:click={() => (editActive = item)} />
                  {/if}
                  {#if can(`users-${item.id}:delete-*`)}
                    <DeleteButton
                      label="Deactivate"
                      on:click={() => (deleteActiveId = item.id)}
                      disabled={!item.active} />
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
        {#if hasMore}
          <button
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm font-medium rounded-md sm:text-sm text-indigo-900 bg-indigo-100 hover:bg-indigo-200 transition motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 m-7 mt-3"
            on:click={fetch}>Load more users</button>
        {/if}
        {#if data.length === 0 && state === 'ready'}
          <Empty message="No users found" />
        {/if}
        {#if state === 'fetching'}
          <div class={`loading ${data.length ? 'loading-has' : 'h-52 bg-gray-50'}`}>
            <div>Loading...</div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

{#if error}
  <div class="p-7">
    <Error {error} />
  </div>
{/if}

{#if deleteActiveId}
  <div class="fixed z-10 inset-0 overflow-y-auto" transition:fade={{ duration: 200 }}>
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div
        class="fixed inset-0 transition motion-reduce:transition-none-opacity"
        aria-hidden="true">
        <div
          class="absolute inset-0 bg-gray-500 opacity-75"
          on:click={() => (deleteActiveId = '')} />
      </div>
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true">&#8203;</span>
      <div
        class={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition motion-reduce:transition-none-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${state === 'deleting' ? 'loading' : ''}`}
        transition:fadeScale={{ baseScale: 0.95, delay: 50 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg
                class="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                Deactivate user
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you sure you want to delete this user? All products with this user will be
                  permanently removed. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            on:click={remove}>
            Deactivate
          </button>
          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            on:click={() => (deleteActiveId = '')}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

{#if editActive}
  <div class="fixed z-10 inset-0 overflow-y-auto" transition:fade={{ duration: 200 }}>
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div
        class="fixed inset-0 transition motion-reduce:transition-none-opacity"
        aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75" on:click={() => (editActive = null)} />
      </div>
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true">&#8203;</span>
      <form
        class={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition motion-reduce:transition-none-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${state === 'editing' ? 'loading' : ''}`}
        transition:fadeScale={{ baseScale: 0.95, delay: 50 }}
        on:submit|preventDefault={edit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h2 class="text-xl">Edit user</h2>
          <fieldset class="space-y-4 my-4">
            <div>
              <span class="block text-sm font-medium text-gray-700">Role</span>
              <div class="mt-2">
                <label class="inline-flex items-center text-sm text-gray-700">
                  <input
                    type="radio"
                    class="form-radio text-indigo-600 border-gray-300"
                    name="role"
                    bind:group={editActive.role}
                    value="USER" />
                  <span class="ml-2">User</span>
                </label>
                <label class="inline-flex items-center text-sm text-gray-700 ml-4">
                  <input
                    type="radio"
                    class="form-radio text-indigo-600 border-gray-300"
                    name="role"
                    bind:group={editActive.role}
                    value="INTERIOR_DESIGNER" />
                  <span class="ml-2">Interior designer</span>
                </label>
                <label class="inline-flex items-center text-sm text-gray-700 ml-4">
                  <input
                    type="radio"
                    class="form-radio text-indigo-600 border-gray-300"
                    name="role"
                    bind:group={editActive.role}
                    value="SUDO" />
                  <span class="ml-2">Superadmin</span>
                </label>
              </div>
            </div>
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input
                bind:value={editActive.name}
                type="text"
                name="name"
                id="name"
                autocomplete="name"
                class="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required />
            </div>
            <div>
              <span class="block text-sm font-medium text-gray-700">Gender</span>
              <div class="mt-2">
                <label class="inline-flex items-center text-sm text-gray-700">
                  <input
                    type="radio"
                    class="form-radio text-indigo-600 border-gray-300"
                    name="gender"
                    bind:group={editActive.gender}
                    value="MALE" />
                  <span class="ml-2">Male</span>
                </label>
                <label class="inline-flex items-center text-sm text-gray-700 ml-4">
                  <input
                    type="radio"
                    class="form-radio text-indigo-600 border-gray-300"
                    name="gender"
                    bind:group={editActive.gender}
                    value="FEMALE" />
                  <span class="ml-2">Female</span>
                </label>
                <label class="inline-flex items-center text-sm text-gray-700 ml-4">
                  <input
                    type="radio"
                    class="form-radio text-indigo-600 border-gray-300"
                    name="gender"
                    bind:group={editActive.gender}
                    value="NONBINARY" />
                  <span class="ml-2">Non-binary</span>
                </label>
                <label class="inline-flex items-center text-sm text-gray-700 ml-4">
                  <input
                    type="radio"
                    class="form-radio text-indigo-600 border-gray-300"
                    name="gender"
                    bind:group={editActive.gender}
                    value="UNKNOWN" />
                  <span class="ml-2">Prefer not to say</span>
                </label>
              </div>
            </div>
            <div>
              <label
                for="prefersLanguage"
                class="block text-sm font-medium text-gray-700">Language</label>
              <select
                bind:value={editActive.prefersLanguage}
                type="text"
                name="prefersLanguage"
                id="prefersLanguage"
                autocomplete="prefersLanguage"
                class="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required>
                {#each Object.keys(languages) as lang}
                  <option value={lang}>{languages[lang]}</option>
                {/each}
              </select>
            </div>
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="active"
                  bind:checked={editActive.active}
                  name="active"
                  type="checkbox"
                  class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              </div>
              <div class="ml-3 text-sm">
                <label for="active" class="font-medium text-gray-700">Active</label>
                <p class="text-gray-500">Uncheck this to deactivate this account</p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="checkLocationOnLogin"
                  bind:checked={editActive.checkLocationOnLogin}
                  name="checkLocationOnLogin"
                  type="checkbox"
                  class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              </div>
              <div class="ml-3 text-sm">
                <label for="checkLocationOnLogin" class="font-medium text-gray-700">Check location
                  on login</label>
                <p class="text-gray-500">
                  Send a verification email if logging in from a new location
                </p>
              </div>
            </div>
            <div>
              <span class="block text-sm font-medium text-gray-700">Notification emails</span>
              <div class="mt-2">
                <label class="inline-flex items-center text-sm text-gray-700">
                  <input
                    type="radio"
                    class="form-radio text-indigo-600 border-gray-300"
                    name="notificationEmail"
                    bind:group={editActive.notificationEmail}
                    value="PROMOTIONS" />
                  <span class="ml-2">Promotions</span>
                </label>
                <label class="inline-flex items-center text-sm text-gray-700 ml-4">
                  <input
                    type="radio"
                    class="form-radio text-indigo-600 border-gray-300"
                    name="notificationEmail"
                    bind:group={editActive.notificationEmail}
                    value="UPDATES" />
                  <span class="ml-2">App updates</span>
                </label>
                <label class="inline-flex items-center text-sm text-gray-700 ml-4">
                  <input
                    type="radio"
                    class="form-radio text-indigo-600 border-gray-300"
                    name="notificationEmail"
                    bind:group={editActive.notificationEmail}
                    value="ACCOUNT" />
                  <span class="ml-2">Account-related</span>
                </label>
              </div>
            </div>
            <div>
              <span class="block text-sm font-medium text-gray-700">Preferred color scheme</span>
              <div class="mt-2">
                <label class="inline-flex items-center text-sm text-gray-700">
                  <input
                    type="radio"
                    class="form-radio text-indigo-600 border-gray-300"
                    name="prefersColorScheme"
                    bind:group={editActive.prefersColorScheme}
                    value="LIGHT" />
                  <span class="ml-2">Light</span>
                </label>
                <label class="inline-flex items-center text-sm text-gray-700 ml-4">
                  <input
                    type="radio"
                    class="form-radio text-indigo-600 border-gray-300"
                    name="prefersColorScheme"
                    bind:group={editActive.prefersColorScheme}
                    value="DARK" />
                  <span class="ml-2">Dark</span>
                </label>
                <label class="inline-flex items-center text-sm text-gray-700 ml-4">
                  <input
                    type="radio"
                    class="form-radio text-indigo-600 border-gray-300"
                    name="prefersColorScheme"
                    bind:group={editActive.prefersColorScheme}
                    value="NO_PREFERENCE" />
                  <span class="ml-2">No preference</span>
                </label>
              </div>
            </div>
            <div>
              <span class="block text-sm font-medium text-gray-700">Preferred motion</span>
              <div class="mt-2">
                <label class="inline-flex items-center text-sm text-gray-700">
                  <input
                    type="radio"
                    class="form-radio text-indigo-600 border-gray-300"
                    name="prefersReducedMotion"
                    bind:group={editActive.prefersReducedMotion}
                    value="REDUCE" />
                  <span class="ml-2">Reduced motion</span>
                </label>
                <label class="inline-flex items-center text-sm text-gray-700 ml-4">
                  <input
                    type="radio"
                    class="form-radio text-indigo-600 border-gray-300"
                    name="prefersReducedMotion"
                    bind:group={editActive.prefersReducedMotion}
                    value="NO_PREFERENCE" />
                  <span class="ml-2">No preference</span>
                </label>
              </div>
            </div>
            <div>
              <label for="profilePictureUrl" class="block text-sm font-medium text-gray-700">Profile
                picture</label>
              <input
                bind:value={editActive.profilePictureUrl}
                type="text"
                name="profilePictureUrl"
                id="profilePictureUrl"
                class="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required />
            </div>
          </fieldset>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            on:click={edit}>
            Save changes
          </button>
          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            on:click={() => (editActive = null)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
