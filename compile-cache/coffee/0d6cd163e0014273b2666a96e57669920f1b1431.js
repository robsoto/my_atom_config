(function() {
  var $, CompositeDisposable, InputView;

  $ = require('atom-space-pen-views').$;

  CompositeDisposable = require('atom').CompositeDisposable;

  InputView = require('./input-view');

  module.exports = {
    inputView: null,
    activate: function(state) {
      var handleEditorCancel;
      this.subscriber = new CompositeDisposable;
      this.subscriber.add(atom.commands.add('atom-workspace', 'incremental-search:forward', (function(_this) {
        return function() {
          return _this.findPressed('forward');
        };
      })(this)));
      this.subscriber.add(atom.commands.add('atom-workspace', 'incremental-search:backward', (function(_this) {
        return function() {
          return _this.findPressed('backward');
        };
      })(this)));
      handleEditorCancel = (function(_this) {
        return function(_arg) {
          var isMiniEditor, target, _ref;
          target = _arg.target;
          isMiniEditor = target.tagName === 'ATOM-TEXT-EDITOR' && target.hasAttribute('mini');
          if (!isMiniEditor) {
            return (_ref = _this.inputView) != null ? _ref.inputPanel.hide() : void 0;
          }
        };
      })(this);
      return this.subscriber.add(atom.commands.add('atom-workspace', {
        'core:cancel': handleEditorCancel,
        'core:close': handleEditorCancel
      }));
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.inputView) != null) {
        _ref.destroy();
      }
      return this.inputView = null;
    },
    findPressed: function(direction) {
      this.createViews();
      return this.inputView.trigger(direction);
    },
    createViews: function() {
      if (this.inputView != null) {
        return;
      }
      return this.inputView = new InputView();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvaW5jcmVtZW50YWwtc2VhcmNoL2xpYi9pc2VhcmNoLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQ0FBQTs7QUFBQSxFQUFDLElBQUssT0FBQSxDQUFRLHNCQUFSLEVBQUwsQ0FBRCxDQUFBOztBQUFBLEVBQ0Msc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQURELENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FIWixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsU0FBQSxFQUFXLElBQVg7QUFBQSxJQUVBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLFVBQUEsa0JBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsR0FBQSxDQUFBLG1CQUFkLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxVQUFVLENBQUMsR0FBWixDQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLDRCQUFwQyxFQUFrRSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxXQUFELENBQWEsU0FBYixFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEUsQ0FBaEIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsVUFBVSxDQUFDLEdBQVosQ0FBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyw2QkFBcEMsRUFBbUUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsV0FBRCxDQUFhLFVBQWIsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5FLENBQWhCLENBRkEsQ0FBQTtBQUFBLE1BSUEsa0JBQUEsR0FBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO0FBQ25CLGNBQUEsMEJBQUE7QUFBQSxVQURxQixTQUFELEtBQUMsTUFDckIsQ0FBQTtBQUFBLFVBQUEsWUFBQSxHQUFlLE1BQU0sQ0FBQyxPQUFQLEtBQWtCLGtCQUFsQixJQUF5QyxNQUFNLENBQUMsWUFBUCxDQUFvQixNQUFwQixDQUF4RCxDQUFBO0FBQ0EsVUFBQSxJQUFBLENBQUEsWUFBQTswREFDWSxDQUFFLFVBQVUsQ0FBQyxJQUF2QixDQUFBLFdBREY7V0FGbUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUpyQixDQUFBO2FBU0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxHQUFaLENBQWdCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDZDtBQUFBLFFBQUEsYUFBQSxFQUFlLGtCQUFmO0FBQUEsUUFDQSxZQUFBLEVBQWMsa0JBRGQ7T0FEYyxDQUFoQixFQVZRO0lBQUEsQ0FGVjtBQUFBLElBZ0JBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLElBQUE7O1lBQVUsQ0FBRSxPQUFaLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxTQUFELEdBQWEsS0FGSDtJQUFBLENBaEJaO0FBQUEsSUF1QkEsV0FBQSxFQUFhLFNBQUMsU0FBRCxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsV0FBRCxDQUFBLENBQUEsQ0FBQTthQUVBLElBQUMsQ0FBQSxTQUFTLENBQUMsT0FBWCxDQUFtQixTQUFuQixFQUhXO0lBQUEsQ0F2QmI7QUFBQSxJQTRCQSxXQUFBLEVBQWEsU0FBQSxHQUFBO0FBQ1gsTUFBQSxJQUFVLHNCQUFWO0FBQUEsY0FBQSxDQUFBO09BQUE7YUFFQSxJQUFDLENBQUEsU0FBRCxHQUFpQixJQUFBLFNBQUEsQ0FBQSxFQUhOO0lBQUEsQ0E1QmI7R0FORixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/rsoto/.atom/packages/incremental-search/lib/isearch.coffee
