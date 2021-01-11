<script lang="ts">
  import { stores } from "@sapper/app";
  import { onMount } from "svelte";
  import { api } from "../../../api";
  import Error from "../../../components/Error.svelte";
  import Form from "../../../components/Form.svelte";
  import { activeNotification } from "../../../stores";

  const { page } = stores();
  const { slug } = $page.params;
  let state = "ready";
  let error = "";
  let data: any = {};

  onMount(() => {
    fetch();
  });

  const fetch = async () => {
    state = "fetching";
    try {
      data = await api<any>({
        method: "GET",
        url: `/groups/${slug}`,
        onCachedResponse: (result) => (data = result),
      });
      error = "";
    } catch (err) {
      error = err.message;
    }
    state = "ready";
  };

  const edit = async (body: {
    name: string;
    gender: string;
    prefersLanguage: string;
    prefersColorScheme: string;
    prefersReducedMotion: string;
  }) => {
    data = await api<any>({
      method: "PATCH",
      url: `/groups/${slug}`,
      body,
    });
    error = "";
    activeNotification.set({
      text: "Group has been updated",
      type: "success",
    });
  };
</script>

<svelte:head>
  <title>Security</title>
</svelte:head>

<div class="p-7">
  <h1 class="text-2xl">Security</h1>
  {#if error}
    <Error {error} />
  {/if}
  {#if state === 'fetching'}
    <div class={`loading ${data ? 'loading-has' : 'h-52 bg-gray-50'}`} />
  {/if}
  <Form
    items={[{ name: 'forceTwoFactor', label: 'Force multi-factor authentication', type: 'checkbox', hint: 'All members of this group must enable MFA' }, { name: 'autoJoinDomain', label: 'Members can auto-join via verified domains', type: 'checkbox', hint: 'Members with emails on your domains will be added to your group' }, { name: 'onlyAllowDomain', label: 'Members can only join via verified domains', type: 'checkbox', hint: 'Only users with emails on your domains can be added to this group' }, { name: 'ipRestrictions', label: 'IP address restrictions', type: 'array' }]}
    values={data}
    submitText="Save security settings"
    onSubmit={edit} />
</div>
