// build.js (ESM)
import { build, context } from "esbuild";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);

const isWatch = process.argv.includes("--watch");
const isProd  = process.argv.includes("--prod");

// плагін: перед кожною збіркою запускає fix-css
const fixCssPlugin = {
  name: "fix-css",
  setup(buildCtx) {
    buildCtx.onStart(async () => {
      console.log("🔧 fix-css…");
      await exec("node", ["fix-image-set.js"]);
    });
  },
};

const common = {
  entryPoints: ["js/main.js"],     // твій вхід
  outfile: "js/main.iife.js",      // куди збираємо (посилання в HTML вже є)
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["es2018"],
  sourcemap: isProd ? false : "inline",
  minify: isProd,
  plugins: [fixCssPlugin],
  logLevel: "info",
};

try {
  if (isWatch) {
    const ctx = await context(common);
    await ctx.watch();
    console.log("👀 watching for changes…");
  } else {
    await build(common);
    console.log("✅ build complete");
  }
} catch (err) {
  console.error("❌ build failed", err);
  process.exit(1);
}
