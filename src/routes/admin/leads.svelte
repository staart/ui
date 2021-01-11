<script lang="ts">
  import { api, can } from "../../api";
  import DataTable from "../../components/DataTable.svelte";
  import DeleteModal from "../../components/DeleteModal.svelte";
  import Form from "../../components/Form.svelte";
  import Modal from "../../components/Modal.svelte";
  import DeleteButton from "../../components/Table/DeleteButton.svelte";
  import EditButton from "../../components/Table/EditButton.svelte";
  import LocationAgentIcons from "../../components/LocationAgentIcons.svelte";
  import TimeAgo from "../../components/TimeAgo.svelte";

  const primaryKeyType = "id";
  let data: any[] = [];
  let deleteActiveKey: string | undefined = undefined;
  let editActive: any | undefined = undefined;

  const updateData = (item: any) => {
    if (data.find((i) => i[primaryKeyType] === item[primaryKeyType]))
      data = data.map((i) => {
        if (i[primaryKeyType] === item[primaryKeyType]) return item;
        return i;
      });
    else data = [...data, item];
  };

  const edit = async (body: { name: string; email: string }) => {
    if (!editActive) return;
    const result = await api<any>({
      method: "PATCH",
      url: `/leads/${editActive[primaryKeyType]}`,
      body,
    });
    updateData(result);
    editActive = undefined;
  };
</script>

<svelte:head>
  <title>Leads</title>
</svelte:head>

<DataTable
  let:item
  {data}
  title="Leads"
  itemName="leads"
  text="Leads are users who started the onboarding flow but didn't upload a floor plan and are in the demo mode."
  endpoint="/leads"
  headers={['Lead', 'Device']}
  onData={(val) => (data = val)}
  {primaryKeyType}
  filters={[{ title: 'Name', name: 'name', type: 'string' }, { title: 'Email', name: 'email', type: 'string' }, { title: 'ID', name: primaryKeyType, type: 'int' }, { name: 'browser', title: 'Browser', type: 'string' }, { name: 'operatingSystem', title: 'Operating system', type: 'string' }, { name: 'city', title: 'City', type: 'string' }, { name: 'region', title: 'Region', type: 'string' }, { name: 'countryCode', title: 'Country code', type: 'string' }, { title: 'Created at', name: 'createdAt', type: 'datetime' }, { title: 'Updated at', name: 'updatedAt', type: 'datetime' }]}>
  <td class="px-7 py-4 whitespace-nowrap">
    <div class="inline-flex items-center transition motion-reduce:transition-none text-gray-900">
      <div class="flex-shrink-0 h-10 w-10">
        <img
          class="h-10 w-10 rounded-full"
          src={`https://images.weserv.nl/?url=${encodeURIComponent(`https://unavatar.now.sh/${item.email}`)}&w=128&h=128&fit=contain`}
          alt="" />
      </div>
      <div class="ml-5">
        <div class="text-sm font-medium">{item.name}</div>
        <div class="text-sm text-gray-500">
          Signed up
          <TimeAgo date={item.createdAt} />
        </div>
      </div>
    </div>
  </td>
  <td class="px-7 py-4 whitespace-nowrap">
    <LocationAgentIcons
      browserHref={`/admin/leads?q=${encodeURIComponent(`browser: contains ${(item.browser || '').split(' ')[0]}`)}`}
      operatingSystemHref={`/admin/leads?q=${encodeURIComponent(`operatingSystem: contains ${(item.operatingSystem || '').split(' ')[0]}`)}`}
      countryCodeHref={`/admin/leads?q=${encodeURIComponent(`countryCode: ${item.countryCode}`)}`}
      {item} />
  </td>
  <td class="px-7 py-4 whitespace-nowrap text-right text-sm font-medium">
    {#if can(`lead:write-info-${item[primaryKeyType]}`)}
      <EditButton on:click={() => (editActive = item)} />
    {/if}
    {#if can(`lead:write-info-${item[primaryKeyType]}`)}
      <DeleteButton on:click={() => (deleteActiveKey = item[primaryKeyType])} />
    {/if}
  </td>
</DataTable>

{#if deleteActiveKey}
  <DeleteModal
    title="Delete lead"
    text="Are you sure you want to permanently delete this lead?"
    onClose={() => (deleteActiveKey = undefined)}
    url={`/leads/${deleteActiveKey}`}
    onSuccess={() => {
      data = data.filter((i) => i[primaryKeyType] !== deleteActiveKey);
      deleteActiveKey = undefined;
    }} />
{/if}

{#if editActive}
  <Modal onClose={() => (editActive = undefined)}>
    <Form
      title="Edit lead"
      items={[{ name: 'name', label: 'Name' }, { name: 'email', label: 'Email', type: 'email' }]}
      values={editActive}
      onSubmit={edit}
      submitText="Save lead"
      onClose={() => (editActive = undefined)}
      modal={true} />
  </Modal>
{/if}
