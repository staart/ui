export default {
  errors: {
    "user-not-found": "We couldn't find this user",
    "missing-field": "Make sure you've entered all required fields",
    "unverified-email": "This email has not been verified yet",
    "invalid-login": "This is an incorrect email/password combination",
    "incorrect-password": "This password is incorrect",
    "TokenExpiredjwt expired":
      "This magic link has been expired, please request a new one",
    "JsonWebTokenjwt malformed":
      "This magic link is broken, please request a new one",
    "google-auth-error": "We got an error in verifying your Google account",
    "validation-email": "Please enter a valid email",
    "validation-phone": "Please enter a valid phone number",
    "validation-url": "Please enter a valid URL (start with http(s))",
    "validation-domain": "Please enter a valid domain nmame",
    "validation-language": "Please enter a valid language",
    "validation-timezone": "Please enter a valid timezone",
    "validation-gender": "Please enter a valid gender",
    "validation-country-code": "Please enter a valid country code",
    "validation-text": "Please enter a valid text",
    "email-exists": "An account with this email already exists",
    "cannot-delete-sole-owner":
      "Add another owner to this organization before deleting",
    "cannot-update-sole-owner":
      "Add another owner to this organization before updating this role",
    "insufficient-permission":
      "You don't have the permission to perform this action",
    "user-is-member-already": "This user is already a member",
    "invalid-2fa-token": "This 2FA verification code is incorrect",
    "oauth-no-email": "We couldn't find an account with that email",
    "domain-missing-file": "We couldn't find the verification file",
    "domain-missing-dns": "We didn't find the DNS record",
    "domain-already-verified": "This domain is already verified",
    "cannot-invite-domain": "You cannot invite a member from this domain",
    "username-exists": "This username is already claimed",
    "cannot-delete-email": "This email cannot be deleted"
  },
  securityEvents: {
    "user.created": "Created account",
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
    "organization.updated": "Updated organization",
    "organization.deleted": "Deleted organization",
    "email.created": "Created a new email",
    "email.updated": "Updated email",
    "email.deleted": "Deleted email",
    "email.verified": "Verified email",
    "membership.created": "Updated membership",
    "membership.updated": "Updated membership",
    "membership.deleted": "Updated membership"
  },
  messages: {
    success: "Your changes were saved successfully",
    "admin-info-success": "Looking like everything is working",
    "auth-register-success": "Your account has been successfully created",
    "auth-recover-success": "Your password has been changed",
    "auth-verify-email-success": "Your email have been verified",
    "membership-updated": "Membership has been updated",
    "organization-created": "Your team has been created",
    "organization-updated": "Your team has been updated",
    "organization-deleted": "Your team has been deleted",
    "organization-billing-updated": "Your team's billing info has been updated",
    "user-updated": "Your account has been updated",
    "user-password-updated": "Your password has been changed",
    "user-email-created": "Your email has been created",
    "user-email-verify-resent": "Verification email has been sent",
    "user-email-deleted": "Your email has been deleted",
    "billing-customer-created": "Your customer has been created",
    "billing-customer-deleted": "Your customer has been deleted",
    "billing-customer-updated": "Your customer has been updated ",
    "billing-subscription-created": "Your subscription has been created",
    "billing-subscription-updated": "Your subscription has been updated",
    "billing-source-created": "Your payment method has been added",
    "billing-source-updated": "Your payment method has been updated",
    "billing-source-deleted": "Your payment method has been deleted",
    "domain-unable-to-verify": "We weren't able to verify your domain"
  },
  membershipRoles: {
    1: "Owner",
    2: "Admin",
    3: "Manager",
    4: "Member",
    5: "Basic"
  },
  scopes: {
    "org:read": { text: "Read team details" },
    "org:update": { text: "Update team details" },
    "org:delete": { text: "Delete this team" },
    "org:billing:read": { text: "Read billing info" },
    "org:billing:update": { text: "Update billing info" },
    "org:invoices:read": { text: "Read invoices" },
    "org:sources:read": { text: "Read payment methods" },
    "org:sources:create": { text: "Create payment methods" },
    "org:sources:update": { text: "Update payment methods" },
    "org:sources:delete": { text: "Delete payment methods" },
    "org:subscriptions:read": { text: "Read paid subscriptions" },
    "org:subscriptions:update": { text: "Update paid subscriptions" },
    "org:subscriptions:create": { text: "Create paid subscriptions" },
    "org:plans:read": { text: "Read pricing plans" },
    "org:api-key:read": { text: "Read API keys" },
    "org:api-key:update": { text: "Update API keys" },
    "org:api-key:delete": { text: "Delete API keys" },
    "org:api-key:create": { text: "Create API keys" },
    "org:api-key-logs:read": { text: "Read API logs" },
    "org:domain:read": { text: "Read domains" },
    "org:domain:update": { text: "Update domains" },
    "org:domain:delete": { text: "Delete domains" },
    "org:domain:create": { text: "Create domains" },
    "org:domain:verify": { text: "Verify a domain" },
    "org:webhook:read": { text: "Read webhooks" },
    "org:webhook:update": { text: "Update webhooks" },
    "org:webhook:delete": { text: "Delete webhooks" },
    "org:webhook:create": { text: "Create webhooks" },
    "org:membership:read": { text: "Read memberships" },
    "org:membership:update": { text: "Update memberships" },
    "org:membership:delete": { text: "Delete memberships" },
    "org:membership:create": { text: "Create memberships" }
  },
  webhooks: {
    "*": "All events",
    "update-organization": "Update team settings",
    "delete-organization": "Delete team",
    "update-organization-billing": "Update billing details",
    "update-organization-subscription": "Update subscription",
    "create-organization-subscription": "Create a subscription",
    "delete-organization-source": "Delete a payment method",
    "update-organization-source": "Update a payment method",
    "create-organization-source": "Create a payment method",
    "update-api-key": "Update an API key",
    "create-api-key": "Create an API key",
    "delete-api-key": "Delete an API key",
    "update-domain": "Update a domain",
    "create-domain": "Create a domain",
    "delete-domain": "Delete a domain",
    "verify-domain": "Verify a domain",
    "update-webhook": "Update a webhook",
    "create-webhook": "Create a webhook",
    "delete-webhook": "Delete a webhook"
  },
  userScopes: {
    "user:read": {
      text: "Read basic user profile"
    },
    "user:update": {
      text: "Update user profile"
    },
    "user:emails:create": {
      text: "Add an email address"
    },
    "user:emails:read": {
      text: "Read email addresses"
    },
    "user:emails:delete": {
      text: "Delete an email address"
    },
    "user:emails:resend-verification": {
      text: "Resend email verification"
    },
    "user:change-password": {
      text: "Change user password"
    },
    "user:delete": {
      text: "Delete user account"
    },
    "user:memberships:read": {
      text: "Read team memberships"
    },
    "user:2fa:enable": {
      text: "Enable two-factor authentication"
    },
    "user:2fa:disable": {
      text: "Disable two-factor authentication"
    },
    "user:backup-codes:read": {
      text: "Read 2FA backup codes"
    },
    "user:backup-codes:regenerate": {
      text: "Regenerate 2FA backup codes"
    },
    "user:access-tokens:create": {
      text: "Create new access tokens"
    },
    "user:access-tokens:read": {
      text: "Read access tokens"
    },
    "user:access-tokens:update": {
      text: "Update access tokens"
    },
    "user:access-tokens:delete": {
      text: "Delete access tokens"
    }
  },
  months: {
    1: "January (01)",
    2: "February (02)",
    3: "March (03)",
    4: "April (04)",
    5: "May (05)",
    6: "June (06)",
    7: "July (07)",
    8: "August (08)",
    9: "September (09)",
    10: "October (10)",
    11: "November (11)",
    12: "December (12)"
  },
  genders: {
    m: "Male (he/him)",
    f: "Female (she/her)",
    n: "Non-binary (them/their)",
    x: "Prefer not to say (them/their)"
  },
  buttons: {
    getStarted: "Get started for free →",
    goToDashboard: "Go to your dashboard →"
  },
  pages: {
    index: {
      hero: {
        title: "Staart is a SaaS starter for your next big idea.",
        intro:
          "Written in TypeScript and Vue, Staart gives you a 6-month headstart in building your SaaS product. Free and open-source."
      },
      features: {
        1: {
          title: "SaaS Billing",
          intro:
            "Subscriptions, credit cards, invoices, and more, powered by Stripe"
        },
        2: {
          title: "Teams",
          intro: "Users can invite their teams and manage roles and permissions"
        },
        3: {
          title: "Platform",
          intro:
            "Authentication, scoped API keys, and more ways to use your SaaS"
        },
        4: {
          title: "Full-stack",
          intro:
            "Node.js backend written in TypeScript with a beautiful Vue PWA."
        }
      },
      lists: {
        title: "More than a basic template",
        1: {
          title: "Node.js/TypeScript Backend",
          link: "Staart on GitHub →",
          1: {
            title: "Controller-driven",
            intro:
              "Auto route generation with redirects and static file support."
          },
          2: {
            title: "OAuth2 client",
            intro: "Users can login with email, Apple, Google, Salesforce, etc."
          },
          3: {
            title: "Smart authentication",
            intro: "Secure, location-aware logins with TOTP 2FA support."
          },
          4: {
            title: "Developer API",
            intro: "Developers can use your SaaS with API keys and access"
          },
          5: {
            title: "GDPR compliance",
            intro: "Teams and users can export and delete data transparently."
          },
          6: {
            title: "Secure endpoints",
            intro:
              "Rate limiting, brute force prevention, and IP/CIDR whitelisting."
          },
          7: {
            title: "Modern toolkit",
            intro: "Powerful middleware, error handling, async functions."
          }
        },
        2: {
          title: "Vue.js/Nuxt.js Frontend",
          link: "Staart UI on GitHub →",
          1: {
            title: "Progressive Web App",
            intro: "Service worker-cached PWA frontend with a modern toolkit."
          },
          2: {
            title: "Lazy loaded routes",
            intro: "Smart loading of routes for a fast initial load."
          },
          3: {
            title: "Ready-to-use components",
            intro: "Beautiful forms, cards, dropdowns, and more components."
          },
          4: {
            title: "Static pages",
            intro: "SEO-proof static templates for pricing, policies, and"
          },
          5: {
            title: "Internationalization",
            intro: "Localize your SaaS to as many languages as you like."
          },
          6: {
            title: "Accessibility",
            intro: "ARIA, accessible tooltips, dark theme, reduced motion."
          },
          7: {
            title: "Deploy anywhere",
            intro:
              "Works perfectly on Netlify, Firebase, Surge, and GitHub pages."
          }
        }
      },
      logos: {
        title: "Coming soon, powered by Staart",
        1: {
          title: "A11Y.co",
          intro: "End-to-end web accessibility platform from Oswald Labs"
        },
        2: {
          title: "Ara Assistant",
          intro:
            "AI-powered assistant for businesses and professionals from O15Y"
        },
        3: {
          title: "Dai11y",
          intro:
            "Automated daily accessibility audits to find issues in your sites"
        },
        4: {
          title: "Glimage",
          intro:
            "Global CDN for delivering super-fast, optimized images to your sites"
        }
      }
    }
  }
};
