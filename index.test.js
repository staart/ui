import { resolve } from "path";
import { Nuxt, Builder } from "nuxt";
import { JSDOM } from "jsdom";
import test from "ava";

let nuxt = null;

test.before(async () => {
  const config = {
    dev: false,
    rootDir: resolve(__dirname, "..")
  };
  nuxt = new Nuxt(config);
  await new Builder(nuxt).build();
  await nuxt.server.listen(4000, "localhost");
}, 30000);

test("Route / exits and render HTML", async t => {
  const context = {};
  const { html } = await nuxt.server.renderRoute("/", context);
  t.true(html.includes(`<h1 class="red">Hello world!</h1>`));
});

test("Route / exits and render HTML with CSS applied", async t => {
  const context = {};
  const { html } = await nuxt.server.renderRoute("/", context);
  const { window } = new JSDOM(html).window;
  const element = window.document.querySelector(".red");
  t.not(element, null);
  t.is(element.textContent, "Hello world!");
  t.is(element.className, "red");
  t.is(window.getComputedStyle(element).color, "red");
});

test.after("Closing server and nuxt.js", t => {
  nuxt.close();
});
