import Vue from "vue";
Vue.filter("currency", (value: number) =>
  ((value || 0) / 100).toLocaleString()
);
