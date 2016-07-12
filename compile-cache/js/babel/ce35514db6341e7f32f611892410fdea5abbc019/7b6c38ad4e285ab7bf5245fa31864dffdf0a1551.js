function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

'use babel';

module.exports = {
  config: {
    executablePath: {
      type: 'string',
      'default': _path2['default'].join(__dirname, '..', 'node_modules', 'jshint', 'bin', 'jshint'),
      description: 'Path of the `jshint` node script'
    },
    lintInlineJavaScript: {
      type: 'boolean',
      'default': false,
      description: 'Lint JavaScript inside `<script>` blocks in HTML or PHP files.'
    },
    disableWhenNoJshintrcFileInPath: {
      type: 'boolean',
      'default': false,
      description: 'Disable linter when no `.jshintrc` is found in project.'
    },
    lintJSXFiles: {
      title: 'Lint JSX Files',
      type: 'boolean',
      'default': false
    },
    jshintFileName: {
      type: 'string',
      'default': '.jshintrc',
      description: 'jshint file name'
    }
  },

  activate: function activate() {
    var _this = this;

    require('atom-package-deps').install('linter-jshint');
    this.scopes = ['source.js', 'source.js-semantic'];
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-jshint.executablePath', function (executablePath) {
      _this.executablePath = executablePath;
    }));
    this.subscriptions.add(atom.config.observe('linter-jshint.disableWhenNoJshintrcFileInPath', function (disableWhenNoJshintrcFileInPath) {
      _this.disableWhenNoJshintrcFileInPath = disableWhenNoJshintrcFileInPath;
    }));

    this.subscriptions.add(atom.config.observe('linter-jshint.jshintFileName', function (jshintFileName) {
      _this.jshintFileName = jshintFileName;
    }));

    var scopeJSX = 'source.js.jsx';
    this.subscriptions.add(atom.config.observe('linter-jshint.lintJSXFiles', function (lintJSXFiles) {
      _this.lintJSXFiles = lintJSXFiles;
      if (lintJSXFiles) {
        _this.scopes.push(scopeJSX);
      } else {
        if (_this.scopes.indexOf(scopeJSX) !== -1) {
          _this.scopes.splice(_this.scopes.indexOf(scopeJSX), 1);
        }
      }
    }));

    var scopeEmbedded = 'source.js.embedded.html';
    this.subscriptions.add(atom.config.observe('linter-jshint.lintInlineJavaScript', function (lintInlineJavaScript) {
      _this.lintInlineJavaScript = lintInlineJavaScript;
      if (lintInlineJavaScript) {
        _this.scopes.push(scopeEmbedded);
      } else {
        if (_this.scopes.indexOf(scopeEmbedded) !== -1) {
          _this.scopes.splice(_this.scopes.indexOf(scopeEmbedded), 1);
        }
      }
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    var Helpers = require('atom-linter');
    var Reporter = require('jshint-json');

    return {
      name: 'JSHint',
      grammarScopes: this.scopes,
      scope: 'file',
      lintOnFly: true,
      lint: _asyncToGenerator(function* (textEditor) {
        var results = [];
        var filePath = textEditor.getPath();
        var fileContents = textEditor.getText();
        var parameters = ['--reporter', Reporter, '--filename', filePath];

        var configFile = yield Helpers.findCachedAsync(_path2['default'].dirname(filePath), _this2.jshintFileName);

        if (configFile) {
          parameters.push('--config', configFile);
        } else if (_this2.disableWhenNoJshintrcFileInPath) {
          return results;
        }

        if (_this2.lintInlineJavaScript && textEditor.getGrammar().scopeName.indexOf('text.html') !== -1) {
          parameters.push('--extract', 'always');
        }
        parameters.push('-');

        var result = yield Helpers.execNode(_this2.executablePath, parameters, { stdin: fileContents });
        var parsed = undefined;
        try {
          parsed = JSON.parse(result);
        } catch (_) {
          console.error('[Linter-JSHint]', _, result);
          atom.notifications.addWarning('[Linter-JSHint]', { detail: 'JSHint return an invalid response, check your console for more info' });
          return results;
        }

        for (var entry of parsed.result) {
          if (!entry.error.id) {
            continue;
          }

          var error = entry.error;
          var errorType = error.code.substr(0, 1);
          var errorLine = error.line > 0 ? error.line - 1 : 0;
          var range = undefined;

          // TODO: Remove workaround of jshint/jshint#2846
          if (error.character === null) {
            range = Helpers.rangeFromLineNumber(textEditor, errorLine);
          } else {
            var character = error.character > 0 ? error.character - 1 : 0;
            var line = errorLine;
            var buffer = textEditor.getBuffer();
            var maxLine = buffer.getLineCount();
            // TODO: Remove workaround of jshint/jshint#2894
            if (errorLine >= maxLine) {
              line = maxLine;
            }
            var maxCharacter = buffer.lineLengthForRow(line);
            // TODO: Remove workaround of jquery/esprima#1457
            if (character > maxCharacter) {
              character = maxCharacter;
            }
            range = Helpers.rangeFromLineNumber(textEditor, line, character);
          }

          results.push({
            type: errorType === 'E' ? 'Error' : errorType === 'W' ? 'Warning' : 'Info',
            html: '<a href="http://jslinterrors.com/' + error.code + '">' + error.code + '</a> - ' + error.reason,
            filePath: filePath,
            range: range
          });
        }
        return results;
      })
    };
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Jzb3RvLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1qc2hpbnQvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFJaUIsTUFBTTs7OztvQkFDYSxNQUFNOztBQUwxQyxXQUFXLENBQUE7O0FBU1gsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLFFBQU0sRUFBRTtBQUNOLGtCQUFjLEVBQUU7QUFDZCxVQUFJLEVBQUUsUUFBUTtBQUNkLGlCQUFTLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQztBQUM5RSxpQkFBVyxFQUFFLGtDQUFrQztLQUNoRDtBQUNELHdCQUFvQixFQUFFO0FBQ3BCLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsS0FBSztBQUNkLGlCQUFXLEVBQUUsZ0VBQWdFO0tBQzlFO0FBQ0QsbUNBQStCLEVBQUU7QUFDL0IsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0FBQ2QsaUJBQVcsRUFBRSx5REFBeUQ7S0FDdkU7QUFDRCxnQkFBWSxFQUFFO0FBQ1osV0FBSyxFQUFFLGdCQUFnQjtBQUN2QixVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLEtBQUs7S0FDZjtBQUNELGtCQUFjLEVBQUU7QUFDZCxVQUFJLEVBQUUsUUFBUTtBQUNkLGlCQUFTLFdBQVc7QUFDcEIsaUJBQVcsRUFBRSxrQkFBa0I7S0FDaEM7R0FDRjs7QUFFRCxVQUFRLEVBQUEsb0JBQUc7OztBQUNULFdBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUNyRCxRQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsV0FBVyxFQUFFLG9CQUFvQixDQUFDLENBQUE7QUFDakQsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMs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TyxHQUFHLFNBQVMsS0FBSyxHQUFHLEdBQUcsU0FBUyxHQUFHLE1BQU07QUFDMUUsZ0JBQUksd0NBQXNDLEtBQUssQ0FBQyxJQUFJLFVBQUssS0FBSyxDQUFDLElBQUksZUFBVSxLQUFLLENBQUMsTUFBTSxBQUFFO0FBQzNGLG9CQUFRLEVBQVIsUUFBUTtBQUNSLGlCQUFLLEVBQUwsS0FBSztXQUNOLENBQUMsQ0FBQTtTQUNIO0FBQ0QsZUFBTyxPQUFPLENBQUE7T0FDZixDQUFBO0tBQ0YsQ0FBQTtHQUNGO0NBQ0YsQ0FBQSIsImZpbGUiOiIvaG9tZS9yc290by8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNoaW50L2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuLyogQGZsb3cgKi9cblxuaW1wb3J0IFBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG50eXBlIExpbnRlciRQcm92aWRlciA9IE9iamVjdFxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29uZmlnOiB7XG4gICAgZXhlY3V0YWJsZVBhdGg6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogUGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ25vZGVfbW9kdWxlcycsICdqc2hpbnQnLCAnYmluJywgJ2pzaGludCcpLFxuICAgICAgZGVzY3JpcHRpb246ICdQYXRoIG9mIHRoZSBganNoaW50YCBub2RlIHNjcmlwdCdcbiAgICB9LFxuICAgIGxpbnRJbmxpbmVKYXZhU2NyaXB0OiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTGludCBKYXZhU2NyaXB0IGluc2lkZSBgPHNjcmlwdD5gIGJsb2NrcyBpbiBIVE1MIG9yIFBIUCBmaWxlcy4nXG4gICAgfSxcbiAgICBkaXNhYmxlV2hlbk5vSnNoaW50cmNGaWxlSW5QYXRoOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGlzYWJsZSBsaW50ZXIgd2hlbiBubyBgLmpzaGludHJjYCBpcyBmb3VuZCBpbiBwcm9qZWN0LidcbiAgICB9LFxuICAgIGxpbnRKU1hGaWxlczoge1xuICAgICAgdGl0bGU6ICdMaW50IEpTWCBGaWxlcycsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAganNoaW50RmlsZU5hbWU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJy5qc2hpbnRyYycsXG4gICAgICBkZXNjcmlwdGlvbjogJ2pzaGludCBmaWxlIG5hbWUnXG4gICAgfVxuICB9LFxuXG4gIGFjdGl2YXRlKCkge1xuICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLWpzaGludCcpXG4gICAgdGhpcy5zY29wZXMgPSBbJ3NvdXJjZS5qcycsICdzb3VyY2UuanMtc2VtYW50aWMnXVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1qc2hpbnQuZXhlY3V0YWJsZVBhdGgnLCBleGVjdXRhYmxlUGF0aCA9PiB7XG4gICAgICB0aGlzLmV4ZWN1dGFibGVQYXRoID0gZXhlY3V0YWJsZVBhdGhcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWpzaGludC5kaXNhYmxlV2hlbk5vSnNoaW50cmNGaWxlSW5QYXRoJyxcbiAgICAgICAgZGlzYWJsZVdoZW5Ob0pzaGludHJjRmlsZUluUGF0aCA9PiB7XG4gICAgICAgICAgdGhpcy5kaXNhYmxlV2hlbk5vSnNoaW50cmNGaWxlSW5QYXRoID0gZGlzYWJsZVdoZW5Ob0pzaGludHJjRmlsZUluUGF0aFxuICAgICAgICB9XG4gICAgICApXG4gICAgKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItanNoaW50LmpzaGludEZpbGVOYW1lJywganNoaW50RmlsZU5hbWUgPT4ge1xuICAgICAgdGhpcy5qc2hpbnRGaWxlTmFtZSA9IGpzaGludEZpbGVOYW1lXG4gICAgfSkpXG5cbiAgICBjb25zdCBzY29wZUpTWCA9ICdzb3VyY2UuanMuanN4J1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWpzaGludC5saW50SlNYRmlsZXMnLCBsaW50SlNYRmlsZXMgPT4ge1xuICAgICAgdGhpcy5saW50SlNYRmlsZXMgPSBsaW50SlNYRmlsZXNcbiAgICAgIGlmIChsaW50SlNYRmlsZXMpIHtcbiAgICAgICAgdGhpcy5zY29wZXMucHVzaChzY29wZUpTWClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3Blcy5pbmRleE9mKHNjb3BlSlNYKSAhPT0gLTEpIHtcbiAgICAgICAgICB0aGlzLnNjb3Blcy5zcGxpY2UodGhpcy5zY29wZXMuaW5kZXhPZihzY29wZUpTWCksIDEpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KSlcblxuICAgIGNvbnN0IHNjb3BlRW1iZWRkZWQgPSAnc291cmNlLmpzLmVtYmVkZGVkLmh0bWwnXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItanNoaW50LmxpbnRJbmxpbmVKYXZhU2NyaXB0JyxcbiAgICAgIGxpbnRJbmxpbmVKYXZhU2NyaXB0ID0+IHtcbiAgICAgICAgdGhpcy5saW50SW5saW5lSmF2YVNjcmlwdCA9IGxpbnRJbmxpbmVKYXZhU2NyaXB0XG4gICAgICAgIGlmIChsaW50SW5saW5lSmF2YVNjcmlwdCkge1xuICAgICAgICAgIHRoaXMuc2NvcGVzLnB1c2goc2NvcGVFbWJlZGRlZClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5zY29wZXMuaW5kZXhPZihzY29wZUVtYmVkZGVkKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVzLnNwbGljZSh0aGlzLnNjb3Blcy5pbmRleE9mKHNjb3BlRW1iZWRkZWQpLCAxKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICkpXG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcigpOiBMaW50ZXIkUHJvdmlkZXIge1xuICAgIGNvbnN0IEhlbHBlcnMgPSByZXF1aXJlKCdhdG9tLWxpbnRlcicpXG4gICAgY29uc3QgUmVwb3J0ZXIgPSByZXF1aXJlKCdqc2hpbnQtanNvbicpXG5cbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ0pTSGludCcsXG4gICAgICBncmFtbWFyU2NvcGVzOiB0aGlzLnNjb3BlcyxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50T25GbHk6IHRydWUsXG4gICAgICBsaW50OiBhc3luYyAodGV4dEVkaXRvcikgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHRzID0gW11cbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKVxuICAgICAgICBjb25zdCBmaWxlQ29udGVudHMgPSB0ZXh0RWRpdG9yLmdldFRleHQoKVxuICAgICAgICBjb25zdCBwYXJhbWV0ZXJzID0gWyctLXJlcG9ydGVyJywgUmVwb3J0ZXIsICctLWZpbGVuYW1lJywgZmlsZVBhdGhdXG5cbiAgICAgICAgbGV0IGNvbmZpZ0ZpbGUgPSBhd2FpdCBIZWxwZXJzLmZpbmRDYWNoZWRBc3luYyhQYXRoLmRpcm5hbWUoZmlsZVBhdGgpLCB0aGlzLmpzaGludEZpbGVOYW1lKVxuXG4gICAgICAgIGlmIChjb25maWdGaWxlKSB7XG4gICAgICAgICAgcGFyYW1ldGVycy5wdXNoKCctLWNvbmZpZycsIGNvbmZpZ0ZpbGUpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5kaXNhYmxlV2hlbk5vSnNoaW50cmNGaWxlSW5QYXRoKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmxpbnRJbmxpbmVKYXZhU2NyaXB0ICYmXG4gICAgICAgICAgdGV4dEVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lLmluZGV4T2YoJ3RleHQuaHRtbCcpICE9PSAtMVxuICAgICAgICApIHtcbiAgICAgICAgICBwYXJhbWV0ZXJzLnB1c2goJy0tZXh0cmFjdCcsICdhbHdheXMnKVxuICAgICAgICB9XG4gICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLScpXG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgSGVscGVycy5leGVjTm9kZShcbiAgICAgICAgICB0aGlzLmV4ZWN1dGFibGVQYXRoLCBwYXJhbWV0ZXJzLCB7IHN0ZGluOiBmaWxlQ29udGVudHMgfVxuICAgICAgICApXG4gICAgICAgIGxldCBwYXJzZWRcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBwYXJzZWQgPSBKU09OLnBhcnNlKHJlc3VsdClcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tMaW50ZXItSlNIaW50XScsIF8sIHJlc3VsdClcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZygnW0xpbnRlci1KU0hpbnRdJyxcbiAgICAgICAgICAgIHsgZGV0YWlsOiAnSlNIaW50IHJldHVybiBhbiBpbnZhbGlkIHJlc3BvbnNlLCBjaGVjayB5b3VyIGNvbnNvbGUgZm9yIG1vcmUgaW5mbycgfVxuICAgICAgICAgIClcbiAgICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBwYXJzZWQucmVzdWx0KSB7XG4gICAgICAgICAgaWYgKCFlbnRyeS5lcnJvci5pZCkge1xuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBlcnJvciA9IGVudHJ5LmVycm9yXG4gICAgICAgICAgY29uc3QgZXJyb3JUeXBlID0gZXJyb3IuY29kZS5zdWJzdHIoMCwgMSlcbiAgICAgICAgICBjb25zdCBlcnJvckxpbmUgPSBlcnJvci5saW5lID4gMCA/IGVycm9yLmxpbmUgLSAxIDogMFxuICAgICAgICAgIGxldCByYW5nZVxuXG4gICAgICAgICAgLy8gVE9ETzogUmVtb3ZlIHdvcmthcm91bmQgb2YganNoaW50L2pzaGludCMyODQ2XG4gICAgICAgICAgaWYgKGVycm9yLmNoYXJhY3RlciA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmFuZ2UgPSBIZWxwZXJzLnJhbmdlRnJvbUxpbmVOdW1iZXIodGV4dEVkaXRvciwgZXJyb3JMaW5lKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgY2hhcmFjdGVyID0gZXJyb3IuY2hhcmFjdGVyID4gMCA/IGVycm9yLmNoYXJhY3RlciAtIDEgOiAwXG4gICAgICAgICAgICBsZXQgbGluZSA9IGVycm9yTGluZVxuICAgICAgICAgICAgY29uc3QgYnVmZmVyID0gdGV4dEVkaXRvci5nZXRCdWZmZXIoKVxuICAgICAgICAgICAgY29uc3QgbWF4TGluZSA9IGJ1ZmZlci5nZXRMaW5lQ291bnQoKVxuICAgICAgICAgICAgLy8gVE9ETzogUmVtb3ZlIHdvcmthcm91bmQgb2YganNoaW50L2pzaGludCMyODk0XG4gICAgICAgICAgICBpZiAoZXJyb3JMaW5lID49IG1heExpbmUpIHtcbiAgICAgICAgICAgICAgbGluZSA9IG1heExpbmVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG1heENoYXJhY3RlciA9IGJ1ZmZlci5saW5lTGVuZ3RoRm9yUm93KGxpbmUpXG4gICAgICAgICAgICAvLyBUT0RPOiBSZW1vdmUgd29ya2Fyb3VuZCBvZiBqcXVlcnkvZXNwcmltYSMxNDU3XG4gICAgICAgICAgICBpZiAoY2hhcmFjdGVyID4gbWF4Q2hhcmFjdGVyKSB7XG4gICAgICAgICAgICAgIGNoYXJhY3RlciA9IG1heENoYXJhY3RlclxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmFuZ2UgPSBIZWxwZXJzLnJhbmdlRnJvbUxpbmVOdW1iZXIodGV4dEVkaXRvciwgbGluZSwgY2hhcmFjdGVyKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiBlcnJvclR5cGUgPT09ICdFJyA/ICdFcnJvcicgOiBlcnJvclR5cGUgPT09ICdXJyA/ICdXYXJuaW5nJyA6ICdJbmZvJyxcbiAgICAgICAgICAgIGh0bWw6IGA8YSBocmVmPVwiaHR0cDovL2pzbGludGVycm9ycy5jb20vJHtlcnJvci5jb2RlfVwiPiR7ZXJyb3IuY29kZX08L2E+IC0gJHtlcnJvci5yZWFzb259YCxcbiAgICAgICAgICAgIGZpbGVQYXRoLFxuICAgICAgICAgICAgcmFuZ2VcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=
//# sourceURL=/home/rsoto/.atom/packages/linter-jshint/lib/main.js
