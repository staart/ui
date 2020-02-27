<template>
  <main>
    <Loading v-if="loading" :message="loading" />
    <div v-else-if="domain">
      <div class="row">
        <div>
          <nuxt-link
            :to="`/manage/${$route.params.team}/settings`"
            aria-label="Back"
            data-balloon-pos="down"
            class="button button--type-icon button--type-back"
          >
            <font-awesome-icon class="icon" icon="arrow-left" fixed-width />
          </nuxt-link>
          <h1>{{ domain.domain }}</h1>
        </div>
        <div class="text text--align-right">
          <button
            aria-label="Refresh"
            data-balloon-pos="down"
            class="button button--type-icon"
            @click="load"
          >
            <font-awesome-icon class="icon" icon="sync" fixed-width />
          </button>
        </div>
      </div>
      <div v-if="!domain.isVerified">
        <h2>Verify your domain</h2>
        <form @submit.prevent="verifyDomain">
          <div class="fake-radio-container">
            <label>
              <input
                v-model="verifyOption"
                type="radio"
                value="file"
                required
              />
              <span class="fake-radio" role="radio" tabindex="0" />
              Upload a file to your domain
            </label>
          </div>
          <div class="fake-radio-container">
            <label>
              <input v-model="verifyOption" type="radio" value="dns" required />
              <span class="fake-radio" role="radio" tabindex="0" />
              Add a DNS record to your domain
            </label>
          </div>
          <div v-if="hasError" style="margin-bottom: 2rem">
            <p>
              <strong>Error:</strong> We weren't able to verify your domain. If
              you've just added a DNS record, it may take up to 24 hours to
              propogate.
            </p>
          </div>
          <div v-if="verifyOption === 'file'" class="card card--type-padded">
            <h3>Steps to verify your domain</h3>
            <ol>
              <li>Download a text file by pressing the button below</li>
              <li>
                Create a folder in your domain root: <code>.well-known</code>
              </li>
              <li>Upload the file you just downloaded in that folder</li>
              <li>
                You should be able to access the file:
                <a
                  :href="
                    `http://${domain.domain}/.well-known/staart-verify.txt`
                  "
                  target="_blank"
                  >http://{{ domain.domain }}/.well-known/staart-verify.txt</a
                >
              </li>
              <li>
                Make sure the code in the file starts with
                <code>{{
                  (domain.verificationCode || "").substring(0, 24)
                }}</code
                >...
              </li>
            </ol>
            <button
              type="button"
              class="button button--color-info"
              @click="download"
            >
              Download file
            </button>
            <button class="button" style="margin-left: 0.5rem">
              Check verification
            </button>
          </div>
          <div
            v-else-if="verifyOption === 'dns'"
            class="card card--type-padded"
          >
            <h3>Steps to verify your domain</h3>
            <ol>
              <li>Go to your domain's DNS records page</li>
              <li>
                <span>Add a new record with the following details</span>
                <ol>
                  <li>For the record type, select <code>TXT</code></li>
                  <li>
                    In the Name/Host/Alias field, enter <code>@</code> or leave
                    it blank
                  </li>
                  <li>
                    In the Time to Live (TTL) field, enter <code>86400</code> or
                    leave the default.
                  </li>
                  <li>
                    In the Value/Answer/Destination field, enter
                    <code>{{ domain.verificationCode }}</code>
                  </li>
                </ol>
              </li>
              <li>Save the record</li>
            </ol>
            <button class="button">
              Check verification
            </button>
          </div>
        </form>
      </div>
      <LargeMessage
        v-else
        img="undraw_confirmation_2uy0.svg"
        heading="Domain verified"
        text="Nothing to do here, you've already verified your domain successfully"
      />
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { getAllCountries } from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTrash,
  faPencilAlt,
  faSync,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import download from "downloadjs";
import LargeMessage from "@/components/LargeMessage.vue";
import Loading from "@/components/Loading.vue";
import Country from "@/components/Country.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import { Domain } from "@/types/manage";
library.add(faTrash, faPencilAlt, faSync, faArrowLeft);

@Component({
  components: {
    Country,
    LargeMessage,
    TimeAgo,
    Loading,
    Input,
    Select,
    Checkbox,
    FontAwesomeIcon
  },
  computed: mapGetters({
    domains: "manage/domains"
  }),
  middleware: "auth"
})
export default class ManageMembers extends Vue {
  domains!: any;
  domain: Domain | null = null;
  loading = "";
  verifyOption = "file";
  hasError = false;

  private load() {
    this.loading = "Loading domain details";
    this.$store
      .dispatch("manage/getDomain", {
        team: this.$route.params.team,
        id: this.$route.params.id
      })
      .then(domain => {
        this.domain = domain;
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private mounted() {
    this.load();
  }

  private download() {
    if (!this.domain) return;
    download(this.domain.verificationCode, "staart-verify.txt", "text/plain");
  }

  private verifyDomain() {
    this.loading = "Verifying your domain";
    this.$store
      .dispatch("manage/verifyDomain", {
        team: this.$route.params.team,
        id: this.$route.params.id,
        method: this.verifyOption
      })
      .then(() => {
        this.$router.push(`/manage/${this.$route.params.team}/settings`);
      })
      .catch(() => {
        this.hasError = true;
      })
      .finally(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped>
.user-image {
  height: 2rem;
  border-radius: 100%;
  width: 2rem;
  vertical-align: middle;
  margin-right: 0.5rem;
}
</style>
