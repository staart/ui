<template>
  <main>
    <div class="row">
      <h1>Users</h1>
      <div class="text text--align-right">
        <button
          aria-label="Refresh"
          data-balloon-pos="down"
          class="button button--type-icon"
          @click="load"
        >
          <font-awesome-icon
            class="icon"
            icon="sync"
            :spin="!!loading"
            fixed-width
          />
        </button>
      </div>
    </div>
    <div v-if="users && users.data">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Joined</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users.data" :key="`${user.id}_${index}`">
            <td><User :user="user" /></td>
            <td><TimeAgo :date="user.createdAt" /></td>
            <td class="text text--align-right">
              <router-link
                :to="`/users/${user.username || user.id}/profile`"
                aria-label="View"
                data-balloon-pos="up"
                class="button button--type-icon"
              >
                <font-awesome-icon class="icon" icon="eye" fixed-width />
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination text text--align-center">
        <button
          v-if="users && users.hasMore"
          class="button"
          :disabled="loadingMore"
          @click="loadMore"
        >
          <span>Load more users</span>
          <font-awesome-icon
            v-if="!loadingMore"
            class="icon"
            icon="arrow-down"
          />
          <font-awesome-icon
            v-else
            class="icon icon--ml-2 icon--color-light"
            icon="sync"
            spin
          />
        </button>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowDown, faSync, faEye } from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import User from "@/components/User.vue";
import { emptyPagination } from "../../types/admin";
library.add(faArrowDown, faSync, faEye);

@Component({
  components: {
    Loading,
    TimeAgo,
    User,
    FontAwesomeIcon
  }
})
export default class AdminUsers extends Vue {
  users = emptyPagination;
  loading = "";
  loadingMore = false;

  private created() {
    this.users = { ...this.$store.getters["admin/users"]() };
  }

  private mounted() {
    this.load();
  }

  private load() {
    this.loading = "Loading your users";
    this.$store
      .dispatch("admin/getUsers", {})
      .then(users => {
        this.users = { ...users };
      })
      .catch(error => {
        throw new Error(error);
      })
      .then(() => (this.loading = ""));
  }

  private loadMore() {
    this.loadingMore = true;
    this.$store
      .dispatch("admin/getUsers", {
        start: this.$store.state.admin.users.next
      })
      .then(() => {
        this.users = {
          ...this.$store.getters["admin/users"]()
        };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loadingMore = false));
  }
}
</script>

<style lang="scss" scoped></style>
