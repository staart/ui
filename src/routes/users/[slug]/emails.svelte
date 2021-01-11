<script lang="ts">
  import { stores } from "@sapper/app";
  import type { Email, User } from "@koj/types";
  import { api, can } from "../../../api";
  import DataTable from "../../../components/DataTable.svelte";
  import DeleteModal from "../../../components/DeleteModal.svelte";
  import Form from "../../../components/Form.svelte";
  import DeleteButton from "../../../components/Table/DeleteButton.svelte";
  import { onMount } from "svelte";

  const { page } = stores();
  const { slug } = $page.params;
  const primaryKeyType = "id";
  let data: Email[] = [];
  let deleteActiveKey: number | undefined = undefined;
  let user: User | undefined = undefined;

  onMount(async () => {
    user = await api<User>({ method: "GET", url: `/users/${slug}` });
  });

  const updateData = (item: Email) => {
    if (data.find((i) => i[primaryKeyType] === item[primaryKeyType]))
      data = data.map((i) => {
        if (i[primaryKeyType] === item[primaryKeyType]) return item;
        return i;
      });
    else data = [...data, item];
  };

  const add = async (body: { email: string }) => {
    const result = await api<Email>({
      method: "POST",
      url: `/users/${slug}/emails`,
      body,
    });
    updateData(result);
  };

  let setting = false;
  const setPrimary = async (id: number) => {
    setting = true;
    user = await api<any>({
      method: "PATCH",
      url: `/users/${slug}`,
      body: {
        prefersEmail: { connect: { id } },
      },
    });
    setting = false;
  };
</script>

<svelte:head>
  <title>Emails</title>
</svelte:head>

<DataTable
  let:item
  {data}
  title="Emails"
  itemName="emails"
  titleKey="email"
  text="Users can login from any of their verified email addresses. Notifications will only be sent to the primary email."
  endpoint={`/users/${slug}/emails`}
  headers={['Email']}
  onData={(val) => (data = val)}
  {primaryKeyType}
  filters={[{ title: 'Email', name: 'email', type: 'string' }, { title: 'Created at', name: 'createdAt', type: 'datetime' }, { title: 'Updated at', name: 'updatedAt', type: 'datetime' }]}>
  <td class="px-7 py-4 whitespace-nowrap">
    <div class="flex items-center">
      <div class="flex-shrink-0 h-5 w-5">
        <img
          class="h-5 w-5 rounded"
          src={`https://images.weserv.nl/?url=${encodeURIComponent(`https://favicons.githubusercontent.com/${encodeURIComponent(item.email.split('@')[1])}`)}&w=64&h=64&fit=contain`}
          alt="" />
      </div>
      <div class="ml-5 text-sm font-medium text-gray-900">
        <span>{item.email}</span>
        {#if user && item.id === user.prefersEmailId}
          <span
            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 ml-2">
            Primary
          </span>
        {/if}
        {#if !item.isVerified}
          <span
            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 ml-2">
            Unverified
          </span>
        {/if}
      </div>
    </div>
  </td>
  <td class="px-7 py-4 whitespace-nowrap text-right text-sm font-medium">
    {#if user && user.prefersEmailId !== item.id}
      <button
        class="text-indigo-600 hover:text-indigo-900 mr-4"
        on:click={() => setPrimary(item.id)}>
        <span class="flex space-x-4 items-center">
          <span>Set as primary</span>
          {#if setting}
            <svg
              class="w-4 h-4"
              viewBox="0 0 38 38"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor">
              <g fill="none" fill-rule="evenodd">
                <g transform="translate(1 1)" stroke-width="2">
                  <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
                  <path d="M36 18c0-9.94-8.06-18-18-18">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 18 18"
                      to="360 18 18"
                      dur="1s"
                      repeatCount="indefinite" />
                  </path>
                </g>
              </g>
            </svg>
          {/if}
        </span>
      </button>
    {/if}
    {#if can(`email:write-info-${item[primaryKeyType]}`)}
      <DeleteButton on:click={() => (deleteActiveKey = item[primaryKeyType])} />
    {/if}
  </td>
</DataTable>

<div class="p-7">
  <Form
    title="Add email"
    text="You can connect all your email addresses to your account."
    items={[{ name: 'title', label: 'Name' }]}
    onSubmit={add}
    submitText="Add email" />
</div>

{#if deleteActiveKey}
  <DeleteModal
    title="Delete email"
    text="Are you sure you want to permanently delete this email?"
    onClose={() => (deleteActiveKey = undefined)}
    url={`/users/${slug}/emails/${deleteActiveKey}`}
    onSuccess={() => {
      data = data.filter((i) => i[primaryKeyType] !== deleteActiveKey);
      deleteActiveKey = undefined;
    }} />
{/if}
