<template>
  <div class="notifs">
    <p v-if="!notifications.length" class="text text--align-center">
      You don't have any notifications.
    </p>
    <div v-else>
      <a
        v-for="(notification, index) in notifications"
        :key="`notif_${notification.id}_${index}`"
        :href="notification.link"
        :class="
          `notification notification--type-${
            notification.isRead ? 'read' : 'unread'
          }`
        "
        @click.prevent="readNotification(notification)"
      >
        <span>{{ notification.text }}</span>
        <time class="text text--color-light"
          ><TimeAgo :date="notification.createdAt"
        /></time>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
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
  notifications!: any;
  count = 0;
  @Prop() onCount;
  @Watch("notifications")
  onNotifications() {
    this.count = this.notifications.filter(
      notification => !notification.isRead
    ).length;
    if (typeof this.onCount === "function") this.onCount(this.count);
  }
  private readNotification(notification: any) {
    if (!notification.isRead)
      this.$store.dispatch("auth/readNotification", notification.id);
    this.$router.push(notification.link);
  }
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
.notification--type-read {
  opacity: 0.5;
}
</style>
