import VuexPersist from "vuex-persist";
import { RootState } from "../types/auth";

export default ({ store }) => {
  return new VuexPersist({
    key: "staart-state",
    // reducer: (state: { auth: RootState }) => ({ auth: state.auth }),
    filter: mutation => {
      if (mutation.type.toLowerCase().includes("loading")) return false;
      return true;
    }
  }).plugin(store);
};
