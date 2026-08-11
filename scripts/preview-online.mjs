import { spawn } from "node:child_process";
import localtunnel from "localtunnel";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const host = "127.0.0.1";
const nextBin = process.platform === "win32" ? "next.cmd" : "next";

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  console.error("PORT must be a number between 1 and 65535.");
  process.exit(1);
}

const server = spawn(nextBin, ["dev", "--hostname", host, "--port", String(port)], {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
});

async function waitForServer() {
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Next.js exited with code ${server.exitCode}.`);
    }

    try {
      await fetch(`http://${host}:${port}`);
      return;
    } catch {
      // The development server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error("Next.js did not become ready within 60 seconds.");
}

let tunnel;

async function shutDown(signal) {
  await tunnel?.close();
  if (server.exitCode === null) server.kill(signal);
}

process.once("SIGINT", () => void shutDown("SIGINT"));
process.once("SIGTERM", () => void shutDown("SIGTERM"));

try {
  await waitForServer();
  tunnel = await localtunnel({ port, local_host: host });
  console.log(`\nPublic preview: ${tunnel.url}`);
  console.log("Keep this command running while the preview is being reviewed.\n");
  tunnel.on("close", () => {
    if (server.exitCode === null) server.kill("SIGTERM");
  });
} catch (error) {
  console.error(`Unable to start the public preview: ${error.message}`);
  await shutDown("SIGTERM");
  process.exitCode = 1;
}
