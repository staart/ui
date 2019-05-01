import Vue from "vue";
import { NuxtAxiosInstance } from "@nuxtjs/axios";

export default function({
  $axios,
  redirect
}: {
  $axios: NuxtAxiosInstance;
  redirect: any;
}) {
  $axios.onError(error => {
    // console.log("Axios global error handler", error);
    if (error.response.data.error === "user-not-found") {
      Vue.notify({
        group: "auth",
        text: "We couldn't find a user with this email",
        duration: 5000,
        type: "notification notification--color-danger"
      });
    }
  });
}
