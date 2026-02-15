/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016-2023 Mickael Jeanroy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import path from 'path';
import fs from 'fs/promises';
import * as rollup from 'rollup';
import tmp from 'tmp';
import stripBanner from '../../src/index';
import { joinLines } from '../utils/join-lines';

describe('rollup-plugin-strip-banner', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = tmp.dirSync({
      unsafeCleanup: true,
    });
  });

  afterEach(() => {
    tmpDir.removeCallback();
  });

  it('should strip banner of chunks', async () => {
    await runAndVerify('test-file-1');
  });

  it('should strip banner with "@license" keyword', async () => {
    await runAndVerify('test-file-2');
  });

  // eslint-disable-next-line require-jsdoc
  async function runAndVerify(fileName) {
    const output = path.join(tmpDir.name, 'bundle.js');
    const config = {
      input: path.join(__dirname, '..', 'fixtures', fileName),
      output: {
        file: output,
        format: 'es',
      },

      plugins: [
        stripBanner(),
      ],
    };

    const bundle = await rollup.rollup(config);

    await bundle.write(config.output);

    const data = await fs.readFile(output, 'utf8');
    const content = data.toString();

    expect(content).toBeDefined();
    expect(content).toEqual(joinLines([
      '/* eslint-disable */',
      '',
      "console.log('hello world');",
      '',
    ]));
  }
});
