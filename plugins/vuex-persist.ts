import VuexPersist from "vuex-persist";

export default ({ store }) => {
  return new VuexPersist({
    filter: mutation => {
      if (mutation.type.toLowerCase().includes("loading")) return false;
      return true;
    }
  }).plugin(store);
};
