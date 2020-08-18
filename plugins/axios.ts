import Vue from "vue";
import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { AxiosRequestConfig } from "axios";
import decode from "jwt-decode";
import { ToastProgrammatic as Toast } from "buefy";

const ignoredErrors = ["no-customer"];

export default function({
  $axios,
  redirect,
  store,
  app
}: {
  $axios: NuxtAxiosInstance;
  app: any;
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
        $axios.setHeader("X-Requested-With", "XMLHttpRequest");
        if (process.env.API_KEY)
          $axios.setHeader("X-Api-Key", process.env.API_KEY);

        try {
          const token: string = config.headers.common.Authorization.replace(
            "Bearer ",
            ""
          );
          if (
            decode<{ exp: number }>(token).exp * 1000 <
            new Date().getTime()
          ) {
            if (!store.state.auth.tokens.refresh) {
              return resolve(config);
            }
            $axios.setHeader("Authorization", undefined);
            store
              .dispatch("auth/refresh")
              .then((newToken: string) => {
                $axios.setHeader("Authorization", newToken);
                config.headers = {
                  ...config.headers,
                  Authorization: `Bearer ${newToken}`
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
  $axios.onResponse(response => {
    if (typeof response.data?.text === "string") {
      Toast.open({
        message: response?.data?.text,
        type: "is-success"
      });
    }
  });
  $axios.onError(error => {
    if (!error.response) return;

    if (
      [
        "revoked-token",
        "invalid-token",
        "expired-token",
        "missing-token"
      ].includes(error.response.data.code || error.response.data.error)
    ) {
      return redirect("/auth/refresh");
    }

    if (
      ignoredErrors.includes(
        error.response.data.code || error.response.data.error
      )
    ) {
    } else if (typeof error.response.data?.error === "string") {
      Toast.open({
        message: error?.response?.data?.error,
        type: "is-danger"
      });
    }
  });
}
