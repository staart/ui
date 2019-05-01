<template>
  <main class="container container--size-small container--top-20height">
    <Card>
      <h1>Login</h1>
      <form>
        <Input
          v-model="email"
          type="email"
          label="Email"
          placeholder="Enter your work email"
          autocomplete="username"
          required
        />
        <Input
          v-model="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          autocomplete="current-password"
          required
        />
        <button
          class="button button--width-full button--size-large button--color-primary"
          type="submit"
        >
          Login to your account
        </button>
      </form>
    </Card>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Card from "~/components/Card";
import Input from "~/components/form/Input";

@Component({
  components: {
    Card,
    Input
  }
})
export default class Login extends Vue {
  email = "";
  password = "";
}
</script>
