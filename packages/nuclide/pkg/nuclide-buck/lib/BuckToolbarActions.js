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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _flux2;

function _flux() {
  return _flux2 = require('flux');
}

var _commonsNodeCollection2;

function _commonsNodeCollection() {
  return _commonsNodeCollection2 = require('../../commons-node/collection');
}

var _nuclideBuckBase2;

function _nuclideBuckBase() {
  return _nuclideBuckBase2 = require('../../nuclide-buck-base');
}

var BuckToolbarActions = (function () {
  _createClass(BuckToolbarActions, null, [{
    key: 'ActionType',
    value: Object.freeze((0, (_commonsNodeCollection2 || _commonsNodeCollection()).keyMirror)({
      UPDATE_BUILD_TARGET: null,
      UPDATE_IS_LOADING_RULE: null,
      UPDATE_RULE_TYPE: null,
      UPDATE_PANEL_VISIBILITY: null,
      UPDATE_BUCK_ROOT: null,
      UPDATE_REACT_NATIVE_SERVER_MODE: null,
      UPDATE_SIMULATOR: null,
      UPDATE_TASK_SETTINGS: null
    })),
    enumerable: true
  }]);

  function BuckToolbarActions(dispatcher, store) {
    _classCallCheck(this, BuckToolbarActions);

    this._dispatcher = dispatcher;
    this._store = store;
    this._loadingRules = 0;
  }

  _createClass(BuckToolbarActions, [{
    key: 'updateProjectPath',
    value: _asyncToGenerator(function* (path) {
      var buckRoot = yield (0, (_nuclideBuckBase2 || _nuclideBuckBase()).getBuckProjectRoot)(path);
      if (buckRoot != null && buckRoot !== this._store.getCurrentBuckRoot()) {
        this._dispatcher.dispatch({
          actionType: BuckToolbarActions.ActionType.UPDATE_BUCK_ROOT,
          buckRoot: buckRoot
        });
        // Update the build target information as well.
        this.updateBuildTarget(this._store.getBuildTarget());
      }
    })
  }, {
    key: 'updateBuildTarget',
    value: _asyncToGenerator(function* (buildTarget) {
      this._dispatcher.dispatch({
        actionType: BuckToolbarActions.ActionType.UPDATE_BUILD_TARGET,
        buildTarget: buildTarget
      });

      // Find the rule type, if applicable.
      var buckRoot = this._store.getCurrentBuckRoot();
      if (buckRoot != null) {
        if (this._loadingRules++ === 0) {
          this._dispatcher.dispatch({
            actionType: BuckToolbarActions.ActionType.UPDATE_IS_LOADING_RULE,
            isLoadingRule: true
          });
        }
        var buckProject = (0, (_nuclideBuckBase2 || _nuclideBuckBase()).createBuckProject)(buckRoot);
        var buildRuleType = buildTarget === '' ? null : (yield buckProject.buildRuleTypeFor(buildTarget)
        // Most likely, this is an invalid target, so do nothing.
        .catch(function (e) {
          return null;
        }));
        buckProject.dispose();
        this._dispatcher.dispatch({
          actionType: BuckToolbarActions.ActionType.UPDATE_RULE_TYPE,
          ruleType: buildRuleType
        });
        if (--this._loadingRules === 0) {
          this._dispatcher.dispatch({
            actionType: BuckToolbarActions.ActionType.UPDATE_IS_LOADING_RULE,
            isLoadingRule: false
          });
        }
      }
    })
  }, {
    key: 'updateSimulator',
    value: function updateSimulator(simulator) {
      this._dispatcher.dispatch({
        actionType: BuckToolbarActions.ActionType.UPDATE_SIMULATOR,
        simulator: simulator
      });
    }
  }, {
    key: 'updateReactNativeServerMode',
    value: function updateReactNativeServerMode(serverMode) {
      this._dispatcher.dispatch({
        actionType: BuckToolbarActions.ActionType.UPDATE_REACT_NATIVE_SERVER_MODE,
        serverMode: serverMode
      });
    }
  }, {
    key: 'updateTaskSettings',
    value: function updateTaskSettings(taskType, settings) {
      this._dispatcher.dispatch({
        actionType: BuckToolbarActions.ActionType.UPDATE_TASK_SETTINGS,
        taskType: taskType,
        settings: settings
      });
    }
  }]);

  return BuckToolbarActions;
})();

exports.default = BuckToolbarActions;
module.exports = exports.default;

// TODO(hansonw): Will be obsolete when this is an observable stream.