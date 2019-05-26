<template>
  <main itemscope itemtype="http://schema.org/Product">
    <div class="hero hero--align-center">
      <h1>Simple, transparent pricing.</h1>
      <p>
        Our fair pricing charges websites with higher pageviews a subscription
        cost, but is free for smaller websites with less than 10,000 pageviews
        per month.
      </p>
    </div>
    <div
      class="container"
      itemprop="offers"
      itemscope
      itemtype="http://schema.org/Offer"
    >
      <div class="row row--padding-large">
        <div>1</div>
        <div>
          <div class="card card--type-padded text text--align-center">
            <h2 class="plan">Free</h2>
            <div class="price">
              <span itemprop="priceCurrency" content="USD">$</span>
              <span itemprop="price" content="0.00">0</span>
              <link itemprop="availability" href="http://schema.org/InStock" />
            </div>
            <div class="text text--size-small text--color-light">&nbsp;</div>
            <div class="text text--size-small text--color-light">&nbsp;</div>
          </div>
        </div>
        <div>
          <div class="card card--type-padded text text--align-center">
            <h2 class="plan">Basic</h2>
            <div class="price">
              <span itemprop="priceCurrency" content="USD">$</span>
              <span itemprop="price" content="39.00">39</span>
              <link itemprop="availability" href="http://schema.org/InStock" />
            </div>
            <div class="text text--size-small text--color-light">per month</div>
            <div class="text text--size-small text--color-light">
              billed monthly
            </div>
          </div>
        </div>
        <div>
          <div class="card card--type-padded text text--align-center">
            <h2 class="plan">Pro</h2>
            <div class="price">
              <span itemprop="priceCurrency" content="USD">$</span>
              <span itemprop="price" content="99.00">99</span>
              <link itemprop="availability" href="http://schema.org/InStock" />
            </div>
            <div class="text text--size-small text--color-light">per month</div>
            <div class="text text--size-small text--color-light">
              billed monthly
            </div>
          </div>
        </div>
      </div>
      <div class="row row--padding-large">
        <div>
          <div
            class="card card--type-padded card--type-invisible"
            style="padding-left: 0"
          >
            <ul>
              <li>&nbsp;</li>
              <li>Pageviews</li>
              <li>Apps &amp; modes</li>
              <li>Usage metrics</li>
              <li>White labeling</li>
              <li>Branding</li>
              <li>Support</li>
            </ul>
          </div>
        </div>
        <div>
          <div class="card card--type-padded text text--align-center">
            <ul>
              <li><a href="#">Start with free</a></li>
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
                <span>Data analytics</span>
              </li>
              <li><font-awesome-icon class="i-n" icon="times" title="No" /></li>
              <li><font-awesome-icon class="i-n" icon="times" title="No" /></li>
              <li><font-awesome-icon class="i-n" icon="times" title="No" /></li>
            </ul>
          </div>
        </div>
        <div>
          <div class="card card--type-padded text text--align-center">
            <ul>
              <li><a href="#">Start with basic</a></li>
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
                <span>Data analytics</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>White labeling</span>
              </li>
              <li><font-awesome-icon class="i-n" icon="times" title="No" /></li>
              <li><font-awesome-icon class="i-n" icon="times" title="No" /></li>
            </ul>
          </div>
        </div>
        <div>
          <div class="card card--type-padded text text--align-center">
            <ul>
              <li><a href="#">Start with pro</a></li>
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
                <span>Data analytics</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>White labeling</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>Hide &ldquo;Powered by&rdquo;</span>
              </li>
              <li>
                <font-awesome-icon class="i-y" icon="check" title="Yes" />
                <span>Email support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row row--padding-large addons">
        <div>
          <h2>Addons</h2>
        </div>
        <div>
          <div class="card card--type-padded">
            <h3>100% uptime SLA</h3>
            <p>Service-level agreement for 100% uptime for our services</p>
            <a href="#">$99/month &rarr;</a>
          </div>
          <div class="card card--type-padded">
            <h3>100% uptime SLA</h3>
            <p>Service-level agreement for 100% uptime for our services</p>
            <a href="#">$99/month &rarr;</a>
          </div>
        </div>
        <div>
          <div class="card card--type-padded">
            <h3>Enterprise support</h3>
            <p>Live chat, phone, and email support, 7 days a week</p>
            <a href="#">$99/month &rarr;</a>
          </div>
        </div>
        <div>
          <div class="card card--type-padded">
            <h3>Web analytics</h3>
            <p>GDPR-compliant tracking for pageviews, clicks, and more</p>
            <a href="#">$0.0001/event &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
library.add(faCheck, faTimes);

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
.card.card--type-padded.text.text--align-center {
  border-radius: 0.75rem;
}
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
.addons {
  margin-top: 3rem;
  .card + .card {
    margin-top: 2rem;
  }
  h3 {
    margin: 0;
    font-size: 100%;
  }
  p {
    font-size: 95%;
  }
}
</style>
