export {
  loadState,
  saveState,
  addSkill,
  removeSkillInstallation,
  updateSkillCommit,
  getSkillState,
  getAllSkills,
  cleanOrphanedEntries,
  getStateDir,
  getCacheDir,
} from './global.js';

export {
  loadLocalState,
  saveLocalState,
  addLocalSkill,
  removeLocalSkill,
  getLocalSkill,
  updateLocalSkillCommit,
  getAllLocalSkills,
  findLocalSkillInstallations,
} from './local.js';

export type {
  StateFile,
  SkillState,
  SkillInstallation,
  LocalState,
  LocalSkillEntry,
  Dirent,
} from '../../types/index.js';
