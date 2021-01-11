export const errors = {
  "429000": "You've exceeded your rate limit, please try again after some time",
  "400008":
    "This password has been compromised in a previous data breach. We recommend that you select a different password (#400008).",
};

const warnings = ["400008"];

export const isWarning = (message: string) => {
  let has = false;
  warnings.forEach((code) => {
    has = has || message.includes(code);
  });
  return has;
};
