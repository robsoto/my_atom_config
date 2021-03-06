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

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _WatchExpressionStore2;

function _WatchExpressionStore() {
  return _WatchExpressionStore2 = require('./WatchExpressionStore');
}

var _reactForAtom2;

function _reactForAtom() {
  return _reactForAtom2 = require('react-for-atom');
}

var _nuclideUiLibLazyNestedValueComponent2;

function _nuclideUiLibLazyNestedValueComponent() {
  return _nuclideUiLibLazyNestedValueComponent2 = require('../../nuclide-ui/lib/LazyNestedValueComponent');
}

var _nuclideUiLibSimpleValueComponent2;

function _nuclideUiLibSimpleValueComponent() {
  return _nuclideUiLibSimpleValueComponent2 = _interopRequireDefault(require('../../nuclide-ui/lib/SimpleValueComponent'));
}

var LocalsComponent = (function (_React$Component) {
  _inherits(LocalsComponent, _React$Component);

  function LocalsComponent(props) {
    _classCallCheck(this, LocalsComponent);

    _get(Object.getPrototypeOf(LocalsComponent.prototype), 'constructor', this).call(this, props);
    this._renderExpression = this._renderExpression.bind(this);
  }

  _createClass(LocalsComponent, [{
    key: '_renderExpression',
    value: function _renderExpression(fetchChildren, local, index) {
      var name = local.name;
      var value = local.value;

      return (_reactForAtom2 || _reactForAtom()).React.createElement(
        'div',
        {
          className: 'nuclide-debugger-atom-expression-value-row',
          key: index },
        (_reactForAtom2 || _reactForAtom()).React.createElement(
          'div',
          {
            className: 'nuclide-debugger-atom-expression-value-content' },
          (_reactForAtom2 || _reactForAtom()).React.createElement((_nuclideUiLibLazyNestedValueComponent2 || _nuclideUiLibLazyNestedValueComponent()).LazyNestedValueComponent, {
            expression: name,
            evaluationResult: value,
            fetchChildren: fetchChildren,
            simpleValueComponent: (_nuclideUiLibSimpleValueComponent2 || _nuclideUiLibSimpleValueComponent()).default
          })
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var watchExpressionStore = _props.watchExpressionStore;
      var locals = _props.locals;

      if (locals == null || locals.length === 0) {
        return (_reactForAtom2 || _reactForAtom()).React.createElement(
          'span',
          null,
          '(no variables)'
        );
      }
      var fetchChildren = watchExpressionStore.getProperties.bind(watchExpressionStore);
      var expressions = locals.map(this._renderExpression.bind(this, fetchChildren));
      return (_reactForAtom2 || _reactForAtom()).React.createElement(
        'div',
        { className: 'nuclide-debugger-atom-expression-value-list' },
        expressions
      );
    }
  }]);

  return LocalsComponent;
})((_reactForAtom2 || _reactForAtom()).React.Component);

exports.LocalsComponent = LocalsComponent;