<template>
  <div>
    <header class="section section--bg-white">
      <div class="container">
        <div class="row">
          <div>
            <h1><Translate t="pages.index.hero.title" /></h1>
            <p style="max-width: 500px">
              <Translate t="pages.index.hero.intro" />
            </p>
            <div v-if="isAuthenticated">
              <nuxt-link
                class="button button--size-large button--color-primary"
                to="/dashboard"
              >
                <Translate t="buttons.goToDashboard" />
              </nuxt-link>
            </div>
            <div v-else>
              <nuxt-link
                class="button button--size-large button--color-primary"
                to="/auth/register"
              >
                <Translate t="buttons.getStarted" />
              </nuxt-link>
            </div>
          </div>
          <img class="b" alt="" src="/images/undraw_product_tour_foyt.svg" />
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
                icon="credit-card"
                fixed-width
              />
              <h3><Translate t="pages.index.features.1.title" /></h3>
              <p><Translate t="pages.index.features.1.intro" /></p>
            </div>
            <div>
              <font-awesome-icon
                class="icon icon--size-lg"
                icon="users"
                fixed-width
              />
              <h3><Translate t="pages.index.features.2.title" /></h3>
              <p><Translate t="pages.index.features.2.intro" /></p>
            </div>
            <div>
              <font-awesome-icon
                class="icon icon--size-lg"
                icon="code"
                fixed-width
              />
              <h3><Translate t="pages.index.features.3.title" /></h3>
              <p><Translate t="pages.index.features.3.intro" /></p>
            </div>
            <div>
              <font-awesome-icon
                class="icon icon--size-lg"
                icon="laptop"
                fixed-width
              />
              <h3><Translate t="pages.index.features.4.title" /></h3>
              <p><Translate t="pages.index.features.4.intro" /></p>
            </div>
          </div>
        </div>
      </section>
      <section class="section section--bg-white">
        <div class="container">
          <h2 class="text text--align-center">
            <Translate t="pages.index.lists.title" />
          </h2>
          <div class="row">
            <div>
              <h3><Translate t="pages.index.lists.1.title" /></h3>
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
                    <dt><Translate t="pages.index.lists.1.1.title" /></dt>
                    <dd><Translate t="pages.index.lists.1.1.intro" /></dd>
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
                    <dt><Translate t="pages.index.lists.1.2.title" /></dt>
                    <dd><Translate t="pages.index.lists.1.2.intro" /></dd>
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
                    <dt><Translate t="pages.index.lists.1.3.title" /></dt>
                    <dd><Translate t="pages.index.lists.1.3.intro" /></dd>
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
                    <dt><Translate t="pages.index.lists.1.4.title" /></dt>
                    <dd>
                      <Translate t="pages.index.lists.1.4.intro" />tokens.
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
                      <Translate t="pages.index.lists.1.5.title" />
                      <span
                        aria-label="Data export not mean you are completely GDPR compliant, you need to take additional steps. Read more in our docs."
                        class="label-help"
                        data-balloon-pos="up"
                      >
                        <span aria-hidden="true">?</span>
                      </span>
                    </dt>
                    <dd><Translate t="pages.index.lists.1.5.intro" /></dd>
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
                    <dt><Translate t="pages.index.lists.1.6.title" /></dt>
                    <dd><Translate t="pages.index.lists.1.6.intro" /></dd>
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
                    <dt><Translate t="pages.index.lists.1.7.title" /></dt>
                    <dd><Translate t="pages.index.lists.1.7.intro" /></dd>
                  </div>
                </div>
              </dl>
              <div>
                <a
                  class="button"
                  target="_blank"
                  href="https://github.com/o15y/staart"
                >
                  <Translate t="pages.index.lists.1.link" />
                </a>
              </div>
            </div>
            <div>
              <h3><Translate t="pages.index.lists.2.title" /></h3>
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
                    <dt><Translate t="pages.index.lists.2.1.title" /></dt>
                    <dd><Translate t="pages.index.lists.2.1.intro" /></dd>
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
                    <dt><Translate t="pages.index.lists.2.2.title" /></dt>
                    <dd><Translate t="pages.index.lists.2.2.intro" /></dd>
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
                    <dt><Translate t="pages.index.lists.2.3.title" /></dt>
                    <dd><Translate t="pages.index.lists.2.3.intro" /></dd>
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
                    <dt><Translate t="pages.index.lists.2.4.title" /></dt>
                    <dd><Translate t="pages.index.lists.2.4.intro" />more.</dd>
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
                    <dt><Translate t="pages.index.lists.2.5.title" /></dt>
                    <dd><Translate t="pages.index.lists.2.5.intro" /></dd>
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
                    <dt><Translate t="pages.index.lists.2.6.title" /></dt>
                    <dd><Translate t="pages.index.lists.2.6.intro" /></dd>
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
                    <dt><Translate t="pages.index.lists.2.7.title" /></dt>
                    <dd><Translate t="pages.index.lists.2.7.intro" /></dd>
                  </div>
                </div>
              </dl>
              <div>
                <a
                  class="button"
                  target="_blank"
                  href="https://github.com/o15y/staart-ui"
                >
                  <Translate t="pages.index.lists.2.link" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <h2 class="text text--align-center">
            <Translate t="pages.index.logos.title" />
          </h2>
          <div class="row text text--align-center main-features">
            <div>
              <font-awesome-icon
                class="icon icon--size-lg"
                :icon="['fab', 'accessible-icon']"
                fixed-width
              />
              <h3><Translate t="pages.index.logos.1.title" /></h3>
              <p><Translate t="pages.index.logos.1.intro" /></p>
            </div>
            <div>
              <font-awesome-icon
                class="icon icon--size-lg"
                icon="hands-helping"
                fixed-width
              />
              <h3><Translate t="pages.index.logos.2.title" /></h3>
              <p><Translate t="pages.index.logos.2.intro" /></p>
            </div>
            <div>
              <font-awesome-icon
                class="icon icon--size-lg"
                icon="calendar"
                fixed-width
              />
              <h3><Translate t="pages.index.logos.3.title" /></h3>
              <p><Translate t="pages.index.logos.3.intro" /></p>
            </div>
            <div>
              <font-awesome-icon
                class="icon icon--size-lg"
                icon="image"
                fixed-width
              />
              <h3><Translate t="pages.index.logos.4.title" /></h3>
              <p><Translate t="pages.index.logos.4.intro" /></p>
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
  faMagic,
  faCreditCard,
  faUsers,
  faLaptop,
  faHandsHelping,
  faCalendar,
  faImage
} from "@fortawesome/free-solid-svg-icons";
import {
  faNodeJs,
  faVuejs,
  faAccessibleIcon
} from "@fortawesome/free-brands-svg-icons";
import Translate from "@/components/Translate.vue";
library.add(
  faSync,
  faMagic,
  faUserLock,
  faCalendar,
  faImage,
  faHandsHelping,
  faFingerprint,
  faCode,
  faUsers,
  faLaptop,
  faGlobeEurope,
  faShieldAlt,
  faNodeJs,
  faVuejs,
  faToggleOn,
  faFile,
  faLanguage,
  faAccessibleIcon,
  faRocket,
  faCreditCard
);

@Component({
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated"
  }),
  components: {
    Translate,
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
  margin-bottom: 5rem;
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
    margin-bottom: 2.5rem;
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
@media (max-width: 500px) {
  .label-help {
    display: none;
  }
}
.label-help::after {
  font-size: 90% !important;
  line-height: 1.5;
  width: 300px;
  white-space: normal;
}
.b {
  height: 20rem;
  margin-top: -4rem;
  margin-bottom: -5rem;
}
@media (max-width: 500px) {
  .b {
    margin-top: 0;
    margin-bottom: 0;
    height: auto;
    width: 100%;
    margin-bottom: -5rem;
  }
}
</style>
