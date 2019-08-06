<template>
  <main itemscope itemtype="https://schema.org/Product">
    <div
      class="container"
      itemprop="offers"
      itemscope
      itemtype="https://schema.org/Offer"
    >
      <h1 class="hero hero--align-center">Simple, transparent pricing.</h1>
      <div class="row row--padding-large hide-mobile">
        <div>
          <label>
            <span aria-label="Payment term">Pay</span>
            <select v-model="selectedTerm">
              <option>monthly</option>
              <option>annually</option>
            </select>
          </label>
          <label>
            <span aria-label="Currency">in</span>
            <select v-model="selectedCurrency">
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="inr">INR</option>
            </select>
          </label>
        </div>
        <div>
          <div class="card card--type-padded text text--align-center">
            <h2 class="plan">Free</h2>
            <div class="price">
              <span itemprop="priceCurrency" content="USD">{{
                currencySymbol
              }}</span
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
              <span itemprop="priceCurrency" :content="selectedCurrency">{{
                currencySymbol
              }}</span
              ><span itemprop="price" :content="calculatedPrice">{{
                calculatedPrice | currency
              }}</span>
              <link itemprop="availability" href="https://schema.org/InStock" />
            </div>
            <div class="text text--size-small text--color-light">
              per {{ selectedTerm === "annually" ? "year" : "month" }}
            </div>
            <div class="text text--size-small text--color-light">
              billed {{ selectedTerm }}
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
              starts at {{ currencySymbol }}500/m
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
              <li>Event tracking</li>
              <li>White labeling</li>
              <li>Support</li>
              <li>Branding</li>
            </ul>
          </div>
        </div>
        <div>
          <div class="card card--type-padded text text--align-center">
            <h2 class="hide-desktop">Free</h2>
            <ul>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>Unlimited</span>
                <span class="hide-desktop">pageviews</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>20+ included</span>
                <span class="hide-desktop">apps &amp; modes</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>10k events/month</span>
                <span class="hide-desktop">event tracking</span>
              </li>
              <li class="hide-mobile">
                <font-awesome-icon class="i-n" icon="times" title="No" />
              </li>
              <li class="hide-mobile">
                <font-awesome-icon class="i-n" icon="times" title="No" />
              </li>
              <li class="hide-mobile">
                <font-awesome-icon class="i-n" icon="times" title="No" />
              </li>
            </ul>
            <div class="text text--mt-2">
              <router-link
                to="/auth/register?plan=free"
                class="button button--size-large"
                >Start for free</router-link
              >
            </div>
          </div>
        </div>
        <div>
          <div class="card card--type-padded text text--align-center">
            <h2 class="hide-desktop">
              Pro for
              <span itemprop="priceCurrency" :content="selectedCurrency">{{
                currencySymbol
              }}</span
              ><span itemprop="price" :content="calculatedPrice">{{
                calculatedPrice | currency
              }}</span>
              <link itemprop="availability" href="https://schema.org/InStock" />
            </h2>
            <ul>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>Unlimited</span>
                <span class="hide-desktop">pageviews</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>20+ included</span>
                <span class="hide-desktop">apps &amp; modes</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>100k events/month</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>White labeling</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>Email support</span>
              </li>
              <li class="hide-mobile">
                <font-awesome-icon class="i-n" icon="times" title="No" />
              </li>
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
            <h2 class="hide-desktop">Custom</h2>
            <ul>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>Unlimited</span>
                <span class="hide-desktop">pageviews</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>20+ included</span>
                <span class="hide-desktop">apps &amp; modes</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>Unlimited</span>
                <span class="hide-desktop">event tracking</span>
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
              <li class="hide-mobile">
                <font-awesome-icon class="i-n" icon="times" title="No" />
              </li>
              <li class="hide-mobile">
                <font-awesome-icon class="i-n" icon="times" title="No" />
              </li>
              <li class="hide-mobile">
                <font-awesome-icon class="i-n" icon="times" title="No" />
              </li>
              <li class="hide-mobile">
                <font-awesome-icon class="i-n" icon="times" title="No" />
              </li>
              <li class="hide-mobile">
                <font-awesome-icon class="i-n" icon="times" title="No" />
              </li>
              <li class="hide-mobile">
                <font-awesome-icon class="i-n" icon="times" title="No" />
              </li>
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
              <li class="hide-mobile">
                <font-awesome-icon class="i-n" icon="times" title="No" />
              </li>
              <li class="hide-mobile">
                <font-awesome-icon class="i-n" icon="times" title="No" />
              </li>
              <li class="hide-mobile">
                <font-awesome-icon class="i-n" icon="times" title="No" />
              </li>
              <li class="hide-mobile">
                <font-awesome-icon class="i-n" icon="times" title="No" />
              </li>
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
        <div class="addons row more-plans">
          <div class="card card--type-padded">
            <h3>For tracking &amp; analytics</h3>
            <p>
              Track as many events as you like after your fixed quota for $0.001
              per event.
            </p>
            <a href="#">Purchase Analytics pack &rarr;</a>
          </div>
          <div class="card card--type-padded">
            <h3>For open-source</h3>
            <p>
              $1,000 in credits for open-source projects under permissive
              licenses.
            </p>
            <a href="#">Apply for FOSS &rarr;</a>
          </div>
          <div class="card card--type-padded">
            <h3>For students</h3>
            <p>
              $1,000 in credits for student developers with a verified
              university email account.
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
export default class Pricing extends Vue {
  selectedCurrency = "usd";
  selectedTerm = "monthly";
  proPrices = {
    monthly: {
      usd: 15000,
      eur: 13000,
      inr: 1200000
    },
    annually: {
      usd: 150000,
      eur: 130000,
      inr: 12000000
    }
  };
  currencySymbols = {
    usd: "$",
    eur: "€",
    inr: "₹"
  };
  private changeCurrency(currency: string) {
    this.selectedCurrency = currency;
  }
  get calculatedPrice() {
    return this.proPrices[this.selectedTerm][this.selectedCurrency];
  }
  get currencySymbol() {
    return this.currencySymbols[this.selectedCurrency];
  }
}
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
    padding: 0.25rem 0;
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
  h3 {
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
