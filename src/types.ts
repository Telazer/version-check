export type VersionString = `${number}.${number}.${number}`;

export type DiffResult = {
  major: boolean;
  minor: boolean;
  patch: boolean;
  result: '' | 'patch' | 'minor' | 'major';
  isMajorChanged: boolean;
  isMinorChanged: boolean;
  isPatchChanged: boolean;
};
