<template>
  <main>
    <div class="row">
      <h1>Settings</h1>
      <div class="text text--align-right">
        <button
          aria-label="Refresh"
          data-balloon-pos="down"
          class="button button--type-icon"
          @click="load"
        >
          <font-awesome-icon
            title="Refresh"
            class="icon"
            icon="sync"
            fixed-width
          />
        </button>
      </div>
    </div>
    <Loading v-if="loading" :message="loading" />
    <form v-else v-meta-ctrl-enter="save" @submit.prevent="save">
      <Input
        :value="user.name"
        label="Name"
        placeholder="Enter your user's name"
        required
        @input="val => (user.name = val)"
      />
      <Input
        :value="user.username"
        label="Username"
        placeholder="Enter a unique username"
        help="Changing your username can have unintended side effects"
        @input="val => (user.username = val)"
      />
      <button class="button">
        Update profile
      </button>
    </form>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { getAllCountries } from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import ImageInput from "@/components/form/Image.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import { UsersKV, User, emptyUser } from "@/types/users";
library.add(faSync);

@Component({
  components: {
    Loading,
    Input,
    FontAwesomeIcon,
    Select,
    ImageInput,
    Checkbox
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  loading = "";
  user: User = emptyUser;

  private created() {
    this.user = {
      ...this.$store.getters["users/user"](this.$route.params.slug)
    };
  }

  private load() {
    this.loading = "Loading user details";
    this.$store
      .dispatch("users/getUser", this.$route.params.slug)
      .then(user => {
        this.user = { ...user };
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private mounted() {
    this.load();
  }

  private save() {
    this.loading = "Saving";
    const user = { ...this.user };
    delete user.role;
    this.$store
      .dispatch("users/updateUser", {
        slug: this.$route.params.slug,
        ...user
      })
      .then(user => {
        this.user = { ...user };
        this.$router.replace(`/users/${this.user.username}/profile`);
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped></style>
