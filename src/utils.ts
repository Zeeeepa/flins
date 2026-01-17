import { existsSync, readdirSync } from 'fs';
import { resolve } from 'path';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import type { SkillInstallation } from './types.js';

export function isValidSkillInstallation(path: string): boolean {
  if (!existsSync(path)) return false;

  try {
    const files = readdirSync(path);
    if (files.length === 0) return false;
    return files.includes('SKILL.md');
  } catch {
    return false;
  }
}

export function resolveInstallationPath(installation: SkillInstallation): string {
  return installation.type === 'global'
    ? installation.path
    : resolve(process.cwd(), installation.path);
}

export function showNoSkillsMessage(): void {
  p.log.warn('No skills tracked. Install skills with:');
  p.log.message(`  ${pc.cyan('give-skill <repo>')}       # Install in current directory`);
  p.log.message(`  ${pc.cyan('give-skill <repo> --global')}  # Install globally`);
}

export const Plural = (count: number, singular: string, plural?: string): string => {
  return count === 1 ? singular : (plural ?? `${singular}s`);
};
