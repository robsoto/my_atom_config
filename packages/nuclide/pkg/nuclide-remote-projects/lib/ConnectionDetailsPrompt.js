Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _nuclideUiLibAddTooltip2;

function _nuclideUiLibAddTooltip() {
  return _nuclideUiLibAddTooltip2 = _interopRequireDefault(require('../../nuclide-ui/lib/add-tooltip'));
}

var _classnames2;

function _classnames() {
  return _classnames2 = _interopRequireDefault(require('classnames'));
}

var _ConnectionDetailsForm2;

function _ConnectionDetailsForm() {
  return _ConnectionDetailsForm2 = _interopRequireDefault(require('./ConnectionDetailsForm'));
}

var _nuclideUiLibHR2;

function _nuclideUiLibHR() {
  return _nuclideUiLibHR2 = require('../../nuclide-ui/lib/HR');
}

var _nuclideUiLibMutableListSelector2;

function _nuclideUiLibMutableListSelector() {
  return _nuclideUiLibMutableListSelector2 = require('../../nuclide-ui/lib/MutableListSelector');
}

var _reactForAtom2;

function _reactForAtom() {
  return _reactForAtom2 = require('react-for-atom');
}

/**
 * This component contains the entire view in which the user inputs their
 * connection information when connecting to a remote project.
 * This view contains the ConnectionDetailsForm on the left side, and a
 * NuclideListSelector on the right side that displays 0 or more connection
 * 'profiles'. Clicking on a 'profile' in the NuclideListSelector auto-fills
 * the form with the information associated with that profile.
 */

