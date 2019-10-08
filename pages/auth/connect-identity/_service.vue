<template>
  <main
    class="container container--size-small container--top-20height container--bottom-20height"
  >
    <LargeMessage
      img="undraw_loading_frh4.svg"
      heading="Connecting your account"
      text="We're connecting your identity now, hold on a second"
    />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { User } from "../../../types/auth";
import Card from "@/components/Card.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";

@Component({
  components: {
    Card,
    LargeMessage,
    Input
  },
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated",
    user: "auth/user"
  })
})
export default class ConnectIdentity extends Vue {
  isAuthenticated!: boolean;
  user!: User;

  private async mounted() {
    const service = this.$route.params.service;
    const url = location.href.replace(
      "http://localhost:3000/",
      "https://staart-ui.o15y.now.sh/"
    );

    if (
      !this.isAuthenticated ||
      !(this.user && (this.user.username || this.user.id))
    )
      return this.$router.replace("/");

    try {
      const result = await this.$axios.post(
        `/users/${this.user.username || this.user.id}/identities/${service}`,
        { url }
      );
    } catch (error) {}

    this.$router.replace(
      `/users/${this.user.username || this.user.id}/login/identities`
    );
  }
}
</script>
