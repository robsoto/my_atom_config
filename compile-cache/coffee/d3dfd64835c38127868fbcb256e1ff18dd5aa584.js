(function() {
  var CompositeDisposable, GitRepositoryAsync, GitView, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require("underscore-plus");

  _ref = require("atom"), CompositeDisposable = _ref.CompositeDisposable, GitRepositoryAsync = _ref.GitRepositoryAsync;

  GitView = (function(_super) {
    __extends(GitView, _super);

    function GitView() {
      return GitView.__super__.constructor.apply(this, arguments);
    }

    GitView.prototype.initialize = function() {
      this.classList.add('git-view');
      this.createBranchArea();
      this.createCommitsArea();
      this.createStatusArea();
      this.updateStatusPromise = Promise.resolve();
      this.updateBranchPromise = Promise.resolve();
      this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          return _this.subscribeToActiveItem();
        };
      })(this));
      this.projectPathSubscription = atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.subscribeToRepositories();
        };
      })(this));
      this.subscribeToRepositories();
      return this.subscribeToActiveItem();
    };

    GitView.prototype.createBranchArea = function() {
      var branchIcon;
      this.branchArea = document.createElement('div');
      this.branchArea.classList.add('git-branch', 'inline-block');
      this.appendChild(this.branchArea);
      branchIcon = document.createElement('span');
      branchIcon.classList.add('icon', 'icon-git-branch');
      this.branchArea.appendChild(branchIcon);
      this.branchLabel = document.createElement('span');
      this.branchLabel.classList.add('branch-label');
      return this.branchArea.appendChild(this.branchLabel);
    };

    GitView.prototype.createCommitsArea = function() {
      this.commitsArea = document.createElement('div');
      this.commitsArea.classList.add('git-commits', 'inline-block');
      this.appendChild(this.commitsArea);
      this.commitsAhead = document.createElement('span');
      this.commitsAhead.classList.add('icon', 'icon-arrow-up', 'commits-ahead-label');
      this.commitsArea.appendChild(this.commitsAhead);
      this.commitsBehind = document.createElement('span');
      this.commitsBehind.classList.add('icon', 'icon-arrow-down', 'commits-behind-label');
      return this.commitsArea.appendChild(this.commitsBehind);
    };

    GitView.prototype.createStatusArea = function() {
      this.gitStatus = document.createElement('div');
      this.gitStatus.classList.add('git-status', 'inline-block');
      this.appendChild(this.gitStatus);
      this.gitStatusIcon = document.createElement('span');
      this.gitStatusIcon.classList.add('icon');
      return this.gitStatus.appendChild(this.gitStatusIcon);
    };

    GitView.prototype.subscribeToActiveItem = function() {
      var activeItem, _ref1;
      activeItem = this.getActiveItem();
      if ((_ref1 = this.savedSubscription) != null) {
        _ref1.dispose();
      }
      this.savedSubscription = activeItem != null ? typeof activeItem.onDidSave === "function" ? activeItem.onDidSave((function(_this) {
        return function() {
          return _this.update();
        };
      })(this)) : void 0 : void 0;
      return this.update();
    };

    GitView.prototype.subscribeToRepositories = function() {
      var repo, _i, _len, _ref1, _ref2, _results;
      if ((_ref1 = this.repositorySubscriptions) != null) {
        _ref1.dispose();
      }
      this.repositorySubscriptions = new CompositeDisposable;
      _ref2 = atom.project.getRepositories();
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        repo = _ref2[_i];
        if (!(repo != null)) {
          continue;
        }
        this.repositorySubscriptions.add(repo.async.onDidChangeStatus((function(_this) {
          return function(_arg) {
            var path, status;
            path = _arg.path, status = _arg.status;
            if (path === _this.getActiveItemPath()) {
              return _this.update();
            }
          };
        })(this)));
        _results.push(this.repositorySubscriptions.add(repo.async.onDidChangeStatuses((function(_this) {
          return function() {
            return _this.update();
          };
        })(this))));
      }
      return _results;
    };

    GitView.prototype.destroy = function() {
      var _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
      if ((_ref1 = this.activeItemSubscription) != null) {
        _ref1.dispose();
      }
      if ((_ref2 = this.projectPathSubscription) != null) {
        _ref2.dispose();
      }
      if ((_ref3 = this.savedSubscription) != null) {
        _ref3.dispose();
      }
      if ((_ref4 = this.repositorySubscriptions) != null) {
        _ref4.dispose();
      }
      if ((_ref5 = this.branchTooltipDisposable) != null) {
        _ref5.dispose();
      }
      if ((_ref6 = this.commitsAheadTooltipDisposable) != null) {
        _ref6.dispose();
      }
      if ((_ref7 = this.commitsBehindTooltipDisposable) != null) {
        _ref7.dispose();
      }
      return (_ref8 = this.statusTooltipDisposable) != null ? _ref8.dispose() : void 0;
    };

    GitView.prototype.getActiveItemPath = function() {
      var _ref1;
      return (_ref1 = this.getActiveItem()) != null ? typeof _ref1.getPath === "function" ? _ref1.getPath() : void 0 : void 0;
    };

    GitView.prototype.getRepositoryForActiveItem = function() {
      var repo, rootDir, rootDirIndex, _i, _len, _ref1, _ref2;
      rootDir = atom.project.relativizePath(this.getActiveItemPath())[0];
      rootDirIndex = atom.project.getPaths().indexOf(rootDir);
      if (rootDirIndex >= 0) {
        return (_ref1 = atom.project.getRepositories()[rootDirIndex]) != null ? _ref1.async : void 0;
      } else {
        _ref2 = atom.project.getRepositories();
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          repo = _ref2[_i];
          if (repo) {
            return repo.async;
          }
        }
      }
    };

    GitView.prototype.getActiveItem = function() {
      return atom.workspace.getActivePaneItem();
    };

    GitView.prototype.update = function() {
      var repo;
      repo = this.getRepositoryForActiveItem();
      this.updateBranchText(repo);
      this.updateAheadBehindCount(repo);
      return this.updateStatusText(repo);
    };

    GitView.prototype.updateBranchText = function(repo) {
      return this.updateBranchPromise = this.updateBranchPromise.then((function(_this) {
        return function() {
          if (_this.showGitInformation(repo)) {
            return repo != null ? repo.getShortHead(_this.getActiveItemPath()).then(function(head) {
              var _ref1;
              _this.branchLabel.textContent = head;
              if (head) {
                _this.branchArea.style.display = '';
              }
              if ((_ref1 = _this.branchTooltipDisposable) != null) {
                _ref1.dispose();
              }
              return _this.branchTooltipDisposable = atom.tooltips.add(_this.branchArea, {
                title: "On branch " + head
              });
            })["catch"](function(e) {
              if (e.name === GitRepositoryAsync.DestroyedErrorName) {
                return null;
              } else {
                return Promise.reject(e);
              }
            })["catch"](function(e) {
              console.error('Error getting short head:');
              return console.error(e);
            }) : void 0;
          } else {
            return _this.branchArea.style.display = 'none';
          }
        };
      })(this));
    };

    GitView.prototype.showGitInformation = function(repo) {
      var itemPath;
      if (repo == null) {
        return false;
      }
      if (itemPath = this.getActiveItemPath()) {
        return atom.project.contains(itemPath);
      } else {
        return this.getActiveItem() == null;
      }
    };

    GitView.prototype.updateAheadBehindCount = function(repo) {
      var itemPath;
      if (!this.showGitInformation(repo)) {
        this.commitsArea.style.display = 'none';
        return;
      }
      itemPath = this.getActiveItemPath();
      return repo.getCachedUpstreamAheadBehindCount(itemPath).then((function(_this) {
        return function(_arg) {
          var ahead, behind, _ref1, _ref2;
          ahead = _arg.ahead, behind = _arg.behind;
          if (ahead > 0) {
            _this.commitsAhead.textContent = ahead;
            _this.commitsAhead.style.display = '';
            if ((_ref1 = _this.commitsAheadTooltipDisposable) != null) {
              _ref1.dispose();
            }
            _this.commitsAheadTooltipDisposable = atom.tooltips.add(_this.commitsAhead, {
              title: "" + (_.pluralize(ahead, 'commit')) + " ahead of upstream"
            });
          } else {
            _this.commitsAhead.style.display = 'none';
          }
          if (behind > 0) {
            _this.commitsBehind.textContent = behind;
            _this.commitsBehind.style.display = '';
            if ((_ref2 = _this.commitsBehindTooltipDisposable) != null) {
              _ref2.dispose();
            }
            _this.commitsBehindTooltipDisposable = atom.tooltips.add(_this.commitsBehind, {
              title: "" + (_.pluralize(behind, 'commit')) + " behind upstream"
            });
          } else {
            _this.commitsBehind.style.display = 'none';
          }
          if (ahead > 0 || behind > 0) {
            return _this.commitsArea.style.display = '';
          } else {
            return _this.commitsArea.style.display = 'none';
          }
        };
      })(this));
    };

    GitView.prototype.clearStatus = function() {
      return this.gitStatusIcon.classList.remove('icon-diff-modified', 'status-modified', 'icon-diff-added', 'status-added', 'icon-diff-ignored', 'status-ignored');
    };

    GitView.prototype.updateAsNewFile = function() {
      var textEditor;
      this.clearStatus();
      this.gitStatusIcon.classList.add('icon-diff-added', 'status-added');
      if (textEditor = atom.workspace.getActiveTextEditor()) {
        this.gitStatusIcon.textContent = "+" + (textEditor.getLineCount());
        this.updateTooltipText("" + (_.pluralize(textEditor.getLineCount(), 'line')) + " in this new file not yet committed");
      } else {
        this.gitStatusIcon.textContent = '';
        this.updateTooltipText();
      }
      this.gitStatus.style.display = '';
      return Promise.resolve();
    };

    GitView.prototype.updateAsModifiedFile = function(repo, path) {
      return repo.getDiffStats(path).then((function(_this) {
        return function(stats) {
          _this.clearStatus();
          _this.gitStatusIcon.classList.add('icon-diff-modified', 'status-modified');
          if (stats.added && stats.deleted) {
            _this.gitStatusIcon.textContent = "+" + stats.added + ", -" + stats.deleted;
            _this.updateTooltipText("" + (_.pluralize(stats.added, 'line')) + " added and " + (_.pluralize(stats.deleted, 'line')) + " deleted in this file not yet committed");
          } else if (stats.added) {
            _this.gitStatusIcon.textContent = "+" + stats.added;
            _this.updateTooltipText("" + (_.pluralize(stats.added, 'line')) + " added to this file not yet committed");
          } else if (stats.deleted) {
            _this.gitStatusIcon.textContent = "-" + stats.deleted;
            _this.updateTooltipText("" + (_.pluralize(stats.deleted, 'line')) + " deleted from this file not yet committed");
          } else {
            _this.gitStatusIcon.textContent = '';
            _this.updateTooltipText();
          }
          return _this.gitStatus.style.display = '';
        };
      })(this));
    };

    GitView.prototype.updateAsIgnoredFile = function() {
      this.clearStatus();
      this.gitStatusIcon.classList.add('icon-diff-ignored', 'status-ignored');
      this.gitStatusIcon.textContent = '';
      this.gitStatus.style.display = '';
      this.updateTooltipText("File is ignored by git");
      return Promise.resolve();
    };

    GitView.prototype.updateTooltipText = function(text) {
      var _ref1;
      if ((_ref1 = this.statusTooltipDisposable) != null) {
        _ref1.dispose();
      }
      if (text) {
        return this.statusTooltipDisposable = atom.tooltips.add(this.gitStatusIcon, {
          title: text
        });
      }
    };

    GitView.prototype.updateStatusText = function(repo) {
      var hideStatus, itemPath;
      hideStatus = (function(_this) {
        return function() {
          _this.clearStatus();
          return _this.gitStatus.style.display = 'none';
        };
      })(this);
      itemPath = this.getActiveItemPath();
      return this.updateStatusPromise = this.updateStatusPromise.then((function(_this) {
        return function() {
          if (_this.showGitInformation(repo) && (itemPath != null)) {
            return repo != null ? repo.getCachedPathStatus(itemPath).then(function(status) {
              if (status == null) {
                status = 0;
              }
              if (repo != null ? repo.isStatusNew(status) : void 0) {
                return _this.updateAsNewFile();
              }
              if (repo != null ? repo.isStatusModified(status) : void 0) {
                return _this.updateAsModifiedFile(repo, itemPath);
              }
              return repo != null ? repo.isPathIgnored(itemPath).then(function(ignored) {
                if (ignored) {
                  return _this.updateAsIgnoredFile();
                } else {
                  hideStatus();
                  return Promise.resolve();
                }
              }) : void 0;
            })["catch"](function(e) {
              if (e.name === GitRepositoryAsync.DestroyedErrorName) {
                return null;
              } else {
                return Promise.reject(e);
              }
            })["catch"](function(e) {
              console.error('Error getting status for ' + itemPath + ':');
              return console.error(e);
            }) : void 0;
          } else {
            return hideStatus();
          }
        };
      })(this));
    };

    return GitView;

  })(HTMLElement);

  module.exports = document.registerElement('status-bar-git', {
    prototype: GitView.prototype,
    "extends": 'div'
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvc3RhdHVzLWJhci9saWIvZ2l0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLE9BQTRDLE9BQUEsQ0FBUSxNQUFSLENBQTVDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsMEJBQUEsa0JBRHRCLENBQUE7O0FBQUEsRUFHTTtBQUNKLDhCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxzQkFBQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxVQUFmLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGdCQUFELENBQUEsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxDQUhBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxnQkFBRCxDQUFBLENBSkEsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLG1CQUFELEdBQXVCLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FOdkIsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLG1CQUFELEdBQXVCLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FQdkIsQ0FBQTtBQUFBLE1BU0EsSUFBQyxDQUFBLHNCQUFELEdBQTBCLElBQUksQ0FBQyxTQUFTLENBQUMseUJBQWYsQ0FBeUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDakUsS0FBQyxDQUFBLHFCQUFELENBQUEsRUFEaUU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QyxDQVQxQixDQUFBO0FBQUEsTUFXQSxJQUFDLENBQUEs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

//# sourceURL=/home/rsoto/.atom/packages/status-bar/lib/git-view.coffee
