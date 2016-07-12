'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Client = (function () {
  function Client(manager, projectDir) {
    _classCallCheck(this, Client);

    this.manager = manager;
    this.projectDir = projectDir;
  }

  _createClass(Client, [{
    key: 'completions',
    value: function completions(file, end) {

      return this.post('query', {

        query: {

          type: 'completions',
          file: file,
          end: end,
          types: true,
          includeKeywords: true,
          sort: this.manager.packageConfig.options.sort,
          guess: this.manager.packageConfig.options.guess,
          docs: this.manager.packageConfig.options.documentation,
          urls: this.manager.packageConfig.options.urls,
          origins: this.manager.packageConfig.options.origins,
          lineCharPositions: true,
          caseInsensitive: this.manager.packageConfig.options.caseInsensitive
        }
      });
    }
  }, {
    key: 'documentation',
    value: function documentation(file, end) {

      return this.post('query', {

        query: {

          type: 'documentation',
          file: file,
          end: end
        }
      });
    }
  }, {
    key: 'refs',
    value: function refs(file, end) {

      return this.post('query', {

        query: {

          type: 'refs',
          file: file,
          end: end
        }
      });
    }
  }, {
    key: 'updateFull',
    value: function updateFull(editor, editorMeta) {

      if (editorMeta) {

        editorMeta.diffs = [];
      }

      return this.post('query', { files: [{

          type: 'full',
          name: atom.project.relativizePath(editor.getURI())[1],
          text: editor.getText()
        }] });
    }
  }, {
    key: 'updatePart',
    value: function updatePart(editor, editorMeta, start, text) {

      if (editorMeta) {

        editorMeta.diffs = [];
      }

      return this.post('query', [{

        type: 'full',
        name: atom.project.relativizePath(editor.getURI())[1],
        offset: {

          line: start,
          ch: 0
        },
        text: editor.getText()
      }]);
    }
  }, {
    key: 'update',
    value: function update(editor) {
      var _this = this;

      var editorMeta = this.manager.getEditor(editor);
      var file = atom.project.relativizePath(editor.getURI())[1].replace(/\\/g, '/');

      // check if this file is excluded via dontLoad
      if (this.manager.server && this.manager.server.dontLoad(file)) {

        return Promise.resolve({});
      }

      // check if the file is registered, else return
      return this.files().then(function (data) {

        if (data.files) {

          for (var i = 0; i < data.files.length; i++) {

            data.files[i] = data.files[i].replace(/\\/g, '/');
          }
        }

        var registered = data.files && data.files.indexOf(file) > -1;

        if (editorMeta && editorMeta.diffs.length === 0 && registered) {

          return Promise.resolve({});
        }

        if (registered) {

          // const buffer = editor.getBuffer();
          // if buffer.getMaxCharacterIndex() > 5000
          //   start = 0
          //   end = 0
          //   text = ''
          //   for diff in editorMeta.diffs
          //     start = Math.max(0, diff.oldRange.start.row - 50)
          //     end = Math.min(buffer.getLineCount(), diff.oldRange.end.row + 5)
          //     text = buffer.getTextInRange([[start, 0], [end, buffer.lineLengthForRow(end)]])
          //   promise = this.updatePart(editor, editorMeta, start, text)
          // else
          return _this.updateFull(editor, editorMeta);
        } else {

          return Promise.resolve({});
        }
      })['catch'](function (err) {

        console.error(err);
      });
    }
  }, {
    key: 'rename',
    value: function rename(file, end, newName) {

      return this.post('query', {

        query: {

          type: 'rename',
          file: file,
          end: end,
          newName: newName
        }
      });
    }
  }, {
    key: 'lint',
    value: function lint(file, text) {

      return this.post('query', {

        query: {

          type: 'lint',
          file: file,
          files: [{
            type: 'full',
            name: file,
            text: text
          }]
        }
      });
    }
  }, {
    key: 'type',
    value: function type(editor, position) {

      var file = atom.project.relativizePath(editor.getURI())[1];
      var end = {

        line: position.row,
        ch: position.column
      };

      return this.post('query', {

        query: {

          type: 'type',
          file: file,
          end: end,
          preferFunction: true
        }
      });
    }
  }, {
    key: 'definition',
    value: function definition() {
      var _this2 = this;

      var editor = atom.workspace.getActiveTextEditor();
      var cursor = editor.getLastCursor();
      var position = cursor.getBufferPosition();
      var file = atom.project.relativizePath(editor.getURI())[1];
      var end = {

        line: position.row,
        ch: position.column
      };

      return this.post('query', {

        query: {

          type: 'definition',
          file: file,
          end: end
        }

      }).then(function (data) {

        if (data && data.start) {

          if (_this2.manager.helper) {

            _this2.manager.helper.setMarkerCheckpoint();
            _this2.manager.helper.openFileAndGoTo(data.start, data.file);
          }
        }
      })['catch'](function (err) {

        console.error(err);
      });
    }
  }, {
    key: 'files',
    value: function files() {

      return this.post('query', {

        query: {

          type: 'files'
        }

      }).then(function (data) {

        return data;
      });
    }
  }, {
    key: 'post',
    value: function post(type, data) {

      var promise = this.manager.server.request(type, data);

      return promise;
    }
  }]);

  return Client;
})();

