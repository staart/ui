import VuexPersist from "vuex-persist";

export default ({ store }: { store: any }) => {
  return new VuexPersist({
    key: "staart-state",
    filter: mutation => {
      if (mutation.type.toLowerCase().includes("loading")) return false;
      return true;
    }
  }).plugin(store);
};
