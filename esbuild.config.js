var esbuild = require("esbuild");
var inlineImage = require("esbuild-plugin-inline-image");
var dotenv = require("dotenv");
var nodeLib = require("node-stdlib-browser/helpers/esbuild/plugin");
var stdLibBrowser = require("node-stdlib-browser");

dotenv.config();

var variables = {};

Object.keys(process.env)
  .filter((k) => k.startsWith("REACT_APP_"))
  .forEach((k) => (variables[k] = process.env[k]));

var define = {
  process: JSON.stringify({
    env: variables,
  }),
  Buffer: "Buffer",
};

esbuild
  .build({
    entryPoints: ["src/index.tsx"],
    bundle: true,
    minify: false,
    format: "cjs",
    sourcemap: false,
    outfile: "public/dist/bundle.js",
    plugins: [inlineImage(), nodeLib(stdLibBrowser)],
    publicPath: "/dist",
    loader: {
      ".png": "file",
      ".svg": "file",
      ".jpg": "file",
    },
    define,
    inject: [require.resolve("node-stdlib-browser/helpers/esbuild/shim")],
    watch: {
      onRebuild(error, result) {
        var now = new Date();
        if (error) {
          console.log(
            "🙈\x1b[2m %s: \x1b[0m\x1b[37m\x1b[41m%s\x1b[0m %s",
            now.toTimeString(),
            "FAILURE",
            error.message
          );
        } else {
          console.log(
            "🐻‍❄️\x1b[2m %s: \x1b[0m\x1b[30m\x1b[42m%s\x1b[0m %s",
            now.toTimeString(),
            "COMPLETE",
            "Build successful"
          );
        }
      },
    },
  })
  .then(() => console.log("Initialize successful. Watching for changes..."))
  .catch(() => process.exit(1));
