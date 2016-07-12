(function() {
  var Client;

  module.exports = Client = (function() {
    Client.prototype.port = null;

    Client.prototype.manager = null;

    Client.prototype.projectDir = null;

    function Client(manager, projectDir) {
      this.manager = manager;
      this.projectDir = projectDir;
    }

    Client.prototype.completions = function(file, end) {
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
    };

    Client.prototype.documentation = function(file, end) {
      return this.post('query', {
        query: {
          type: 'documentation',
          file: file,
          end: end
        }
      });
    };

    Client.prototype.refs = function(file, end) {
      return this.post('query', {
        query: {
          type: 'refs',
          file: file,
          end: end
        }
      });
    };

    Client.prototype.updateFull = function(editor, editorMeta) {
      if (editorMeta != null) {
        editorMeta.diffs = [];
      }
      return this.post('query', {
        files: [
          {
            type: 'full',
            name: atom.project.relativizePath(editor.getURI())[1],
            text: editor.getText()
          }
        ]
      });
    };

    Client.prototype.updatePart = function(editor, editorMeta, start, text) {
      if (editorMeta != null) {
        editorMeta.diffs = [];
      }
      return this.post('query', {
        files: [
          {
            type: 'part',
            name: atom.project.relativizePath(editor.getURI())[1],
            offset: {
              line: start,
              ch: 0
            },
            text: editor.getText()
          }
        ]
      });
    };

    Client.prototype.update = function(editor) {
      var editorMeta, file, _ref;
      editorMeta = this.manager.getEditor(editor);
      file = atom.project.relativizePath(editor.getURI())[1].replace(/\\/g, '/');
      if ((_ref = this.manager.server) != null ? _ref.dontLoad(file) : void 0) {
        return Promise.resolve({});
      }
      return this.files().then((function(_this) {
        return function(data) {
          var buffer, promise, registered;
          registered = data.files.indexOf(file) > -1;
          if (editorMeta && editorMeta.diffs.length === 0 && registered) {
            return Promise.resolve({});
          }
          if (registered) {
            buffer = editor.getBuffer();
            return promise = _this.updateFull(editor, editorMeta);
          } else {
            return Promise.resolve({});
          }
        };
      })(this), function(err) {
        return console.log(err);
      });
    };

    Client.prototype.rename = function(file, end, newName) {
      return this.post('query', {
        query: {
          type: 'rename',
          file: file,
          end: end,
          newName: newName
        }
      });
    };

    Client.prototype.lint = function(file, text) {
      return this.post('query', {
        query: {
          type: 'lint',
          file: file,
          files: [
            {
              type: 'full',
              name: file,
              text: text
            }
          ]
        }
      });
    };

    Client.prototype.type = function(editor, position) {
      var end, file;
      file = atom.project.relativizePath(editor.getURI())[1];
      end = {
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
    };

    Client.prototype.definition = function() {
      var cursor, editor, end, file, position;
      editor = atom.workspace.getActiveTextEditor();
      cursor = editor.getLastCursor();
      position = cursor.getBufferPosition();
      file = atom.project.relativizePath(editor.getURI())[1];
      end = {
        line: position.row,
        ch: position.column
      };
      return this.post('query', {
        query: {
          type: 'definition',
          file: file,
          end: end
        }
      }).then((function(_this) {
        return function(data) {
          var _ref, _ref1;
          if (data != null ? data.start : void 0) {
            if ((_ref = _this.manager.helper) != null) {
              _ref.setMarkerCheckpoint();
            }
            return (_ref1 = _this.manager.helper) != null ? _ref1.openFileAndGoTo(data.start, data.file) : void 0;
          }
        };
      })(this), function(err) {
        return console.log(err);
      });
    };

    Client.prototype.files = function() {
      return this.post('query', {
        query: {
          type: 'files'
        }
      }).then((function(_this) {
        return function(data) {
          return data;
        };
      })(this));
    };

    Client.prototype.post = function(type, data) {
      var promise;
      console.log(data);
      promise = this.manager.server.request(type, data);
      return promise;
    };

    return Client;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWNsaWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsTUFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSixxQkFBQSxJQUFBLEdBQU0sSUFBTixDQUFBOztBQUFBLHFCQUNBLE9BQUEsR0FBUyxJQURULENBQUE7O0FBQUEscUJBRUEsVUFBQSxHQUFZLElBRlosQ0FBQTs7QUFJYSxJQUFBLGdCQUFDLE9BQUQsRUFBVSxVQUFWLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsT0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsVUFBRCxHQUFjLFVBRGQsQ0FEVztJQUFBLENBSmI7O0FBQUEscUJBUUEsV0FBQSxHQUFhLFNBQUMsSUFBRCxFQUFPLEdBQVAsR0FBQTthQUNYLElBQUMsQ0FBQSxJQUFELENBQU0sT0FBTixFQUFlO0FBQUEsUUFBQSxLQUFBLEVBQ2I7QUFBQSxVQUFBLElBQUEsRUFBTSxhQUFOO0FBQUEsVUFDQSxJQUFBLEVBQU0sSUFETjtBQUFBLFVBRUEsR0FBQSxFQUFLLEdBRkw7QUFBQSxVQUdBLEtBQUEsRUFBTyxJQUhQO0FBQUEsVUFJQSxlQUFBLEVBQWlCLElBSmpCO0FBQUEsVUFLQSxJQUFBLEVBQU0sSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBTHJDO0FBQUEsVUFNQSxLQUFBLEVBQU8sSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEtBTnRDO0FBQUEsVUFPQSxJQUFBLEVBQU0sSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGFBUHJDO0FBQUEsVUFRQSxJQUFBLEVBQU0sSUFB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

//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/lib/atom-ternjs-client.coffee
