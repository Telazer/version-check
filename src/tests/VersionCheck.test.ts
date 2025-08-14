// tests/versionCheck.spec.ts
import { VersionCheck } from '../VersionCheck';
import type { VersionString } from '../types';

type Expected = {
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

type Case = {
  test: string;
  v1: VersionString;
  v2: VersionString;
  expected: Expected;
  helpers?: Partial<{
    isVersionChanged: boolean;
    isMajorChanged: boolean;
    isMinorChanged: boolean;
    isPatchChanged: boolean;
  }>;
};

export const cases: Array<Case> = [
  {
    test: 'No change',
    v1: 'v1.2.3',
    v2: 'v1.2.3',
    expected: {
      main: false,
      major: false,
      minor: false,
      patch: false,
      result: '',
      isMainChanged: false,
      isMajorChanged: false,
      isMinorChanged: false,
      isPatchChanged: false,
    },
    helpers: {
      isVersionChanged: false,
      isMajorChanged: false,
      isMinorChanged: false,
      isPatchChanged: false,
    },
  },
  {
    test: 'Patch change',
    v1: 'v1.2.3',
    v2: 'v1.2.4',
    expected: {
      main: false,
      major: false,
      minor: false,
      patch: true,
      result: 'patch',
      isMainChanged: false,
      isMajorChanged: false,
      isMinorChanged: false,
      isPatchChanged: true,
    },
    helpers: {
      isVersionChanged: false,
      isMajorChanged: false,
      isMinorChanged: false,
      isPatchChanged: true,
    },
  },
  {
    test: 'Minor change (resets patch)',
    v1: 'v1.2.9',
    v2: 'v1.3.0',
    expected: {
      main: false,
      major: false,
      minor: true,
      patch: true,
      result: 'minor',
      isMainChanged: false,
      isMajorChanged: false,
      isMinorChanged: true,
      isPatchChanged: true,
    },
    helpers: {
      isVersionChanged: false,
      isMajorChanged: false,
      isMinorChanged: true,
      isPatchChanged: true,
    },
  },
  {
    test: 'Major change (resets minor and patch)',
    v1: 'v1.9.9',
    v2: 'v2.0.0',
    expected: {
      main: false,
      major: true,
      minor: true,
      patch: true,
      result: 'major',
      isMainChanged: false,
      isMajorChanged: true,
      isMinorChanged: true,
      isPatchChanged: true,
    },
    helpers: {
      isVersionChanged: false,
      isMajorChanged: true,
      isMinorChanged: true,
      isPatchChanged: true,
    },
  },
  {
    test: 'Main (prefix) change only',
    v1: 'game-v1.2.3',
    v2: 'editor-v1.2.3',
    expected: {
      main: true,
      major: false,
      minor: false,
      patch: false,
      result: 'version',
      isMainChanged: true,
      isMajorChanged: true,
      isMinorChanged: true,
      isPatchChanged: true,
    },
    helpers: {
      isVersionChanged: true,
      isMajorChanged: true,
      isMinorChanged: true,
      isPatchChanged: true,
    },
  },
  {
    test: 'From no-main to main (prefix added)',
    v1: 'v1.0.0',
    v2: 'api-v1.0.0',
    expected: {
      main: true,
      major: false,
      minor: false,
      patch: false,
      result: 'version',
      isMainChanged: true,
      isMajorChanged: true,
      isMinorChanged: true,
      isPatchChanged: true,
    },
    helpers: {
      isVersionChanged: true,
      isMajorChanged: true,
      isMinorChanged: true,
      isPatchChanged: true,
    },
  },
  {
    test: 'Zero-padded numbers parse equal',
    v1: 'v01.02.003',
    v2: 'v1.2.3',
    expected: {
      main: false,
      major: true,
      minor: true,
      patch: true,
      result: 'major',
      isMainChanged: false,
      isMajorChanged: true,
      isMinorChanged: true,
      isPatchChanged: true,
    },
  },
  {
    test: 'Main + Major change',
    v1: 'core-v1.2.3',
    v2: 'core-v2.0.0',
    expected: {
      main: false,
      major: true,
      minor: true,
      patch: true,
      result: 'major',
      isMainChanged: false,
      isMajorChanged: true,
      isMinorChanged: true,
      isPatchChanged: true,
    },
  },
  {
    test: 'Main change dominates even if numerics equal',
    v1: 'core-v1.2.3',
    v2: 'ui-v1.2.3',
    expected: {
      main: true,
      major: false,
      minor: false,
      patch: false,
      result: 'version',
      isMainChanged: true,
      isMajorChanged: true,
      isMinorChanged: true,
      isPatchChanged: true,
    },
  },
];

describe('VersionCheck.diff', () => {
  for (const c of cases) {
    test(c.test, () => {
      const diff = VersionCheck.diff(c.v1, c.v2);
      expect(diff).toEqual(c.expected);

      if (c.helpers) {
        if ('isVersionChanged' in c.helpers) {
          expect(VersionCheck.isVersionChanged(c.v1, c.v2)).toBe(c.helpers.isVersionChanged);
        }
        if ('isMajorChanged' in c.helpers) {
          expect(VersionCheck.isMajorChanged(c.v1, c.v2)).toBe(c.helpers.isMajorChanged);
        }
        if ('isMinorChanged' in c.helpers) {
          expect(VersionCheck.isMinorChanged(c.v1, c.v2)).toBe(c.helpers.isMinorChanged);
        }
        if ('isPatchChanged' in c.helpers) {
          expect(VersionCheck.isPatchChanged(c.v1, c.v2)).toBe(c.helpers.isPatchChanged);
        }
      }
    });
  }
});

describe('VersionCheck.parse validation', () => {
  test('Invalid format without leading v', () => {
    expect(() => VersionCheck.diff('1.2.3' as VersionString, 'v1.2.3')).toThrow();
  });

  test('Invalid format with missing patch', () => {
    expect(() => VersionCheck.diff('v1.2' as VersionString, 'v1.2.0')).toThrow();
  });
});
