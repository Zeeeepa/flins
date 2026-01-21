import { join } from "path";
import { rmSync } from "fs";
import { tmpdir } from "os";
import { execGit } from "@/utils/git";

export async function cloneRepo(url: string, branch?: string): Promise<string> {
  const tempDir = join(tmpdir(), `flins-${Date.now()}`);

  const args = ["clone", "--depth", "1"];
  if (branch) {
    args.push("--branch", branch);
  }
  args.push(url, tempDir);

  await execGit(args);
  return tempDir;
}

export async function getLatestCommit(url: string, branch = "main"): Promise<string> {
  const result = await execGit(["ls-remote", url, `refs/heads/${branch}`]);
  return result.split(/\s+/)[0] ?? "";
}

export async function getCommitHash(repoPath: string): Promise<string> {
  return execGit(["rev-parse", "HEAD"], { cwd: repoPath });
}

export async function cleanupTempDir(dir: string): Promise<void> {
  rmSync(dir, { recursive: true, force: true });
}
