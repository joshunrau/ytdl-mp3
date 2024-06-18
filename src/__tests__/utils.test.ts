import { describe, expect, it } from 'vitest';

import { isDirectory, removeParenthesizedText } from '../utils';

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

describe('isDirectory', () => {
  it('should return true for an existing directory', () => {
    expect(isDirectory(import.meta.dirname)).toBe(true);
  });
  it('should return true for an existing file', () => {
    expect(isDirectory(import.meta.filename)).toBe(false);
  });
  it('should return true for a non-existent file', () => {
    expect(isDirectory('/dev/null/foo.js')).toBe(false);
  });
});
