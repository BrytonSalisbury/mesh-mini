import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: ["bundled-mesh\\meshcommander.js"],
  output: {
    dir: "bundled-mesh",
    format: "cjs",
  },
  plugins: [commonjs(), nodeResolve(), json()],
};
