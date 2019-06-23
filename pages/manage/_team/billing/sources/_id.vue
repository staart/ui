<template>
  <main>
    <Loading v-if="loading" :message="loading" />
    <div v-else>
      <h1>Source</h1>
      <LargeMessage
        v-if="!loading && !source"
        heading="Source not found"
        img="undraw_credit_card_payment_yb88.svg"
        text="We couldn't find this source for you."
      />
      <div v-else-if="source">
        <table class="table table--type-cols">
          <tbody>
            <tr>
              <td>Source #</td>
              <td>
                <code>{{ source.number }}</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Loading from "@/components/Loading.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { getAllCountries } from "countries-and-timezones";
import { User } from "@/types/auth";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";
import { sources } from "stripe";
import { Sources, emptyPagination } from "@/types/manage";
library.add(faCloudDownloadAlt);

@Component({
  components: {
    Loading,
    TimeAgo,
    Input,
    FontAwesomeIcon,
    Select,
    LargeMessage,
    Checkbox
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  source?: sources.ISource;
  loadingMore = false;
  loading = "";

  private created() {
    this.source = {
      ...this.$store.getters["manage/source"](
        this.$route.params.team,
        this.$route.params.id
      )
    };
  }

  private mounted() {
    this.loading = "Loading your source";
    this.$store
      .dispatch("manage/getSource", {
        team: this.$route.params.team,
        id: this.$route.params.id
      })
      .then(source => {
        this.source = { ...source };
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }
}
</script>
