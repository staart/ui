<template>
  <nav>
    <nuxt-link :to="`/teams/${$route.params.team}/billing/details`">
      Billing details
    </nuxt-link>
    <nuxt-link :to="`/teams/${$route.params.team}/billing/subscription`">
      Subscription
    </nuxt-link>
    <nuxt-link :to="`/teams/${$route.params.team}/billing/sources`">
      Payment methods
    </nuxt-link>
    <nuxt-link :to="`/teams/${$route.params.team}/billing/invoices`">
      Invoices
    </nuxt-link>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Billing extends Vue {}
</script>
