<template>
  <main itemscope itemtype="https://schema.org/Product">
    <div class="hero hero--align-center">
      <h1>Simple, transparent pricing.</h1>
      <p>
        This is an example pricing page for a SaaS startup. You can add your own
        plans, extra addons, and more.
      </p>
    </div>
    <div
      class="container"
      itemprop="offers"
      itemscope
      itemtype="https://schema.org/Offer"
    >
      <div class="row row--padding-large hide-mobile">
        <div></div>
        <div>
          <div class="card card--type-padded text text--align-center">
            <h2 class="plan">Free</h2>
            <div class="price">
              <span itemprop="priceCurrency" content="USD">$</span
              ><span itemprop="price" content="0.00">0</span>
              <link itemprop="availability" href="https://schema.org/InStock" />
            </div>
            <div class="text text--size-small text--color-light">&nbsp;</div>
            <div class="text text--size-small text--color-light">&nbsp;</div>
          </div>
        </div>
        <div>
          <div class="card card--type-padded text text--align-center">
            <h2 class="plan">Pro</h2>
            <div class="price">
              <span itemprop="priceCurrency" content="USD">$</span
              ><span itemprop="price" content="49.00">49</span>
              <link itemprop="availability" href="https://schema.org/InStock" />
            </div>
            <div class="text text--size-small text--color-light">per month</div>
            <div class="text text--size-small text--color-light">
              billed monthly
            </div>
          </div>
        </div>
        <div>
          <div class="card card--type-padded text text--align-center">
            <h2 class="plan">Enterprise</h2>
            <div class="price">
              <span>Custom</span>
              <link itemprop="availability" href="https://schema.org/InStock" />
            </div>
            <div class="text text--size-small text--color-light">
              unlimited users
            </div>
            <div class="text text--size-small text--color-light">
              billed annually
            </div>
          </div>
        </div>
      </div>
      <div class="row row--padding-large">
        <div class="hide-mobile">
          <div
            class="card card--type-padded card--type-invisible"
            style="padding-left: 0"
          >
            <ul>
              <li>Pageviews</li>
              <li>Apps &amp; modes</li>
              <li>Usage metrics</li>
              <li>White labeling</li>
              <li>Support</li>
              <li>Branding</li>
            </ul>
          </div>
        </div>
        <div>
          <div class="card card--type-padded text text--align-center">
            <ul>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>Unlimited</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>20+ included</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>Usage analytics</span>
              </li>
              <li><font-awesome-icon class="i-n" icon="times" title="No" /></li>
              <li><font-awesome-icon class="i-n" icon="times" title="No" /></li>
              <li><font-awesome-icon class="i-n" icon="times" title="No" /></li>
            </ul>
            <div class="text text--mt-2">
              <router-link
                to="/auth/register?plan=free"
                class="button button--size-large"
                >Get started</router-link
              >
            </div>
          </div>
        </div>
        <div>
          <div class="card card--type-padded text text--align-center">
            <ul>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>Unlimited</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>20+ included</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>Usage analytics</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>White labeling</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>Chat support</span>
              </li>
              <li><font-awesome-icon class="i-n" icon="times" title="No" /></li>
            </ul>
            <div class="text text--mt-2">
              <router-link
                to="/auth/register?plan=pro"
                class="button button--color-primary button--size-large"
              >
                <span>Get started</span>
                <font-awesome-icon icon="arrow-right" class="icon icon--ml-1" />
              </router-link>
            </div>
          </div>
        </div>
        <div>
          <div class="card card--type-padded text text--align-center">
            <ul>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>Unlimited</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>20+ included</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>Usage analytics</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>White labeling</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>Dedicated support</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>Hide "Powered by"</span>
              </li>
            </ul>
            <div class="text text--mt-2">
              <router-link
                to="/auth/register?plan=contact"
                class="button button--size-large"
                >Contact us</router-link
              >
            </div>
          </div>
        </div>
      </div>
      <div class="row row--padding-large text text--mt-4 hide-mobile">
        <div>
          <ul>
            <li>100+ integrations</li>
            <li>Team members</li>
            <li>Developer API</li>
            <li>Bank-grade security</li>
            <li>Hosted in Europe</li>
            <li>Data export &amp; delete</li>
            <li>99.99% uptime SLA</li>
            <li>Increased rate limit</li>
            <li>Single-sign on</li>
            <li>IP whitelisting</li>
            <li>Self-hosted service</li>
            <li>Reseller accounts</li>
          </ul>
        </div>
        <div>
          <div class="text text--align-center">
            <ul>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li><font-awesome-icon class="i-n" icon="times" title="No" /></li>
              <li><font-awesome-icon class="i-n" icon="times" title="No" /></li>
              <li><font-awesome-icon class="i-n" icon="times" title="No" /></li>
              <li><font-awesome-icon class="i-n" icon="times" title="No" /></li>
              <li><font-awesome-icon class="i-n" icon="times" title="No" /></li>
              <li><font-awesome-icon class="i-n" icon="times" title="No" /></li>
            </ul>
          </div>
        </div>
        <div>
          <div class="text text--align-center">
            <ul>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li><font-awesome-icon class="i-n" icon="times" title="No" /></li>
              <li><font-awesome-icon class="i-n" icon="times" title="No" /></li>
              <li><font-awesome-icon class="i-n" icon="times" title="No" /></li>
              <li><font-awesome-icon class="i-n" icon="times" title="No" /></li>
            </ul>
          </div>
        </div>
        <div>
          <div class="text text--align-center">
            <ul>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <section class="section">
        <div class="text text--align-center">
          <h2>More plans</h2>
        </div>
        <div class="addons more-plans">
          <div class="card card--type-padded">
            <h3>For open-source</h3>
            <p>
              Pro plan availabile for free for open-source projects under
              permissive licenses.
            </p>
            <a href="#">Apply for FOSS &rarr;</a>
          </div>
          <div class="card card--type-padded">
            <h3>For students</h3>
            <p>
              Free or discounted Startup plan for student developers with an
              educational account
            </p>
            <a href="#">Create student account &rarr;</a>
          </div>
          <div class="card card--type-padded">
            <h3>For non-profits</h3>
            <p>
              Up to 50% off on all plans and services for registered text
              501(c)(3) non-profits
            </p>
            <a href="#">Contact us &rarr;</a>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheck,
  faTimes,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
