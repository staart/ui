import Vue from "vue";
import { NuxtAxiosInstance } from "@nuxtjs/axios";

const messages = {
  "user-not-found": "We couldn't find a user with this email",
  "missing-field": "Make sure you've entered all required fields",
  "unverified-email": "This email has not been verified yet"
};

export default function({
  $axios,
  redirect
}: {
  $axios: NuxtAxiosInstance;
  redirect: any;
}) {
  $axios.onError(error => {
    if (!error.response) return;
    if (Object.keys(messages).includes(error.response.data.error)) {
      Vue.notify({
        group: "auth",
        text: messages[error.response.data.error],
        duration: 5000,
        type: "notification notification--color-danger"
      });
    } else {
      Vue.notify({
        group: "auth",
        text: error.response.data.error,
        type: "notification notification--color-danger"
      });
    }
  });
}
