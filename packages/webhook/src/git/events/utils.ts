import micromatch from 'micromatch';

export const patternMatch = (files: string[], patterns: string[]): boolean => {
  const filterFiles = micromatch(files, patterns);
  return filterFiles.length > 0;
}
