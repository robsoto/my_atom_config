(function() {
  var Disposable, StatusBarView, Tile,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Disposable = require('atom').Disposable;

  Tile = require('./tile');

  StatusBarView = (function(_super) {
    __extends(StatusBarView, _super);

    function StatusBarView() {
      return StatusBarView.__super__.constructor.apply(this, arguments);
    }

    StatusBarView.prototype.createdCallback = function() {
      var flexboxHackElement;
      this.classList.add('status-bar');
      flexboxHackElement = document.createElement('div');
      flexboxHackElement.classList.add('flexbox-repaint-hack');
      this.appendChild(flexboxHackElement);
      this.leftPanel = document.createElement('div');
      this.leftPanel.classList.add('status-bar-left');
      flexboxHackElement.appendChild(this.leftPanel);
      this.rightPanel = document.createElement('div');
      this.rightPanel.classList.add('status-bar-right');
      flexboxHackElement.appendChild(this.rightPanel);
      this.leftTiles = [];
      return this.rightTiles = [];
    };

    StatusBarView.prototype.initialize = function() {
      this.bufferSubscriptions = [];
      this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          _this.unsubscribeAllFromBuffer();
          _this.storeActiveBuffer();
          _this.subscribeAllToBuffer();
          return _this.dispatchEvent(new CustomEvent('active-buffer-changed', {
            bubbles: true
          }));
        };
      })(this));
      this.storeActiveBuffer();
      return this;
    };

    StatusBarView.prototype.destroy = function() {
      this.activeItemSubscription.dispose();
      this.unsubscribeAllFromBuffer();
      return this.remove();
    };

    StatusBarView.prototype.addLeftTile = function(options) {
      var index, item, newElement, newItem, newPriority, newTile, nextElement, nextItem, priority, _i, _len, _ref, _ref1, _ref2;
      newItem = options.item;
      newPriority = (_ref = options != null ? options.priority : void 0) != null ? _ref : this.leftTiles[this.leftTiles.length - 1].priority + 1;
      nextItem = null;
      _ref1 = this.leftTiles;
      for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
        _ref2 = _ref1[index], priority = _ref2.priority, item = _ref2.item;
        if (priority > newPriority) {
          nextItem = item;
          break;
        }
      }
      newTile = new Tile(newItem, newPriority, this.leftTiles);
      this.leftTiles.splice(index, 0, newTile);
      newElement = atom.views.getView(newItem);
      nextElement = atom.views.getView(nextItem);
      this.leftPanel.insertBefore(newElement, nextElement);
      return newTile;
    };

    StatusBarView.prototype.addRightTile = function(options) {
      var index, item, newElement, newItem, newPriority, newTile, nextElement, nextItem, priority, _i, _len, _ref, _ref1, _ref2;
      newItem = options.item;
      newPriority = (_ref = options != null ? options.priority : void 0) != null ? _ref : this.rightTiles[0].priority + 1;
      nextItem = null;
      _ref1 = this.rightTiles;
      for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
        _ref2 = _ref1[index], priority = _ref2.priority, item = _ref2.item;
        if (priority < newPriority) {
          nextItem = item;
          break;
        }
      }
      newTile = new Tile(newItem, newPriority, this.rightTiles);
      this.rightTiles.splice(index, 0, newTile);
      newElement = atom.views.getView(newItem);
      nextElement = atom.views.getView(nextItem);
      this.rightPanel.insertBefore(newElement, nextElement);
      return newTile;
    };

    StatusBarView.prototype.getLeftTiles = function() {
      return this.leftTiles;
    };

    StatusBarView.prototype.getRightTiles = function() {
      return this.rightTiles;
    };

    StatusBarView.prototype.getActiveBuffer = function() {
      return this.buffer;
    };

    StatusBarView.prototype.getActiveItem = function() {
      return atom.workspace.getActivePaneItem();
    };

    StatusBarView.prototype.storeActiveBuffer = function() {
      var _ref;
      return this.buffer = (_ref = this.getActiveItem()) != null ? typeof _ref.getBuffer === "function" ? _ref.getBuffer() : void 0 : void 0;
    };

    StatusBarView.prototype.subscribeToBuffer = function(event, callback) {
      this.bufferSubscriptions.push([event, callback]);
      if (this.buffer) {
        return this.buffer.on(event, callback);
      }
    };

    StatusBarView.prototype.subscribeAllToBuffer = function() {
      var callback, event, _i, _len, _ref, _ref1, _results;
      if (!this.buffer) {
        return;
      }
      _ref = this.bufferSubscriptions;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], event = _ref1[0], callback = _ref1[1];
        _results.push(this.buffer.on(event, callback));
      }
      return _results;
    };

    StatusBarView.prototype.unsubscribeAllFromBuffer = function() {
      var callback, event, _i, _len, _ref, _ref1, _results;
      if (!this.buffer) {
        return;
      }
      _ref = this.bufferSubscriptions;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], event = _ref1[0], callback = _ref1[1];
        _results.push(this.buffer.off(event, callback));
      }
      return _results;
    };

    return StatusBarView;

  })(HTMLElement);

  module.exports = document.registerElement('status-bar', {
    prototype: StatusBarView.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvc3RhdHVzLWJhci9saWIvc3RhdHVzLWJhci12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQURQLENBQUE7O0FBQUEsRUFHTTtBQUNKLG9DQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSw0QkFBQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLFVBQUEsa0JBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLFlBQWYsQ0FBQSxDQUFBO0FBQUEsTUFFQSxrQkFBQSxHQUFxQixRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUZyQixDQUFBO0FBQUEsTUFHQSxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsR0FBN0IsQ0FBaUMsc0JBQWpDLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxrQkFBYixDQUpBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxTQUFELEdBQWEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FOYixDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFyQixDQUF5QixpQkFBekIsQ0FQQSxDQUFBO0FBQUEsTUFRQSxrQkFBa0IsQ0FBQyxXQUFuQixDQUErQixJQUFDLENBQUEsU0FBaEMsQ0FSQSxDQUFBO0FBQUEsTUFVQSxJQUFDLENBQUEsVUFBRCxHQUFjLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBVmQsQ0FBQTtBQUFBLE1BV0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxTQUFT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

//# sourceURL=/home/rsoto/.atom/packages/status-bar/lib/status-bar-view.coffee
