(function() {
  var CursorPositionView, FileInfoView, GitView, Grim, SelectionCountView, StatusBarView,
    __slice = [].slice;

  Grim = require('grim');

  StatusBarView = require('./status-bar-view');

  FileInfoView = require('./file-info-view');

  CursorPositionView = require('./cursor-position-view');

  SelectionCountView = require('./selection-count-view');

  GitView = require('./git-view');

  module.exports = {
    activate: function() {
      var LaunchModeView, devMode, launchModeView, safeMode, _ref;
      this.statusBar = new StatusBarView();
      this.statusBar.initialize();
      this.statusBarPanel = atom.workspace.addFooterPanel({
        item: this.statusBar,
        priority: 0
      });
      atom.commands.add('atom-workspace', 'status-bar:toggle', (function(_this) {
        return function() {
          if (_this.statusBarPanel.isVisible()) {
            return _this.statusBarPanel.hide();
          } else {
            return _this.statusBarPanel.show();
          }
        };
      })(this));
      _ref = atom.getLoadSettings(), safeMode = _ref.safeMode, devMode = _ref.devMode;
      if (safeMode || devMode) {
        LaunchModeView = require('./launch-mode-view');
        launchModeView = new LaunchModeView();
        launchModeView.initialize({
          safeMode: safeMode,
          devMode: devMode
        });
        this.statusBar.addLeftTile({
          item: launchModeView,
          priority: -1
        });
      }
      this.fileInfo = new FileInfoView();
      this.fileInfo.initialize();
      this.statusBar.addLeftTile({
        item: this.fileInfo,
        priority: 0
      });
      this.cursorPosition = new CursorPositionView();
      this.cursorPosition.initialize();
      this.statusBar.addLeftTile({
        item: this.cursorPosition,
        priority: 1
      });
      this.selectionCount = new SelectionCountView();
      this.selectionCount.initialize();
      this.statusBar.addLeftTile({
        item: this.selectionCount,
        priority: 2
      });
      this.git = new GitView();
      this.git.initialize();
      return this.statusBar.addRightTile({
        item: this.git,
        priority: 0
      });
    },
    deactivate: function() {
      var _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      if ((_ref = this.git) != null) {
        _ref.destroy();
      }
      this.git = null;
      if ((_ref1 = this.fileInfo) != null) {
        _ref1.destroy();
      }
      this.fileInfo = null;
      if ((_ref2 = this.cursorPosition) != null) {
        _ref2.destroy();
      }
      this.cursorPosition = null;
      if ((_ref3 = this.selectionCount) != null) {
        _ref3.destroy();
      }
      this.selectionCount = null;
      if ((_ref4 = this.statusBarPanel) != null) {
        _ref4.destroy();
      }
      this.statusBarPanel = null;
      if ((_ref5 = this.statusBar) != null) {
        _ref5.destroy();
      }
      this.statusBar = null;
      if (atom.__workspaceView != null) {
        return delete atom.__workspaceView.statusBar;
      }
    },
    provideStatusBar: function() {
      return {
        addLeftTile: this.statusBar.addLeftTile.bind(this.statusBar),
        addRightTile: this.statusBar.addRightTile.bind(this.statusBar),
        getLeftTiles: this.statusBar.getLeftTiles.bind(this.statusBar),
        getRightTiles: this.statusBar.getRightTiles.bind(this.statusBar)
      };
    },
    legacyProvideStatusBar: function() {
      var statusbar;
      statusbar = this.provideStatusBar();
      return {
        addLeftTile: function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          Grim.deprecate("Use version ^1.0.0 of the status-bar Service API.");
          return statusbar.addLeftTile.apply(statusbar, args);
        },
        addRightTile: function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          Grim.deprecate("Use version ^1.0.0 of the status-bar Service API.");
          return statusbar.addRightTile.apply(statusbar, args);
        },
        getLeftTiles: function() {
          Grim.deprecate("Use version ^1.0.0 of the status-bar Service API.");
          return statusbar.getLeftTiles();
        },
        getRightTiles: function() {
          Grim.deprecate("Use version ^1.0.0 of the status-bar Service API.");
          return statusbar.getRightTiles();
        }
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvc3RhdHVzLWJhci9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0ZBQUE7SUFBQSxrQkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxtQkFBUixDQURoQixDQUFBOztBQUFBLEVBRUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUixDQUZmLENBQUE7O0FBQUEsRUFHQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsd0JBQVIsQ0FIckIsQ0FBQTs7QUFBQSxFQUlBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx3QkFBUixDQUpyQixDQUFBOztBQUFBLEVBS0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSLENBTFYsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixVQUFBLHVEQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBRCxHQUFpQixJQUFBLGFBQUEsQ0FBQSxDQUFqQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLFVBQVgsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBZixDQUE4QjtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxTQUFQO0FBQUEsUUFBa0IsUUFBQSxFQUFVLENBQTVCO09BQTlCLENBRmxCLENBQUE7QUFBQSxNQUlBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsbUJBQXBDLEVBQXlELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxT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

//# sourceURL=/home/rsoto/.atom/packages/status-bar/lib/main.coffee
