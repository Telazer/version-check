import { DiffResult, VersionString } from './types';

export class VersionCheck {
  private static rx = /^(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)$/;

  private static parse(version: VersionString) {
    const match = this.rx.exec(version);
    if (!match || !match.groups) throw new Error(`Invalid version: ${version}`);

    const { major, minor, patch } = match.groups;

    return { major, minor, patch };
  }

  public static diff(version1: VersionString, version2: VersionString): DiffResult {
    const result = {
      major: false,
      minor: false,
      patch: false,
      result: '' as DiffResult['result'],
      isMajorChanged: false,
      isMinorChanged: false,
      isPatchChanged: false,
    };

    const v1 = this.parse(version1);
    const v2 = this.parse(version2);

    if (v1.patch !== v2.patch) {
      result.patch = true;
      result.result = 'patch';
      result.isPatchChanged = true;
    }
    if (v1.minor !== v2.minor) {
      result.minor = true;
      result.result = 'minor';
      result.isPatchChanged = true;
      result.isMinorChanged = true;
    }
    if (v1.major !== v2.major) {
      result.major = true;
      result.result = 'major';
      result.isPatchChanged = true;
      result.isMinorChanged = true;
      result.isMajorChanged = true;
    }

    return result;
  }

  public static isPatchChanged(version1: VersionString, version2: VersionString) {
    return this.diff(version1, version2).isPatchChanged;
  }

  public static isMinorChanged(version1: VersionString, version2: VersionString) {
    return this.diff(version1, version2).isMinorChanged;
  }

  public static isMajorChanged(version1: VersionString, version2: VersionString) {
    return this.diff(version1, version2).isMajorChanged;
  }
}
