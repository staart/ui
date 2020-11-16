const errorMessages: Record<number, string> = {
  404001: "We couldn't find a user account",
};

export const getMessageFromCode = (
  message: string,
  response: Response,
  json: any
) => {
  const code = parseInt(message.split(":")[0]);
  if (code && !isNaN(code)) {
    const text = message.split(/\:(.+)/)[1] ?? message;
    const result = errorMessages[code] ?? text;
    if (result === "Rate limit exceeded")
      return `Rate limit exceeded, please try again in ${Math.round(
        (new Date(response.headers.get("X-Retry-Reset")).getTime() -
          new Date().getTime()) /
          1000
      )} seconds.`;
  }
  return message;
};
