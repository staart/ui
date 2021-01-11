<script lang="ts">
  import { goto, stores } from "@sapper/app";
  import { onMount } from "svelte";
  import { api, loginWithTokenResponse } from "../../../api";
  import Error from "../../../components/Error.svelte";
  import Success from "../../../components/Success.svelte";
  import { activeNotification } from "../../../stores";
  import type { User } from "../../../stores";

  const { page } = stores();
  const { type } = $page.params;
  let state = "ready";
  let error = "";
  let password = "";

  onMount(() => {
    if (type.join("/") !== "reset-password") verify();
  });

  const verify = async () => {
    state = "loading";
    try {
      const data: Record<string, string> = {
        token: $page.query.token,
      };
      if (type.join("/") === "reset-password") data.password = password;
      const result = await api<User["auth"] | any>({
        method: "POST",
        url: `/auth/${type.join("/")}`,
        body: data,
      });
      if (type.join("/") === "reset-password")
        activeNotification.set({ text: "Your password has been changed", type: "success" });
      if (type.join("/") === "approve-subnet")
        activeNotification.set({ text: "Your location has been verified", type: "success" });
      if (type.join("/") === "verify-email")
        activeNotification.set({ text: "Your email has been verified", type: "success" });
      else activeNotification.set({ text: "All done!", type: "success" });
      if (result.accessToken) {
        await loginWithTokenResponse(result as User["auth"]);
        goto("/");
      }
      error = "";
    } catch (err) {
      error = err.message;
      setTimeout(() => (error = ""), 10000);
    }
    state = "success";
  };
</script>

<svelte:head>
  <title>Verifying</title>
</svelte:head>

<div class="text-center">
  <h1 class="text-3xl font-bold">
    {#if type.join('/') === 'reset-password'}Reset your password{:else}Verifying your link...{/if}
  </h1>
</div>
{#if error}
  <Error {error} />
{:else if state === 'success'}
  <Success title="All done!">We were able to successfully verify your link.</Success>
{:else if type.join('/') === 'reset-password'}
  <div class="bg-white shadow sm:rounded-lg">
    <form on:submit|preventDefault={verify} class={state}>
      <div class="px-4 py-5 sm:px-6 space-y-4">
        <fieldset class="space-y-4">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">New password</label>
            <input
              bind:value={password}
              type="password"
              name="password"
              id="password"
              autocomplete="password"
              class="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required />
          </div>
        </fieldset>
        <button
          type="submit"
          class="inline-flex justify-center py-2 px-4 w-full border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Change password
        </button>
      </div>
    </form>
  </div>
{:else}
  <div class="bg-white shadow sm:rounded-lg py-2">
    <div class="loading h-64">
      <div />
    </div>
  </div>
{/if}
