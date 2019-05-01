import VuexPersist from "vuex-persist";

export default ({ store }) => {
  return new VuexPersist().plugin(store);
}
