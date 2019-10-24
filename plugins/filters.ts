import Vue from "vue";
Vue.filter("currency", (value: number) =>
  ((value || 0) / 100).toLocaleString()
);

Vue.filter("number", (data: any) => {
  if (typeof data === "string") data = parseInt(data);
  if (!isNaN(data)) return data.toLocaleString();
});
