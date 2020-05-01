<template>
  <div>
    <h1 class="is-size-4">Team members</h1>
    <b-table
      :loading="loading"
      :data="members.data"
      default-sort-direction="asc"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <template slot-scope="props">
        <b-table-column sortable field="member" label="Name">
          {{ props.row.user.name }}
        </b-table-column>
        <b-table-column sortable field="role" label="Role">
          <b-select
            :value="props.row.role"
            @input="(val) => updateRole(props.row.id, val)"
            :loading="loadingId === props.row.id"
            placeholder="Update role"
          >
            <option value="OWNER">Owner</option>
            <option value="ADMIN">Admin</option>
            <option value="MEMBER">Member</option>
          </b-select>
        </b-table-column>
        <b-table-column sortable field="createdAt" label="Added">
          {{ new Date(props.row.createdAt).toLocaleDateString() }}
        </b-table-column>
        <b-table-column class="has-text-right">
          <b-tooltip label="Remove">
            <b-button
              type="is-danger"
              icon-right="delete"
              @click="deleteMember(props.row.id, props.row.user.name)"
            />
          </b-tooltip>
        </b-table-column>
      </template>
    </b-table>
    <div class="has-text-centered">
      <b-button
        v-if="members.hasMore"
        @click="get"
        icon-right="arrow-down"
        :loading="loading"
      >
        Load more members
      </b-button>
    </div>
    <h2 class="is-size-5" style="margin-top: 1rem">Add member</h2>
    <form @submit.prevent="add" style="margin-top: 0.5rem">
      <div class="columns">
        <div class="column">
          <b-field label="Name">
            <b-input type="text" v-model="newMemberName" required />
          </b-field>
        </div>
        <div class="column">
          <b-field label="Email">
            <b-input type="email" v-model="newMemberEmail" required />
          </b-field>
        </div>
        <div class="column">
          <b-field label="Role">
            <b-select v-model="newMemberRole" expanded>
              <option value="OWNER">Owner</option>
              <option value="ADMIN">Admin</option>
              <option value="MEMBER">Member</option>
            </b-select>
          </b-field>
        </div>
      </div>
      <b-button type="is-primary" native-type="submit" :loading="loadingAdd">
        Invite member
      </b-button>
    </form>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { Vue, Component, Watch } from "vue-property-decorator";
import download from "js-file-download";

@Component({
  middleware: "authenticated",
  layout: "teams",
})
export default class UsersProfile extends Vue {
  loading = false;
  loadingAdd = false;
  loadingId = 0;
  team: any = {};
  members: any = { data: [] };
  newMemberName = "";
  newMemberEmail = "";
  newMemberRole = "MEMBER";

  async created() {
    return this.get();
  }

  async updateRole(id: number, role: string) {
    this.loadingId = id;
    try {
      const { data } = await this.$axios.patch(
        `/organizations/${this.$route.params.username}/memberships/${id}`,
        {
          role,
        }
      );
    } catch (error) {
      this.members.data = [];
      this.get();
    }
    this.loadingId = 0;
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/organizations/${
          this.$route.params.username
        }/memberships?first=10&include=user${
          this.members.data.length
            ? `&after=${this.members.data[this.members.data.length - 1].id}`
            : ""
        }`
      );
      this.members.data.push(...(data.data || []));
      this.members.hasMore = data.hasMore;
      this.members = data;
    } catch (error) {}
    this.loading = false;
  }

  async add() {
    this.loadingAdd = true;
    try {
      const { data } = await this.$axios.put(
        `/organizations/${this.$route.params.username}/memberships`,
        {
          name: this.newMemberName,
          email: this.newMemberEmail,
          role: this.newMemberRole,
        }
      );
      this.members.data.push(data.added);
      this.newMemberName = "";
      this.newMemberEmail = "";
      this.newMemberRole = "";
    } catch (error) {}
    this.loadingAdd = false;
  }

  async deleteMember(id: number, member: string) {
    this.$buefy.dialog.confirm({
      title: "Removing member",
      message: `Are you sure you want to remove <strong>${member}</strong> from this team? This action is not reversible, and you'll have to add them again if you change your mind.`,
      confirmText: "Yes, remove member",
      cancelText: "No, don't remove",
      type: "is-danger",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loading = true;
        try {
          await this.$axios.delete(
            `/organizations/${this.$route.params.username}/memberships/${id}`
          );
        } catch (error) {}
        return this.get();
      },
    });
  }

  async verifyMember(method: string, id: number, member: string) {
    this.loading = true;
    try {
      const { data } = await this.$axios.post(
        `/organizations/${this.$route.params.username}/memberships/${id}/verify`,
        {
          method,
        }
      );
      this.team = data.updated;
    } catch (error) {}
    this.loading = false;
  }
}
</script>
