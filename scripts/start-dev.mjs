import { existsSync, mkdirSync, openSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const logsDir = join(root, "logs");
mkdirSync(logsDir, { recursive: true });

function cleanEnv() {
  const env = { ...process.env };
  if (env.Path && env.PATH) {
    env.Path = env.Path || env.PATH;
    delete env.PATH;
  }
  return env;
}

function start(name, cwd, command, args) {
  const out = openSync(join(logsDir, `${name}.out.log`), "a");
  const err = openSync(join(logsDir, `${name}.err.log`), "a");
  const isCmd = command.toLowerCase().endsWith(".cmd") || command.toLowerCase().endsWith(".bat");
  const child = spawn(isCmd ? "cmd.exe" : command, isCmd ? ["/c", command, ...args] : args, {
    cwd,
    env: cleanEnv(),
    detached: true,
    stdio: ["ignore", out, err],
    shell: false,
    windowsHide: true
  });
  child.unref();
  writeFileSync(join(logsDir, `${name}.pid`), String(child.pid));
  console.log(`${name} PID=${child.pid}`);
}

const backendCmd = existsSync(join(root, "backend", "mvnw.cmd")) ? ".\\mvnw.cmd" : "mvn";
start("backend", join(root, "backend"), backendCmd, ["spring-boot:run"]);
start("frontend", join(root, "frontend"), "npm.cmd", ["run", "dev", "--", "--host", "127.0.0.1", "--port", "5174"]);
