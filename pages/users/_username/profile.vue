<template>
  <div>
    <h1>Profile</h1>
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
export default class UsersProfile extends Vue {}
</script>
