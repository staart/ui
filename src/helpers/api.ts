export const BASE_URL = "http://localhost:3000/v1";
// import PQueue from "p-queue";

// const queue = new PQueue({ concurrency: 1 });

export const api = async <T>(method: string, endpoint: string): Promise<T> =>
  callApiMethod(method, endpoint);

const callApiMethod = async <T>(
  method: string,
  endpoint: string
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
  });
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);
  const result = await response.json();
  if (!response.ok)
    if (Array.isArray(result.message))
      throw new Error(
        /**
         * Join an array using "A, B, and C" rather than "A, B, C"
         * @source https://stackoverflow.com/a/49289042/1656944
         */
        capitalize(result.message.join(", ").replace(/, ([^,]*)$/, ", and $1"))
      );
    else if (typeof result.message === "string")
      throw new Error(capitalize(result.message));
    else throw new Error(capitalize(result.error ?? "An error occurred"));
  return result;
};
