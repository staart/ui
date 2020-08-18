<template>
  <section class="section">
    <b-loading :is-full-page="true" :active="true" />
  </section>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { User } from "../store/auth";
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  middleware: "authenticated",
  computed: mapGetters({
    user: "auth/user",
  }),
})
export default class Homepage extends Vue {
  user!: User;

  async mounted() {
    const memberships = this.user.memberships?.data || [];
    if (memberships.length) {
      return this.$router.replace(`/teams/${memberships[0].groupId}`);
    } else {
      try {
        const memberships = (await this.$axios.get("/users/me/memberships"))
          .data;
        if (memberships.length)
          return this.$router.replace(`/teams/${memberships[0].groupId}`);
      } catch (error) {}
      return this.$router.replace("/onboarding/user");
    }
  }
}
</script>
