// Verify every EN playground snippet runs on CPython 3.14 and prints without error.
// Usage: node tools/verify-playgrounds.mjs [pathFilter]
// The site runs snippets on Pyodide (CPython 3.14.2); locally we use python3.14.
// Compare the printed stdout against the `#` output comments in the lesson by eye.
import { readFileSync, mkdirSync, writeFileSync, globSync } from 'node:fs';
import { execSync } from 'node:child_process';

const PYTHON = process.env.PYTHON ?? 'python3.14';
const filter = process.argv[2] ?? '';
const files = globSync('src/content/docs/en/**/*.mdx').filter((f) => f.includes(filter));

let fail = 0;
let n = 0;
for (const f of files.sort()) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/export const (\w+Code) = `((?:[^`\\]|\\[\s\S])*)`(?:\.trim\(\))?;?\n/g)) {
    n++;
    const code = Function('return `' + m[2] + '`')().trim() + '\n';
    const dir = `.verify/${f.replace(/[\/.]/g, '_')}_${m[1]}`;
    mkdirSync(dir, { recursive: true });
    writeFileSync(`${dir}/main.py`, code);
    try {
      // -X dev surfaces ResourceWarnings and "coroutine was never awaited".
      const out = execSync(`cd ${dir} && ${PYTHON} -X dev -W error::RuntimeWarning main.py`, {
        stdio: 'pipe',
        timeout: 30000,
      });
      console.log(`OK   ${f} ${m[1]}\n--- stdout ---\n${out.toString()}--------------`);
    } catch (e) {
      fail++;
      console.log(`FAIL ${f} ${m[1]}\n${String(e.stderr).slice(0, 600)}`);
    }
  }
}
console.log(`${n} playgrounds, ${fail} failed`);
process.exit(fail ? 1 : 0);
