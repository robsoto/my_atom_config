(function() {
  var Disposable, FileInfoView, url,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Disposable = require('atom').Disposable;

  url = require('url');

  FileInfoView = (function(_super) {
    __extends(FileInfoView, _super);

    function FileInfoView() {
      return FileInfoView.__super__.constructor.apply(this, arguments);
    }

    FileInfoView.prototype.initialize = function() {
      var clickHandler;
      this.classList.add('file-info', 'inline-block');
      this.currentPath = document.createElement('a');
      this.currentPath.classList.add('current-path');
      this.appendChild(this.currentPath);
      this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          return _this.subscribeToActiveItem();
        };
      })(this));
      this.subscribeToActiveItem();
      clickHandler = (function(_this) {
        return function(event) {
          var isShiftClick, text;
          isShiftClick = event.shiftKey;
          _this.showCopiedTooltip(isShiftClick);
          text = _this.getActiveItemCopyText(isShiftClick);
          atom.clipboard.write(text);
          return setTimeout(function() {
            return _this.clearCopiedTooltip();
          }, 2000);
        };
      })(this);
      this.currentPath.addEventListener('click', clickHandler);
      return this.clickSubscription = new Disposable((function(_this) {
        return function() {
          return _this.removeEventListener('click', clickHandler);
        };
      })(this));
    };

    FileInfoView.prototype.clearCopiedTooltip = function() {
      var _ref;
      return (_ref = this.copiedTooltip) != null ? _ref.dispose() : void 0;
    };

    FileInfoView.prototype.showCopiedTooltip = function(copyRelativePath) {
      var text, _ref;
      if ((_ref = this.copiedTooltip) != null) {
        _ref.dispose();
      }
      text = this.getActiveItemCopyText(copyRelativePath);
      return this.copiedTooltip = atom.tooltips.add(this, {
        title: "Copied: " + text,
        trigger: 'click',
        delay: {
          show: 0
        }
      });
    };

    FileInfoView.prototype.getActiveItemCopyText = function(copyRelativePath) {
      var activeItem, path;
      activeItem = this.getActiveItem();
      path = activeItem != null ? typeof activeItem.getPath === "function" ? activeItem.getPath() : void 0 : void 0;
      if ((path != null ? path.indexOf('://') : void 0) > 0) {
        path = url.parse(path).path;
      }
      if (path == null) {
        return (activeItem != null ? typeof activeItem.getTitle === "function" ? activeItem.getTitle() : void 0 : void 0) || '';
      }
      if (copyRelativePath) {
        return atom.project.relativize(path);
      } else {
        return path;
      }
    };

    FileInfoView.prototype.subscribeToActiveItem = function() {
      var activeItem, _ref, _ref1;
      if ((_ref = this.modifiedSubscription) != null) {
        _ref.dispose();
      }
      if ((_ref1 = this.titleSubscription) != null) {
        _ref1.dispose();
      }
      if (activeItem = this.getActiveItem()) {
        if (this.updateCallback == null) {
          this.updateCallback = (function(_this) {
            return function() {
              return _this.update();
            };
          })(this);
        }
        if (typeof activeItem.onDidChangeTitle === 'function') {
          this.titleSubscription = activeItem.onDidChangeTitle(this.updateCallback);
        } else if (typeof activeItem.on === 'function') {
          activeItem.on('title-changed', this.updateCallback);
          this.titleSubscription = {
            dispose: (function(_this) {
              return function() {
                return typeof activeItem.off === "function" ? activeItem.off('title-changed', _this.updateCallback) : void 0;
              };
            })(this)
          };
        }
        this.modifiedSubscription = typeof activeItem.onDidChangeModified === "function" ? activeItem.onDidChangeModified(this.updateCallback) : void 0;
      }
      return this.update();
    };

    FileInfoView.prototype.destroy = function() {
      var _ref, _ref1, _ref2, _ref3;
      this.activeItemSubscription.dispose();
      if ((_ref = this.titleSubscription) != null) {
        _ref.dispose();
      }
      if ((_ref1 = this.modifiedSubscription) != null) {
        _ref1.dispose();
      }
      if ((_ref2 = this.clickSubscription) != null) {
        _ref2.dispose();
      }
      return (_ref3 = this.copiedTooltip) != null ? _ref3.dispose() : void 0;
    };

    FileInfoView.prototype.getActiveItem = function() {
      return atom.workspace.getActivePaneItem();
    };

    FileInfoView.prototype.update = function() {
      var _ref;
      this.updatePathText();
      return this.updateBufferHasModifiedText((_ref = this.getActiveItem()) != null ? typeof _ref.isModified === "function" ? _ref.isModified() : void 0 : void 0);
    };

    FileInfoView.prototype.updateBufferHasModifiedText = function(isModified) {
      if (isModified) {
        this.classList.add('buffer-modified');
        return this.isModified = true;
      } else {
        this.classList.remove('buffer-modified');
        return this.isModified = false;
      }
    };

    FileInfoView.prototype.updatePathText = function() {
      var path, title, _ref, _ref1;
      if (path = (_ref = this.getActiveItem()) != null ? typeof _ref.getPath === "function" ? _ref.getPath() : void 0 : void 0) {
        return this.currentPath.textContent = atom.project.relativize(path);
      } else if (title = (_ref1 = this.getActiveItem()) != null ? typeof _ref1.getTitle === "function" ? _ref1.getTitle() : void 0 : void 0) {
        return this.currentPath.textContent = title;
      } else {
        return this.currentPath.textContent = '';
      }
    };

    return FileInfoView;

  })(HTMLElement);

  module.exports = document.registerElement('status-bar-file', {
    prototype: FileInfoView.prototype,
    "extends": 'div'
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvc3RhdHVzLWJhci9saWIvZmlsZS1pbmZvLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBQ0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSLENBRE4sQ0FBQTs7QUFBQSxFQUdNO0FBQ0osbUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDJCQUFBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixVQUFBLFlBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLFdBQWYsRUFBNEIsY0FBNUIsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsV0FBRCxHQUFlLFFBQVEsQ0FBQyxhQUFULENBQXVCLEdBQXZCLENBRmYsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBdkIsQ0FBMkIsY0FBM0IsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxXQUFkLENBSkEsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLHNCQUFELEdBQTBCLElBQUksQ0FBQyxTQUFTLENBQUMseUJBQWYsQ0FBeUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDakUsS0FBQyxDQUFBLHFCQUFELENBQUEsRUFEaUU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QyxDQU4xQixDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEscUJBQUQsQ0FBQSxDQVJBLENBQUE7QUFBQSxNQVVBLFlBQUEsR0FBZSxDQUFBLFNBQUEsS0FBQSxHQUFB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

//# sourceURL=/home/rsoto/.atom/packages/status-bar/lib/file-info-view.coffee
