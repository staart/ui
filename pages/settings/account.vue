<template>
  <main>
    <Settings>
      <h1>Account</h1>
      <Loading v-if="loading" :message="loading" />
      <form v-else>
        <Input label="Name" placeholder="Enter your full name" required />
        <Select
          v-model="countryCode"
          label="Country"
          placeholder="Select your country"
          :options="countries"
          required
        />
        <button type="submit" class="button button--color-primary">
          Update account settings
        </button>
      </form>
    </Settings>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { getCodeList } from "country-list";
import Settings from "@/components/Settings.vue";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";

@Component({
  components: {
    Settings,
    Loading,
    Input,
    Select
  }
})
export default class AccountSettings extends Vue {
  loading = "";
  countries = getCodeList();
  countryCode = "";
}
</script>

<style lang="scss" scoped></style>
