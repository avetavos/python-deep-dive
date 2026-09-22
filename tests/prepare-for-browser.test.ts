import { describe, expect, it } from 'vitest';
import { prepareForBrowser } from '../src/components/py-runner';

describe('prepareForBrowser', () => {
  it('rewrites a bare top-level asyncio.run(...) into a top-level await', () => {
    const src = 'import asyncio\n\nasync def main():\n    print("hi")\n\nasyncio.run(main())\n';
    expect(prepareForBrowser(src)).toBe('import asyncio\n\nasync def main():\n    print("hi")\n\nawait main()\n');
  });

  it('rewrites asyncio.run(...) under an if __name__ guard, dropping the guard', () => {
    const src = 'import asyncio\n\nasync def main():\n    return 1\n\nif __name__ == "__main__":\n    asyncio.run(main())\n';
    expect(prepareForBrowser(src)).toBe('import asyncio\n\nasync def main():\n    return 1\n\nawait main()\n');
  });

  it('leaves code without asyncio.run untouched', () => {
    const src = 'print(1)\nx = asyncio_runner()\n';
    expect(prepareForBrowser(src)).toBe(src);
  });

  it('does not touch an indented asyncio.run inside a function body', () => {
    const src = 'def start():\n    asyncio.run(main())\n\nstart()\n';
    expect(prepareForBrowser(src)).toBe(src);
  });
});
