(function() {
  var SelectionCountView, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  SelectionCountView = (function(_super) {
    __extends(SelectionCountView, _super);

    function SelectionCountView() {
      return SelectionCountView.__super__.constructor.apply(this, arguments);
    }

    SelectionCountView.prototype.initialize = function() {
      var _ref;
      this.classList.add('selection-count', 'inline-block');
      this.formatString = (_ref = atom.config.get('status-bar.selectionCountFormat')) != null ? _ref : '(%L, %C)';
      this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          return _this.subscribeToActiveTextEditor();
        };
      })(this));
      this.subscribeToConfig();
      return this.subscribeToActiveTextEditor();
    };

    SelectionCountView.prototype.destroy = function() {
      var _ref, _ref1;
      this.activeItemSubscription.dispose();
      if ((_ref = this.selectionSubscription) != null) {
        _ref.dispose();
      }
      return (_ref1 = this.configSubscription) != null ? _ref1.dispose() : void 0;
    };

    SelectionCountView.prototype.subscribeToConfig = function() {
      var _ref;
      if ((_ref = this.configSubscription) != null) {
        _ref.dispose();
      }
      return this.configSubscription = atom.config.observe('status-bar.selectionCountFormat', (function(_this) {
        return function(value) {
          _this.formatString = value != null ? value : '(%L, %C)';
          return _this.updateCount();
        };
      })(this));
    };

    SelectionCountView.prototype.subscribeToActiveTextEditor = function() {
      var _ref, _ref1;
      if ((_ref = this.selectionSubscription) != null) {
        _ref.dispose();
      }
      this.selectionSubscription = (_ref1 = this.getActiveTextEditor()) != null ? _ref1.onDidChangeSelectionRange((function(_this) {
        return function(_arg) {
          var selection;
          selection = _arg.selection;
          if (selection !== _this.getActiveTextEditor().getLastSelection()) {
            return;
          }
          return _this.updateCount();
        };
      })(this)) : void 0;
      return this.updateCount();
    };

    SelectionCountView.prototype.getActiveTextEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    SelectionCountView.prototype.updateCount = function() {
      var count, lineCount, title, _ref, _ref1, _ref2;
      count = (_ref = this.getActiveTextEditor()) != null ? _ref.getSelectedText().length : void 0;
      lineCount = (_ref1 = this.getActiveTextEditor()) != null ? _ref1.getSelectedBufferRange().getRowCount() : void 0;
      if (count > 0) {
        this.textContent = this.formatString.replace('%L', lineCount).replace('%C', count);
        title = "" + (_.pluralize(lineCount, 'line')) + ", " + (_.pluralize(count, 'character')) + " selected";
        if ((_ref2 = this.toolTipDisposable) != null) {
          _ref2.dispose();
        }
        return this.toolTipDisposable = atom.tooltips.add(this, {
          title: title
        });
      } else {
        return this.textContent = '';
      }
    };

    return SelectionCountView;

  })(HTMLElement);

  module.exports = document.registerElement('status-bar-selection', {
    prototype: SelectionCountView.prototype,
    "extends": 'div'
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvc3RhdHVzLWJhci9saWIvc2VsZWN0aW9uLWNvdW50LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUVNO0FBRUoseUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLGlDQUFBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixVQUFBLElBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLGlCQUFmLEVBQWtDLGNBQWxDLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFlBQUQsZ0ZBQXFFLFVBRnJFLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxzQkFBRCxHQUEwQixJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFmLENBQXlDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2pFLEtBQUMsQ0FBQSwyQkFBRCxDQUFBLEVBRGlFO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekMsQ0FIMUIsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLGlCQUFELENBQUEsQ0FOQSxDQUFBO2FBT0EsSUFBQyxDQUFBLDJCQUFELENBQUEsRUFSVTtJQUFBLENBQVosQ0FBQTs7QUFBQSxpQ0FVQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSxXQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsc0JBQXNCLENBQUMsT0FBeEIsQ0FBQSxDQUFBLENBQUE7O1lBQ3NCLENBQUUsT0FBeEIsQ0FBQTtPQURBOzhEQUVtQixDQUFFLE9BQXJCLENBQUEsV0FITztJQUFBLENBVlQsQ0FBQTs7QUFBQSxpQ0FlQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7QUFDakIsVUFBQSxJQUFBOztZQUFtQixDQUFFLE9BQXJCLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxrQkFBRCxHQUFzQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsaUNBQXBCLEVBQXVELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsR0FBQTtBQUMzRSxVQUFBLEtBQUMsQ0FBQSxZQUFELG1CQUFnQixRQUFRLFVBQXhCLENBQUE7aUJBQ0EsS0FBQyxDQUFBLFdBQUQsQ0FBQSxFQUYyRTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZELEVBRkw7SUFBQSxDQWZuQixDQUFBOztBQUFBLGlDQXFCQSwyQkFBQSxHQUE2QixTQUFBLEdBQUE7QUFDM0IsVUFBQSxXQUFBOztZQUFzQixDQUFFLE9BQXhCLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLHFCQUFELHVEQUErQyxDQUFFLHlCQUF4QixDQUFrRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDekUsY0FBQSxTQUFBO0FBQUEsVUFEMkUsWUFBRCxLQUFDLFNBQzNFLENBQUE7QUFBQSxVQUFBLElBQWMsU0FBQSxLQUFhLEtBQUMsQ0FBQSxtQkFBRCxDQUFBLENBQXNCLENBQUMsZ0JBQXZCLENBQUEsQ0FBM0I7QUFBQSxrQkFBQSxDQUFBO1dBQUE7aUJBQ0EsS0FBQyxDQUFBLFdBQUQsQ0FBQSxFQUZ5RTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxELFVBRHpCLENBQUE7YUFJQSxJQUFDLENBQUEsV0FBRCxDQUFBLEVBTDJCO0lBQUEsQ0FyQjdCLENBQUE7O0FBQUEsaUNBNEJBLG1CQUFBLEdBQXFCLFNBQUEsR0FBQTthQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsRUFEbUI7SUFBQSxDQTVCckIsQ0FBQTs7QUFBQSxpQ0ErQkEsV0FBQSxHQUFhLFNBQUEsR0FBQTtBQUNYLFVBQUEsMkNBQUE7QUFBQSxNQUFBLEtBQUEscURBQThCLENBQUUsZUFBeEIsQ0FBQSxDQUF5QyxDQUFDLGVBQWxELENBQUE7QUFBQSxNQUNBLFNBQUEsdURBQWtDLENBQUUsc0JBQXhCLENBQUEsQ0FBZ0QsQ0FBQyxXQUFqRCxDQUFBLFVBRFosQ0FBQTtBQUVBLE1BQUEsSUFBRyxLQUFBLEdBQVEsQ0FBWDtBQUNFLFFBQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBc0IsSUFBdEIsRUFBNEIsU0FBNUIsQ0FBc0MsQ0FBQyxPQUF2QyxDQUErQyxJQUEvQyxFQUFxRCxLQUFyRCxDQUFmLENBQUE7QUFBQSxRQUNBLEtBQUEsR0FBUSxFQUFBLEdBQUUsQ0FBQyxDQUFDLENBQUMsU0FBRixDQUFZLFNBQVosRUFBdUIsTUFBdkIsQ0FBRCxDQUFGLEdBQWtDLElBQWxDLEdBQXFDLENBQUMsQ0FBQyxDQUFDLFNBQUYsQ0FBWSxLQUFaLEVBQW1CLFdBQW5CLENBQUQsQ0FBckMsR0FBc0UsV0FEOUUsQ0FBQTs7ZUFFa0IsQ0FBRSxPQUFwQixDQUFBO1NBRkE7ZUFHQSxJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQWxCLEVBQXdCO0FBQUEsVUFBQSxLQUFBLEVBQU8sS0FBUDtTQUF4QixFQUp2QjtPQUFBLE1BQUE7ZUFNRSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBTmpCO09BSFc7SUFBQSxDQS9CYixDQUFBOzs4QkFBQTs7S0FGK0IsWUFGakMsQ0FBQTs7QUFBQSxFQThDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixRQUFRLENBQUMsZUFBVCxDQUF5QixzQkFBekIsRUFBaUQ7QUFBQSxJQUFBLFNBQUEsRUFBVyxrQkFBa0IsQ0FBQyxTQUE5QjtBQUFBLElBQXlDLFNBQUEsRUFBUyxLQUFsRDtHQUFqRCxDQTlDakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/rsoto/.atom/packages/status-bar/lib/selection-count-view.coffee
