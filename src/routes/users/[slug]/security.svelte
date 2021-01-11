<script lang="ts">
  import type { User } from "@koj/types";

  import { goto, stores } from "@sapper/app";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { api } from "../../../api";
  import DeleteModal from "../../../components/DeleteModal.svelte";
  import Error from "../../../components/Error.svelte";
  import Form from "../../../components/Form.svelte";
  import { fadeScale } from "../../../helpers/transitions";
  import { activeNotification, activeUserIndex, users } from "../../../stores";

  const { page } = stores();
  const { slug } = $page.params;
  let state = "ready";
  let error = "";
  let user: any = {};
  let twoFactorMethod = "NONE";
  let phone = "";
  let token = "";
  let backupCodes: number[] = [];
  let qrCode: string = "";
  let showTotp = false;
  let showDelete = false;
  let showDeactivate = false;

  onMount(() => {
    fetch();
  });

  const fetch = async () => {
    state = "fetching";
    try {
      user = await api<any>({
        method: "GET",
        url: `/users/${slug}`,
        onCachedResponse: (result) => (user = result),
      });
      error = "";
    } catch (err) {
      error = err.message;
    }
    state = "ready";
  };

  const changePassword = async (body: {
    currentPassword?: string;
    newPassword: string;
    ignorePwnedPassword?: boolean;
  }) => {
    user = await api<User>({
      method: "PATCH",
      url: `/users/${slug}`,
      body,
    });
    activeNotification.set({
      text: "Your password has been changed successfully",
      type: "success",
    });
  };

  const verifyTotp = async () => {
    state = "enabling";
    if (twoFactorMethod === "TOTP") {
      try {
        await api<any>({
          method: "POST",
          url: `/users/${slug}/multi-factor-authentication/totp`,
          body: { token },
        });
        user.twoFactorMethod = twoFactorMethod;
      } catch (err) {
        error = err.message;
      }
    } else if (twoFactorMethod === "EMAIL") {
      try {
        await api<any>({
          method: "POST",
          url: `/users/${slug}/multi-factor-authentication/email`,
          body: { token },
        });
        user.twoFactorMethod = twoFactorMethod;
      } catch (err) {
        error = err.message;
      }
    } else if (twoFactorMethod === "SMS") {
      try {
        await api<any>({
          method: "POST",
          url: `/users/${slug}/multi-factor-authentication/sms`,
          body: { token },
        });
        user.twoFactorMethod = twoFactorMethod;
      } catch (err) {
        error = err.message;
      }
    }
    showTotp = false;
    state = "ready";
  };

  const enableMfa = async () => {
    state = "enabling";
    if (twoFactorMethod === "TOTP") {
      try {
        qrCode = (
          await api<{ img: string }>({
            method: "POST",
            url: `/users/${slug}/multi-factor-authentication/totp`,
          })
        ).img;
        showTotp = true;
      } catch (err) {
        error = err.message;
      }
    } else if (twoFactorMethod === "EMAIL") {
      try {
        await api<any>({ method: "POST", url: `/users/${slug}/multi-factor-authentication/email` });
        showTotp = true;
      } catch (err) {
        error = err.message;
      }
    } else if (twoFactorMethod === "SMS") {
      try {
        await api<any>({
          method: "POST",
          url: `/users/${slug}/multi-factor-authentication/sms`,
          body: { phone },
        });
        showTotp = true;
      } catch (err) {
        error = err.message;
      }
    }
    state = "ready";
  };
</script>

<svelte:head>
  <title>Password & security</title>
</svelte:head>

