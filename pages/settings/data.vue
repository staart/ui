<template>
  <main>
    <Settings>
      <h1>Data &amp; privacy</h1>
      <p>
        You can download an export of your data in JSON format. This will help
        you keep track of what we have and transfer your settings to other apps.
      </p>
      <form>
        <button class="button button--color-primary">
          Export my data
        </button>
      </form>
      <h2>Delete account</h2>
      <p>
        You can delete your Staart account. Note that this action is not
        reversable, and all your data will be permanently lost. If you ever
        change your mind, you'll have to create a new account.
      </p>
      <form>
        <Input
          :value="deleteText"
          label='To confirm, enter "delete my account" below'
          placeholder="Write those exact words"
          required
          @input="val => (deleteText = val)"
        />
        <button class="button button--color-danger">
          Delete my account
        </button>
      </form>
      <h2>Data Protection Officer</h2>
      <p>
        If you have any questions or concerns about your data or our security
        measures, you can get in touch with our Data Protection Officer.
      </p>
    </Settings>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Settings from "@/components/Settings.vue";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";

@Component({
  components: {
    Settings,
    Loading,
    Input
  }
})
export default class AccountSettings extends Vue {
  loading = "";
  deleteText = "";
}
</script>

<style lang="scss" scoped></style>
