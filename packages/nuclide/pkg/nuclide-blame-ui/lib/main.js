Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.activate = activate;
exports.getBlameGutter = getBlameGutter;

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function activate(state) {}

function getBlameGutter() {
  return require('./BlameGutter');
}