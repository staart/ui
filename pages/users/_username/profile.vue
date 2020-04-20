<template>
  <div>
    <h1 class="is-size-4">Account settings</h1>
    <form style="margin-top: 1rem">
      <b-field label="Name">
        <b-input type="text" v-model="user.name" size="is-medium" required />
      </b-field>
      <div class="columns">
        <div class="column">
          <b-field label="Username">
            <b-input
              type="text"
              v-model="user.username"
              size="is-medium"
              required
            />
          </b-field>
        </div>
        <div class="column">
          <b-field>
            <template slot="label">
              Nickname
              <b-tooltip type="is-dark" label="We'll call you by your nickname">
                <b-icon size="is-small" icon="help-circle-outline"></b-icon>
              </b-tooltip>
            </template>
            <b-input
              type="text"
              v-model="user.nickname"
              size="is-medium"
              required
            />
          </b-field>
        </div>
      </div>
      <b-button type="is-primary" native-type="submit">
        Update settings
      </b-button>
      <b-loading :is-full-page="false" :active.sync="loading"></b-loading>
    </form>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import Component from "vue-class-component";

@Component({
  middleware: "authenticated",
  layout: "users"
})
export default class UsersProfile extends Vue {
  loading = false;
  user: any = {};

  async created() {
    this.loading = true;
    const { data }: { data: any } = await this.$axios.get(
      `/users/${this.$route.params.username}`
    );
    this.user = data;
    this.loading = false;
  }
}
</script>
