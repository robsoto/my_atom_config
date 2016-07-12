(function() {
  var CompositeDisposable, helpers, os, path, _;

  CompositeDisposable = require('atom').CompositeDisposable;

  helpers = require('atom-linter');

  path = require('path');

  _ = require('lodash');

  os = require('os');

  module.exports = {
    config: {
      executable: {
        type: 'string',
        "default": 'pylint',
        description: 'Command or path to executable. Use %p for current project directory (no trailing /).'
      },
      pythonPath: {
        type: 'string',
        "default": '',
        description: 'Paths to be added to $PYTHONPATH. Use %p for current project directory or %f for the directory of the current file.'
      },
      rcFile: {
        type: 'string',
        "default": '',
        description: 'Path to pylintrc file. Use %p for the current project directory or %f for the directory of the current file.'
      },
      workingDirectory: {
        type: 'string',
        "default": '%p',
        description: 'Directory pylint is run from. Use %p for the current project directory or %f for the directory of the current file.'
      },
      messageFormat: {
        type: 'string',
        "default": '%i %m',
        description: 'Format for Pylint messages where %m is the message, %i is the numeric mesasge ID (e.g. W0613) and %s is the human-readable message ID (e.g. unused-argument).'
      }
    },
    activate: function() {
      require('atom-package-deps').install();
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-pylint.executable', (function(_this) {
        return function(newExecutableValue) {
          return _this.executable = newExecutableValue;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-pylint.rcFile', (function(_this) {
        return function(newRcFileValue) {
          return _this.rcFile = newRcFileValue;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-pylint.messageFormat', (function(_this) {
        return function(newMessageFormatValue) {
          return _this.messageFormat = newMessageFormatValue;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-pylint.pythonPath', (function(_this) {
        return function(newPythonPathValue) {
          return _this.pythonPath = _.trim(newPythonPathValue, path.delimiter);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-pylint.workingDirectory', (function(_this) {
        return function(newCwd) {
          return _this.cwd = _.trim(newCwd, path.delimiter);
        };
      })(this)));
      this.regex = '^(?<line>\\d+),(?<col>\\d+),(?<type>\\w+),(\\w\\d+):(?<message>.*)\\r?$';
      return this.errorWhitelist = [/^No config file found, using default configuration$/];
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      var provider;
      return provider = {
        name: 'Pylint',
        grammarScopes: ['source.python'],
        scope: 'file',
        lintOnFly: true,
        lint: (function(_this) {
          return function(activeEditor) {
            var file;
            file = activeEditor.getPath();
            return helpers.tempFile(path.basename(file), activeEditor.getText(), function(tmpFilename) {
              var args, cwd, env, executable, fileDir, format, pattern, projDir, pythonPath, rcFile, value, _ref;
              projDir = _this.getProjDir(file) || path.dirname(file);
              fileDir = path.dirname(file);
              cwd = _this.cwd.replace(/%f/g, fileDir).replace(/%p/g, projDir);
              executable = _this.executable.replace(/%p/g, projDir);
              pythonPath = _this.pythonPath.replace(/%f/g, fileDir).replace(/%p/g, projDir);
              env = Object.create(process.env, {
                PYTHONPATH: {
                  value: _.compact([process.env.PYTHONPATH, fileDir, projDir, pythonPath]).join(path.delimiter),
                  enumerable: true
                }
              });
              format = _this.messageFormat;
              _ref = {
                '%m': 'msg',
                '%i': 'msg_id',
                '%s': 'symbol'
              };
              for (pattern in _ref) {
                value = _ref[pattern];
                format = format.replace(new RegExp(pattern, 'g'), "{" + value + "}");
              }
              args = ["--msg-template='{line},{column},{category},{msg_id}:" + format + "'", '--reports=n', '--output-format=text'];
              if (_this.rcFile) {
                rcFile = _this.rcFile.replace(/%p/g, projDir).replace(/%f/g, fileDir);
                args.push("--rcfile=" + rcFile);
              }
              args.push(tmpFilename);
              return helpers.exec(executable, args, {
                env: env,
                cwd: cwd,
                stream: 'both'
              }).then(function(data) {
                var filteredErrors;
                filteredErrors = _this.filterWhitelistedErrors(data.stderr);
                if (filteredErrors) {
                  throw new Error(filteredErrors);
                }
                return helpers.parse(data.stdout, _this.regex, {
                  filePath: file
                }).filter(function(lintIssue) {
                  return lintIssue.type !== 'info';
                }).map(function(lintIssue) {
                  var colEnd, colStart, lineEnd, lineStart, _ref1, _ref2, _ref3;
                  _ref1 = lintIssue.range, (_ref2 = _ref1[0], lineStart = _ref2[0], colStart = _ref2[1]), (_ref3 = _ref1[1], lineEnd = _ref3[0], colEnd = _ref3[1]);
                  if (lineStart === lineEnd && (colStart <= colEnd && colEnd <= 0)) {
                    return _.merge({}, lintIssue, {
                      range: helpers.rangeFromLineNumber(activeEditor, lineStart, colStart)
                    });
                  }
                  return lintIssue;
                });
              });
            });
          };
        })(this)
      };
    },
    getProjDir: function(filePath) {
      return atom.project.relativizePath(filePath)[0];
    },
    filterWhitelistedErrors: function(output) {
      var filteredOutputLines, outputLines;
      outputLines = _.compact(output.split(os.EOL));
      filteredOutputLines = _.reject(outputLines, (function(_this) {
        return function(outputLine) {
          return _.some(_this.errorWhitelist, function(errorRegex) {
            return errorRegex.test(outputLine);
          });
        };
      })(this));
      return filteredOutputLines.join(os.EOL);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvbGludGVyLXB5bGludC9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsYUFBUixDQURWLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBSEosQ0FBQTs7QUFBQSxFQUlBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUpMLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxRQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsc0ZBRmI7T0FERjtBQUFBLE1BSUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSxxSEFGYjtPQUxGO0FBQUEsTUFTQSxNQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDhHQUZiO09BVkY7QUFBQSxNQWNBLGdCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLHFIQUZiO09BZkY7QUFBQSxNQW1CQSxhQUFBLEVBQ0U7QUFB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

//# sourceURL=/home/rsoto/.atom/packages/linter-pylint/lib/main.coffee
