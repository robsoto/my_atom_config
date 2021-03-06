function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _utilsFlatten2;

function _utilsFlatten() {
  return _utilsFlatten2 = _interopRequireDefault(require('../../utils/flatten'));
}

var _constantsMarkers2;

function _constantsMarkers() {
  return _constantsMarkers2 = _interopRequireDefault(require('../../constants/markers'));
}

function printCommaSeparatedNodes(print, nodes) {
  if (nodes.length === 0) {
    return [];
  }
  return (0, (_utilsFlatten2 || _utilsFlatten()).default)([(_constantsMarkers2 || _constantsMarkers()).default.openScope, (_constantsMarkers2 || _constantsMarkers()).default.scopeIndent, (0, (_utilsFlatten2 || _utilsFlatten()).default)(nodes.map(function (node, i, arr) {
    return (0, (_utilsFlatten2 || _utilsFlatten()).default)([i > 0 ? [(_constantsMarkers2 || _constantsMarkers()).default.space] : [], (_constantsMarkers2 || _constantsMarkers()).default.scopeBreak, print(node), i === arr.length - 1 ? [(_constantsMarkers2 || _constantsMarkers()).default.scopeComma] : ',', '']);
  })), (_constantsMarkers2 || _constantsMarkers()).default.scopeBreak, (_constantsMarkers2 || _constantsMarkers()).default.scopeDedent, (_constantsMarkers2 || _constantsMarkers()).default.closeScope]);
}

module.exports = printCommaSeparatedNodes;