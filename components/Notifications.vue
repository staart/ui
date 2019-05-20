<template>
  <div class="notifs">
    <p v-if="!notifications.length" class="text text--align-center">
      You don't have any notifications.
    </p>
    {{ notifications }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { mapGetters } from "vuex";
import LargeMessage from "@/components/LargeMessage.vue";

@Component({
  computed: mapGetters({
    self: "auth/user",
    notifications: "auth/notifications"
  }),
  components: {
    LargeMessage
  }
})
export default class Notifications extends Vue {
  self!: any;
  private created() {
    this.$store.dispatch("auth/getNotifications");
  }
}
</script>

<style lang="scss" scoped></style>
