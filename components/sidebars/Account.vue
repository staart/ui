<template>
  <nav>
    <nuxt-link :to="`/users/${$route.params.slug}/account/profile`">
      Profile
    </nuxt-link>
    <nuxt-link :to="`/users/${$route.params.slug}/account/emails`">
      Emails
    </nuxt-link>
    <nuxt-link :to="`/users/${$route.params.slug}/account/password`">
      Password
    </nuxt-link>
    <nuxt-link :to="`/users/${$route.params.slug}/account/identities`">
      Identities
    </nuxt-link>
    <nuxt-link :to="`/users/${$route.params.slug}/account/sessions`">
      Sessions
    </nuxt-link>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Profile extends Vue {}
</script>
