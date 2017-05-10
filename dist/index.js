'use strict';

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Mickael Jeanroy
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

var path = require('path');
var rollupPluginUtils = require('rollup-pluginutils');
var extractBanner = require('extract-banner');
var MagicString = require('magic-string');

module.exports = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var filter = rollupPluginUtils.createFilter(options.include, options.exclude);

  return {
    transform: function transform(code, id) {
      if (!filter(id)) {
        return;
      }

      // Remove banner for JS files only
      var ext = path.extname(id).toLowerCase();
      if (ext !== '.js') {
        return;
      }

      var banner = extractBanner(code);
      if (!banner) {
        return;
      }

      // Use a magicString: it will generate the sourceMap at the end.
      var magicString = new MagicString(code);
      var pos = code.indexOf(banner);

      // Remove the banner with the magicString instance.
      magicString.remove(pos, pos + banner.length);

      // Trim left to remove blank spaces.
      magicString.trimStart();

      var result = {
        code: magicString.toString()
      };

      if (options.sourceMap !== false) {
        result.map = magicString.generateMap({
          hires: true
        });
      }

      return result;
    }
  };
};