import { homedir } from 'os';
import { join, resolve } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync } from 'fs';
import { isValidSkillInstallation } from './utils.js';
import type { StateFile, SkillState, SkillInstallation, AgentType, LocalState, LocalSkillEntry, Dirent } from './types.js';
import { agents } from './agents.js';

const STATE_VERSION = '1.0.0';
const LOCAL_STATE_FILE = 'skills.lock';

const STATE_DIR = join(homedir(), '.give-skill');
const STATE_FILE = join(STATE_DIR, 'state.json');

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
    const content = readFileSync(STATE_FILE, 'utf-8');
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
  installation: SkillInstallation
): { updated: boolean; previousBranch?: string } {
  const state = loadState();
  const key = skillName.toLowerCase();

  let updated = false;
  let previousBranch: string | undefined;

  if (!state.skills[key]) {
    state.skills[key] = {
      url,
      subpath,
      branch,
      commit,
      installations: [],
    };
  } else {
    if (state.skills[key].branch !== branch) {
      previousBranch = state.skills[key].branch;
      state.skills[key].branch = branch;
      state.skills[key].commit = commit;
      updated = true;
    }
    state.skills[key].url = url;
    if (subpath) {
      state.skills[key].subpath = subpath;
    }
  }

  const existingIndex = state.skills[key].installations.findIndex(
    i => i.agent === installation.agent && i.path === installation.path
  );

  if (existingIndex >= 0) {
    state.skills[key].installations[existingIndex] = installation;
  } else {
    state.skills[key].installations.push(installation);
  }

  saveState(state);
  return { updated, previousBranch };
}

export function removeSkillInstallation(skillName: string, agent: AgentType, path: string): void {
  const state = loadState();
  const key = skillName.toLowerCase();

  if (!state.skills[key]) {
    return;
  }

  state.skills[key].installations = state.skills[key].installations.filter(
    i => !(i.agent === agent && i.path === path)
  );

  if (state.skills[key].installations.length === 0) {
    delete state.skills[key];
  }

  saveState(state);
}

export function updateSkillCommit(skillName: string, commit: string): void {
  const state = loadState();
  const key = skillName.toLowerCase();

  if (state.skills[key]) {
    state.skills[key].commit = commit;
    saveState(state);
  }
}

export function getSkillState(skillName: string): SkillState | null {
  const state = loadState();
  return state.skills[skillName.toLowerCase()] || null;
}

export function getAllSkills(): StateFile {
  return loadState();
}

export async function cleanOrphanedEntries(): Promise<void> {
  const state = loadState();
  const orphanedKeys: string[] = [];

  for (const [key, skillState] of Object.entries(state.skills)) {
    const validInstallations: SkillInstallation[] = [];

    for (const installation of skillState.installations) {
      try {
        const path = installation.type === 'global'
          ? installation.path
          : join(process.cwd(), installation.path);
        if (isValidSkillInstallation(path)) {
          validInstallations.push(installation);
        }
      } catch {
      }
    }

    if (validInstallations.length === 0) {
      orphanedKeys.push(key);
    } else if (validInstallations.length !== skillState.installations.length) {
      skillState.installations = validInstallations;
    }
  }

  for (const key of orphanedKeys) {
    delete state.skills[key];
  }

  if (orphanedKeys.length > 0) {
    saveState(state);
  }
}

export function getStateDir(): string {
  ensureStateDir();
  return STATE_DIR;
}

export function getCacheDir(): string {
  const cacheDir = join(STATE_DIR, 'cache');
  if (!existsSync(cacheDir)) {
    mkdirSync(cacheDir, { recursive: true });
  }
  return cacheDir;
}

function getLocalStatePath(cwd?: string): string {
  const basePath = cwd || process.cwd();
  return resolve(basePath, LOCAL_STATE_FILE);
}

export function loadLocalState(cwd?: string): LocalState | null {
  const statePath = getLocalStatePath(cwd);

  if (!existsSync(statePath)) {
    return null;
  }

  try {
    const content = readFileSync(statePath, 'utf-8');
    const state = JSON.parse(content) as LocalState;

    if (!state.version || !state.skills) {
      return null;
    }

    return state;
  } catch {
    return null;
  }
}

