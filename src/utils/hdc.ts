import { Command } from "@tauri-apps/plugin-shell";

export function hdc(...args: string[]) {
  const command = Command.sidecar("binaries/hdc", args);
  return command.execute();
}

export type TargetMode = "TCP" | "USB";
export type TargetStatus = "Connected" | "Offline";
export interface Target {
  name: string;
  mode: TargetMode;
  status: TargetStatus;
  host: string;
}

export async function listTargets() {
  const output = await hdc("list", "targets", "-v");
  if (output.code) {
    return Promise.reject(output.stderr);
  }
  const lines = output.stdout.split("\n").filter((item) => item.trim());
  const targets: Target[] = [];
  lines.map((line) => {
    const [name, mode, status, host] = line.split(/\t+/);
    targets.push({ name, mode: mode as TargetMode, status: status as TargetStatus, host });
  });
  return targets;
}
