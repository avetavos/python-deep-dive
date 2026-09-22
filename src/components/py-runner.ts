export type RunResult = { output: string; errors: string };

const PYODIDE_VERSION = '314.0.6'; // Pyodide ships CPython 3.14.2; versions now track the CPython minor (314.x)
const CDN = `https://cdn.jsdelivr.net/npm/pyodide@${PYODIDE_VERSION}/`;

type Runtime = {
  setStdout: (o: { batched: (s: string) => void }) => void;
  setStderr: (o: { batched: (s: string) => void }) => void;
  runPythonAsync: (src: string) => Promise<unknown>;
};

let runtime: Runtime | null = null;
let loadPromise: Promise<void> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var loadPyodide: ((opts?: { indexURL?: string }) => Promise<Runtime>) | undefined;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.onload = () => resolve(); s.onerror = () => reject(new Error('failed to load ' + src));
    document.head.appendChild(s);
  });
}

export function loadRuntime(): Promise<void> {
  if (runtime) return Promise.resolve();
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    await loadScript(`${CDN}pyodide.js`);
    runtime = await globalThis.loadPyodide!({ indexURL: CDN });
  })();
  return loadPromise;
}

/**
 * Pyodide already runs inside the browser's event loop, so `asyncio.run(...)`
 * raises "asyncio.run() cannot be called from a running event loop". Lessons
 * keep the canonical CPython form; here we rewrite the final top-level call
 * (bare, or under an `if __name__ == "__main__":` guard) into a top-level
 * `await`, which runPythonAsync supports. Anything else is left untouched.
 */
export function prepareForBrowser(source: string): string {
  const guarded = /^if __name__ == ["']__main__["']:\n(?:[ \t]+asyncio\.run\((.+)\)[ \t]*\n?)$/m;
  const bare = /^asyncio\.run\((.+)\)[ \t]*$/m;
  if (guarded.test(source)) return source.replace(guarded, (_m, expr) => `await ${expr}\n`);
  if (bare.test(source)) return source.replace(bare, (_m, expr) => `await ${expr}`);
  return source;
}

export async function runPython(
  source: string,
  opts: { skipLoad?: boolean; runtime?: Runtime } = {},
): Promise<RunResult> {
  let py = opts.runtime ?? null;
  if (!py) {
    if (!opts.skipLoad) {
      try { await loadRuntime(); }
      catch { return { output: '', errors: 'Failed to load Python runtime — try an online REPL.' }; }
    }
    py = runtime;
  }
  if (!py) return { output: '', errors: 'Python runtime unavailable.' };

  let out = '';
  const sink = { batched: (s: string) => { out += s + '\n'; } };
  py.setStdout(sink);
  py.setStderr(sink);
  try {
    await py.runPythonAsync(prepareForBrowser(source));
    return { output: out, errors: '' };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { output: out, errors: msg };
  }
}
