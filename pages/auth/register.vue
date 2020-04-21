<template>
  <div class="container">
    <div class="columns is-centered">
      <div class="column is-one-third">
        <div class="card" style="margin: 7.5vw 0">
          <div class="card-content">
            <h1 class="title is-4">Register</h1>
            <div class="content">
              <form @submit.prevent="login">
                <b-field label="Name">
                  <b-input v-model="name" type="text" required />
                </b-field>
                <b-field label="Email">
                  <b-input v-model="email" type="email" required />
                </b-field>
                <b-field v-show="!hasPasswordless" label="Password">
                  <b-input v-model="password" type="password" password-reveal />
                </b-field>
                <b-field>
                  <b-checkbox v-model="hasPasswordless">
                    Use passwordless login
                  </b-checkbox>
                </b-field>
                <b-field>
                  <b-checkbox v-model="hasInviteCode">
                    I have an invitation code
                  </b-checkbox>
                </b-field>
                <b-field v-show="hasInviteCode" label="Invitation code">
                  <b-input v-model="invitedByUser" type="text" />
                </b-field>
                <b-button
                  type="is-primary"
                  native-type="submit"
                  :loading="loading"
                >
                  Create an account
                </b-button>
              </form>
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

@Component({
  middleware: "unauthenticated"
})
export default class Login extends Vue {
  name = "";
  email = "";
  password = "";
  invitedByUser = "";

  loading = false;
  hasPasswordless = false;
  hasInviteCode = false;

  async login() {
    if (this.loading) return;
    this.loading = true;
    try {
      await this.$axios.post("/auth/register", {
        name: this.name,
        email: this.email,
        password: this.password ? this.password : undefined,
        invitedByUser: this.invitedByUser ? this.invitedByUser : undefined
      });
    } catch (error) {
      this.$buefy.toast.open({
        message: error?.response?.data?.error,
        type: "is-danger"
      });
    }
    this.loading = false;
    this.email = "";
    this.password = "";
  }
}
</script>
