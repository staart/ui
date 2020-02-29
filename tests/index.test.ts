import { join } from "path";
import { readFileSync } from "fs";
import { exec } from "shelljs";
import { JSDOM } from "jsdom";

jest.setTimeout(60000);
const publicDir = join(__dirname, "..", "public");

beforeAll(async () => {
  exec("npm run generate");
});

test("index.html is created", () => {
  readFileSync(join(publicDir, "index.html"));
});

test("index.html has a title", () => {
  readFileSync(join(publicDir, "index.html"))
    .toString()
    .includes("<title>StartupName");
});

test("pwa is build", () => {
  readFileSync(join(publicDir, "site.webmanifest"));
});

test("login form has a password input", () => {
  const html = readFileSync(
    join(publicDir, "auth", "login", "index.html")
  ).toString();
  const { window } = new JSDOM(html).window;
  const element = window.document.querySelector("form input[type='password']");
  expect(element).toBeTruthy();
});
