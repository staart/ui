import { NuxtAxiosInstance } from "@nuxtjs/axios";

export default function({
  $axios,
  redirect
}: {
  $axios: NuxtAxiosInstance;
  redirect: any;
}) {
  $axios.onError(error => {
    console.log("Axios global error handler", error);
  });
}
