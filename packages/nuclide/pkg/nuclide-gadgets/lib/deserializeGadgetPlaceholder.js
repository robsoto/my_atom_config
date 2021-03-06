

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _reactForAtom2;

function _reactForAtom() {
  return _reactForAtom2 = require('react-for-atom');
}

module.exports = function deserializeGadgetPlaceholder(state) {
  // Pane items are deserialized before the gadget providers have had a chance to register their
  // gadgets. Therefore, we need to create a placeholder item that we later replace.
  return require('./GadgetPlaceholder').deserialize(state);
};