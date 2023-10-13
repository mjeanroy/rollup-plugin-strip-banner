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
import extractBanner from 'extract-banner';
import MagicString from 'magic-string';
import {createFilter} from '@rollup/pluginutils';

/**
 * Create plugin instance.
 *
 * @param {*} options Plugin options.
 * @return {Objects} The plugin instance.
 */
export default function rollupPluginStripBanner(options = {}) {
  const filter = createFilter(options.include, options.exclude);

  return {
    transform(code, id) {
      if (!filter(id)) {
        return;
      }

      // Remove banner for JS files only
      const ext = path.extname(id).toLowerCase();
      if (ext !== '.js' && ext !== '.jsx' && ext !== '.ts' && ext !== '.tsx') {
        return;
      }

      const banner = extractBanner(code);
      if (!banner) {
        return;
      }

      // Use a magicString: it will generate the sourceMap at the end.
      const magicString = new MagicString(code);
      const pos = code.indexOf(banner);

      // Remove the banner with the magicString instance.
      magicString.remove(pos, pos + banner.length);

      // Trim left to remove blank spaces.
      magicString.trimStart();

      return {
        code: magicString.toString(),
        map: magicString.generateMap({
          hires: true,
        }),
      };
    },
  };
}
