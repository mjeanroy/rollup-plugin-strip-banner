/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016-2020 Mickael Jeanroy
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

import fs from 'fs';
import path from 'path';
import plugin from '../src/index.js';
import {joinLines} from './utils/join-lines';

describe('rollup-plugin-strip-banner', () => {
  it('should strip banner and generate sourcemap', () => {
    const instance = plugin();
    const id = 'test-file-1.js';
    const code = fs.readFileSync(path.join(__dirname, 'fixtures', id), 'utf-8');

    const result = instance.transform(code, id);

    expect(result.code).toEqual(joinLines([
      '/* eslint-disable */',
      '',
      `console.log('hello world');`,
      '',
    ]));

    expect(result.map).toBeDefined();
  });

  it('should strip banner with "@license" keyword and generate sourcemap', () => {
    const instance = plugin();
    const id = 'test-file-2.js';
    const code = fs.readFileSync(path.join(__dirname, 'fixtures', id), 'utf-8');

    const result = instance.transform(code, id);

    expect(result.code).toEqual(joinLines([
      '/* eslint-disable */',
      '',
      `console.log('hello world');`,
      '',
    ]));

    expect(result.map).toBeDefined();
  });

  it('should ignore source if it is does not have banner', () => {
    const id = 'test-file-without-banner.js';
    const instance = plugin();
    const code = fs.readFileSync(path.join(__dirname, 'fixtures', id), 'utf-8');
    const result = instance.transform(code, id);

    expect(result).not.toBeDefined();
  });

  it('should ignore source if it is not included', () => {
    const id = 'test-file-1.js';
    const instance = plugin({
      include: '**/*.spec.js',
    });

    const code = fs.readFileSync(path.join(__dirname, 'fixtures', id), 'utf-8');
    const result = instance.transform(code, id);

    expect(result).not.toBeDefined();
  });

  it('should ignore source if it is excluded', () => {
    const id = 'test-file-1.js';
    const instance = plugin({
      include: '**/*test*.js',
      exclude: id,
    });

    const code = fs.readFileSync(path.join(__dirname, 'fixtures', id), 'utf-8');
    const result = instance.transform(code, id);

    expect(result).not.toBeDefined();
  });

  it('should ignore non JS file', () => {
    const id = 'test-file.txt';
    const instance = plugin();
    const code = fs.readFileSync(path.join(__dirname, 'fixtures', 'test-file-1.js'), 'utf-8');

    const result = instance.transform(code, id);

    expect(result).not.toBeDefined();
  });

  it('should not ignore JSX file', () => {
    const id = 'test-file-1.jsx';
    const instance = plugin();
    const code = fs.readFileSync(path.join(__dirname, 'fixtures', 'test-file-1.js'), 'utf-8');

    const result = instance.transform(code, id);

    expect(result).toBeDefined();
  });

  it('should not ignore TS file', () => {
    const id = 'test-file.ts';
    const instance = plugin();
    const code = fs.readFileSync(path.join(__dirname, 'fixtures', 'test-file-1.js'), 'utf-8');

    const result = instance.transform(code, id);

    expect(result).toBeDefined();
  });

  it('should not ignore TSX file', () => {
    const id = 'test-file.tsx';
    const instance = plugin();
    const code = fs.readFileSync(path.join(__dirname, 'fixtures', 'test-file-1.js'), 'utf-8');

    const result = instance.transform(code, id);

    expect(result).toBeDefined();
  });
});
