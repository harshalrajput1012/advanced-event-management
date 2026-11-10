import { existsSync, readFileSync, unlinkSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const logsDir = join(root, "logs");

for (const name of ["backend", "frontend"]) {
  const file = join(logsDir, `${name}.pid`);
  if (!existsSync(file)) continue;
  const pid = Number(readFileSync(file, "utf8"));
  try {
    process.kill(pid);
    console.log(`Stopped ${name} PID=${pid}`);
  } catch {
    console.log(`${name} PID=${pid} was not running`);
  }
  unlinkSync(file);
}
