<template>
  <nav>
    <nuxt-link :to="`/teams/${$route.params.team}/developer/api-keys`">
      API keys
    </nuxt-link>
    <nuxt-link :to="`/teams/${$route.params.team}/developer/webhooks`">
      Webhooks
    </nuxt-link>
    <nuxt-link :to="`/teams/${$route.params.team}/developer/logs`">
      Logs
    </nuxt-link>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Developer extends Vue {}
</script>
