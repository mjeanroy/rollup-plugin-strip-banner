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

// Required with prettier >= 2.3.0 with node 11
require('globalthis').shim();

const path = require('node:path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const stripBanner = require('gulp-strip-banner');
const headerComment = require('gulp-header-comment');
const prettier = require('gulp-prettier');
const config = require('../config');

module.exports = gulp.series(
  buildOutput,
  copyTypings,
);

/**
 * Build output script into `/dist` directory.
 *
 * @returns {*} Gulp stream.
 */
function buildOutput() {
  return gulp.src(path.join(config.src, '**', '*.js'))
    .pipe(stripBanner())
    .pipe(babel())
    .pipe(headerComment({ file: path.join(config.root, 'LICENSE') }))
    .pipe(prettier())
    .pipe(gulp.dest(config.dist));
}

/**
 * Copy TypeScript typngs into `/dist` directory.
 *
 * @returns {*} Gulp stream.
 */
function copyTypings() {
  return gulp.src(path.join(config.src, 'index.d.ts')).pipe(gulp.dest(config.dist));
}
