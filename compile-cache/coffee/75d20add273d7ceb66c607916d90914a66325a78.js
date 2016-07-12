(function() {
  var CompositeDisposable, InputView, SearchModel, TextEditorView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, TextEditorView = _ref.TextEditorView;

  CompositeDisposable = require('atom').CompositeDisposable;

  SearchModel = require('./search-model');

  module.exports = InputView = (function(_super) {
    __extends(InputView, _super);

    function InputView() {
      this.toggleCaseOption = __bind(this.toggleCaseOption, this);
      this.toggleRegexOption = __bind(this.toggleRegexOption, this);
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div({
        tabIndex: -1,
        "class": 'isearch tool-panel panel-bottom padded'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'block'
          }, function() {
            _this.span({
              outlet: 'descriptionLabel',
              "class": 'description'
            }, 'Incremental Search');
            return _this.span({
              outlet: 'optionsLabel',
              "class": 'options'
            });
          });
          return _this.div({
            "class": 'find-container block'
          }, function() {
            _this.div({
              "class": 'editor-container'
            }, function() {
              return _this.subview('findEditor', new TextEditorView({
                mini: true,
                placeholderText: 'search'
              }));
            });
            return _this.div({
              "class": 'btn-group btn-toggle btn-group-options'
            }, function() {
              _this.button({
                outlet: 'regexOptionButton',
                "class": 'btn'
              }, '.*');
              return _this.button({
                outlet: 'caseOptionButton',
                "class": 'btn'
              }, 'Aa');
            });
          });
        };
      })(this));
    };

    InputView.prototype.initialize = function(serializeState) {
      this.subscriptions = new CompositeDisposable;
      serializeState = serializeState || {};
      this.searchModel = new SearchModel(serializeState.modelState);
      return this.handleEvents();
    };

    InputView.prototype.handleEvents = function() {
      this.subscriptions.add(this.findEditor.getModel().onDidStopChanging((function(_this) {
        return function() {
          return _this.updateSearchText();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add(this.findEditor.element, {
        'core:confirm': (function(_this) {
          return function() {
            return _this.stopSearch();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add(this.element, {
        'core:close': (function(_this) {
          return function() {
            return _this.cancelSearch();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.cancelSearch();
          };
        })(this),
        'incremental-search:toggle-regex-option': this.toggleRegexOption,
        'incremental-search:toggle-case-option': this.toggleCaseOption,
        'incremental-search:focus-editor': (function(_this) {
          return function() {
            return _this.focusEditor();
          };
        })(this),
        'incremental-search:slurp': (function(_this) {
          return function() {
            return _this.slurp();
          };
        })(this)
      }));
      this.regexOptionButton.on('click', this.toggleRegexOption);
      this.caseOptionButton.on('click', this.toggleCaseOption);
      return this.searchModel.on('updatedOptions', (function(_this) {
        return function() {
          _this.updateOptionButtons();
          return _this.updateOptionsLabel();
        };
      })(this));
    };

    InputView.prototype.attached = function() {
      if (this.tooltipSubscriptions != null) {
        return;
      }
      this.tooltipSubscriptions = new CompositeDisposable;
      this.tooltipSubscriptions.add(atom.tooltips.add(this.regexOptionButton, {
        title: "Use Regex",
        keyBindingCommand: 'incremental-search:toggle-regex-option',
        keyBindingTarget: this.findEditor[0]
      }));
      return this.tooltipSubscriptions.add(atom.tooltips.add(this.caseOptionButton, {
        title: "Match Case",
        keyBindingCommand: 'incremental-search:toggle-case-option',
        keyBindingTarget: this.findEditor[0]
      }));
    };

    InputView.prototype.hideAllTooltips = function() {
      var _ref1;
      if ((_ref1 = this.tooltipSubscriptions) != null) {
        _ref1.dispose();
      }
      return this.tooltipSubscriptions = null;
    };

    InputView.prototype.slurp = function() {
      this.searchModel.slurp();
      return this.findEditor.setText(this.searchModel.pattern);
    };

    InputView.prototype.toggleRegexOption = function() {
      this.searchModel.update({
        pattern: this.findEditor.getText(),
        useRegex: !this.searchModel.useRegex
      });
      this.updateOptionsLabel();
      return this.updateOptionButtons();
    };

    InputView.prototype.toggleCaseOption = function() {
      this.searchModel.update({
        pattern: this.findEditor.getText(),
        caseSensitive: !this.searchModel.caseSensitive
      });
      this.updateOptionsLabel();
      return this.updateOptionButtons();
    };

    InputView.prototype.updateSearchText = function() {
      var pattern;
      pattern = this.findEditor.getText();
      return this.searchModel.update({
        pattern: pattern
      });
    };

    InputView.prototype.serialize = function() {
      return {
        modelState: this.searchModel.serialize()
      };
    };

    InputView.prototype.destroy = function() {
      var _ref1, _ref2;
      if ((_ref1 = this.subscriptions) != null) {
        _ref1.dispose();
      }
      return (_ref2 = this.tooltipSubscriptions) != null ? _ref2.dispose() : void 0;
    };

    InputView.prototype.detach = function() {
      var workspaceElement;
      this.hideAllTooltips();
      workspaceElement = atom.views.getView(atom.workspace);
      workspaceElement.focus();
      return InputView.__super__.detach.call(this);
    };

    InputView.prototype.trigger = function(direction) {
      var pattern;
      this.searchModel.direction = direction;
      this.updateOptionsLabel();
      this.updateOptionButtons();
      if (!this.hasParent()) {
        this.inputPanel = atom.workspace.addBottomPanel({
          item: this
        });
        pattern = '';
        this.findEditor.setText(pattern);
        this.searchModel.start(pattern);
        this.inputPanel.show();
        return this.findEditor.focus();
      } else {
        this.inputPanel.show();
        this.findEditor.focus();
        if (this.findEditor.getText()) {
          return this.searchModel.findNext();
        } else {
          if (this.searchModel.history.length) {
            pattern = this.searchModel.history[this.searchModel.history.length - 1];
            this.findEditor.setText(pattern);
            return this.searchModel.update({
              pattern: pattern
            });
          }
        }
      }
    };

    InputView.prototype.stopSearch = function() {
      this.searchModel.stopSearch(this.findEditor.getText());
      return this.detach();
    };

    InputView.prototype.cancelSearch = function() {
      var _ref1;
      this.searchModel.cancelSearch();
      if ((_ref1 = this.inputPanel) != null) {
        _ref1.hide();
      }
      return this.detach();
    };

    InputView.prototype.updateOptionsLabel = function() {
      var label;
      label = [];
      if (this.searchModel.useRegex) {
        label.push('regex');
      }
      if (this.searchModel.caseSensitive) {
        label.push('case sensitive');
      } else {
        label.push('case insensitive');
      }
      return this.optionsLabel.text(' (' + label.join(', ') + ')');
    };

    InputView.prototype.updateOptionButtons = function() {
      this.setOptionButtonState(this.regexOptionButton, this.searchModel.useRegex);
      return this.setOptionButtonState(this.caseOptionButton, this.searchModel.caseSensitive);
    };

    InputView.prototype.setOptionButtonState = function(optionButton, selected) {
      if (selected) {
        return optionButton.addClass('selected');
      } else {
        return optionButton.removeClass('selected');
      }
    };

    InputView.prototype.focusEditor = function() {
      if (this.searchModel.lastPosition) {
        this.searchModel.moveCursorToCurrent();
        return atom.workspaceView.getActiveView().focus();
      }
    };

    return InputView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvaW5jcmVtZW50YWwtc2VhcmNoL2xpYi9pbnB1dC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1RUFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQXlCLE9BQUEsQ0FBUSxzQkFBUixDQUF6QixFQUFDLFlBQUEsSUFBRCxFQUFPLHNCQUFBLGNBQVAsQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBR0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUhkLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osZ0NBQUEsQ0FBQTs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxTQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLFFBQUEsRUFBVSxDQUFBLENBQVY7QUFBQSxRQUFjLE9BQUEsRUFBTyx3Q0FBckI7T0FBTCxFQUFvRSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2xFLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLE9BQVA7V0FBTCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsWUFBQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsY0FBQSxNQUFBLEVBQVEsa0JBQVI7QUFBQSxjQUE0QixPQUFBLEVBQU8sYUFBbkM7YUFBTixFQUF3RCxvQkFBeEQsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxjQUFBLE1BQUEsRUFBUSxjQUFSO0FBQUEsY0FBd0IsT0FBQSxFQUFPLFNBQS9CO2FBQU4sRUFGbUI7VUFBQSxDQUFyQixDQUFB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

//# sourceURL=/home/rsoto/.atom/packages/incremental-search/lib/input-view.coffee
