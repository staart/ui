<script lang="ts">
  import { goto } from "@sapper/app";
  import { api, loginWithTokenResponse } from "../../api";
  import Form from "../../components/Form.svelte";
  import { fadeScale } from "../../helpers/transitions";
  import type { User } from "../../stores";
  import { activeUserIndex, users } from "../../stores";

  let navUsers: User[] = [];
  let totpToken = "";
  let showHelp = false;
  users.subscribe((val) => (navUsers = val));

  const login = async (body: { email: string; password?: string }) => {
    const auth = await api<
      User["auth"] | { multiFactorRequired: true; totpToken: string; type: string }
    >({
      method: "POST",
      url: "/auth/login",
      body: {
        ...body,
        origin: window.location.origin,
      },
    });
    if ("multiFactorRequired" in auth && auth.multiFactorRequired) totpToken = auth.totpToken;
    else {
      await loginWithTokenResponse(auth as User["auth"]);
      goto("/");
    }
  };

  const totpLogin = async (body: { token: string }) => {
    const auth = await api<User["auth"]>({
      method: "POST",
      url: "/auth/login/totp",
      body: {
        token: totpToken,
        code: body.token,
      },
    });
    await loginWithTokenResponse(auth);
    goto("/");
  };

  const changeSession = (index: number) => {
    activeUserIndex.set(index);
    goto("/");
  };
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<div class="text-center">
  <h1 class="text-3xl font-bold">
    {#if navUsers.length}Login to another account{:else}Login to your account{/if}
  </h1>
  <p class="mt-2 text-gray-500">
    or,
    <a href="/auth/register" class="text-indigo-600 hover:text-indigo-900 font-medium">create an
      account</a>
  </p>
</div>
{#if navUsers.length}
  <div class="bg-gray-100 rounded mt-5 mb-2 py-4 px-6">
    <p class="text-gray-500">Active sessions</p>
    {#each navUsers as user, index}
      <button
        class="flex w-full text-gray-900 hover:text-gray-500 select-none relative py-3 transition"
        on:click={() => changeSession(index)}>
        <div class="flex items-center">
          <img
            src={user.details.profilePictureUrl}
            alt=""
            class="flex-shrink-0 h-6 w-6 rounded-full" />
          <span class="ml-3 block font-normal truncate">{user.details.name}</span>
        </div>
      </button>
    {/each}
  </div>
{/if}
{#if totpToken}
  <Form
    onSubmit={totpLogin}
    items={[{ name: 'token', type: 'number', label: 'One-time password', required: true }]}
    submitText="Login to your account" />
{:else}
  <Form
    onSubmit={login}
    items={[{ name: 'email', type: 'email', label: 'Email', required: true }, { name: 'password', type: 'password', label: 'Password' }]}
    submitText="Login to your account" />
{/if}
<div class="mt-5 text-sm text-center">
  <div>
    <button
      on:click={() => (showHelp = !showHelp)}
      class="text-indigo-600 hover:text-indigo-900 font-medium">Need help?</button>
  </div>
  {#if showHelp}
    <div
      class="bg-white shadow sm:rounded-lg p-4 mt-3 text-left text-gray-600"
      transition:fadeScale={{ baseScale: 0.95 }}>
      <nav class="space-y-2">
        <p>
          If you're unable to log in, you can
          <a href="/auth/forgot" class="text-indigo-600 hover:text-indigo-900 font-medium">reset
            your password</a>.
        </p>
        <p>
          If you haven't received the link to verify your email, you can
          <a href="/auth/resend" class="text-indigo-600 hover:text-indigo-900 font-medium">resend
            email verification</a>
          after a few minutes.
        </p>
      </nav>
    </div>
  {/if}
</div>
