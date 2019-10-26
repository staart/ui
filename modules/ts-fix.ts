import { Module } from "@nuxt/types";

const tsFix: Module = function() {
  this.nuxt.options.extensions.push("ts");
};

export default tsFix;
