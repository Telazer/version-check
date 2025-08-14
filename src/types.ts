export type VersionString = `v${number}.${number}.${number}` | `${string}-v${number}.${number}.${number}`;

export type DiffResult = {
  main: boolean;
  major: boolean;
  minor: boolean;
  patch: boolean;
  result: '' | 'patch' | 'minor' | 'major' | 'version';
  isMainChanged: boolean;
  isMajorChanged: boolean;
  isMinorChanged: boolean;
  isPatchChanged: boolean;
};
