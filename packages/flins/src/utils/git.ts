import { spawn } from "child_process";

export async function execGit(args: string[], options?: { cwd?: string }): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let output = "";
    const proc = spawn("git", args, {
      stdio: "pipe",
      cwd: options?.cwd,
    });

    proc.stdout?.on("data", (data) => {
      output += data.toString();
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`Git command failed: git ${args.join(" ")}`));
      }
    });

    proc.on("error", reject);
  });
}
