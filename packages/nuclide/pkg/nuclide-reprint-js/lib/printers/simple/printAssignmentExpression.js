

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _constantsMarkers2;

function _constantsMarkers() {
  return _constantsMarkers2 = _interopRequireDefault(require('../../constants/markers'));
}

var _wrappersSimpleWrapExpression2;

function _wrappersSimpleWrapExpression() {
  return _wrappersSimpleWrapExpression2 = _interopRequireDefault(require('../../wrappers/simple/wrapExpression'));
}

function printAssignmentExpression(print, node) {
  var wrap = function wrap(x) {
    return (0, (_wrappersSimpleWrapExpression2 || _wrappersSimpleWrapExpression()).default)(print, node, x);
  };
  return wrap([print(node.left), (_constantsMarkers2 || _constantsMarkers()).default.noBreak, (_constantsMarkers2 || _constantsMarkers()).default.space, node.operator, (_constantsMarkers2 || _constantsMarkers()).default.noBreak, (_constantsMarkers2 || _constantsMarkers()).default.space, print(node.right)]);
}

module.exports = printAssignmentExpression;