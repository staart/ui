<template>
  <main class="text text--align-center">
    <Loading
      v-if="loading"
      class="container--top-20height"
      message="Setting up your account"
    />
    <div
      v-else
      class="container container--size-medium container--top-20height container--bottom-20height"
    >
      <h1>👋 Hi {{ user.nickname || "there" }}, do you have a team?</h1>
      <form
        v-meta-ctrl-enter="setupTeam"
        class="row"
        @submit.prevent="setupTeam"
      >
        <div class="card card--type-padded">
          <div class="emoji">👨‍👩‍👦‍👦</div>
          <h2>Yes, I have a team</h2>
          <p>If you have a team, you can invite them in the next step.</p>
          <div>
            <Input
              v-model="teamName"
              type="text"
              label="Team name"
              placeholder="Enter your team name"
            />
            <button class="button button--color-primary">
              <span>Setup team account &rarr;</span>
            </button>
          </div>
        </div>
        <div class="card card--type-padded">
          <div class="emoji">👩‍🚀</div>
          <h2>No, I'm flying solo</h2>
          <p>
            We'll set up a one person team account for you for now. You can
            invite others as you grow.
          </p>
          <div>
            <button class="button button--color-secondary">
              <span>Setup individual account &rarr;</span>
            </button>
          </div>
        </div>
      </form>
      <p class="section section--mt-2">
        <a href="#">Want to join an existing team?</a>
      </p>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";

@Component({
  computed: mapGetters({
    user: "auth/user"
  }),
  components: {
    Input,
    Loading
  },
  middleware: "auth"
})
export default class OnboardingTeam extends Vue {
  teamName = "";
  user!: any;
  loading = false;
  private mounted() {
    if (this.user && this.user.nickname)
      this.teamName = `${this.user.nickname}'s team`;
  }
  private setupTeam() {
    this.teamName = this.teamName || `${this.user.nickname}'s team`;
    this.loading = true;
    this.$store
      .dispatch("settings/createOrganization", {
        name: this.teamName
      })
      .then(() => {
        this.$router.push("/dashboard");
      })
      .catch(() => {})
      .finally(() => (this.loading = false));
  }
}
</script>

<style lang="scss" scoped>
.emoji {
  font-size: 400%;
  line-height: 1;
  + h2 {
    margin-top: 1rem;
  }
}
</style>
