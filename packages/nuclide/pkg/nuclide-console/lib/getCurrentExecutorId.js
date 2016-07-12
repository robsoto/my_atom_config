Object.defineProperty(exports, '__esModule', {
  value: true
});

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

exports.default = getCurrentExecutorId;

function getCurrentExecutorId(state) {
  var currentExecutorId = state.currentExecutorId;

  if (currentExecutorId == null) {
    var firstExecutor = Array.from(state.executors.values())[0];
    currentExecutorId = firstExecutor && firstExecutor.id;
  }
  return currentExecutorId;
}

module.exports = exports.default;