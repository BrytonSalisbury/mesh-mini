import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: ["meshcommander.js"],
  output: {
    file: ".\\build\\bundled-mesh.js",
    format: "cjs",
  },
  plugins: [commonjs(), nodeResolve(), json()],
};
