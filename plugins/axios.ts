import Vue from "vue";
import { NuxtAxiosInstance } from "@nuxtjs/axios";
import en from "@/locales/en";
const messages = en.errors;

const redirectErrors = ["unapproved-location", "1-missing-token"];

export default function({
  $axios,
  redirect
}: {
  $axios: NuxtAxiosInstance;
  redirect: any;
}) {
  $axios.onResponse(response => {
    if (response.data.success === true) {
      Vue.notify({
        group: "auth",
        text: "Your changes were successfully saved",
        type: "notification notification--color-success"
      });
    }
  });
  $axios.onError(error => {
    if (!error.response) return;
    if (
      redirectErrors.includes(
        error.response.data.code || error.response.data.error
      )
    ) {
      return redirect(
        `/errors/${error.response.data.code || error.response.data.error}`
      );
    } else if (
      Object.keys(messages).includes(
        error.response.data.code || error.response.data.error
      )
    ) {
      Vue.notify({
        group: "auth",
        text: messages[error.response.data.code || error.response.data.error],
        duration: 5000,
        type: "notification notification--color-danger"
      });
    } else {
      Vue.notify({
        group: "auth",
        text: error.response.data.code || error.response.data.error,
        type: "notification notification--color-danger"
      });
    }
  });
}
