(function() {
  var CursorPositionView, Disposable,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Disposable = require('atom').Disposable;

  CursorPositionView = (function(_super) {
    __extends(CursorPositionView, _super);

    function CursorPositionView() {
      return CursorPositionView.__super__.constructor.apply(this, arguments);
    }

    CursorPositionView.prototype.initialize = function() {
      var _ref;
      this.viewUpdatePending = false;
      this.classList.add('cursor-position', 'inline-block');
      this.goToLineLink = document.createElement('a');
      this.goToLineLink.classList.add('inline-block');
      this.goToLineLink.href = '#';
      this.appendChild(this.goToLineLink);
      this.formatString = (_ref = atom.config.get('status-bar.cursorPositionFormat')) != null ? _ref : '%L:%C';
      this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(activeItem) {
          return _this.subscribeToActiveTextEditor();
        };
      })(this));
      this.subscribeToConfig();
      this.subscribeToActiveTextEditor();
      this.tooltip = atom.tooltips.add(this, {
        title: function() {
          return "Line " + this.row + ", Column " + this.column;
        }
      });
      return this.handleClick();
    };

    CursorPositionView.prototype.destroy = function() {
      var _ref, _ref1, _ref2;
      this.activeItemSubscription.dispose();
      if ((_ref = this.cursorSubscription) != null) {
        _ref.dispose();
      }
      this.tooltip.dispose();
      if ((_ref1 = this.configSubscription) != null) {
        _ref1.dispose();
      }
      this.clickSubscription.dispose();
      return (_ref2 = this.updateSubscription) != null ? _ref2.dispose() : void 0;
    };

    CursorPositionView.prototype.subscribeToActiveTextEditor = function() {
      var _ref, _ref1;
      if ((_ref = this.cursorSubscription) != null) {
        _ref.dispose();
      }
      this.cursorSubscription = (_ref1 = this.getActiveTextEditor()) != null ? _ref1.onDidChangeCursorPosition((function(_this) {
        return function(_arg) {
          var cursor;
          cursor = _arg.cursor;
          if (cursor !== _this.getActiveTextEditor().getLastCursor()) {
            return;
          }
          return _this.updatePosition();
        };
      })(this)) : void 0;
      return this.updatePosition();
    };

    CursorPositionView.prototype.subscribeToConfig = function() {
      var _ref;
      if ((_ref = this.configSubscription) != null) {
        _ref.dispose();
      }
      return this.configSubscription = atom.config.observe('status-bar.cursorPositionFormat', (function(_this) {
        return function(value) {
          _this.formatString = value != null ? value : '%L:%C';
          return _this.updatePosition();
        };
      })(this));
    };

    CursorPositionView.prototype.handleClick = function() {
      var clickHandler;
      clickHandler = (function(_this) {
        return function() {
          return atom.commands.dispatch(atom.views.getView(_this.getActiveTextEditor()), 'go-to-line:toggle');
        };
      })(this);
      this.addEventListener('click', clickHandler);
      return this.clickSubscription = new Disposable((function(_this) {
        return function() {
          return _this.removeEventListener('click', clickHandler);
        };
      })(this));
    };

    CursorPositionView.prototype.getActiveTextEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    CursorPositionView.prototype.updatePosition = function() {
      if (this.viewUpdatePending) {
        return;
      }
      this.viewUpdatePending = true;
      return this.updateSubscription = atom.views.updateDocument((function(_this) {
        return function() {
          var position, _ref;
          _this.viewUpdatePending = false;
          if (position = (_ref = _this.getActiveTextEditor()) != null ? _ref.getCursorBufferPosition() : void 0) {
            _this.row = position.row + 1;
            _this.column = position.column + 1;
            _this.goToLineLink.textContent = _this.formatString.replace('%L', _this.row).replace('%C', _this.column);
            return _this.classList.remove('hide');
          } else {
            _this.goToLineLink.textContent = '';
            return _this.classList.add('hide');
          }
        };
      })(this));
    };

    return CursorPositionView;

  })(HTMLElement);

  module.exports = document.registerElement('status-bar-cursor', {
    prototype: CursorPositionView.prototype,
    "extends": 'div'
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvc3RhdHVzLWJhci9saWIvY3Vyc29yLXBvc2l0aW9uLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBRU07QUFDSix5Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsaUNBQUEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGlCQUFELEdBQXFCLEtBQXJCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLGlCQUFmLEVBQWtDLGNBQWxDLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsR0FBdkIsQ0FIaEIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBeEIsQ0FBNEIsY0FBNUIsQ0FKQSxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsWUFBWSxDQUFDLElBQWQsR0FBcUIsR0FMckIsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsWUFBZCxDQU5BLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxZQUFELGdGQUFxRSxPQVJyRSxDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsc0JBQUQsR0FBMEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyx5QkFBZixDQUF5QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxVQUFELEdBQUE7aUJBQ2pFLEtBQUMsQ0FBQSwyQkFBRCxDQUFBLEVBRGlFO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxD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

//# sourceURL=/home/rsoto/.atom/packages/status-bar/lib/cursor-position-view.coffee
