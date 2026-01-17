import { test, expect, describe } from 'bun:test';
import { resolveInstallationPath } from '../../../src/utils/paths.js';
import type { SkillInstallation } from '../../../src/types/index.js';

describe('paths', () => {
  test('resolveInstallationPath should return path for global installation', () => {
    const installation: SkillInstallation = {
      agent: 'opencode',
      type: 'global',
      path: '/home/user/.config/opencode/skill/test-skill',
    };

    const result = resolveInstallationPath(installation);
    expect(result).toBe('/home/user/.config/opencode/skill/test-skill');
  });

  test('resolveInstallationPath should resolve relative path for project installation', () => {
    const installation: SkillInstallation = {
      agent: 'opencode',
      type: 'project',
      path: '.opencode/skill/test-skill',
    };

    const result = resolveInstallationPath(installation);
    expect(result).toContain('.opencode/skill/test-skill');
  });
});
