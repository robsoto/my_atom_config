(function() {
  var Type, TypeView;

  TypeView = require('./atom-ternjs-type-view');

  module.exports = Type = (function() {
    Type.prototype.view = null;

    Type.prototype.manager = null;

    Type.prototype.overlayDecoration = null;

    Type.prototype.marker = null;

    function Type(manager) {
      this.manager = manager;
      this.view = new TypeView();
      this.view.initialize(this);
      atom.views.getView(atom.workspace).appendChild(this.view);
    }

    Type.prototype.setPosition = function() {
      var editor;
      if (!this.marker) {
        editor = atom.workspace.getActiveTextEditor();
        if (!editor) {
          return;
        }
        this.marker = typeof editor.getLastCursor === "function" ? editor.getLastCursor().getMarker() : void 0;
        if (!this.marker) {
          return;
        }
        return this.overlayDecoration = editor.decorateMarker(this.marker, {
          type: 'overlay',
          item: this.view,
          "class": 'atom-ternjs-type',
          position: 'tale',
          invalidate: 'touch'
        });
      } else {
        return this.marker.setProperties({
          type: 'overlay',
          item: this.view,
          "class": 'atom-ternjs-type',
          position: 'tale',
          invalidate: 'touch'
        });
      }
    };

    Type.prototype.destroyOverlay = function() {
      var _ref;
      if ((_ref = this.overlayDecoration) != null) {
        _ref.destroy();
      }
      this.overlayDecoration = null;
      return this.marker = null;
    };

    Type.prototype.queryType = function(editor, cursor) {
      var buffer, cancel, lineCount, may, may2, paramPosition, position, rangeBefore, rowStart, scopeDescriptor, skipCounter, skipCounter2, text, tmp, tolerance;
      if (cursor.destroyed) {
        return;
      }
      if (!this.manager.client) {
        return;
      }
      scopeDescriptor = cursor.getScopeDescriptor();
      if (scopeDescriptor.scopes.join().match(/comment/)) {
        this.destroyOverlay();
        return;
      }
      tolerance = 20;
      rowStart = 0;
      position = cursor.getBufferPosition();
      lineCount = editor.getLineCount();
      if (position.row - tolerance < 0) {
        rowStart = 0;
      } else {
        rowStart = position.row - tolerance;
      }
      buffer = editor.getBuffer();
      rangeBefore = false;
      tmp = false;
      may = 0;
      may2 = 0;
      skipCounter = 0;
      skipCounter2 = 0;
      paramPosition = 0;
      cancel = false;
      buffer.backwardsScanInRange(/\]|\[|\(|\)|\,|\{|\}/g, [[rowStart, 0], [position.row, position.column]], (function(_this) {
        return function(obj) {
          if (editor.scopeDescriptorForBufferPosition(obj.range.start).scopes.join().match(/string/)) {
            return;
          }
          if (obj.matchText === '}') {
            may++;
            return;
          }
          if (obj.matchText === ']') {
            if (tmp === false) {
              skipCounter2++;
            }
            may2++;
            return;
          }
          if (obj.matchText === '{') {
            if (!may) {
              rangeBefore = false;
              obj.stop();
              return;
            }
            may--;
            return;
          }
          if (obj.matchText === '[') {
            if (skipCounter2) {
              skipCounter2--;
            }
            if (!may2) {
              rangeBefore = false;
              obj.stop();
              return;
            }
            may2--;
            return;
          }
          if (obj.matchText === ')' && tmp === false) {
            skipCounter++;
            return;
          }
          if (obj.matchText === ',' && !skipCounter && !skipCounter2 && !may && !may2) {
            paramPosition++;
            return;
          }
          if (obj.matchText === ',') {
            return;
          }
          if (obj.matchText === '(' && skipCounter) {
            skipCounter--;
            return;
          }
          if (skipCounter || skipCounter2) {
            return;
          }
          if (obj.matchText === '(' && tmp === false) {
            rangeBefore = obj.range;
            obj.stop();
            return;
          }
          return tmp = obj.matchText;
        };
      })(this));
      if (!rangeBefore) {
        this.destroyOverlay();
        return;
      }
      text = buffer.getTextInRange([[rangeBefore.start.row, 0], [rangeBefore.start.row, rangeBefore.start.column]]);
      return this.manager.client.update(editor).then((function(_this) {
        return function(data) {
          return _this.manager.client.type(editor, rangeBefore.start).then(function(data) {
            var offsetFix, params, type;
            if (!data || data.type === '?' || !data.exprName) {
              _this.destroyOverlay();
              return;
            }
            type = _this.manager.helper.prepareType(data);
            params = _this.manager.helper.extractParams(type);
            _this.manager.helper.formatType(data);
            if (params != null ? params[paramPosition] : void 0) {
              offsetFix = paramPosition > 0 ? ' ' : '';
              data.type = data.type.replace(params[paramPosition], offsetFix + ("<span class=\"current-param\">" + params[paramPosition] + "</span>"));
            }
            _this.view.setData({
              label: data.type
            });
            return _this.setPosition();
          }, function(err) {
            return console.log(err);
          });
        };
      })(this));
    };

    Type.prototype.destroy = function() {
      var _ref;
      this.destroyOverlay();
      if ((_ref = this.view) != null) {
        _ref.destroy();
      }
      return this.view = null;
    };

    return Type;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXR5cGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLHlCQUFSLENBQVgsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSixtQkFBQSxJQUFBLEdBQU0sSUFBTixDQUFBOztBQUFBLG1CQUNBLE9BQUEsR0FBUyxJQURULENBQUE7O0FBQUEsbUJBRUEsaUJBQUEsR0FBbUIsSUFGbkIsQ0FBQTs7QUFBQSxtQkFHQSxNQUFBLEdBQVEsSUFIUixDQUFBOztBQUthLElBQUEsY0FBQyxPQUFELEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsT0FBWCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsUUFBQSxDQUFBLENBRlosQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLElBQUksQ0FBQyxVQUFOLENBQWlCLElBQWpCLENBSEEsQ0FBQTtBQUFBLE1BS0EsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFrQyxDQUFDLFdBQW5DLENBQStDLElBQUMsQ0FBQSxJQUFoRCxDQUxBLENBRFc7SUFBQSxDQUxiOztBQUFBLG1CQWFBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxVQUFBLE1BQUE7QUFBQSxNQUFBLElBQUcsQ0FBQSxJQUFFLENBQUEsTUFBTDtBQUNFLFFBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFDQSxRQUFBLElBQUEsQ0FBQSxNQUFBO0FBQUEsZ0JBQUEsQ0FBQTtTQURBO0FBQUEsUUFFQSxJQUFD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

//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/lib/atom-ternjs-type.coffee