var ConnectionDetailsPrompt = (function (_React$Component) {
  _inherits(ConnectionDetailsPrompt, _React$Component);

  function ConnectionDetailsPrompt(props) {
    _classCallCheck(this, ConnectionDetailsPrompt);

    _get(Object.getPrototypeOf(ConnectionDetailsPrompt.prototype), 'constructor', this).call(this, props);
    this._settingFormFieldsLock = false;

    this._handleConnectionDetailsFormDidChange = this._handleConnectionDetailsFormDidChange.bind(this);
    this._onDefaultProfileClicked = this._onDefaultProfileClicked.bind(this);
    this._onDeleteProfileClicked = this._onDeleteProfileClicked.bind(this);
    this._onProfileClicked = this._onProfileClicked.bind(this);
  }

  _createClass(ConnectionDetailsPrompt, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      // Manually update the contents of an existing `ConnectionDetailsForm`, because it contains
      // `AtomInput` components (which don't update their contents when their props change).
      if (prevProps.indexOfSelectedConnectionProfile !== this.props.indexOfSelectedConnectionProfile ||
      // If the connection profiles changed length, the effective selected profile also changed.
      prevProps.connectionProfiles != null && this.props.connectionProfiles != null && prevProps.connectionProfiles.length !== this.props.connectionProfiles.length) {
        var existingConnectionDetailsForm = this.refs['connection-details-form'];
        if (existingConnectionDetailsForm) {
          // Setting values in the ConnectionDetailsForm fires change events. However, this is a
          // controlled update that should not trigger any change events. "Lock" change events until
          // synchronous updates to the form are complete.
          this._settingFormFieldsLock = true;
          existingConnectionDetailsForm.setFormFields(this.getPrefilledConnectionParams());
          existingConnectionDetailsForm.clearPassword();
          this._settingFormFieldsLock = false;
          existingConnectionDetailsForm.focus();
        }
      }
    }
  }, {
    key: 'focus',
    value: function focus() {
      this.refs['connection-details-form'].focus();
    }
  }, {
    key: 'getFormFields',
    value: function getFormFields() {
      return this.refs['connection-details-form'].getFormFields();
    }
  }, {
    key: 'getPrefilledConnectionParams',
    value: function getPrefilledConnectionParams() {
      // If there are profiles, pre-fill the form with the information from the specified selected
      // profile.
      if (this.props.connectionProfiles != null && this.props.connectionProfiles.length > 0 && this.props.indexOfSelectedConnectionProfile != null) {
        var selectedProfile = this.props.connectionProfiles[this.props.indexOfSelectedConnectionProfile];
        return selectedProfile.params;
      }
    }
  }, {
    key: '_handleConnectionDetailsFormDidChange',
    value: function _handleConnectionDetailsFormDidChange() {
      if (this._settingFormFieldsLock) {
        return;
      }

      this.props.onDidChange();
    }
  }, {
    key: '_onDefaultProfileClicked',
    value: function _onDefaultProfileClicked() {
      this.props.onProfileClicked(0);
    }
  }, {
    key: '_onDeleteProfileClicked',
    value: function _onDeleteProfileClicked(profileId) {
      if (profileId == null) {
        return;
      }

      // The id of a profile is its index in the list of props.
      // * This requires a `+ 1` because the default profile is sliced from the Array during render
      //   creating an effective offset of -1 for each index passed to the `MutableListSelector`.
      this.props.onDeleteProfileClicked(parseInt(profileId, 10) + 1);
    }
  }, {
    key: '_onProfileClicked',
    value: function _onProfileClicked(profileId) {
      // The id of a profile is its index in the list of props.
      // * This requires a `+ 1` because the default profile is sliced from the Array during render
      //   creating an effective offset of -1 for each index passed to the `MutableListSelector`.
      this.props.onProfileClicked(parseInt(profileId, 10) + 1);
    }
  }, {
    key: 'render',
    value: function render() {

      // If there are profiles, pre-fill the form with the information from the
      // specified selected profile.
      var prefilledConnectionParams = this.getPrefilledConnectionParams() || {};

      var defaultConnectionProfileList = undefined;
      var listSelectorItems = undefined;
      var connectionProfiles = this.props.connectionProfiles;
      if (connectionProfiles == null || connectionProfiles.length === 0) {
        listSelectorItems = [];
      } else {
        var mostRecentClassName = (0, (_classnames2 || _classnames()).default)('list-item', {
          selected: this.props.indexOfSelectedConnectionProfile === 0
        });

        defaultConnectionProfileList = (_reactForAtom2 || _reactForAtom()).React.createElement(
          'div',
          { className: 'block select-list' },
          (_reactForAtom2 || _reactForAtom()).React.createElement(
            'ol',
            { className: 'list-group', style: { marginTop: 0 } },
            (_reactForAtom2 || _reactForAtom()).React.createElement(
              'li',
              {
                className: mostRecentClassName,
                onClick: this._onDefaultProfileClicked,
                onDoubleClick: this.props.onConfirm },
              (_reactForAtom2 || _reactForAtom()).React.createElement('span', {
                className: 'icon icon-info pull-right connection-details-icon-info',
                ref: (0, (_nuclideUiLibAddTooltip2 || _nuclideUiLibAddTooltip()).default)({
                  // Intentionally *not* an arrow function so the jQuery Tooltip plugin can set the
                  // context to the Tooltip instance.
                  placement: function placement() {
                    // Atom modals have z indices of 9999. This Tooltip needs to stack on top of the
                    // modal; beat the modal's z-index.
                    this.tip.style.zIndex = 10999;
                    return 'right';
                  },
                  title: 'The settings most recently used to connect. To save settings permanently, ' + 'create a profile.'
                }) }),
              'Most Recent'
            )
          ),
          (_reactForAtom2 || _reactForAtom()).React.createElement((_nuclideUiLibHR2 || _nuclideUiLibHR()).HR, null)
        );

        listSelectorItems = connectionProfiles.slice(1).map(function (profile, index) {
          // Use the index of each profile as its id. This is safe because the
          // items are immutable (within this React component).
          return {
            deletable: profile.deletable,
            displayTitle: profile.displayTitle,
            id: String(index),
            saveable: profile.saveable
          };
        });
      }

      // The default profile is sliced from the Array to render it separately, which means
      // decrementing the effective index into the Array passed to the `MutableListSelector`.
      var idOfSelectedItem = this.props.indexOfSelectedConnectionProfile == null ? null : this.props.indexOfSelectedConnectionProfile - 1;
      if (idOfSelectedItem === null || idOfSelectedItem < 0) {
        idOfSelectedItem = null;
      } else {
        idOfSelectedItem = String(idOfSelectedItem);
      }

      return (_reactForAtom2 || _reactForAtom()).React.createElement(
        'div',
        { className: 'nuclide-connection-details-prompt container-fluid' },
        (_reactForAtom2 || _reactForAtom()).React.createElement(
          'div',
          { className: 'row', style: { display: 'flex' } },
          (_reactForAtom2 || _reactForAtom()).React.createElement(
            'div',
            { className: 'connection-profiles col-xs-3 inset-panel' },
            defaultConnectionProfileList,
            (_reactForAtom2 || _reactForAtom()).React.createElement(
              'h6',
              null,
              'Profiles'
            ),
            (_reactForAtom2 || _reactForAtom()).React.createElement((_nuclideUiLibMutableListSelector2 || _nuclideUiLibMutableListSelector()).MutableListSelector, {
              items: listSelectorItems,
              idOfSelectedItem: idOfSelectedItem,
              onItemClicked: this._onProfileClicked,
              onItemDoubleClicked: this.props.onConfirm,
              onAddButtonClicked: this.props.onAddProfileClicked,
              onDeleteButtonClicked: this._onDeleteProfileClicked
            })
          ),
          (_reactForAtom2 || _reactForAtom()).React.createElement(
            'div',
            { className: 'connection-details-form col-xs-9' },
            (_reactForAtom2 || _reactForAtom()).React.createElement((_ConnectionDetailsForm2 || _ConnectionDetailsForm()).default, {
              initialUsername: prefilledConnectionParams.username,
              initialServer: prefilledConnectionParams.server,
              initialRemoteServerCommand: prefilledConnectionParams.remoteServerCommand,
              initialCwd: prefilledConnectionParams.cwd,
              initialSshPort: prefilledConnectionParams.sshPort,
              initialPathToPrivateKey: prefilledConnectionParams.pathToPrivateKey,
              initialAuthMethod: prefilledConnectionParams.authMethod,
              initialDisplayTitle: prefilledConnectionParams.displayTitle,
              onConfirm: this.props.onConfirm,
              onCancel: this.props.onCancel,
              onDidChange: this._handleConnectionDetailsFormDidChange,
              ref: 'connection-details-form'
            })
          )
        )
      );
    }
  }]);

  return ConnectionDetailsPrompt;
})((_reactForAtom2 || _reactForAtom()).React.Component);

exports.default = ConnectionDetailsPrompt;
module.exports = exports.default;

// The initial list of connection profiles that will be displayed.
// Whenever a user add/removes profiles via the child NuclideListSelector,
// these props should be updated from the top-level by calling ReactDOM.render()
// again (with the new props) on the ConnectionDetailsPrompt.

// If there is >= 1 connection profile, this index indicates the profile to use.

// Function to call when 'enter'/'confirm' is selected by the user in this view.

// Function to call when 'cancel' is selected by the user in this view.

// Function that is called when the "+" button on the profiles list is clicked.
// The user's intent is to create a new profile.

// Function that is called when the "-" button on the profiles list is clicked
// ** while a profile is selected **.
// The user's intent is to delete the currently-selected profile.