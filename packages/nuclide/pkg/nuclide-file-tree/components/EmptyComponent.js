Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var _nuclideUiLibButton2;

function _nuclideUiLibButton() {
  return _nuclideUiLibButton2 = require('../../nuclide-ui/lib/Button');
}

var EmptyComponent = (function (_React$Component) {
  _inherits(EmptyComponent, _React$Component);

  function EmptyComponent() {
    _classCallCheck(this, EmptyComponent);

    _get(Object.getPrototypeOf(EmptyComponent.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(EmptyComponent, [{
    key: 'render',
    value: function render() {
      var _this = this;

      return (_reactForAtom2 || _reactForAtom()).React.createElement(
        'div',
        { className: 'padded' },
        (_reactForAtom2 || _reactForAtom()).React.createElement(
          (_nuclideUiLibButton2 || _nuclideUiLibButton()).Button,
          {
            onClick: function () {
              return _this.runCommand('application:add-project-folder');
            },
            icon: 'device-desktop',
            className: 'btn-block' },
          'Add Project Folder'
        ),
        (_reactForAtom2 || _reactForAtom()).React.createElement(
          (_nuclideUiLibButton2 || _nuclideUiLibButton()).Button,
          {
            onClick: function () {
              return _this.runCommand('nuclide-remote-projects:connect');
            },
            icon: 'cloud-upload',
            className: 'btn-block' },
          'Add Remote Project Folder'
        )
      );
    }
  }, {
    key: 'runCommand',
    value: function runCommand(command) {
      atom.commands.dispatch(atom.views.getView(atom.workspace), command);
    }
  }]);

  return EmptyComponent;
})((_reactForAtom2 || _reactForAtom()).React.Component);

exports.EmptyComponent = EmptyComponent;