<script lang="ts">
  import { onMount } from "svelte";
  import { api } from "../../api";
  import Line from "svelte-chartjs/src/Line.svelte";

  let cpuMetrics: Record<string, number> = {};
  let memoryMetrics: Record<string, number> = {};

  onMount(async () => {
    return updateData();
  });

  let loading = false;
  const updateData = async () => {
    loading = true;
    const data = await api<{ date: string; cpu: number; memory: number }[]>({
      method: "GET",
      url: "/metrics/process",
    });
    data.forEach((i) => {
      cpuMetrics[new Date(i.date).toLocaleTimeString()] = i.cpu;
      memoryMetrics[new Date(i.date).toLocaleTimeString()] = Math.round(i.memory / 1000000);
    });
    loading = false;
  };

  const recordData = async () => {
    loading = true;
    await api<void>({ method: "POST", url: "/metrics/update" });
    return updateData();
  };
</script>

<svelte:head>
  <title>Metrics</title>
</svelte:head>

{#if loading}
  <div class="loading h-52 bg-gray-50" />
{/if}

<div class="p-7">
  <h1 class="text-2xl">Metrics</h1>
  <div>
    <button
      type="button"
      class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 transition motion-reduce:transition-none mr-3 mt-3"
      on:click={updateData}>
      <svg
        class="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
      <span>Refresh data</span>
    </button>
    <button
      type="button"
      class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 transition motion-reduce:transition-none mr-3 mt-3"
      on:click={recordData}>
      <svg
        class="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
      <span>Record new data</span>
    </button>
  </div>
  <h2 class="text-xl mt-5">CPU</h2>
  <Line
    data={{ labels: Object.keys(cpuMetrics), datasets: [{ label: 'CPU usage (%)', fill: true, backgroundColor: 'rgb(209, 250, 229)', borderColor: 'rgb(52, 211, 153)', data: Object.values(cpuMetrics) }] }}
    options={{ scales: { yAxes: [{ ticks: { suggestedMin: 0, suggestedMax: 100 } }] } }} />
  <h2 class="text-xl mt-7">Memory</h2>
  <Line
    data={{ labels: Object.keys(memoryMetrics), datasets: [{ label: 'Memory usage in MB', fill: true, backgroundColor: 'rgb(221, 214, 254)', borderColor: 'rgb(139, 92, 246)', data: Object.values(memoryMetrics) }] }}
    options={{ scales: { yAxes: [{ ticks: { suggestedMin: 0 } }] } }} />
</div>
