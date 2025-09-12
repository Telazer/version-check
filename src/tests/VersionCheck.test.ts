// tests/versionCheck.spec.ts
import { VersionCheck } from '../VersionCheck';
import type { VersionString } from '../types';

type Expected = {
  major: boolean;
  minor: boolean;
  patch: boolean;
  result: '' | 'patch' | 'minor' | 'major';
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
    isMajorChanged: boolean;
    isMinorChanged: boolean;
    isPatchChanged: boolean;
  }>;
};

export const cases: Array<Case> = [
  {
    test: 'No change',
    v1: '1.2.3',
    v2: '1.2.3',
    expected: {
      major: false,
      minor: false,
      patch: false,
      result: '',
      isMajorChanged: false,
      isMinorChanged: false,
      isPatchChanged: false,
    },
    helpers: {
      isMajorChanged: false,
      isMinorChanged: false,
      isPatchChanged: false,
    },
  },
  {
    test: 'Patch change',
    v1: '1.2.3',
    v2: '1.2.4',
    expected: {
      major: false,
      minor: false,
      patch: true,
      result: 'patch',
      isMajorChanged: false,
      isMinorChanged: false,
      isPatchChanged: true,
    },
    helpers: {
      isMajorChanged: false,
      isMinorChanged: false,
      isPatchChanged: true,
    },
  },
  {
    test: 'Minor change (resets patch)',
    v1: '1.2.9',
    v2: '1.3.0',
    expected: {
      major: false,
      minor: true,
      patch: true,
      result: 'minor',
      isMajorChanged: false,
      isMinorChanged: true,
      isPatchChanged: true,
    },
    helpers: {
      isMajorChanged: false,
      isMinorChanged: true,
      isPatchChanged: true,
    },
  },
  {
    test: 'Major change (resets minor and patch)',
    v1: '1.9.9',
    v2: '2.0.0',
    expected: {
      major: true,
      minor: true,
      patch: true,
      result: 'major',
      isMajorChanged: true,
      isMinorChanged: true,
      isPatchChanged: true,
    },
    helpers: {
      isMajorChanged: true,
      isMinorChanged: true,
      isPatchChanged: true,
    },
  },
  // {
  //   test: 'Main (prefix) change only',
  //   v1: 'game-1.2.3',
  //   v2: 'editor-1.2.3',
  //   expected: {
  //     major: false,
  //     minor: false,
  //     patch: false,
  //     result: 'version',
  //     isMajorChanged: true,
  //     isMinorChanged: true,
  //     isPatchChanged: true,
  //   },
  //   helpers: {
  //     isMajorChanged: true,
  //     isMinorChanged: true,
  //     isPatchChanged: true,
  //   },
  // },
  // {
  //   test: 'From no-main to main (prefix added)',
  //   v1: 'v1.0.0',
  //   v2: 'api-v1.0.0',
  //   expected: {
  //     major: false,
  //     minor: false,
  //     patch: false,
  //     result: 'version',
  //     isMajorChanged: true,
  //     isMinorChanged: true,
  //     isPatchChanged: true,
  //   },
  //   helpers: {
  //     isMajorChanged: true,
  //     isMinorChanged: true,
  //     isPatchChanged: true,
  //   },
  // },
  // {
  //   test: 'Zero-padded numbers parse equal',
  //   v1: 'v01.02.003',
  //   v2: 'v1.2.3',
  //   expected: {
  //     major: true,
  //     minor: true,
  //     patch: true,
  //     result: 'major',
  //     isMajorChanged: true,
  //     isMinorChanged: true,
  //     isPatchChanged: true,
  //   },
  // },
  // {
  //   test: 'Main + Major change',
  //   v1: 'core-v1.2.3',
  //   v2: 'core-v2.0.0',
  //   expected: {
  //     major: true,
  //     minor: true,
  //     patch: true,
  //     result: 'major',
  //     isMajorChanged: true,
  //     isMinorChanged: true,
  //     isPatchChanged: true,
  //   },
  // },
  // {
  //   test: 'Main change dominates even if numerics equal',
  //   v1: 'core-v1.2.3',
  //   v2: 'ui-v1.2.3',
  //   expected: {
  //     major: false,
  //     minor: false,
  //     patch: false,
  //     result: 'version',
  //     isMajorChanged: true,
  //     isMinorChanged: true,
  //     isPatchChanged: true,
  //   },
  // },
];

describe('VersionCheck.diff', () => {
  for (const c of cases) {
    test(c.test, () => {
      const diff = VersionCheck.diff(c.v1, c.v2);
      expect(diff).toEqual(c.expected);

      if (c.helpers) {
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
    expect(() => VersionCheck.diff('v1.2.3' as VersionString, '1.2.3')).toThrow();
  });

  test('Invalid format with missing patch', () => {
    expect(() => VersionCheck.diff('v1.2' as VersionString, '1.2.0')).toThrow();
  });
});
