(function() {
  var Reference, ReferenceView, TextBuffer, fs, path, _;

  ReferenceView = require('./atom-ternjs-reference-view');

  fs = require('fs');

  _ = require('underscore-plus');

  path = require('path');

  TextBuffer = require('atom').TextBuffer;

  module.exports = Reference = (function() {
    Reference.prototype.reference = null;

    Reference.prototype.manager = null;

    Reference.prototype.references = [];

    function Reference(manager, state) {
      if (state == null) {
        state = {};
      }
      this.manager = manager;
      this.reference = new ReferenceView();
      this.reference.initialize(this);
      this.referencePanel = atom.workspace.addBottomPanel({
        item: this.reference,
        priority: 0
      });
      this.referencePanel.hide();
      atom.views.getView(this.referencePanel).classList.add('atom-ternjs-reference-panel', 'panel-bottom');
      this.registerEvents();
    }

    Reference.prototype.registerEvents = function() {
      var close;
      close = this.reference.getClose();
      return close.addEventListener('click', (function(_this) {
        return function(e) {
          var editor, view;
          _this.hide();
          editor = atom.workspace.getActiveTextEditor();
          if (!editor) {
            return;
          }
          view = atom.views.getView(editor);
          return view != null ? typeof view.focus === "function" ? view.focus() : void 0 : void 0;
        };
      })(this));
    };

    Reference.prototype.goToReference = function(idx) {
      var editor, ref;
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      ref = this.references.refs[idx];
      return this.manager.helper.openFileAndGoTo(ref.start, ref.file);
    };

    Reference.prototype.findReference = function() {
      var cursor, editor, position;
      if (!this.manager.client) {
        return;
      }
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      cursor = editor.getLastCursor();
      position = cursor.getBufferPosition();
      return this.manager.client.update(editor).then((function(_this) {
        return function(data) {
          return _this.manager.client.refs(atom.project.relativizePath(editor.getURI())[1], {
            line: position.row,
            ch: position.column
          }).then(function(data) {
            var ref, _i, _len, _ref;
            if (!data) {
              atom.notifications.addInfo('No references found.', {
                dismissable: false
              });
              return;
            }
            _this.references = data;
            _ref = data.refs;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              ref = _ref[_i];
              ref.file = ref.file.replace(/^.\//, '');
              ref.file = path.resolve(atom.project.relativizePath(_this.manager.server.projectDir)[0], ref.file);
            }
            data.refs = _.uniq(data.refs, function(item) {
              return JSON.stringify(item);
            });
            data = _this.gatherMeta(data);
            _this.referencePanel.show();
            return _this.reference.buildItems(data);
          });
        };
      })(this));
    };

    Reference.prototype.gatherMeta = function(data) {
      var buffer, content, i, item, _i, _len, _ref;
      _ref = data.refs;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        item = _ref[i];
        content = fs.readFileSync(item.file, 'utf8');
        buffer = new TextBuffer({
          text: content
        });
        item.position = buffer.positionForCharacterIndex(item.start);
        item.lineText = buffer.lineForRow(item.position.row);
        buffer.destroy();
      }
      return data;
    };

    Reference.prototype.hide = function() {
      return this.referencePanel.hide();
    };

    Reference.prototype.show = function() {
      return this.referencePanel.show();
    };

    Reference.prototype.destroy = function() {
      var _ref, _ref1;
      if ((_ref = this.reference) != null) {
        _ref.destroy();
      }
      this.reference = null;
      if ((_ref1 = this.referencePanel) != null) {
        _ref1.destroy();
      }
      return this.referencePanel = null;
    };

    return Reference;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXJlZmVyZW5jZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaURBQUE7O0FBQUEsRUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSw4QkFBUixDQUFoQixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FGSixDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlDLGFBQWMsT0FBQSxDQUFRLE1BQVIsRUFBZCxVQUpELENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosd0JBQUEsU0FBQSxHQUFXLElBQVgsQ0FBQTs7QUFBQSx3QkFDQSxPQUFBLEdBQVMsSUFEVCxDQUFBOztBQUFBLHdCQUVBLFVBQUEsR0FBWSxFQUZaLENBQUE7O0FBSWEsSUFBQSxtQkFBQyxPQUFELEVBQVUsS0FBVixHQUFBOztRQUFVLFFBQVE7T0FDN0I7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsT0FBWCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsU0FBRCxHQUFpQixJQUFBLGFBQUEsQ0FBQSxDQUZqQixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsU0FBUyxDQUFDLFVBQVgsQ0FBc0IsSUFBdEIsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWYsQ0FBOEI7QUFBQSxRQUFBLElBQUEsRUFBTSxJQUFDLENBQUEsU0FBUDtBQUFBLFFBQWtCLFFBQUEsRUFBVSxDQUE1QjtPQUE5QixD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

//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/lib/atom-ternjs-reference.coffee
