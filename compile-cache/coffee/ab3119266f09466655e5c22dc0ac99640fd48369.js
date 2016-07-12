(function() {
  var DB, OpenRecent, minimatch;

  minimatch = null;

  DB = (function() {
    function DB(key) {
      this.key = key;
    }

    DB.prototype.getData = function() {
      var data;
      data = localStorage[this.key];
      data = data != null ? JSON.parse(data) : {};
      return data;
    };

    DB.prototype.setData = function(data) {
      return localStorage[this.key] = JSON.stringify(data);
    };

    DB.prototype.removeData = function() {
      return localStorage.removeItem(this.key);
    };

    DB.prototype.get = function(name) {
      var data;
      data = this.getData();
      return data[name];
    };

    DB.prototype.set = function(name, value) {
      var data;
      data = this.getData();
      data[name] = value;
      return this.setData(data);
    };

    DB.prototype.remove = function(name) {
      var data;
      data = this.getData();
      delete data[name];
      return this.setData(data);
    };

    return DB;

  })();

  OpenRecent = (function() {
    function OpenRecent() {
      this.eventListenerDisposables = [];
      this.commandListenerDisposables = [];
      this.localStorageEventListener = this.onLocalStorageEvent.bind(this);
      this.db = new DB('openRecent');
    }

    OpenRecent.prototype.onUriOpened = function() {
      var editor, filePath, _ref, _ref1;
      editor = atom.workspace.getActiveTextEditor();
      filePath = editor != null ? (_ref = editor.buffer) != null ? (_ref1 = _ref.file) != null ? _ref1.path : void 0 : void 0 : void 0;
      if (!filePath) {
        return;
      }
      if (!filePath.indexOf('://' === -1)) {
        return;
      }
      if (filePath) {
        return this.insertFilePath(filePath);
      }
    };

    OpenRecent.prototype.onProjectPathChange = function(projectPaths) {
      return this.insertCurrentPaths();
    };

    OpenRecent.prototype.onLocalStorageEvent = function(e) {
      if (e.key === this.db.key) {
        return this.update();
      }
    };

    OpenRecent.prototype.encodeEventName = function(s) {
      s = s.replace('-', '\u2010');
      s = s.replace(':', '\u02D0');
      return s;
    };

    OpenRecent.prototype.commandEventName = function(prefix, path) {
      return "open-recent:" + prefix + "-" + (this.encodeEventName(path));
    };

    OpenRecent.prototype.addCommandListeners = function() {
      var disposable, index, path, _fn, _fn1, _i, _j, _len, _len1, _ref, _ref1;
      _ref = this.db.get('files');
      _fn = (function(_this) {
        return function(path) {
          var disposable;
          disposable = atom.commands.add("atom-workspace", _this.commandEventName("File" + index, path), function() {
            return _this.openFile(path);
          });
          return _this.commandListenerDisposables.push(disposable);
        };
      })(this);
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        path = _ref[index];
        _fn(path);
      }
      _ref1 = this.db.get('paths');
      _fn1 = (function(_this) {
        return function(path) {
          var disposable;
          disposable = atom.commands.add("atom-workspace", _this.commandEventName("Dir" + index, path), function() {
            return _this.openPath(path);
          });
          return _this.commandListenerDisposables.push(disposable);
        };
      })(this);
      for (index = _j = 0, _len1 = _ref1.length; _j < _len1; index = ++_j) {
        path = _ref1[index];
        _fn1(path);
      }
      disposable = atom.commands.add("atom-workspace", "open-recent:clear-all" + '-'.repeat(1024), (function(_this) {
        return function() {
          _this.db.set('files', []);
          _this.db.set('paths', []);
          return _this.update();
        };
      })(this));
      return this.commandListenerDisposables.push(disposable);
    };

    OpenRecent.prototype.getProjectPath = function(path) {
      var _ref;
      return (_ref = atom.project.getPaths()) != null ? _ref[0] : void 0;
    };

    OpenRecent.prototype.openFile = function(path) {
      return atom.workspace.open(path);
    };

    OpenRecent.prototype.openPath = function(path) {
      var options, replaceCurrentProject, workspaceElement;
      replaceCurrentProject = false;
      options = {};
      if (!this.getProjectPath() && atom.config.get('open-recent.replaceNewWindowOnOpenDirectory')) {
        replaceCurrentProject = true;
      } else if (this.getProjectPath() && atom.config.get('open-recent.replaceProjectOnOpenDirectory')) {
        replaceCurrentProject = true;
      }
      if (replaceCurrentProject) {
        atom.project.setPaths([path]);
        if (workspaceElement = atom.views.getView(atom.workspace)) {
          return atom.commands.dispatch(workspaceElement, 'tree-view:toggle-focus');
        }
      } else {
        return atom.open({
          pathsToOpen: [path],
          newWindow: !atom.config.get('open-recent.replaceNewWindowOnOpenDirectory')
        });
      }
    };

    OpenRecent.prototype.addListeners = function() {
      var disposable;
      this.addCommandListeners();
      disposable = atom.workspace.onDidOpen(this.onUriOpened.bind(this));
      this.eventListenerDisposables.push(disposable);
      disposable = atom.project.onDidChangePaths(this.onProjectPathChange.bind(this));
      this.eventListenerDisposables.push(disposable);
      return window.addEventListener("storage", this.localStorageEventListener);
    };

    OpenRecent.prototype.removeCommandListeners = function() {
      var disposable, _i, _len, _ref;
      _ref = this.commandListenerDisposables;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        disposable = _ref[_i];
        disposable.dispose();
      }
      return this.commandListenerDisposables = [];
    };

    OpenRecent.prototype.removeListeners = function() {
      var disposable, _i, _len, _ref;
      this.removeCommandListeners();
      _ref = this.eventListenerDisposables;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        disposable = _ref[_i];
        disposable.dispose();
      }
      this.eventListenerDisposables = [];
      return window.removeEventListener('storage', this.localStorageEventListener);
    };

    OpenRecent.prototype.init = function() {
      if (atom.config.get('open-recent.recentDirectories') || atom.config.get('open-recent.recentFiles')) {
        this.db.set('paths', atom.config.get('open-recent.recentDirectories'));
        this.db.set('files', atom.config.get('open-recent.recentFiles'));
        atom.config.unset('open-recent.recentDirectories');
        atom.config.unset('open-recent.recentFiles');
      }
      if (!this.db.get('paths')) {
        this.db.set('paths', []);
      }
      if (!this.db.get('files')) {
        this.db.set('files', []);
      }
      this.addListeners();
      this.insertCurrentPaths();
      return this.update();
    };

    OpenRecent.prototype.filterPath = function(path) {
      var ignoredNames, match, name, _i, _len;
      ignoredNames = atom.config.get('core.ignoredNames');
      if (ignoredNames) {
        if (minimatch == null) {
          minimatch = require('minimatch');
        }
        for (_i = 0, _len = ignoredNames.length; _i < _len; _i++) {
          name = ignoredNames[_i];
          match = [name, "**/" + name + "/**"].some(function(comparison) {
            return minimatch(path, comparison, {
              matchBase: true,
              dot: true
            });
          });
          if (match) {
            return true;
          }
        }
      }
      return false;
    };

    OpenRecent.prototype.insertCurrentPaths = function() {
      var index, maxRecentDirectories, path, projectDirectory, recentPaths, _i, _len, _ref;
      if (!(atom.project.getDirectories().length > 0)) {
        return;
      }
      recentPaths = this.db.get('paths');
      _ref = atom.project.getDirectories();
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        projectDirectory = _ref[index];
        if (index > 0 && !atom.config.get('open-recent.listDirectoriesAddedToProject')) {
          continue;
        }
        path = projectDirectory.path;
        if (this.filterPath(path)) {
          continue;
        }
        index = recentPaths.indexOf(path);
        if (index !== -1) {
          recentPaths.splice(index, 1);
        }
        recentPaths.splice(0, 0, path);
        maxRecentDirectories = atom.config.get('open-recent.maxRecentDirectories');
        if (recentPaths.length > maxRecentDirectories) {
          recentPaths.splice(maxRecentDirectories, recentPaths.length - maxRecentDirectories);
        }
      }
      this.db.set('paths', recentPaths);
      return this.update();
    };

    OpenRecent.prototype.insertFilePath = function(path) {
      var index, maxRecentFiles, recentFiles;
      if (this.filterPath(path)) {
        return;
      }
      recentFiles = this.db.get('files');
      index = recentFiles.indexOf(path);
      if (index !== -1) {
        recentFiles.splice(index, 1);
      }
      recentFiles.splice(0, 0, path);
      maxRecentFiles = atom.config.get('open-recent.maxRecentFiles');
      if (recentFiles.length > maxRecentFiles) {
        recentFiles.splice(maxRecentFiles, recentFiles.length - maxRecentFiles);
      }
      this.db.set('files', recentFiles);
      return this.update();
    };

    OpenRecent.prototype.createSubmenu = function() {
      var index, menuItem, path, recentFiles, recentPaths, submenu, _i, _j, _len, _len1;
      submenu = [];
      submenu.push({
        command: "pane:reopen-closed-item",
        label: "Reopen Closed File"
      });
      submenu.push({
        type: "separator"
      });
      recentFiles = this.db.get('files');
      if (recentFiles.length) {
        for (index = _i = 0, _len = recentFiles.length; _i < _len; index = ++_i) {
          path = recentFiles[index];
          menuItem = {
            label: path,
            command: this.commandEventName("File" + index, path)
          };
          if (path.length > 100) {
            menuItem.label = path.substr(-60);
            menuItem.sublabel = path;
          }
          submenu.push(menuItem);
        }
        submenu.push({
          type: "separator"
        });
      }
      recentPaths = this.db.get('paths');
      if (recentPaths.length) {
        for (index = _j = 0, _len1 = recentPaths.length; _j < _len1; index = ++_j) {
          path = recentPaths[index];
          menuItem = {
            label: path,
            command: this.commandEventName("Dir" + index, path)
          };
          if (path.length > 100) {
            menuItem.label = path.substr(-60);
            menuItem.sublabel = path;
          }
          submenu.push(menuItem);
        }
        submenu.push({
          type: "separator"
        });
      }
      submenu.push({
        command: "open-recent:clear-all" + '-'.repeat(1024),
        label: "Clear List"
      });
      return submenu;
    };

    OpenRecent.prototype.updateMenu = function() {
      var dropdown, item, _i, _j, _len, _len1, _ref, _ref1, _results;
      _ref = atom.menu.template;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dropdown = _ref[_i];
        if (dropdown.label === "File" || dropdown.label === "&File") {
          _ref1 = dropdown.submenu;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            item = _ref1[_j];
            if (item.command === "pane:reopen-closed-item" || item.label === "Open Recent") {
              delete item.accelerator;
              delete item.command;
              delete item.click;
              item.label = "Open Recent";
              item.enabled = true;
              if (item.metadata == null) {
                item.metadata = {};
              }
              item.metadata.windowSpecific = false;
              item.submenu = this.createSubmenu();
              atom.menu.update();
              break;
            }
          }
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    OpenRecent.prototype.update = function() {
      this.removeCommandListeners();
      this.updateMenu();
      return this.addCommandListeners();
    };

    OpenRecent.prototype.destroy = function() {
      return this.removeListeners();
    };

    return OpenRecent;

  })();

  module.exports = {
    config: {
      maxRecentFiles: {
        type: 'number',
        "default": 8
      },
      maxRecentDirectories: {
        type: 'number',
        "default": 8
      },
      replaceNewWindowOnOpenDirectory: {
        type: 'boolean',
        "default": true,
        description: 'When checked, opening a recent directory will "open" in the current window, but only if the window does not have a project path set. Eg: The window that appears when doing File > New Window.'
      },
      replaceProjectOnOpenDirectory: {
        type: 'boolean',
        "default": false,
        description: 'When checked, opening a recent directory will "open" in the current window, replacing the current project.'
      },
      listDirectoriesAddedToProject: {
        type: 'boolean',
        "default": false,
        description: 'When checked, the all root directories in a project will be added to the history and not just the 1st root directory.'
      },
      ignoredNames: {
        type: 'boolean',
        "default": true,
        description: 'When checked, skips files and directories specified in Atom\'s "Ignored Names" setting.'
      }
    },
    instance: null,
    activate: function() {
      this.instance = new OpenRecent();
      return this.instance.init();
    },
    deactivate: function() {
      this.instance.destroy();
      return this.instance = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvb3Blbi1yZWNlbnQvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLElBQVosQ0FBQTs7QUFBQSxFQUdNO0FBQ1MsSUFBQSxZQUFFLEdBQUYsR0FBQTtBQUFRLE1BQVAsSUFBQyxDQUFBLE1BQUEsR0FBTSxDQUFSO0lBQUEsQ0FBYjs7QUFBQSxpQkFFQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sWUFBYSxDQUFBLElBQUMsQ0FBQSxHQUFELENBQXBCLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBVSxZQUFILEdBQWMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQWQsR0FBb0MsRUFEM0MsQ0FBQTtBQUVBLGFBQU8sSUFBUCxDQUhPO0lBQUEsQ0FGVCxDQUFBOztBQUFBLGlCQU9BLE9BQUEsR0FBUyxTQUFDLElBQUQsR0FBQTthQUNQLFlBQWEsQ0FBQSxJQUFDLENBQUEsR0FBRCxDQUFiLEdBQXFCLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBZixFQURkO0lBQUEsQ0FQVCxDQUFBOztBQUFBLGlCQVVBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFDVixZQUFZLENBQUMsVUFBYixDQUF3QixJQUFDLENBQUEsR0FBekIsRUFEVTtJQUFBLENBVlosQ0FBQTs7QUFBQSxpQkFhQSxHQUFBLEdBQUssU0FBQyxJQUFELEdBQUE7QUFDSCxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsT0FBRCxDQUFBLENBQVAsQ0FBQTtBQUNBLGFBQU8sSUFBSyxDQUFBLElBQUEsQ0FBWixDQUZHO0lBQUEsQ0FiTCxDQUFBOztBQUFBLGlCQWlCQSxHQUFBLEdB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

//# sourceURL=/home/rsoto/.atom/packages/open-recent/lib/main.coffee
