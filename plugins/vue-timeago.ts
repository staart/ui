import Vue from "vue";
import VueTimeago from "vue-timeago";
import { distanceInWordsStrict } from "date-fns";

Vue.use(VueTimeago, {
  converter(date, locale, { includeSeconds, addSuffix = true }) {
    return distanceInWordsStrict(Date.now(), date, {
      locale,
      addSuffix
    });
  }
});
