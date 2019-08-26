<template>
  <router-link
    :to="`/manage/${team.username || team.id}/settings`"
    class="team"
  >
    <div
      class="avatar"
      :style="`background-image: url('${team.profilePicture}')`"
    />
    <div>
      <span>{{ team.name }}</span>
    </div>
  </router-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component
export default class User extends Vue {
  self!: any;
  @Prop({
    default: () => {
      return {};
    }
  })
  team;
}
</script>

<style lang="scss" scoped>
.team {
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
