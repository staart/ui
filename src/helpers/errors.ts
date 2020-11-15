const errorMessages: Record<number, string> = {
  404001: "We couldn't find a user account",
};

export const getMessageFromCode = (message: string) => {
  const code = parseInt(message.split(":")[0]);
  if (code && !isNaN(code)) {
    const text = message.split(/\:(.+)/)[1] ?? message;
    return errorMessages[code] ?? text;
  }
  return message;
};
