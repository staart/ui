<template>
  <main>
    <Manage>
      <h2>Export data</h2>
      <p>
        You can download an export of your data in JSON format. This will help
        you keep track of what we have and transfer your settings to other apps.
      </p>
      <Loading v-if="isDownloading" message="Generating your export" />
      <form v-else @submit.prevent="exportData">
        <button class="button">
          Export all data
        </button>
      </form>
      <h2>Delete organization</h2>
      <p>
        You can delete your organization. Note that this action is not
        reversible, and all your data will be permanently lost. If you ever
        change your mind, you'll have to create a new team and invite all
        members again.
      </p>
      <Loading v-if="isDeleting" message="Deleting your organization" />
      <form v-else @submit.prevent="showDelete = true">
        <button class="button button--color-danger">
          Delete organization
        </button>
      </form>
      <h2>Data Protection Officer</h2>
      <p>
        If you have any questions or concerns about your data or our security
        measures, you can get in touch with our Data Protection Officer.
      </p>
    </Manage>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = false)">
        <h2>
          Are you sure you want to delete {{ organization.organization.name }}?
        </h2>
        <p>
          Deleting an organization is not reversible, and all members will be
          removed.
        </p>
        <form @submit.prevent="deleteAccount">
          <Input
            :value="deleteText"
            label='To confirm, enter "delete organization" below'
            placeholder="Write those exact words"
            required
            @input="val => (deleteText = val)"
          />
          <button class="button button--color-danger-cta">
            Yes, delete organization
          </button>
          <button type="button" class="button" @click="showDelete = false">
            No, don't delete
          </button>
        </form>
      </Confirm>
    </transition>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Manage from "@/components/Manage.vue";
import Loading from "@/components/Loading.vue";
import Confirm from "@/components/Confirm.vue";
import Input from "@/components/form/Input.vue";

@Component({
  components: {
    Manage,
    Loading,
    Confirm,
    Input
  },
  computed: mapGetters({
    isDownloading: "manage/isDownloading",
    organization: "auth/activeOrganization"
  })
})
export default class AccountManage extends Vue {
  loading = "";
  deleteText = "";
  isDownloading!: boolean;
  organization!: any;
  showDelete = false;
  isDeleting = false;

  private exportData() {
    this.$store.dispatch("manage/getExport");
  }

  private deleteAccount() {
    if (this.deleteText !== "delete organization") return;
    this.showDelete = false;
    this.isDeleting = true;
    this.$store
      .dispatch("manage/deleteOrganization")
      .then(() => {
        this.$router.push("/settings/organizations");
      })
      .catch(error => {
        throw new Error(error);
      })
      .then(() => (this.isDeleting = false));
  }
}
</script>

<style lang="scss" scoped></style>
