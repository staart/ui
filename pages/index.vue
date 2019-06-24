<template>
  <div>
    <header class="section section--bg-white">
      <div class="container">
        <h1>Staart is a SaaS starter for your next big idea.</h1>
        <p style="max-width: 500px">
          Written in TypeScript and Vue, Staart gives you a 6-month headstart in
          building your SaaS product. Free and open-source.
        </p>
        <div v-if="isAuthenticated">
          <nuxt-link
            class="button button--size-large button--color-primary"
            to="/dashboard"
            >Go to your dashboard &rarr;</nuxt-link
          >
        </div>
        <div v-else>
          <nuxt-link
            class="button button--size-large button--color-primary"
            to="/auth/register"
            >Get started for free &rarr;</nuxt-link
          >
        </div>
      </div>
    </header>
    <main>
      <section class="section">
        <div class="container">
          <div class="row text text--align-center main-features">
            <div>
              <font-awesome-icon
                class="icon icon--size-lg"
                icon="user-lock"
                fixed-width
              />
              <h3>SaaS Billing</h3>
              <p>
                Subscriptions, credit cards, invoices, and more, powered by
                Stripe.
              </p>
            </div>
            <div>
              <font-awesome-icon
                class="icon icon--size-lg"
                icon="user-lock"
                fixed-width
              />
              <h3>Teams</h3>
              <p>
                Users can invite their teams and manage roles and permissions.
              </p>
            </div>
            <div>
              <font-awesome-icon
                class="icon icon--size-lg"
                icon="user-lock"
                fixed-width
              />
              <h3>Platform</h3>
              <p>
                Authentication, scoped API keys, and more ways to use your SaaS.
              </p>
            </div>
            <div>
              <font-awesome-icon
                class="icon icon--size-lg"
                icon="user-lock"
                fixed-width
              />
              <h3>Full-stack</h3>
              <p>
                Node.js backend written in TypeScript with a beautiful Vue PWA.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section class="section section--bg-white">
        <div class="container">
          <h2 class="text text--align-center">More than a basic template</h2>
          <div class="row">
            <div>
              <h3>Node.js/TypeScript Backend</h3>
              <dl>
                <div class="rc">
                  <div>
                    <div class="icon-circle">
                      <font-awesome-icon
                        class="icon text text--color-blue"
                        icon="magic"
                        fixed-width
                      />
                    </div>
                  </div>
                  <div>
                    <dt>Controller-driven</dt>
                    <dd>
                      Auto route generation with redirects and static file
                      support.
                    </dd>
                  </div>
                </div>
                <div class="rc">
                  <div>
                    <div class="icon-circle">
                      <font-awesome-icon
                        class="icon text text--color-amber"
                        icon="user-lock"
                        fixed-width
                      />
                    </div>
                  </div>
                  <div>
                    <dt>OAuth2 client</dt>
                    <dd>
                      Users can login with email, Apple, Google, Salesforce,
                      etc.
                    </dd>
                  </div>
                </div>
                <div class="rc">
                  <div>
                    <div class="icon-circle">
                      <font-awesome-icon
                        class="icon text text--color-orange"
                        icon="fingerprint"
                        fixed-width
                      />
                    </div>
                  </div>
                  <div>
                    <dt>Smart authentication</dt>
                    <dd>
                      Secure, location-aware logins with TOTP 2FA support.
                    </dd>
                  </div>
                </div>
                <div class="rc">
                  <div>
                    <div class="icon-circle">
                      <font-awesome-icon
                        class="icon text text--color-teal"
                        icon="code"
                        fixed-width
                      />
                    </div>
                  </div>
                  <div>
                    <dt>Developer API</dt>
                    <dd>
                      Developers can use your SaaS with API keys and access
                      tokens.
                    </dd>
                  </div>
                </div>
                <div class="rc">
                  <div>
                    <div class="icon-circle">
                      <font-awesome-icon
                        class="icon text text--color-blue"
                        icon="globe-europe"
                        fixed-width
                      />
                    </div>
                  </div>
                  <div>
                    <dt>
                      <span>GDPR compliance</span>
                      <span
                        aria-label="Data export not mean you are completely GDPR compliant, you need to take additional steps. Read more in our docs."
                        class="label-help"
                        data-balloon-pos="up"
                      >
                        <span aria-hidden="true">?</span>
                      </span>
                    </dt>
                    <dd>
                      Teams and users can export and delete data transparently.
                    </dd>
                  </div>
                </div>
                <div class="rc">
                  <div>
                    <div class="icon-circle">
                      <font-awesome-icon
                        class="icon text text--color-brown"
                        icon="shield-alt"
                        fixed-width
                      />
                    </div>
                  </div>
                  <div>
                    <dt>Secure endpoints</dt>
                    <dd>
                      Rate limiting, brute force prevention, and IP/CIDR
                      whitelisting.
                    </dd>
                  </div>
                </div>
                <div class="rc">
                  <div>
                    <div class="icon-circle">
                      <font-awesome-icon
                        class="icon text text--color-green"
                        :icon="['fab', 'node-js']"
                        fixed-width
                      />
                    </div>
                  </div>
                  <div>
                    <dt>Modern toolkit</dt>
                    <dd>
                      Powerful middleware, error handling, async functions.
                    </dd>
                  </div>
                </div>
              </dl>
              <div>
                <a
                  class="button"
                  target="_blank"
                  href="https://github.com/o15y/staart"
                  >Staart on GitHub &rarr;</a
                >
              </div>
            </div>
            <div>
              <h3>Vue.js/Nuxt.js Frontend</h3>
              <dl>
                <div class="rc">
                  <div>
                    <div class="icon-circle">
                      <font-awesome-icon
                        class="icon text text--color-green"
                        :icon="['fab', 'vuejs']"
                        fixed-width
                      />
                    </div>
                  </div>
                  <div>
                    <dt>Progressive Web App</dt>
                    <dd>
                      Service worker-cached PWA frontend with a modern toolkit.
                    </dd>
                  </div>
                </div>
                <div class="rc">
                  <div>
                    <div class="icon-circle">
                      <font-awesome-icon
                        class="icon text--color-purple"
                        icon="sync"
                        fixed-width
                      />
                    </div>
                  </div>
                  <div>
                    <dt>Lazy loaded routes</dt>
                    <dd>Smart loading of routes for a fast initial load.</dd>
                  </div>
                </div>
                <div class="rc">
                  <div>
                    <div class="icon-circle">
                      <font-awesome-icon
                        class="icon text text--color-cyan"
                        icon="toggle-on"
                        fixed-width
                      />
                    </div>
                  </div>
                  <div>
                    <dt>Ready-to-use components</dt>
                    <dd>
                      Beautiful forms, cards, dropdowns, and more components.
                    </dd>
                  </div>
                </div>
                <div class="rc">
                  <div>
                    <div class="icon-circle">
                      <font-awesome-icon
                        class="icon text text--color-gray"
                        icon="file"
                        fixed-width
                      />
                    </div>
                  </div>
                  <div>
                    <dt>Static pages</dt>
                    <dd>
                      SEO-proof static templates for pricing, policies, and
                      more.
                    </dd>
                  </div>
                </div>
                <div class="rc">
                  <div>
                    <div class="icon-circle">
                      <font-awesome-icon
                        class="icon text text--color-pink"
                        icon="language"
                        fixed-width
                      />
                    </div>
                  </div>
                  <div>
                    <dt>Internationalization</dt>
                    <dd>
                      Localize your SaaS to as many languages as you like.
                    </dd>
                  </div>
                </div>
                <div class="rc">
                  <div>
                    <div class="icon-circle">
                      <font-awesome-icon
                        class="icon text text--color-blue"
                        :icon="['fab', 'accessible-icon']"
                        fixed-width
                      />
                    </div>
                  </div>
                  <div>
                    <dt>Accessibility</dt>
                    <dd>
                      ARIA, accessible tooltips, dark theme, reduced motion.
                    </dd>
                  </div>
                </div>
                <div class="rc">
                  <div>
                    <div class="icon-circle">
                      <font-awesome-icon
                        class="icon text text--color-blue-gray"
                        icon="rocket"
                        fixed-width
                      />
                    </div>
                  </div>
                  <div>
                    <dt>Deploy anywhere</dt>
                    <dd>
                      Works perfectly on Netlify, Firebase, Surge, and GitHub
                      pages.
                    </dd>
                  </div>
                </div>
              </dl>
              <div>
                <a
                  class="button"
                  target="_blank"
                  href="https://github.com/o15y/staart-ui"
                  >Staart UI on GitHub &rarr;</a
                >
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSync,
  faUserLock,
  faFingerprint,
  faCode,
  faGlobeEurope,
  faShieldAlt,
  faToggleOn,
  faFile,
  faLanguage,
  faRocket,
  faMagic
} from "@fortawesome/free-solid-svg-icons";
import {
  faNodeJs,
  faVuejs,
  faAccessibleIcon
} from "@fortawesome/free-brands-svg-icons";
library.add(
  faSync,
  faMagic,
  faUserLock,
  faFingerprint,
  faCode,
  faGlobeEurope,
  faShieldAlt,
  faNodeJs,
  faVuejs,
  faToggleOn,
  faFile,
  faLanguage,
  faAccessibleIcon,
  faRocket
);

@Component({
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated"
  }),
  components: {
    FontAwesomeIcon
  }
})
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
header {
  padding: 15rem 0 7.5rem 0;
  margin-top: -7.5rem;
  h1 {
    margin: 0 0 2rem 0;
  }
}
h2 {
  font-weight: 300;
  font-size: 200%;
  margin-bottom: 2.5rem;
}
.icon-circle {
  background-color: #fff;
  margin-right: 1rem;
  height: 3.5rem;
  width: 3.5rem;
  text-align: center;
  line-height: 3.5rem;
  font-size: 150%;
  border-radius: 100%;
}
dt {
  font-size: 125%;
  margin-bottom: 0.1rem;
  + dd {
    margin-left: 0;
  }
}
.rc {
  > div:first-child {
    float: left;
    margin-bottom: 1.5rem;
    > div {
      box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
    }
  }
  &::after {
    content: "";
    display: block;
    width: 100%;
    clear: both;
  }
}
.icon--size-lg {
  font-size: 250%;
  opacity: 0.5;
  margin-bottom: 1rem;
}
.label-help {
  line-height: 1;
}
.label-help::after {
  font-size: 90% !important;
  line-height: 1.5;
  width: 300px;
  white-space: normal;
}
</style>
