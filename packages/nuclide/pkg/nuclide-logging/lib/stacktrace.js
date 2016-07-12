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

exports.default = addPrepareStackTraceHook;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _commonsNodeSingleton2;

function _commonsNodeSingleton() {
  return _commonsNodeSingleton2 = _interopRequireDefault(require('../../commons-node/singleton'));
}

var _commonsNodeString2;

function _commonsNodeString() {
  return _commonsNodeString2 = require('../../commons-node/string');
}

var PREPARE_STACK_TRACE_HOOKED_KEY = '_nuclide_error_stack_trace_hooked';

var hookedPrepareStackTrace = undefined;

/**
 * v8 provided a way to customize Error stacktrace generation by overwriting
 * Error.prepareStackTrace (https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi).
 * Here we added a hook to Error.prepareStackTrace to achieve following goals:
 *  1) Whenever `error.stack` is called, error.stackTrace will be generated.
 *  2) Other module's customization to Error.prepareStackTrace, no matter before or after the hook
 *     is added, will still work as expected.
 * In this way, other module could still overwrite Error.prepareStackTrace to customize stacktrace.
 * This is required as Atom's builtin coffeescript package need to show coffeescript stacktrace by
 * customize Error.prepareStackTrace.
 */

function addPrepareStackTraceHook() {
  (_commonsNodeSingleton2 || _commonsNodeSingleton()).default.get(PREPARE_STACK_TRACE_HOOKED_KEY, function () {
    hookedPrepareStackTrace = createHookedPrepareStackTrace(Error.prepareStackTrace || defaultPrepareStackTrace);

    // Hook Error.prepareStackTrace by leveraging get/set accessor. In this way, writing to
    // Error.prepareStackTrace will put the new prepareStackTrace functions in a wrapper that
    // calls the hook.
    // $FlowIssue
    Object.defineProperty(Error, 'prepareStackTrace', {
      get: function get() {
        return hookedPrepareStackTrace;
      },
      set: function set(newValue) {
        hookedPrepareStackTrace = createHookedPrepareStackTrace(newValue || defaultPrepareStackTrace);
      },
      enumerable: false,
      configurable: true
    });

    // TODO (chenshen) t8789330.
    // Atom added getRawStack to Error.prototype to get Error's structured stacktrace
    // (https://github.com/atom/grim/blob/master/src/grim.coffee#L43). However, this
    // doesn't work well with our customization of stacktrace. So here we temporarily
    // walk around this by following hack, until https://github.com/atom/atom/issues/9641
    // get addressed.
    /* eslint-disable no-extend-native */
    /* $FlowFixMe */
    Error.prototype.getRawStack = null;
    /* eslint-enable no-extend-native */
    return true;
  });
}

/**
 * Create a wrapper that calls to structuredStackTraceHook first, then return the result of
 * prepareStackTrace.
 */
function createHookedPrepareStackTrace(prepareStackTrace) {
  // If the prepareStackTrace is already been hooked, just return it.
  if (prepareStackTrace.name === 'nuclideHookedPrepareStackTrace') {
    return prepareStackTrace;
  }

  var hookedFunction = function nuclideHookedPrepareStackTrace(error, frames) {
    structuredStackTraceHook(error, frames);
    return prepareStackTrace(error, frames);
  };

  return hookedFunction;
}

function structuredStackTraceHook(error, frames) {
  // $FlowFixMe
  error.stackTrace = frames.map(function (frame) {
    return {
      functionName: frame.getFunctionName(),
      methodName: frame.getMethodName(),
      fileName: frame.getFileName(),
      lineNumber: frame.getLineNumber(),
      columnNumber: frame.getColumnNumber(),
      evalOrigin: frame.getEvalOrigin(),
      isTopLevel: frame.isToplevel(),
      isEval: frame.isEval(),
      isNative: frame.isNative(),
      isConstructor: frame.isConstructor()
    };
  });
}

function defaultPrepareStackTrace(error, frames) {
  var formattedStackTrace = error.message ? error.name + ': ' + error.message : '' + error.name;
  frames.forEach(function (frame) {
    formattedStackTrace += '\n    at ' + (0, (_commonsNodeString2 || _commonsNodeString()).maybeToString)(frame.toString());
  });
  return formattedStackTrace;
}

var __test__ = {
  createHookedPrepareStackTrace: createHookedPrepareStackTrace,
  resetPrepareStackTraceHooked: function resetPrepareStackTraceHooked() {
    (_commonsNodeSingleton2 || _commonsNodeSingleton()).default.clear(PREPARE_STACK_TRACE_HOOKED_KEY);
  }
};
exports.__test__ = __test__;