<template>
  <div class="notifs">
    <p v-if="!notifications.length" class="text text--align-center">
      You don't have any notifications.
    </p>
    <div v-else>
      <nuxt-link
        v-for="(notification, index) in notifications"
        :key="`notif_${notification.id}_${index}`"
        :class="
          `notification notification--type-${
            notification.isRead ? 'read' : 'unread'
          }`
        "
        :to="notification.link"
      >
        <span>{{ notification.text }}</span>
        <time class="text text--color-light"
          ><TimeAgo :date="notification.createdAt"
        /></time>
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { mapGetters } from "vuex";
import LargeMessage from "@/components/LargeMessage.vue";
import TimeAgo from "@/components/TimeAgo.vue";

@Component({
  computed: mapGetters({
    self: "auth/user",
    notifications: "auth/notifications"
  }),
  components: {
    TimeAgo,
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

<style lang="scss" scoped>
.notifs {
  margin: -0.5rem 0;
  max-height: 400px;
  overflow: auto;
}
.notification {
  display: block;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  color: inherit;
  &:last-child {
    border-bottom: 0;
  }
  &:hover {
    text-decoration: none;
  }
  time,
  span {
    display: block;
  }
  time {
    font-size: 90%;
  }
}
</style>