<div class="p-7">
  <h1 class="text-2xl">Password & security</h1>
  {#if error}
    <Error {error} />
  {/if}
  <div class="mt-3">
    <Form
      title="Change password"
      items={[{ name: 'currentPassword', label: 'Current password', type: 'password', show: user.hasPassword }, { name: 'newPassword', label: 'New password', type: 'password', required: true }, { name: 'ignorePwnedPassword', label: "Don't check for compromised passwords", type: 'checkbox', hint: 'If unchecked, the HIBP database will be used to check for compromised passwords' }]}
      submitText="Change password"
      onSubmit={changePassword} />
  </div>
  <h2 class="text-xl mt-10">Multi-factor authentication</h2>
  {#if user.twoFactorMethod === 'NONE'}
    <p class="mt-2 text-gray-500 text-sm">
      Multi-factor authentication (MFA) is currently
      <strong>disabled</strong>
      for your account.
    </p>
    <form
      class={`mt-4 ${state === 'fetching' || state === 'enabling' ? 'loading' : ''}`}
      on:submit|preventDefault={enableMfa}>
      <fieldset class="space-y-4">
        <div class="space-y-4">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                type="radio"
                id="TOTP"
                class="form-radio text-indigo-600 border-gray-300"
                name="twoFactorMethod"
                bind:group={twoFactorMethod}
                value="TOTP"
                required />
            </div>
            <div class="ml-3 text-sm">
              <label for="TOTP" class="font-medium text-gray-700">Authenticator app</label>
              <p class="text-gray-500">Get a one-time password on a TOTP-based authenticator app</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                type="radio"
                id="SMS"
                class="form-radio text-indigo-600 border-gray-300"
                name="twoFactorMethod"
                bind:group={twoFactorMethod}
                value="SMS"
                required />
            </div>
            <div class="ml-3 text-sm">
              <label for="SMS" class="font-medium text-gray-700">SMS</label>
              <p class="text-gray-500">Get a one-time password via text message</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                type="radio"
                id="EMAIL"
                class="form-radio text-indigo-600 border-gray-300"
                name="twoFactorMethod"
                bind:group={twoFactorMethod}
                value="EMAIL"
                required />
            </div>
            <div class="ml-3 text-sm">
              <label for="EMAIL" class="font-medium text-gray-700">Email</label>
              <p class="text-gray-500">Get an email with a link to login</p>
            </div>
          </div>
        </div>
        {#if twoFactorMethod === 'SMS'}
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Phone number</label>
            <input
              bind:value={phone}
              type="text"
              name="phone"
              id="phone"
              autocomplete="phone"
              class="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required />
            <div class="mt-2 text-gray-500 text-xs">
              Enter your full phone number with country code
            </div>
          </div>
        {/if}
        <button
          type="submit"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm font-medium rounded-md sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Enable MFA
        </button>
      </fieldset>
    </form>
  {:else}
    <div class={state === 'fetching' || state === 'enabling' ? 'loading' : ''}>
      {#if user.twoFactorMethod === 'SMS'}
        <p class="mt-2 text-gray-500 text-sm">
          Multi-factor authentication (MFA) is currently enabled using
          <strong>SMS</strong>. We'll send you a one-time password as a text message when you log
          in.
        </p>
      {:else if user.twoFactorMethod === 'EMAIL'}
        <p class="mt-2 text-gray-500 text-sm">
          Multi-factor authentication (MFA) is currently enabled using
          <strong>email</strong>. We'll send you a one-time password in an email when you log in.
        </p>
      {:else if user.twoFactorMethod === 'TOTP'}
        <p class="mt-2 text-gray-500 text-sm">
          Multi-factor authentication (MFA) is currently enabled using an
          <strong>authenticator app</strong>. When logging in, you'll have to enter the one-time
          password from your app.
        </p>
      {:else}
        <p class="mt-2 text-gray-500 text-sm">
          Multi-factor authentication (MFA) is currently
          <strong>enabled</strong>
          using
          {user.twoFactorMethod}.
        </p>
      {/if}
      <div>
        <button
          type="button"
          class="rounded-md border border-red-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm mt-4 transition motion-reduce:transition-none-all"
          on:click={() => (showDelete = true)}>
          Disable MFA
        </button>
      </div>
    </div>
  {/if}
  <h2 class="text-xl mt-10">Delete account</h2>
  <p class="mt-2 text-gray-500 text-sm">
    You can deactivate your account and it will be permanently deleted after 30 days. If you log in
    to your account within 30 days, it will be activated again.
  </p>
  <div>
    <button
      type="button"
      class="rounded-md border border-red-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm mt-4 transition motion-reduce:transition-none-all"
      on:click={() => (showDeactivate = true)}>
      Delete account
    </button>
  </div>
</div>

{#if backupCodes.length}
  <div class="fixed z-10 inset-0 overflow-y-auto" transition:fade={{ duration: 200 }}>
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div
        class="fixed inset-0 transition motion-reduce:transition-none-opacity"
        aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75" />
      </div>
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true">&#8203;</span>
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition motion-reduce:transition-none-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        transition:fadeScale={{ baseScale: 0.95, delay: 50 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h2 class="text-xl">Backup codes</h2>
          <p class="mt-2 text-sm text-gray-500">
            If you lose access to your MFA device or number, you can use these backup codes to log
            in to your account. Make sure you keep them safe.
          </p>
          <div class="font-mono text-gray-500 mt-4 text-center flex flex-wrap space-y-2">
            {#each backupCodes as code}
              <div style="width: 50%">{code}</div>
            {/each}
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            on:click={() => (backupCodes = [])}>
            Close, I've copied these codes
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

{#if showTotp}
  <div class="fixed z-10 inset-0 overflow-y-auto" transition:fade={{ duration: 200 }}>
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div
        class="fixed inset-0 transition motion-reduce:transition-none-opacity"
        aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75" />
      </div>
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true">&#8203;</span>
      <form
        class={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition motion-reduce:transition-none-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${state === 'enabling' ? 'loading' : ''}`}
        transition:fadeScale={{ baseScale: 0.95, delay: 50 }}
        on:submit|preventDefault={verifyTotp}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h2 class="text-xl">Enter one-time password</h2>
          {#if qrCode}
            <p class="mt-2 text-sm text-gray-500">
              Scan this QR code in your authenticator app and enter the one-time password.
            </p>
            <img alt="" src={qrCode} class="h-60 my-5 mx-auto" />
          {:else}
            <p class="mt-2 mb-3 text-sm text-gray-500">Enter the one-time password sent to you.</p>
          {/if}
          <div>
            <label for="token" class="block text-sm font-medium text-gray-700">One-time password</label>
            <input
              bind:value={token}
              type="text"
              name="token"
              id="token"
              autocomplete="one-time-password"
              minlength="1"
              class="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required />
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
            Submit
          </button>
          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            on:click={() => (showTotp = false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

{#if showDelete}
  <DeleteModal
    title="Disable multi-factor authentication"
    text="Are you sure you want to disable MFA? Your account will only require a password and will be less secure."
    onClose={() => (showDelete = false)}
    url={`/users/${slug}/multi-factor-authentication`}
    onSuccess={() => {
      user.twoFactorMethod = 'NONE';
      showDelete = false;
    }} />
{/if}

{#if showDeactivate}
  <DeleteModal
    title="Deactivate account"
    text="Are you sure you want to deactivate your account? Your account will be permanently deleted."
    onClose={() => (showDeactivate = false)}
    url={`/users/${slug}`}
    onSuccess={() => {
      users.update((val) => val.filter((i) => String(i.details.id) !== String(slug)));
      activeUserIndex.set(0);
      goto('/');
      showDeactivate = false;
    }} />
{/if}
