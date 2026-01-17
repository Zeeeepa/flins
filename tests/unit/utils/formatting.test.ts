import { test, expect, describe } from 'bun:test';
import { Plural } from '../../../src/utils/formatting.js';

describe('formatting', () => {
  test('Plural should return singular for count 1', () => {
    expect(Plural(1, 'skill')).toBe('skill');
  });

  test('Plural should return plural for count 0', () => {
    expect(Plural(0, 'skill')).toBe('skills');
  });

  test('Plural should return plural for count > 1', () => {
    expect(Plural(2, 'skill')).toBe('skills');
    expect(Plural(5, 'skill')).toBe('skills');
  });

  test('Plural should use custom plural when provided', () => {
    expect(Plural(2, 'person', 'people')).toBe('people');
    expect(Plural(1, 'person', 'people')).toBe('person');
  });
});
