import { describe, expect, it } from 'vitest';

import { removeParenthesizedText } from '../utils';

describe('removeParenthesizedText', () => {
  it('removes content within square brackets', () => {
    expect(removeParenthesizedText('Hello [world]')).toBe('Hello');
  });
  it('removes content within double square brackets', () => {
    expect(removeParenthesizedText('Hello [[world]]')).toBe('Hello');
  });
  it('removes content within parentheses', () => {
    expect(removeParenthesizedText('Hello (world)')).toBe('Hello');
  });
  it('removes content within double parentheses', () => {
    expect(removeParenthesizedText('Hello (world)')).toBe('Hello');
  });
  it('removes nested content within brackets and parentheses', () => {
    expect(removeParenthesizedText('Hello (beautiful [world])')).toBe('Hello');
    expect(removeParenthesizedText('Hello [beautiful (world)]')).toBe('Hello');
  });
  it('handles strings without brackets or parentheses', () => {
    expect(removeParenthesizedText('Hello World')).toBe('Hello World');
  });
  it('removes brackets and parentheses when they are the only characters', () => {
    expect(removeParenthesizedText('[()]')).toBe('');
  });
  it('handles an empty string', () => {
    expect(removeParenthesizedText('')).toBe('');
  });
});
