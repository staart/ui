import Vue from "vue";
import VueTimeago from "vue-timeago";
import { formatDistanceStrict, Locale } from "date-fns";

Vue.use(VueTimeago, {
  converter(date: Date | number, locale: Locale, { addSuffix = true }) {
    return formatDistanceStrict(Date.now(), date, {
      locale,
      addSuffix
    });
  }
});
