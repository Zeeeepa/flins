import { join } from "path";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { getFlinsHomeDir } from "@/utils/paths";
import type { StateFile, SkillEntry } from "@/types/state";
import type { InstallableType } from "@/types/skills";
import { skillKey, commandKey, findInstallations } from "@/utils/state";

const STATE_DIR = getFlinsHomeDir();
const STATE_FILE = join(STATE_DIR, "skills.lock");

function ensureStateDir(): void {
  if (!existsSync(STATE_DIR)) {
    mkdirSync(STATE_DIR, { recursive: true });
  }
}

export function loadState(): StateFile {
  ensureStateDir();

  if (!existsSync(STATE_FILE)) {
    const emptyState: StateFile = {
      lastUpdate: new Date().toISOString(),
      skills: {},
    };
    writeFileSync(STATE_FILE, JSON.stringify(emptyState, null, 2));
    return emptyState;
  }

  try {
    const content = readFileSync(STATE_FILE, "utf-8");
    return JSON.parse(content) as StateFile;
  } catch {
    return {
      lastUpdate: new Date().toISOString(),
      skills: {},
    };
  }
}

export function saveState(state: StateFile): void {
  ensureStateDir();
  state.lastUpdate = new Date().toISOString();
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export function addSkill(
  skillName: string,
  url: string,
  subpath: string | undefined,
  branch: string,
  commit: string,
  installableType: InstallableType = "skill",
): { updated: boolean; previousBranch?: string } {
  const state = loadState();
  const key = installableType === "skill" ? skillKey(skillName) : commandKey(skillName);
  const existing = state.skills[key];

  let updated = false;
  let previousBranch: string | undefined;

  if (existing && existing.branch !== branch) {
    previousBranch = existing.branch;
    updated = true;
  }

  const entry: SkillEntry = {
    url,
    subpath,
    branch,
    commit,
  };

  state.skills[key] = entry;
  saveState(state);
  return { updated, previousBranch };
}

export function removeSkill(skillName: string, installableType: InstallableType): void {
  const state = loadState();
  const key = installableType === "skill" ? skillKey(skillName) : commandKey(skillName);

  delete state.skills[key];
  saveState(state);
}

export function updateSkillCommit(
  skillName: string,
  installableType: InstallableType,
  commit: string,
): void {
  const state = loadState();
  const key = installableType === "skill" ? skillKey(skillName) : commandKey(skillName);

  if (state.skills[key]) {
    state.skills[key].commit = commit;
    saveState(state);
  }
}

export function getSkillEntry(
  skillName: string,
  installableType: InstallableType,
): SkillEntry | null {
  const state = loadState();
  const key = installableType === "skill" ? skillKey(skillName) : commandKey(skillName);

  return state.skills[key] || null;
}

export function getAllSkills(): StateFile {
  return loadState();
}

export function findGlobalSkillInstallations(skillName: string, installableType: InstallableType) {
  return findInstallations(skillName, installableType, { type: "global" });
}

export async function cleanOrphanedEntries(): Promise<void> {
  const state = loadState();
  const orphanedKeys: string[] = [];

  for (const [key, _entry] of Object.entries(state.skills)) {
    const parsed = key.split(":");
    if (parsed.length !== 2) continue;

    const installableType = parsed[0] === "skill" ? "skill" : "command";
    const name = parsed[1]!;
    const installations = findGlobalSkillInstallations(name, installableType);

    if (installations.length === 0) {
      orphanedKeys.push(key);
    }
  }

  for (const key of orphanedKeys) {
    delete state.skills[key];
  }

  if (orphanedKeys.length > 0) {
    saveState(state);
  }
}
