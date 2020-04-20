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
                  <b-input type="email" required />
                </b-field>
                <b-field label="Password">
                  <b-input type="password" password-reveal />
                </b-field>
                <b-button type="is-primary" native-type="submit"
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
  async login() {
    console.log(this);
  }
}
</script>