exports['default'] = Client;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Jzb3RvLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1jbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7O0lBRVMsTUFBTTtBQUVkLFdBRlEsTUFBTSxDQUViLE9BQU8sRUFBRSxVQUFVLEVBQUU7MEJBRmQsTUFBTTs7QUFJdkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsUUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7R0FDOUI7O2VBTmtCLE1BQU07O1dBUWQscUJBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTs7QUFFckIsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTs7QUFFeEIsYUFBSyxFQUFFOztBQUVMLGNBQUksRUFBRSxhQUFhO0FBQ25CLGNBQUksRUFBRSxJQUFJO0FBQ1YsYUFBRyxFQUFFLEdBQUc7QUFDUixlQUFLLEVBQUUsSUFBSTtBQUNYLHlCQUFlLEVBQUUsSUFBSTtBQUNyQixjQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUk7QUFDN0MsZUFBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxLQUFLO0FBQy9DLGNBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsYUFBYTtBQUN0RCxjQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUk7QUFDN0MsaUJBQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTztBQUNuRCwyQkFBaUIsRUFBRSxJQUFJO0FBQ3ZCLHlCQUFlLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGVBQWU7U0FDcEU7T0FDRixDQUFDLENBQUM7S0FD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QUFJLEVBQUs7O0FBRWhCLFlBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7O0FBRXRCLGNBQUksT0FBSyxPQUFPLENBQUMsTUFBTSxFQUFFOztBQUV2QixtQkFBSyxPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDMUMsbUJBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDNUQ7U0FDRjtPQUNGLENBQUMsU0FBTSxDQUFDLFVBQUMsR0FBRyxFQUFLOztBQUVoQixlQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ3BCLENBQUMsQ0FBQztLQUNKOzs7V0FFSSxpQkFBRzs7QUFFTixhQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFOztBQUV4QixhQUFLLEVBQUU7O0FBRUwsY0FBSSxFQUFFLE9BQU87U0FDZDs7T0FFRixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLOztBQUVoQixlQUFPLElBQUksQ0FBQztPQUNiLENBQUMsQ0FBQztLQUNKOzs7V0FFRyxjQUFDLElBQUksRUFBRSxJQUFJLEVBQUU7O0FBRWYsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFeEQsYUFBTyxPQUFPLENBQUM7S0FDaEI7OztTQXJRa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnQge1xuXG4gIGNvbnN0cnVjdG9yKG1hbmFnZXIsIHByb2plY3REaXIpIHtcblxuICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG4gICAgdGhpcy5wcm9qZWN0RGlyID0gcHJvamVjdERpcjtcbiAgfVxuXG4gIGNvbXBsZXRpb25zKGZpbGUsIGVuZCkge1xuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCB7XG5cbiAgICAgIHF1ZXJ5OiB7XG5cbiAgICAgICAgdHlwZTogJ2NvbXBsZXRpb25zJyxcbiAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgZW5kOiBlbmQsXG4gICAgICAgIHR5cGVzOiB0cnVlLFxuICAgICAgICBpbmNsdWRlS2V5d29yZHM6IHRydWUsXG4gICAgICAgIHNvcnQ6IHRoaXMubWFuYWdlci5wYWNrYWdlQ29uZmlnLm9wdGlvbnMuc29ydCxcbiAgICAgICAgZ3Vlc3M6IHRoaXMubWFuYWdlci5wYWNrYWdlQ29uZmlnLm9wdGlvbnMuZ3Vlc3MsXG4gICAgICAgIGRvY3M6IHRoaXMubWFuYWdlci5wYWNrYWdlQ29uZmlnLm9wdGlvbnMuZG9jdW1lbnRhdGlvbixcbiAgICAgICAgdXJsczogdGhpcy5tYW5hZ2VyLnBhY2thZ2VDb25maWcub3B0aW9ucy51cmxzLFxuICAgICAgICBvcmlnaW5zOiB0aGlzLm1hbmFnZXIucGFja2FnZUNvbmZpZy5vcHRpb25zLm9yaWdpbnMsXG4gICAgICAgIGxpbmVDaGFyUG9zaXRpb25zOiB0cnVlLFxuICAgICAgICBjYXNlSW5zZW5zaXRpdmU6IHRoaXMubWFuYWdlci5wYWNrYWdlQ29uZmlnLm9wdGlvbnMuY2FzZUluc2Vuc2l0aXZlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBkb2N1bWVudGF0aW9uKGZpbGUsIGVuZCkge1xuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCB7XG5cbiAgICAgIHF1ZXJ5OiB7XG5cbiAgICAgICAgdHlwZTogJ2RvY3VtZW50YXRpb24nLFxuICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICBlbmQ6IGVuZFxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmVmcyhmaWxlLCBlbmQpIHtcblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5Jywge1xuXG4gICAgICBxdWVyeToge1xuXG4gICAgICAgIHR5cGU6ICdyZWZzJyxcbiAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgZW5kOiBlbmRcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZUZ1bGwoZWRpdG9yLCBlZGl0b3JNZXRhKSB7XG5cbiAgICBpZiAoZWRpdG9yTWV0YSkge1xuXG4gICAgICBlZGl0b3JNZXRhLmRpZmZzID0gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCB7IGZpbGVzOiBbe1xuXG4gICAgICB0eXBlOiAnZnVsbCcsXG4gICAgICBuYW1lOiBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKVsxXSxcbiAgICAgIHRleHQ6IGVkaXRvci5nZXRUZXh0KClcbiAgICB9XX0pO1xuICB9XG5cbiAgdXBkYXRlUGFydChlZGl0b3IsIGVkaXRvck1ldGEsIHN0YXJ0LCB0ZXh0KSB7XG5cbiAgICBpZiAoZWRpdG9yTWV0YSkge1xuXG4gICAgICBlZGl0b3JNZXRhLmRpZmZzID0gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCBbe1xuXG4gICAgICB0eXBlOiAnZnVsbCcsXG4gICAgICBuYW1lOiBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKVsxXSxcbiAgICAgIG9mZnNldDoge1xuXG4gICAgICAgIGxpbmU6IHN0YXJ0LFxuICAgICAgICBjaDogMFxuICAgICAgfSxcbiAgICAgIHRleHQ6IGVkaXRvci5nZXRUZXh0KClcbiAgICB9XSk7XG4gIH1cblxuICB1cGRhdGUoZWRpdG9yKSB7XG5cbiAgICBjb25zdCBlZGl0b3JNZXRhID0gdGhpcy5tYW5hZ2VyLmdldEVkaXRvcihlZGl0b3IpO1xuICAgIGNvbnN0IGZpbGUgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKVsxXS5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG5cbiAgICAvLyBjaGVjayBpZiB0aGlzIGZpbGUgaXMgZXhjbHVkZWQgdmlhIGRvbnRMb2FkXG4gICAgaWYgKFxuICAgICAgdGhpcy5tYW5hZ2VyLnNlcnZlciAmJlxuICAgICAgdGhpcy5tYW5hZ2VyLnNlcnZlci5kb250TG9hZChmaWxlKVxuICAgICkge1xuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiB0aGUgZmlsZSBpcyByZWdpc3RlcmVkLCBlbHNlIHJldHVyblxuICAgIHJldHVybiB0aGlzLmZpbGVzKCkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICBpZiAoZGF0YS5maWxlcykge1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5maWxlcy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgZGF0YS5maWxlc1tpXSA9IGRhdGEuZmlsZXNbaV0ucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlZ2lzdGVyZWQgPSBkYXRhLmZpbGVzICYmIGRhdGEuZmlsZXMuaW5kZXhPZihmaWxlKSA+IC0xO1xuXG4gICAgICBpZiAoXG4gICAgICAgIGVkaXRvck1ldGEgJiZcbiAgICAgICAgZWRpdG9yTWV0YS5kaWZmcy5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgcmVnaXN0ZXJlZFxuICAgICAgKSB7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWdpc3RlcmVkKSB7XG5cbiAgICAgICAgLy8gY29uc3QgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpO1xuICAgICAgICAvLyBpZiBidWZmZXIuZ2V0TWF4Q2hhcmFjdGVySW5kZXgoKSA+IDUwMDBcbiAgICAgICAgLy8gICBzdGFydCA9IDBcbiAgICAgICAgLy8gICBlbmQgPSAwXG4gICAgICAgIC8vICAgdGV4dCA9ICcnXG4gICAgICAgIC8vICAgZm9yIGRpZmYgaW4gZWRpdG9yTWV0YS5kaWZmc1xuICAgICAgICAvLyAgICAgc3RhcnQgPSBNYXRoLm1heCgwLCBkaWZmLm9sZFJhbmdlLnN0YXJ0LnJvdyAtIDUwKVxuICAgICAgICAvLyAgICAgZW5kID0gTWF0aC5taW4oYnVmZmVyLmdldExpbmVDb3VudCgpLCBkaWZmLm9sZFJhbmdlLmVuZC5yb3cgKyA1KVxuICAgICAgICAvLyAgICAgdGV4dCA9IGJ1ZmZlci5nZXRUZXh0SW5SYW5nZShbW3N0YXJ0LCAwXSwgW2VuZCwgYnVmZmVyLmxpbmVMZW5ndGhGb3JSb3coZW5kKV1dKVxuICAgICAgICAvLyAgIHByb21pc2UgPSB0aGlzLnVwZGF0ZVBhcnQoZWRpdG9yLCBlZGl0b3JNZXRhLCBzdGFydCwgdGV4dClcbiAgICAgICAgLy8gZWxzZVxuICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVGdWxsKGVkaXRvciwgZWRpdG9yTWV0YSk7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG4gICAgICB9XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuXG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgfSk7XG4gIH1cblxuICByZW5hbWUoZmlsZSwgZW5kLCBuZXdOYW1lKSB7XG5cbiAgICByZXR1cm4gdGhpcy5wb3N0KCdxdWVyeScsIHtcblxuICAgICAgcXVlcnk6IHtcblxuICAgICAgICB0eXBlOiAncmVuYW1lJyxcbiAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgZW5kOiBlbmQsXG4gICAgICAgIG5ld05hbWU6IG5ld05hbWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGxpbnQoZmlsZSwgdGV4dCkge1xuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCB7XG5cbiAgICAgIHF1ZXJ5OiB7XG5cbiAgICAgICAgdHlwZTogJ2xpbnQnLFxuICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICBmaWxlczogW3tcbiAgICAgICAgICB0eXBlOiAnZnVsbCcsXG4gICAgICAgICAgbmFtZTogZmlsZSxcbiAgICAgICAgICB0ZXh0OiB0ZXh0XG4gICAgICAgIH1dXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB0eXBlKGVkaXRvciwgcG9zaXRpb24pIHtcblxuICAgIGNvbnN0IGZpbGUgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKVsxXTtcbiAgICBjb25zdCBlbmQgPSB7XG5cbiAgICAgIGxpbmU6IHBvc2l0aW9uLnJvdyxcbiAgICAgIGNoOiBwb3NpdGlvbi5jb2x1bW5cbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCB7XG5cbiAgICAgIHF1ZXJ5OiB7XG5cbiAgICAgICAgdHlwZTogJ3R5cGUnLFxuICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICBlbmQ6IGVuZCxcbiAgICAgICAgcHJlZmVyRnVuY3Rpb246IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGRlZmluaXRpb24oKSB7XG5cbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgY29uc3QgY3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKTtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpO1xuICAgIGNvbnN0IGZpbGUgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKVsxXTtcbiAgICBjb25zdCBlbmQgPSB7XG5cbiAgICAgIGxpbmU6IHBvc2l0aW9uLnJvdyxcbiAgICAgIGNoOiBwb3NpdGlvbi5jb2x1bW5cbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCB7XG5cbiAgICAgIHF1ZXJ5OiB7XG5cbiAgICAgICAgdHlwZTogJ2RlZmluaXRpb24nLFxuICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICBlbmQ6IGVuZFxuICAgICAgfVxuXG4gICAgfSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICBpZiAoZGF0YSAmJiBkYXRhLnN0YXJ0KSB7XG5cbiAgICAgICAgaWYgKHRoaXMubWFuYWdlci5oZWxwZXIpIHtcblxuICAgICAgICAgIHRoaXMubWFuYWdlci5oZWxwZXIuc2V0TWFya2VyQ2hlY2twb2ludCgpO1xuICAgICAgICAgIHRoaXMubWFuYWdlci5oZWxwZXIub3BlbkZpbGVBbmRHb1RvKGRhdGEuc3RhcnQsIGRhdGEuZmlsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG5cbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZpbGVzKCkge1xuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCB7XG5cbiAgICAgIHF1ZXJ5OiB7XG5cbiAgICAgICAgdHlwZTogJ2ZpbGVzJ1xuICAgICAgfVxuXG4gICAgfSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9KTtcbiAgfVxuXG4gIHBvc3QodHlwZSwgZGF0YSkge1xuXG4gICAgY29uc3QgcHJvbWlzZSA9IHRoaXMubWFuYWdlci5zZXJ2ZXIucmVxdWVzdCh0eXBlLCBkYXRhKTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG59XG4iXX0=
//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/lib/atom-ternjs-client.js
