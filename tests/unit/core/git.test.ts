import { test, expect, describe } from 'bun:test';
import { parseSource } from '../../../src/core/git/parser.js';

describe('git parser', () => {
  test('parseSource should parse GitHub URL', () => {
    const result = parseSource('https://github.com/owner/repo.git');
    expect(result.type).toBe('github');
    expect(result.url).toBe('https://github.com/owner/repo.git');
  });

  test('parseSource should parse GitHub shorthand', () => {
    const result = parseSource('owner/repo');
    expect(result.type).toBe('github');
    expect(result.url).toBe('https://github.com/owner/repo.git');
  });

  test('parseSource should parse GitHub tree URL', () => {
    const result = parseSource('https://github.com/owner/repo/tree/main/skills');
    expect(result.type).toBe('github');
    expect(result.url).toBe('https://github.com/owner/repo.git');
    expect(result.branch).toBe('main');
    expect(result.subpath).toBe('skills');
  });

  test('parseSource should parse GitLab URL', () => {
    const result = parseSource('https://gitlab.com/owner/repo.git');
    expect(result.type).toBe('gitlab');
    expect(result.url).toBe('https://gitlab.com/owner/repo.git');
  });

  test('parseSource should parse GitLab tree URL', () => {
    const result = parseSource('https://gitlab.com/owner/repo/-/tree/main/skills');
    expect(result.type).toBe('gitlab');
    expect(result.url).toBe('https://gitlab.com/owner/repo.git');
    expect(result.branch).toBe('main');
    expect(result.subpath).toBe('skills');
  });

  test('parseSource should parse generic git URL', () => {
    const result = parseSource('https://example.com/repo.git');
    expect(result.type).toBe('git');
    expect(result.url).toBe('https://example.com/repo.git');
  });

  test('parseSource should parse shorthand with subpath', () => {
    const result = parseSource('owner/repo/skills');
    expect(result.type).toBe('github');
    expect(result.url).toBe('https://github.com/owner/repo.git');
    expect(result.subpath).toBe('skills');
  });
});
