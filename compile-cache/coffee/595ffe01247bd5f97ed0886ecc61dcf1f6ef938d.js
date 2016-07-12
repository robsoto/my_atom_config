(function() {
  var Helper, fs, path, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  fs = require('fs');

  path = require('path');

  _ = require('underscore-plus');

  module.exports = Helper = (function() {
    Helper.prototype.projectRoot = null;

    Helper.prototype.manager = null;

    Helper.prototype.accessKey = 'altKey';

    Helper.prototype.platform = {
      darwin: false,
      linux: false,
      windows: false
    };

    Helper.prototype.checkpointsDefinition = [];

    Helper.prototype.tags = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    };

    function Helper(manager) {
      this.replaceTags = __bind(this.replaceTags, this);
      this.manager = manager;
      this.initPlatform();
    }

    Helper.prototype.initPlatform = function() {
      var classList;
      classList = document.getElementsByTagName('body')[0].classList.toString();
      this.platform.darwin = classList.indexOf('platform-darwin') > -1;
      this.platform.linux = classList.indexOf('platform-linux') > -1;
      return this.platform.windows = classList.indexOf('platform-win') > -1;
    };

    Helper.prototype.updateTernFile = function(content, restartServer) {
      var _ref;
      this.projectRoot = (_ref = this.manager.server) != null ? _ref.projectDir : void 0;
      if (!this.projectRoot) {
        return;
      }
      return this.writeFile(path.resolve(__dirname, this.projectRoot + '/.tern-project'), content, restartServer);
    };

    Helper.prototype.fileExists = function(path) {
      var e;
      try {
        return fs.accessSync(path, fs.F_OK, (function(_this) {
          return function(err) {
            return console.log(err);
          };
        })(this));
      } catch (_error) {
        e = _error;
        return false;
      }
    };

    Helper.prototype.isDirectory = function(dir) {
      try {
        return fs.statSync(dir).isDirectory();
      } catch (_error) {
        return false;
      }
    };

    Helper.prototype.writeFile = function(filePath, content, restartServer) {
      return fs.writeFile(filePath, content, (function(_this) {
        return function(err) {
          var message;
          atom.workspace.open(filePath);
          if (!err && restartServer) {
            _this.manager.restartServer();
          }
          if (!err) {
            return;
          }
          message = 'Could not create/update .tern-project file. Use the README to manually create a .tern-project file.';
          return atom.notifications.addInfo(message, {
            dismissable: true
          });
        };
      })(this));
    };

    Helper.prototype.readFile = function(path) {
      return fs.readFileSync(path, 'utf8');
    };

    Helper.prototype.getFileContent = function(filePath, projectRoot) {
      var resolvedPath, _ref;
      this.projectRoot = (_ref = this.manager.server) != null ? _ref.projectDir : void 0;
      if (!this.projectRoot) {
        return false;
      }
      if (projectRoot) {
        filePath = this.projectRoot + filePath;
      }
      resolvedPath = path.resolve(__dirname, filePath);
      if (this.fileExists(resolvedPath) !== void 0) {
        return false;
      }
      return this.readFile(resolvedPath);
    };

    Helper.prototype.markerCheckpointBack = function() {
      var checkpoint;
      if (!this.checkpointsDefinition.length) {
        return;
      }
      checkpoint = this.checkpointsDefinition.pop();
      return this.openFileAndGoToPosition(checkpoint.marker.getRange().start, checkpoint.editor.getURI());
    };

    Helper.prototype.setMarkerCheckpoint = function() {
      var buffer, cursor, editor, marker;
      editor = atom.workspace.getActiveTextEditor();
      buffer = editor.getBuffer();
      cursor = editor.getLastCursor();
      if (!cursor) {
        return;
      }
      marker = buffer.markPosition(cursor.getBufferPosition(), {});
      return this.checkpointsDefinition.push({
        marker: marker,
        editor: editor
      });
    };

    Helper.prototype.openFileAndGoToPosition = function(position, file) {
      return atom.workspace.open(file).then(function(textEditor) {
        var buffer, cursor;
        buffer = textEditor.getBuffer();
        cursor = textEditor.getLastCursor();
        return cursor.setBufferPosition(position);
      });
    };

    Helper.prototype.openFileAndGoTo = function(start, file) {
      return atom.workspace.open(file).then((function(_this) {
        return function(textEditor) {
          var buffer, cursor;
          buffer = textEditor.getBuffer();
          cursor = textEditor.getLastCursor();
          cursor.setBufferPosition(buffer.positionForCharacterIndex(start));
          return _this.markDefinitionBufferRange(cursor, textEditor);
        };
      })(this));
    };

    Helper.prototype.replaceTag = function(tag) {
      return this.tags[tag];
    };

    Helper.prototype.replaceTags = function(str) {
      if (!str) {
        return '';
      }
      return str.replace(/[&<>]/g, this.replaceTag);
    };

    Helper.prototype.formatType = function(data) {
      if (!data.type) {
        return '';
      }
      data.type = data.type.replace(/->/g, ':').replace('<top>', 'window');
      if (!data.exprName) {
        return data.type;
      }
      return data.type = data.type.replace(/^fn/, data.exprName);
    };

    Helper.prototype.prepareType = function(data) {
      var type;
      if (!data.type) {
        return;
      }
      return type = data.type.replace(/->/g, ':').replace('<top>', 'window');
    };

    Helper.prototype.formatTypeCompletion = function(obj, isInFunDef) {
      var params, _ref, _ref1;
      if (obj.isKeyword) {
        obj._typeSelf = 'keyword';
      }
      if (!obj.type) {
        return obj;
      }
      if (!obj.type.startsWith('fn')) {
        obj._typeSelf = 'variable';
      }
      if (obj.type === 'string') {
        obj.name = (_ref = obj.name) != null ? _ref.replace(/(^"|"$)/g, '') : void 0;
      } else {
        obj.name = (_ref1 = obj.name) != null ? _ref1.replace(/["']/g, '') : void 0;
      }
      obj.type = obj.rightLabel = this.prepareType(obj);
      if (obj.type.replace(/fn\(.+\)/, '').length === 0) {
        obj.leftLabel = '';
      } else {
        if (obj.type.indexOf('fn') === -1) {
          obj.leftLabel = obj.type;
        } else {
          obj.leftLabel = obj.type.replace(/fn\(.{0,}\)/, '').replace(' : ', '');
        }
      }
      if (obj.rightLabel.startsWith('fn')) {
        params = this.extractParams(obj.rightLabel);
        if (this.manager.packageConfig.options.useSnippets || this.manager.packageConfig.options.useSnippetsAndFunction) {
          if (!isInFunDef) {
            obj._snippet = this.buildSnippet(params, obj.name);
          }
          obj._hasParams = params.length ? true : false;
        } else {
          if (!isInFunDef) {
            obj._snippet = params.length ? "" + obj.name + "(${" + 0 + ":" + "})" : "" + obj.name + "()";
          }
          obj._displayText = this.buildDisplayText(params, obj.name);
        }
        obj._typeSelf = 'function';
      }
      if (obj.name) {
        if (obj.leftLabel === obj.name) {
          obj.leftLabel = null;
          obj.rightLabel = null;
        }
      }
      if (obj.leftLabel === obj.rightLabel) {
        obj.rightLabel = null;
      }
      return obj;
    };

    Helper.prototype.buildDisplayText = function(params, name) {
      var i, param, suggestionParams, _i, _len;
      if (params.length === 0) {
        return "" + name + "()";
      }
      suggestionParams = [];
      for (i = _i = 0, _len = params.length; _i < _len; i = ++_i) {
        param = params[i];
        param = param.replace('}', '\\}');
        param = param.replace(/'"/g, '');
        suggestionParams.push("" + param);
      }
      return "" + name + "(" + (suggestionParams.join(',')) + ")";
    };

    Helper.prototype.buildSnippet = function(params, name) {
      var i, param, suggestionParams, _i, _len;
      if (params.length === 0) {
        return "" + name + "()";
      }
      suggestionParams = [];
      for (i = _i = 0, _len = params.length; _i < _len; i = ++_i) {
        param = params[i];
        param = param.replace('}', '\\}');
        suggestionParams.push("${" + (i + 1) + ":" + param + "}");
      }
      return "" + name + "(" + (suggestionParams.join(',')) + ")";
    };

    Helper.prototype.extractParams = function(type) {
      var i, inside, param, params, start, _i, _ref;
      if (!type) {
        return [];
      }
      start = type.indexOf('(') + 1;
      params = [];
      inside = 0;
      for (i = _i = start, _ref = type.length - 1; start <= _ref ? _i <= _ref : _i >= _ref; i = start <= _ref ? ++_i : --_i) {
        if (type[i] === ':' && inside === -1) {
          params.push(type.substring(start, i - 2));
          break;
        }
        if (i === type.length - 1) {
          param = type.substring(start, i);
          if (param.length) {
            params.push(param);
          }
          break;
        }
        if (type[i] === ',' && inside === 0) {
          params.push(type.substring(start, i));
          start = i + 1;
          continue;
        }
        if (type[i].match(/[{\[\(]/)) {
          inside++;
          continue;
        }
        if (type[i].match(/[}\]\)]/)) {
          inside--;
        }
      }
      return params;
    };

    Helper.prototype.markDefinitionBufferRange = function(cursor, editor) {
      var decoration, marker, range;
      range = cursor.getCurrentWordBufferRange();
      marker = editor.markBufferRange(range, {
        invalidate: 'touch'
      });
      decoration = editor.decorateMarker(marker, {
        type: 'highlight',
        "class": 'atom-ternjs-definition-marker',
        invalidate: 'touch'
      });
      setTimeout((function() {
        return decoration != null ? decoration.setProperties({
          type: 'highlight',
          "class": 'atom-ternjs-definition-marker active',
          invalidate: 'touch'
        }) : void 0;
      }), 1);
      setTimeout((function() {
        return decoration != null ? decoration.setProperties({
          type: 'highlight',
          "class": 'atom-ternjs-definition-marker',
          invalidate: 'touch'
        }) : void 0;
      }), 1501);
      return setTimeout((function() {
        return marker.destroy();
      }), 2500);
    };

    Helper.prototype.focusEditor = function() {
      var editor, view;
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      view = atom.views.getView(editor);
      return view != null ? typeof view.focus === "function" ? view.focus() : void 0 : void 0;
    };

    Helper.prototype.destroy = function() {
      var checkpoint, _i, _len, _ref, _ref1, _results;
      _ref = this.checkpointsDefinition;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        checkpoint = _ref[_i];
        _results.push((_ref1 = checkpoint.marker) != null ? _ref1.destroy() : void 0);
      }
      return _results;
    };

    return Helper;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWhlbHBlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUJBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUZKLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUoscUJBQUEsV0FBQSxHQUFhLElBQWIsQ0FBQTs7QUFBQSxxQkFDQSxPQUFBLEdBQVMsSUFEVCxDQUFBOztBQUFBLHFCQUVBLFNBQUEsR0FBVyxRQUZYLENBQUE7O0FBQUEscUJBR0EsUUFBQSxHQUNFO0FBQUEsTUFBQSxNQUFBLEVBQVEsS0FBUjtBQUFBLE1BQ0EsS0FBQSxFQUFPLEtBRFA7QUFBQSxNQUVBLE9BQUEsRUFBUyxLQUZUO0tBSkYsQ0FBQTs7QUFBQSxxQkFPQSxxQkFBQSxHQUF1QixFQVB2QixDQUFBOztBQUFBLHFCQVFBLElBQUEsR0FDRTtBQUFBLE1BQUEsR0FBQSxFQUFLLE9BQUw7QUFBQSxNQUNBLEdBQUEsRUFBSyxNQURMO0FBQUEsTUFFQSxHQUFBLEVBQUssTUFGTDtLQVRGLENBQUE7O0FBYWEsSUFBQSxnQkFBQyxPQUFELEdBQUE7QUFDWCx1REFBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLE9BQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQURBLENBRFc7SUFBQSxDQWJiOztBQUFBLHFCQWlCQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osVUFBQSxT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

//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/lib/atom-ternjs-helper.coffee
