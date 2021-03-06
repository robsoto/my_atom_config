

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsFlatten2;

function _utilsFlatten() {
  return _utilsFlatten2 = _interopRequireDefault(require('../../utils/flatten'));
}

var _constantsMarkers2;

function _constantsMarkers() {
  return _constantsMarkers2 = _interopRequireDefault(require('../../constants/markers'));
}

function printObjectTypeAnnotation(print, node) {
  return (0, (_utilsFlatten2 || _utilsFlatten()).default)(['{', (_constantsMarkers2 || _constantsMarkers()).default.openScope, (_constantsMarkers2 || _constantsMarkers()).default.scopeIndent, (_constantsMarkers2 || _constantsMarkers()).default.scopeBreak, node.properties.map(function (p, i, arr) {
    return [print(p), i === arr.length - 1 ? (_constantsMarkers2 || _constantsMarkers()).default.scopeComma : ',', i === arr.length - 1 ? (_constantsMarkers2 || _constantsMarkers()).default.scopeBreak : (_constantsMarkers2 || _constantsMarkers()).default.scopeSpaceBreak];
  }), (_constantsMarkers2 || _constantsMarkers()).default.scopeDedent, (_constantsMarkers2 || _constantsMarkers()).default.closeScope, '}']);
}

module.exports = printObjectTypeAnnotation;