(function() {
  var Point, Range, Rename, RenameView, path, _, _ref;

  RenameView = require('./atom-ternjs-rename-view');

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  _ = require('underscore-plus');

  path = require('path');

  module.exports = Rename = (function() {
    Rename.prototype.renameView = null;

    Rename.prototype.manager = null;

    function Rename(manager, state) {
      if (state == null) {
        state = {};
      }
      this.manager = manager;
      this.renameView = new RenameView();
      this.renameView.initialize(this);
      this.renamePanel = atom.workspace.addBottomPanel({
        item: this.renameView,
        priority: 0
      });
      this.renamePanel.hide();
      atom.views.getView(this.renamePanel).classList.add('atom-ternjs-rename-panel', 'panel-bottom');
    }

    Rename.prototype.hide = function() {
      var _ref1;
      if (!((_ref1 = this.renamePanel) != null ? _ref1.isVisible() : void 0)) {
        return;
      }
      this.renamePanel.hide();
      return this.manager.helper.focusEditor();
    };

    Rename.prototype.show = function() {
      var codeEditor, currentName, currentNameRange;
      codeEditor = atom.workspace.getActiveTextEditor();
      currentNameRange = codeEditor.getLastCursor().getCurrentWordBufferRange({
        includeNonWordCharacters: false
      });
      currentName = codeEditor.getTextInBufferRange(currentNameRange);
      this.renameView.nameEditor.getModel().setText(currentName);
      this.renameView.nameEditor.getModel().selectAll();
      this.renamePanel.show();
      return this.renameView.nameEditor.focus();
    };

    Rename.prototype.updateAllAndRename = function(newName) {
      var editor, editors, idx, _i, _len, _results;
      if (!this.manager.client) {
        return;
      }
      idx = 0;
      editors = atom.workspace.getTextEditors();
      _results = [];
      for (_i = 0, _len = editors.length; _i < _len; _i++) {
        editor = editors[_i];
        if (!this.manager.isValidEditor(editor)) {
          idx++;
          continue;
        }
        if (atom.project.relativizePath(editor.getURI())[0] !== this.manager.client.projectDir) {
          idx++;
          continue;
        }
        _results.push(this.manager.client.update(editor).then((function(_this) {
          return function(data) {
            var cursor, position;
            if (++idx === editors.length) {
              editor = atom.workspace.getActiveTextEditor();
              cursor = editor.getLastCursor();
              if (!cursor) {
                return;
              }
              position = cursor.getBufferPosition();
              return _this.manager.client.rename(atom.project.relativizePath(editor.getURI())[1], {
                line: position.row,
                ch: position.column
              }, newName).then(function(data) {
                if (!data) {
                  return;
                }
                return _this.rename(data);
              }, function(err) {
                return atom.notifications.addError(err, {
                  dismissable: false
                });
              });
            }
          };
        })(this)));
      }
      return _results;
    };

    Rename.prototype.rename = function(obj) {
      var arr, arrObj, change, changes, currentFile, dir, idx, translateColumnBy, _i, _j, _k, _len, _len1, _len2, _ref1, _results;
      dir = this.manager.server.projectDir;
      if (!dir) {
        return;
      }
      translateColumnBy = obj.changes[0].text.length - obj.name.length;
      _ref1 = obj.changes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        change = _ref1[_i];
        change.file = change.file.replace(/^.\//, '');
        change.file = path.resolve(atom.project.relativizePath(dir)[0], change.file);
      }
      changes = _.uniq(obj.changes, (function(_this) {
        return function(item) {
          return JSON.stringify(item);
        };
      })(this));
      currentFile = false;
      arr = [];
      idx = 0;
      for (_j = 0, _len1 = changes.length; _j < _len1; _j++) {
        change = changes[_j];
        if (currentFile !== change.file) {
          currentFile = change.file;
          idx = (arr.push([])) - 1;
        }
        arr[idx].push(change);
      }
      _results = [];
      for (_k = 0, _len2 = arr.length; _k < _len2; _k++) {
        arrObj = arr[_k];
        _results.push(this.openFilesAndRename(arrObj, translateColumnBy));
      }
      return _results;
    };

    Rename.prototype.openFilesAndRename = function(obj, translateColumnBy) {
      return atom.workspace.open(obj[0].file).then((function(_this) {
        return function(textEditor) {
          var buffer, change, checkpoint, currentColumnOffset, i, _i, _len;
          currentColumnOffset = 0;
          buffer = textEditor.getBuffer();
          checkpoint = buffer.createCheckpoint();
          for (i = _i = 0, _len = obj.length; _i < _len; i = ++_i) {
            change = obj[i];
            _this.setTextInRange(buffer, change, currentColumnOffset, i === obj.length - 1, textEditor);
            currentColumnOffset += translateColumnBy;
          }
          return buffer.groupChangesSinceCheckpoint(checkpoint);
        };
      })(this));
    };

    Rename.prototype.setTextInRange = function(buffer, change, offset, moveCursor, textEditor) {
      var end, length, position, range, _ref1;
      change.start += offset;
      change.end += offset;
      position = buffer.positionForCharacterIndex(change.start);
      length = change.end - change.start;
      end = position.translate(new Point(0, length));
      range = new Range(position, end);
      buffer.setTextInRange(range, change.text);
      if (!moveCursor) {
        return;
      }
      return (_ref1 = textEditor.getLastCursor()) != null ? _ref1.setBufferPosition(position) : void 0;
    };

    Rename.prototype.destroy = function() {
      var _ref1, _ref2;
      if ((_ref1 = this.renameView) != null) {
        _ref1.destroy();
      }
      this.renameView = null;
      if ((_ref2 = this.renamePanel) != null) {
        _ref2.destroy();
      }
      return this.renamePanel = null;
    };

    return Rename;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXJlbmFtZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0NBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLDJCQUFSLENBQWIsQ0FBQTs7QUFBQSxFQUNBLE9BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsYUFBQSxLQUFELEVBQVEsYUFBQSxLQURSLENBQUE7O0FBQUEsRUFFQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBRkosQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUoscUJBQUEsVUFBQSxHQUFZLElBQVosQ0FBQTs7QUFBQSxxQkFDQSxPQUFBLEdBQVMsSUFEVCxDQUFBOztBQUdhLElBQUEsZ0JBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTs7UUFBVSxRQUFRO09BQzdCO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLE9BQVgsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFVBQUQsR0FBa0IsSUFBQSxVQUFBLENBQUEsQ0FGbEIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxVQUFaLENBQXVCLElBQXZCLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWYsQ0FBOEI7QUFBQSxRQUFBLElBQUEsRUFBTSxJQUFDLENBQUEsVUFBUDtBQUFBLFFBQW1CLFFBQUEsRUFBVSxDQUE3QjtPQUE5QixDQUpmLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFBLENBTEEsQ0FB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

//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/lib/atom-ternjs-rename.coffee
