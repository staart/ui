export default {
  errors: {
    "user-not-found": "We couldn't find a user with this email",
    "missing-field": "Make sure you've entered all required fields",
    "unverified-email": "This email has not been verified yet",
    "invalid-login": "This is an incorrect email/password combination",
    "TokenExpiredjwt expired":
      "This magic link has been expired, please request a new one",
    "JsonWebTokenjwt malformed":
      "This magic link is broken, please request a new one",
    "google-auth-error": "We got an error in verifying your Google account",
    "validation-email": "Please enter a valid email",
    "validation-phone": "Please enter a valid phone number",
    "validation-url": "Please enter a valid URL (start with http(s))",
    "email-exists": "An account with this email already exists",
    "cannot-delete-sole-owner":
      "Add another owner to this organization before deleting",
    "cannot-update-sole-owner":
      "Add another owner to this organization before updating this role",
    "insufficient-permission":
      "You don't have the permission to perform this action",
    "user-is-member-already": "This user is already a member",
    "no-customer": "You don't have billing set up"
  },
  securityEvents: {
    "user.created": "Created an account",
    "user.updated": "Updated settings",
    "user.deleted": "Deleted account",
    "auth.refresh": "Continued session",
    "auth.login": "Login",
    "auth.login_backupCode": "Login with backup code",
    "auth.login_google": "Login with Google",
    "auth.password_changed": "Password changed",
    "auth.passwordReset": "Password reset request",
    "auth.approveLocation": "Approved a new location",
    "organization.created": "Created a new organization",
    "organization.updated": "Updated an organization",
    "organization.deleted": "Deleted an organization",
    "email.created": "Created a new email",
    "email.updated": "Updated an email",
    "email.deleted": "Deleted an email",
    "email.verified": "Verified an email"
  },
  membershipRoles: {
    1: "Owner",
    2: "Admin",
    3: "Manager",
    4: "Member",
    5: "Basic"
  }
};
