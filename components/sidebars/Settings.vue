<template>
  <nav>
    <nuxt-link :to="`/teams/${$route.params.team}/settings/general`">
      General
    </nuxt-link>
    <nuxt-link :to="`/teams/${$route.params.team}/settings/security`">
      Security
    </nuxt-link>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Settings extends Vue {}
</script>