library.add(faCheck, faTimes, faArrowRight);

@Component({
  components: {
    FontAwesomeIcon
  },
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated"
  })
})
export default class Pricing extends Vue {}
</script>

<style lang="scss" scoped>
.plan {
  font-weight: inherit;
  margin-bottom: 0;
}
.price {
  font-size: 200%;
  font-weight: bold;
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
  li {
    padding: 0.5rem 0;
    &:first-child a {
      font-weight: bold;
      text-decoration: underline;
    }
  }
}
svg {
  max-height: 1rem;
}
.i-n {
  opacity: 0.2;
}
.i-y + span {
  margin-left: 0.5rem;
}
.addons {
  margin-top: 3rem;
  display: flex;
  justify-content: space-between;
  > div {
    width: 23%;
  }
  &.more-plans > div {
    width: 100%;
    &:nth-child(2) {
      margin: 0 2rem;
    }
  }
  h3 {
    margin: 0;
    font-size: 100%;
  }
  p {
    font-size: 95%;
  }
}

@media (max-width: 500px) {
  .addons {
    display: block;
  }
  &.more-plans > div {
    margin-top: 1rem;
    &:nth-child(2) {
      margin: 1rem 0 0 0 !important;
    }
  }
}

@media (min-width: 500px) {
  .row.row--padding-large:first-of-type {
    .card {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      padding-bottom: 1rem;
    }
    + .row {
      .card {
        padding-top: 1rem;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
    }
  }
}
</style>
