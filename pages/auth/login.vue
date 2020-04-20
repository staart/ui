<template>
  <div class="container">
    <div class="columns is-centered">
      <div class="column is-one-third">
        <div class="card" style="margin: 7.5vw 0">
          <div class="card-content">
            <h1 class="title is-4">Login</h1>
            <div class="content">
              <form @submit.prevent="login">
                <b-field label="Email">
                  <b-input v-model="email" type="email" required />
                </b-field>
                <b-field label="Password">
                  <b-input v-model="password" type="password" password-reveal />
                </b-field>
                <b-button
                  type="is-primary"
                  native-type="submit"
                  :loading="loading"
                  >Login to your account</b-button
                >
              </form>
              <p style="margin-top: 1rem">
                <a href="#">Forgot your password?</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class Login extends Vue {
  email = "";
  password = "";
  loading = false;

  async login() {
    if (this.loading) return;
    this.loading = true;
    try {
      const { data }: { data: any } = await this.$axios.post("/auth/login", {
        email: this.email,
        password: this.password
      });
      const result = await this.$store.dispatch("auth/setAuthTokens", data);
      this.$router.replace(result === "2fa" ? "/auth/2fa" : "/");
    } catch (error) {
      this.$buefy.toast.open({
        message: error.response.data.error,
        type: "is-danger"
      });
    }
    this.loading = false;
    this.email = "";
    this.password = "";
  }
}
</script>
