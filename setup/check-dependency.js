const fs = require("fs-extra");
const path = require("path");
const hasYarn = require("has-yarn");
const shell = require("shelljs");

const checkDependency = async () => {
  const pkg = JSON.parse(
    (await fs.readFile(path.join(__dirname, "..", "package.json"))).toString()
  );
  if (pkg.name !== "@staart/ui" && !Object.keys(pkg.devDependencies).includes("@staart/ui")) {
    if (process.env.USE_NPM || !hasYarn()) {
      shell.exec("npm install --save-dev @staart/ui");
    } else {
      shell.exec("yarn add -D @staart/ui");
    }
  }
};

checkDependency()
  .then(() => {})
  .catch(error => console.log("ERROR", error))
  .then(() => process.exit(0));
