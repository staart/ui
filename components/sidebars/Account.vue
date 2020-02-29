<template>
  <nav>
    <nuxt-link :to="`/users/${$route.params.team}/account/profile`">
      Profile
    </nuxt-link>
    <nuxt-link :to="`/users/${$route.params.team}/account/emails`">
      Emails
    </nuxt-link>
    <nuxt-link :to="`/users/${$route.params.team}/account/password`">
      Password
    </nuxt-link>
    <nuxt-link :to="`/users/${$route.params.team}/account/identities`">
      Identities
    </nuxt-link>
    <nuxt-link :to="`/users/${$route.params.team}/account/sessions`">
      Sessions
    </nuxt-link>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Profile extends Vue {}
</script>
