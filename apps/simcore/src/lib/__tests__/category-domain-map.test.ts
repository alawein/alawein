import { describe, it, expect } from 'vitest';
import { categoryToThemeDomain, categoryToGroupDomain } from '@/lib/category-domain-map';

describe('category-domain-map', () => {
  it('maps categories to theme domains', () => {
    expect(categoryToThemeDomain('Band Structure')).toBe('quantum');
    expect(categoryToThemeDomain('Statistical Physics')).toBe('statistical');
    expect(categoryToThemeDomain('Materials & Crystals')).toBe('fields');
    expect(['energy','fields','quantum','statistical']).toContain(categoryToThemeDomain('Scientific ML'));
  });

  it('maps categories to group domains', () => {
    expect(categoryToGroupDomain('Band Structure')).toBe('Physics');
    expect(categoryToGroupDomain('Field Theory')).toBe('Mathematics');
    expect(categoryToGroupDomain('Scientific ML')).toBe('Scientific ML');
    expect(categoryToGroupDomain('Advanced Features')).toBe('Advanced');
  });
});
