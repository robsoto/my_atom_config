

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/**
 * Copy of the npm package: blocked, but without the unref, because that doesn't work in apm tests.
 * https://github.com/tj/node-blocked/blob/master/index.js
 *
 * The blocked module checks and reports every event loop block time over a given threshold.
 * @return the interval handler.
 * To cancel, call clearInterval on the returned interval handler.
 */
function blocked(fn) {
  var intervalMs = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
  var thresholdMs = arguments.length <= 2 || arguments[2] === undefined ? 50 : arguments[2];

  var start = Date.now();

  return setInterval(function () {
    var deltaMs = Date.now() - start;
    var blockTimeMs = deltaMs - intervalMs;
    if (blockTimeMs > thresholdMs) {
      fn(blockTimeMs);
    }
    start = Date.now();
  }, intervalMs);
}

module.exports = blocked;