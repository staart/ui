<template>
  <main
    class="container container--size-small container--top-20height container--bottom-20height"
  >
    <div class="card card--type-padded">
      <LargeMessage
        v-if="$route.params.message === 'unapproved-location'"
        heading="Verify new location"
        img="undraw_camping_2g8w.svg"
        text="It looks like you're logging in from a new location. Please click on the verification link sent to your email."
      />
      <LargeMessage
        v-else-if="$route.params.message === 'missing-token'"
        heading="You need to log in"
        text="It looks like the page you're trying to visit needs you to log in before showing you sensitive information."
        img="undraw_authentication_fsn5.svg"
        cta-text="Login to your account"
        cta-to="/auth/login"
      />
      <LargeMessage
        v-else-if="$route.params.message === 'user-deleted'"
        heading="Account has been deleted"
        text="This user account and all its related data has been successfully and permanently deleted."
        img="undraw_treasure_of9i.svg"
        cta-text="Go to the homepage"
        cta-to="/"
      />
      <LargeMessage
        v-else-if="
          $route.params.message === 'oauth' &&
            $route.query.error === '404/user-not-found'
        "
        heading="Wait, who are you?"
        text="We couldn't find an existing account with the email we found from this third-party service. Do you want to register instead?"
        cta-text="Create an account"
        img="undraw_cancel_u1it.svg"
        cta-to="/auth/register"
      />
      <LargeMessage
        v-else-if="$route.params.message === 'oauth'"
        heading="We couldn't log you in"
        text="We're not sure what happened, but we weren't able to log you with using a third-party service."
        cta-text="Try logging in again"
        img="undraw_cancel_u1it.svg"
        cta-to="/auth/login"
      />
      <LargeMessage
        v-else
        heading="An error ocurred"
        text="We're not sure what happened, but it doesn't look good. Perhaps you'll be more comfortable at home."
        cta-text="Go to the homepage"
        img="undraw_cancel_u1it.svg"
        cta-to="/"
      />
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LargeMessage from "@/components/LargeMessage.vue";

@Component({
  components: {
    LargeMessage
  }
})
export default class Errors extends Vue {
  private created() {
    const logOutOnError = ["missing-token"];
    if (logOutOnError.includes(this.$route.params.message)) {
      this.$store.dispatch("auth/logout");
    }
  }
}
</script>