export function saveLocalState(state: LocalState, cwd?: string): void {
  const statePath = getLocalStatePath(cwd);
  state.version = STATE_VERSION;
  writeFileSync(statePath, JSON.stringify(state, null, 2));
}

export function addLocalSkill(
  skillName: string,
  url: string,
  subpath: string | undefined,
  branch: string,
  commit: string,
  cwd?: string
): { updated: boolean; previousBranch?: string } {
  let state = loadLocalState(cwd);

  if (!state) {
    state = {
      version: STATE_VERSION,
      skills: {},
    };
  }

  const key = skillName.toLowerCase();
  let updated = false;
  let previousBranch: string | undefined;

  if (!state.skills[key]) {
    state.skills[key] = {
      url,
      subpath,
      branch,
      commit,
    };
  } else {
    if (state.skills[key].branch !== branch) {
      previousBranch = state.skills[key].branch;
      state.skills[key].branch = branch;
      state.skills[key].commit = commit;
      updated = true;
    }
    state.skills[key].url = url;
    state.skills[key].commit = commit;
    if (subpath) {
      state.skills[key].subpath = subpath;
    }
  }

  saveLocalState(state, cwd);
  return { updated, previousBranch };
}

export function removeLocalSkill(skillName: string, cwd?: string): void {
  const state = loadLocalState(cwd);

  if (!state) {
    return;
  }

  const key = skillName.toLowerCase();
  delete state.skills[key];

  if (Object.keys(state.skills).length > 0) {
    saveLocalState(state, cwd);
  } else {
    const statePath = getLocalStatePath(cwd);
    if (existsSync(statePath)) {
      try {
        rmSync(statePath, { force: true });
      } catch {
      }
    }
  }
}

export function getLocalSkill(skillName: string, cwd?: string): LocalSkillEntry | null {
  const state = loadLocalState(cwd);
  if (!state) {
    return null;
  }
  return state.skills[skillName.toLowerCase()] || null;
}

export function updateLocalSkillCommit(skillName: string, commit: string, cwd?: string): void {
  const state = loadLocalState(cwd);

  if (!state || !state.skills[skillName.toLowerCase()]) {
    return;
  }

  const skill = state.skills[skillName.toLowerCase()];
  if (skill) {
    skill.commit = commit;
    saveLocalState(state, cwd);
  }
}

export function getAllLocalSkills(cwd?: string): LocalState | null {
  return loadLocalState(cwd);
}

export function findLocalSkillInstallations(skillName: string, cwd?: string): SkillInstallation[] {
  const installations: SkillInstallation[] = [];
  const basePath = cwd || process.cwd();

  for (const [agentType, agentConfig] of Object.entries(agents)) {
    const skillsDirPath = join(basePath, agentConfig.skillsDir);

    if (existsSync(skillsDirPath)) {
      try {
        const entries = readdirSync(skillsDirPath, { withFileTypes: true }) as Dirent[];
        const matchingEntry = entries.find(e =>
          e.isDirectory() && e.name.toLowerCase() === skillName.toLowerCase()
        );

        if (matchingEntry) {
          installations.push({
            agent: agentType as AgentType,
            type: 'project',
            path: join(agentConfig.skillsDir, matchingEntry.name),
          });
        }
      } catch {
      }
    }

    const globalSkillsDirPath = agentConfig.globalSkillsDir;
    if (existsSync(globalSkillsDirPath)) {
      try {
        const entries = readdirSync(globalSkillsDirPath, { withFileTypes: true }) as Dirent[];
        const matchingEntry = entries.find(e =>
          e.isDirectory() && e.name.toLowerCase() === skillName.toLowerCase()
        );

        if (matchingEntry) {
          installations.push({
            agent: agentType as AgentType,
            type: 'global',
            path: join(globalSkillsDirPath, matchingEntry.name),
          });
        }
      } catch {
      }
    }
  }

  return installations;
}
