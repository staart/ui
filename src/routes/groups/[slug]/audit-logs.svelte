<script lang="ts">
  import { stores } from "@sapper/app";
  import type { AuditLog } from "@koj/types";
  import { saveAs } from "file-saver";
  import DataTable from "../../../components/DataTable.svelte";
  import LocationAgentIcons from "../../../components/LocationAgentIcons.svelte";
  import UserRecord from "../../../components/Table/UserRecord.svelte";
  import DownloadButton from "../../../components/Table/DownloadButton.svelte";
  import TimeAgo from "../../../components/TimeAgo.svelte";

  const { page } = stores();
  const { slug } = $page.params;
  const primaryKeyType = "id";
  let data: AuditLog[] = [];

  const download = (record: AuditLog) =>
    saveAs(new Blob([JSON.stringify(record, null, 2)]), `audit-log-${record.id}.json`);
</script>

<svelte:head>
  <title>Audit logs</title>
</svelte:head>

<DataTable
  let:item
  {data}
  title="Audit logs"
  titleKey="event"
  itemName="audit logs"
  text="These audit logs offer detailed insights into user-made changes. Audit logs are auto-deleted after 90 days."
  endpoint={`/groups/${slug}/audit-logs`}
  headers={['Date', 'User', 'Event', 'Device']}
  onData={(val) => (data = val)}
  {primaryKeyType}
  filters={[{ name: primaryKeyType, title: 'ID', type: 'int' }, { name: 'event', title: 'Event', type: 'string' }, { name: 'rawEvent', title: 'Event type', type: 'string' }, { name: 'groupId', title: 'Group ID', type: 'int' }, { name: 'userId', title: 'User ID', type: 'int' }, { name: 'ipAddress', title: 'IP address', type: 'string' }, { name: 'userAgent', title: 'User agent', type: 'string' }, { name: 'browser', title: 'Browser', type: 'string' }, { name: 'operatingSystem', title: 'Operating system', type: 'string' }, { name: 'city', title: 'City', type: 'string' }, { name: 'region', title: 'Region', type: 'string' }, { name: 'countryCode', title: 'Country code', type: 'string' }, { name: 'createdAt', title: 'Created at', type: 'datetime' }, { name: 'updatedAt', title: 'Updated at', type: 'datetime' }]}>
  <td class="px-7 py-4 whitespace-nowrap text-sm text-gray-500">
    <TimeAgo date={item.createdAt} />
  </td>
  <td class="px-7 py-4 whitespace-nowrap text-sm">
    {#if item.user}
      <UserRecord item={item.user} iconOnly={true} />
    {/if}
  </td>
  <td class="px-7 py-4 whitespace-nowrap text-sm">
    <div class="font-medium">
      <a
        href={`/admin/audit-logs?q=${encodeURIComponent(`event: ${item.event}`)}`}><code>{item.event}</code></a>
    </div>
    <div class="text-gray-500 mt-1">
      {#if item.groupId}
        <div>
          Group
          <a
            class="text-indigo-600"
            aria-label={item.group ? item.group.name : undefined}
            data-balloon-pos={item.group ? 'up' : undefined}
            href={`/groups/${item.groupId}/details`}>#{item.groupId}</a>
        </div>
      {/if}
    </div>
  </td>
  <td class="px-7 py-4 whitespace-nowrap text-sm">
    <LocationAgentIcons
      browserHref={`/admin/audit-logs?q=${encodeURIComponent(`browser: contains ${(item.browser || '').split(' ')[0]}`)}`}
      operatingSystemHref={`/admin/audit-logs?q=${encodeURIComponent(`operatingSystem: contains ${(item.operatingSystem || '').split(' ')[0]}`)}`}
      countryCodeHref={`/admin/audit-logs?q=${encodeURIComponent(`countryCode: ${item.countryCode}`)}`}
      {item} />
  </td>
  <td class="px-7 py-4 whitespace-nowrap text-right">
    <DownloadButton on:click={() => download(item)} />
  </td>
</DataTable>
