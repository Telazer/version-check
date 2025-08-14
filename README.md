# Telazer - VersionCheck

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/Telazer/version-check)

For more helpers and utilities, check out the [Telazer NPM Page](https://www.npmjs.com/org/telazer)

A TypeScript utility for comparing semantic-style version strings (with optional main/prefix section) and detecting changes by level.

---

## Installation

```bash
npm install @telazer/version-check
```

---

## Key Features

- Parses versions like:
  - `"v1.2.3"`
  - `"main-v1.2.3"`

- Detects changes at **patch**, **minor**, **major**, or **main** (prefix) level
- Two kinds of change flags:
  - **Direct**: `main`, `major`, `minor`, `patch` → **only true if that level changed**
  - **Cascading**: `isMainChanged`, `isMajorChanged`, `isMinorChanged`, `isPatchChanged` → **true if the change is at that level or higher**

- Helper methods:
  - `isPatchChanged()`
  - `isMinorChanged()`
  - `isMajorChanged()`
  - `isVersionChanged()` (main change)

---

## Quick Start

```ts
import { VersionCheck } from '@telazer/version-check';

VersionCheck.diff('v1.2.3', 'v1.2.4');
/*
{
  main: false,
  major: false,
  minor: false,
  patch: true,
  result: 'patch',
  isMainChanged: false,
  isMajorChanged: false,
  isMinorChanged: false,
  isPatchChanged: true
}
*/

VersionCheck.isMinorChanged('v1.2.3', 'v1.3.0'); // true
VersionCheck.isMajorChanged('core-v1.2.3', 'core-v2.0.0'); // true
VersionCheck.isVersionChanged('core-v1.2.3', 'ui-v1.2.3'); // true
```

---

## Direct vs. Cascading Flags

| Change Type     | `main` | `major` | `minor` | `patch` | `isMainChanged` | `isMajorChanged` | `isMinorChanged` | `isPatchChanged` |
| --------------- | ------ | ------- | ------- | ------- | --------------- | ---------------- | ---------------- | ---------------- |
| **Patch only**  | ❌     | ❌      | ❌      | ✅      | ❌              | ❌               | ❌               | ✅               |
| **Minor only**  | ❌     | ❌      | ✅      | ❌      | ❌              | ❌               | ✅               | ✅               |
| **Major only**  | ❌     | ✅      | ❌      | ❌      | ❌              | ✅               | ✅               | ✅               |
| **Main change** | ✅     | ❌      | ❌      | ❌      | ✅              | ✅               | ✅               | ✅               |

**Legend:**
✅ = `true`, ❌ = `false`

**How to read this table:**

- `main`/`major`/`minor`/`patch` → **Only this specific level**
- `is*Changed` → **This level OR anything higher**

Example:
If **major** changes, `major` is `true`, but also `isMajorChanged`, `isMinorChanged`, and `isPatchChanged` are all `true` because major is above them.

---

## API

### `diff(version1, version2)`

Returns:

```ts
type DiffResult = {
  main: boolean; // direct main change
  major: boolean; // direct major change
  minor: boolean; // direct minor change
  patch: boolean; // direct patch change

  result: '' | 'patch' | 'minor' | 'major' | 'version'; // highest-level change

  isMainChanged: boolean;
  isMajorChanged: boolean;
  isMinorChanged: boolean;
  isPatchChanged: boolean;
};
```

---

### `isPatchChanged(version1, version2)`

True if **patch or higher** changed.

### `isMinorChanged(version1, version2)`

True if **minor or higher** changed.

### `isMajorChanged(version1, version2)`

True if **major or higher** changed.

### `isVersionChanged(version1, version2)`

True if **main/prefix** changed.

---

## Behavior Details

- **Main/prefix** is before the first `-` in the version:
  - `"core-v1.2.3"` → main = `"core"`
  - `"v1.2.3"` → main = `""`

- Comparisons are string-based (so `"01"` ≠ `"1"`).
- `result` is the highest-level change detected.
- Higher-level changes set all lower `is*Changed` flags.

---

## Examples

```ts
VersionCheck.diff('v1.2.3', 'v1.2.4');
// Patch change only

VersionCheck.diff('v1.2.3', 'v1.3.0');
// Minor change

VersionCheck.diff('v1.2.3', 'v2.0.0');
// Major change

VersionCheck.diff('core-v1.2.3', 'ui-v1.2.3');
// Main change
```

---

## Development

```bash
git clone https://github.com/Telazer/version-check
npm install
npm run watch
npm test
npm run build
```

---

## License

MIT License

Copyright (c) 2025 Telazer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
