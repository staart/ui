import Vue from "vue";
import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { AxiosRequestConfig } from "axios";
import decode from "jwt-decode";

const redirectErrors = ["unapproved-location", "missing-token"];
const ignoredErrors = ["no-customer"];

export default function ({
  $axios,
  redirect,
  store,
}: {
  $axios: NuxtAxiosInstance;
  redirect: any;
  store: {
    state: {
      auth: any;
    };
    dispatch: any;
  };
}) {
  $axios.interceptors.request.use(
    (config: AxiosRequestConfig) =>
      new Promise((resolve, reject) => {
        // config.data = removeNulls(removeReadOnlyValues(config.data));
        $axios.setHeader("X-Requested-With", "XMLHttpRequest");

        // This is the Staart public API key
        $axios.setHeader(
          "X-Api-Key",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwib3JnYW5pemF0aW9uSWQiOjEsInJlZmVycmVyUmVzdHJpY3Rpb25zIjoic3RhYXJ0LWRlbW8ubzE1eS5jb20sbG9jYWxob3N0LG9zd2FsZGxhYnMuY29tLHN0YWFydC11aS5vMTV5Lm5vdy5zaCIsImlhdCI6MTU2ODM2MjM5MiwiZXhwIjo4ODQ2ODkxNzcwMTMyLCJpc3MiOiJzdGFhcnQiLCJzdWIiOiJhcGkta2V5IiwianRpIjoiZjE2MGRmMDg3NTkyIn0.pGv-H2a87RX5z_6U5ad07Rk7G4rr3W0hvX4BbC3Jg14"
        );
        try {
          const token = config.headers.common.Authorization.replace(
            "Bearer ",
            ""
          );
          if (decode(token).exp * 1000 < new Date().getTime()) {
            $axios.setHeader("Authorization", undefined);
            if (
              !store.state.auth.tokens.token ||
              !store.state.auth.tokens.refresh
            )
              return resolve(config);
            store
              .dispatch("auth/refresh")
              .then((newToken: string) => {
                config.headers = {
                  ...config.headers,
                  Authorization: `Bearer ${newToken}`,
                };
              })
              .catch(() => store.dispatch("auth/logout"))
              .then(() => resolve(config));
          } else {
            resolve(config);
          }
        } catch (error) {
          resolve(config);
        }
      })
  );
  // $axios.onResponse((response) => {
  //   if (response.data.success === true) {
  //     if (response.data.text) {
  //       Vue.notify({
  //         group: "auth",
  //         text: response.data.text,
  //         type: "notification notification--color-success",
  //       });
  //     } else if (response.data.message) {
  //       Vue.notify({
  //         group: "auth",
  //         text: messages[response.data.message] || messages.success,
  //         type: "notification notification--color-success",
  //       });
  //     } else {
  //       Vue.notify({
  //         group: "auth",
  //         text: messages.success,
  //         type: "notification notification--color-success",
  //       });
  //     }
  //   }
  // });
  $axios.onError((error) => {
    if (!error.response) return;
    if (
      ["revoked-token", "invalid-token", "expired-token"].includes(
        error.response.data.code || error.response.data.error
      )
    ) {
      return redirect("/auth/refresh");
    }
    if (
      ignoredErrors.includes(
        error.response.data.code || error.response.data.error
      )
    ) {
    } else if (
      redirectErrors.includes(
        error.response.data.code || error.response.data.error
      )
    ) {
      return redirect(
        `/errors/${error.response.data.code || error.response.data.error}`
      );
    // } else if (
    //   Object.keys(errors).includes(
    //     error.response.data.code || error.response.data.error
    //   )
    // ) {
    //   Vue.notify({
    //     group: "auth",
    //     text: errors[error.response.data.code || error.response.data.error],
    //     duration: 5000,
    //     type: "notification notification--color-danger",
    //   });
    // } else {
    //   Vue.notify({
    //     group: "auth",
    //     text: error.response.data.code || error.response.data.error,
    //     type: "notification notification--color-danger",
    //   });
    // }
  });
}
