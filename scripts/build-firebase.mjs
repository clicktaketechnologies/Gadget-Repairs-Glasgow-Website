#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync, renameSync, mkdirSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const tmp = resolve(root, ".firebase-stash");

if (existsSync(tmp)) rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });
const apiPath = resolve(root, "src/app/api");
if (existsSync(apiPath)) renameSync(apiPath, resolve(tmp, "api"));

const nextConfigPath = resolve(root, "next.config.ts");
const originalNextConfig = readFileSync(nextConfigPath, "utf8");
const patchedConfig = originalNextConfig
  .replace('output: "standalone"', 'output: "export"')
  .replace(/images:[^}]*}/s, "images: { unoptimized: true }");
writeFileSync(nextConfigPath, patchedConfig);

try {
  execSync("npx next build", { stdio: "inherit", env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" } });
  console.log("\n▶ Build complete. Static export is in ./out");
} catch (e) {
  console.error("Build failed:", e.message);
  process.exitCode = 1;
} finally {
  writeFileSync(nextConfigPath, originalNextConfig);
  if (existsSync(resolve(tmp, "api"))) renameSync(resolve(tmp, "api"), apiPath);
  rmSync(tmp, { recursive: true, force: true });
}
