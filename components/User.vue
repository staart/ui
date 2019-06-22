<template>
  <div class="user">
    <div
      class="avatar"
      :style="`background-image: url('${user.profilePicture}')`"
    />
    <div>
      <span>{{ user.name }}</span>
      <span
        v-if="self.id === user.id"
        class="text text--color-light text--type-you"
        >You</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: mapGetters({
    self: "auth/user"
  })
})
export default class User extends Vue {
  self!: any;
  @Prop({ default: {} }) user;
}
</script>

<style lang="scss" scoped>
.user {
  display: inline-block;
  > * {
    display: inline-block;
  }
}
.text--type-you {
  margin-left: 0.5rem;
}
.avatar {
  background-color: #aaa;
  margin: -1.2rem 0.5rem -1rem 0;
  width: 2.5rem;
  height: 2.5rem;
  vertical-align: middle;
  border-radius: 100%;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
