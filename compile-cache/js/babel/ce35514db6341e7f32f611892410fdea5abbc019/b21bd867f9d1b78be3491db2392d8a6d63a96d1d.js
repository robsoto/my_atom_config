"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var cp = require('child_process');
var minimatch = require('minimatch');
var uuid = require('node-uuid');

var Server = (function () {
  function Server(projectRoot, client, manager) {
    _classCallCheck(this, Server);

    this.manager = manager;
    this.client = client;

    this.child = null;

    this.resolves = {};
    this.rejects = {};

    this.projectDir = projectRoot;
    this.distDir = path.resolve(__dirname, '../node_modules/tern');

    this.defaultConfig = {

      libs: [],
      loadEagerly: false,
      plugins: {

        doc_comment: true
      },
      ecmaScript: true,
      ecmaVersion: 6,
      dependencyBudget: 40000
    };

    this.projectFileName = '.tern-project';
    this.disableLoadingLocal = false;

    this.init();
  }

  _createClass(Server, [{
    key: 'init',
    value: function init() {
      var _this = this;

      if (!this.projectDir) {

        return;
      }

      this.config = this.readProjectFile(path.resolve(this.projectDir, this.projectFileName));

      if (!this.config) {

        this.config = this.defaultConfig;
      }

      if (!this.config.plugins['doc_comment']) {

        this.config.plugins['doc_comment'] = true;
      }

      var defs = this.findDefs(this.projectDir, this.config);
      var plugins = this.loadPlugins(this.projectDir, this.config);
      var files = [];

      if (this.config.loadEagerly) {

        this.config.loadEagerly.forEach(function (pat) {

          glob.sync(pat, { cwd: _this.projectDir }).forEach(function (file) {

            files.push(file);
          });
        });
      }

      this.child = cp.fork(path.resolve(__dirname, './atom-ternjs-server-worker.js'));
      this.child.on('message', this.onWorkerMessage.bind(this));
      this.child.on('error', this.onError);
      this.child.on('disconnect', this.onDisconnect);
      this.child.send({

        type: 'init',
        dir: this.projectDir,
        config: this.config,
        defs: defs,
        plugins: plugins,
        files: files
      });
    }
  }, {
    key: 'onError',
    value: function onError(e) {

      atom.notifications.addError('Child process error: ' + e, {

        dismissable: true
      });
    }
  }, {
    key: 'onDisconnect',
    value: function onDisconnect(e) {

      console.log(e);
    }
  }, {
    key: 'request',
    value: function request(type, data) {
      var _this2 = this;

      var requestID = uuid.v1();

      return new Promise(function (resolve, reject) {

        _this2.resolves[requestID] = resolve;
        _this2.rejects[requestID] = reject;

        _this2.child.send({

          type: type,
          id: requestID,
          data: data
        });
      });
    }
  }, {
    key: 'flush',
    value: function flush() {

      this.request('flush', {}).then(function () {

        atom.notifications.addInfo('All files fetched and analyzed.');
      });
    }
  }, {
    key: 'dontLoad',
    value: function dontLoad(file) {

      if (!this.config.dontLoad) {

        return;
      }

      return this.config.dontLoad.some(function (pat) {

        return minimatch(file, pat);
      });
    }
  }, {
    key: 'onWorkerMessage',
    value: function onWorkerMessage(e) {

      if (e.error && e.error.isUncaughtException) {

        atom.notifications.addError('UncaughtException: ' + e.error.message + '. Restarting Server...', {

          dismissable: false
        });

        for (var key in this.rejects) {

          this.rejects[key]({});
        }

        this.resolves = {};
        this.rejects = {};

        this.manager.restartServer();

        return;
      }

      var isError = e.error !== 'null' && e.error !== 'undefined';

      if (isError) {

        console.log(e);
      }

      if (!e.type && this.resolves[e.id]) {

        if (isError) {

          this.rejects[e.id](e.error);
        } else {

          this.resolves[e.id](e.data);
        }

        delete this.resolves[e.id];
        delete this.rejects[e.id];
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      if (!this.child) {

        return;
      }

      this.child.disconnect();
      this.child = undefined;
    }
  }, {
    key: 'readJSON',
    value: function readJSON(fileName) {

      if (this.manager.helper.fileExists(fileName) !== undefined) {

        return false;
      }

      var file = fs.readFileSync(fileName, 'utf8');

      try {

        return JSON.parse(file);
      } catch (e) {

        atom.notifications.addError('Bad JSON in ' + fileName + ': ' + e.message, {

          dismissable: true
        });
        this.destroy();
      }
    }
  }, {
    key: 'readProjectFile',
    value: function readProjectFile(fileName) {

      var data = this.readJSON(fileName);

      if (!data) {

        return false;
      }

      for (var option in this.defaultConfig) if (!data.hasOwnProperty(option)) data[option] = this.defaultConfig[option];
      return data;
    }
  }, {
    key: 'findFile',
    value: function findFile(file, projectDir, fallbackDir) {

      var local = path.resolve(projectDir, file);

      if (!this.disableLoadingLocal && fs.existsSync(local)) {

        return local;
      }

      var shared = path.resolve(fallbackDir, file);

      if (fs.existsSync(shared)) {

        return shared;
      }
    }
  }, {
    key: 'findDefs',
    value: function findDefs(projectDir, config) {

      var defs = [];
      var src = config.libs.slice();

      if (config.ecmaScript) {

        if (src.indexOf('ecma6') == -1 && config.ecmaVersion >= 6) {

          src.unshift('ecma6');
        }

        if (src.indexOf('ecma5') == -1) {

          src.unshift('ecma5');
        }
      }

      for (var i = 0; i < src.length; ++i) {

        var file = src[i];

        if (!/\.json$/.test(file)) {

          file = file + '.json';
        }

        var found = this.findFile(file, projectDir, path.resolve(this.distDir, 'defs'));

        if (!found) {

          try {

            found = require.resolve('tern-' + src[i]);
          } catch (e) {

            atom.notifications.addError('Failed to find library ' + src[i] + '\n', {

              dismissable: true
            });
            continue;
          }
        }

        if (found) {

          defs.push(this.readJSON(found));
        }
      }
      return defs;
    }
  }, {
    key: 'loadPlugins',
    value: function loadPlugins(projectDir, config) {

      var plugins = config.plugins;
      var options = {};
      this.config.pluginImports = [];

      for (var plugin in plugins) {

        var val = plugins[plugin];

        if (!val) {

          continue;
        }

        var found = this.findFile(plugin + '.js', projectDir, path.resolve(this.distDir, 'plugin'));

        if (!found) {

          try {

            found = require.resolve('tern-' + plugin);
          } catch (e) {}
        }

        if (!found) {

          try {

            found = require.resolve(this.projectDir + '/node_modules/tern-' + plugin);
          } catch (e) {

            atom.notifications.addError('Failed to find plugin ' + plugin + '\n', {

              dismissable: true
            });
            continue;
          }
        }

        this.config.pluginImports.push(found);
        options[path.basename(plugin)] = val;
      }

      return options;
    }
  }]);

  return Server;
})();

exports['default'] = Server;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Jzb3RvLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7O0FBRVosSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ2xDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyQyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7O0lBRVgsTUFBTTtBQUVkLFdBRlEsTUFBTSxDQUViLFdBQVcsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFOzBCQUZ2QixNQUFNOztBQUl2QixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFckIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ25CLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUVsQixRQUFJLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQztBQUM5QixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLHNCQUFzQixDQUFDLENBQUM7O0FBRS9ELFFBQUksQ0FBQyxhQUFhLEdBQUc7O0FBRW5CLFVBQUksRUFBRSxFQUFFO0FBQ1IsaUJBQVcsRUFBRSxLQUFLO0FBQ2xCLGFBQU8sRUFBRTs7QUFFUCxtQkFBVyxFQUFFLElBQUk7T0FDbEI7QUFDRCxn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LENBQUMsS0FBSyxFQUFFOztBQUVWLGNBQUk7O0FBRUYsaUJBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxXQUFTLE1BQU0sQ0FBRyxDQUFDO1dBRTNDLENBQUMsT0FBTSxDQUFDLEVBQUUsRUFBRTtTQUNkOztBQUVELFlBQUksQ0FBQyxLQUFLLEVBQUU7O0FBRVYsY0FBSTs7QUFFRixpQkFBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUksSUFBSSxDQUFDLFVBQVUsMkJBQXNCLE1BQU0sQ0FBRyxDQUFDO1dBRTNFLENBQUMsT0FBTyxDQUFDLEVBQUU7O0FBRVYsZ0JBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSw0QkFBMEIsTUFBTSxTQUFNOztBQUUvRCx5QkFBVyxFQUFFLElBQUk7YUFDbEIsQ0FBQyxDQUFDO0FBQ0gscUJBQVM7V0FDVjtTQUNGOztBQUVELFlBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QyxlQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztPQUN0Qzs7QUFFRCxhQUFPLE9BQU8sQ0FBQztLQUNoQjs7O1NBelZrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiIvaG9tZS9yc290by8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxubGV0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmxldCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xubGV0IGdsb2IgPSByZXF1aXJlKCdnbG9iJyk7XG5sZXQgY3AgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XG5sZXQgbWluaW1hdGNoID0gcmVxdWlyZSgnbWluaW1hdGNoJyk7XG5sZXQgdXVpZCA9IHJlcXVpcmUoJ25vZGUtdXVpZCcpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXIge1xuXG4gIGNvbnN0cnVjdG9yKHByb2plY3RSb290LCBjbGllbnQsIG1hbmFnZXIpIHtcblxuICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG4gICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG5cbiAgICB0aGlzLmNoaWxkID0gbnVsbDtcblxuICAgIHRoaXMucmVzb2x2ZXMgPSB7fTtcbiAgICB0aGlzLnJlamVjdHMgPSB7fTtcblxuICAgIHRoaXMucHJvamVjdERpciA9IHByb2plY3RSb290O1xuICAgIHRoaXMuZGlzdERpciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9ub2RlX21vZHVsZXMvdGVybicpO1xuXG4gICAgdGhpcy5kZWZhdWx0Q29uZmlnID0ge1xuXG4gICAgICBsaWJzOiBbXSxcbiAgICAgIGxvYWRFYWdlcmx5OiBmYWxzZSxcbiAgICAgIHBsdWdpbnM6IHtcblxuICAgICAgICBkb2NfY29tbWVudDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGVjbWFTY3JpcHQ6IHRydWUsXG4gICAgICBlY21hVmVyc2lvbjogNixcbiAgICAgIGRlcGVuZGVuY3lCdWRnZXQ6IDQwMDAwXG4gICAgfTtcblxuICAgIHRoaXMucHJvamVjdEZpbGVOYW1lID0gJy50ZXJuLXByb2plY3QnO1xuICAgIHRoaXMuZGlzYWJsZUxvYWRpbmdMb2NhbCA9IGZhbHNlO1xuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0KCkge1xuXG4gICAgaWYgKCF0aGlzLnByb2plY3REaXIpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5yZWFkUHJvamVjdEZpbGUocGF0aC5yZXNvbHZlKHRoaXMucHJvamVjdERpciwgdGhpcy5wcm9qZWN0RmlsZU5hbWUpKTtcblxuICAgIGlmICghdGhpcy5jb25maWcpIHtcblxuICAgICAgdGhpcy5jb25maWcgPSB0aGlzLmRlZmF1bHRDb25maWc7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5wbHVnaW5zWydkb2NfY29tbWVudCddKSB7XG5cbiAgICAgIHRoaXMuY29uZmlnLnBsdWdpbnNbJ2RvY19jb21tZW50J10gPSB0cnVlO1xuICAgIH1cblxuICAgIGxldCBkZWZzID0gdGhpcy5maW5kRGVmcyh0aGlzLnByb2plY3REaXIsIHRoaXMuY29uZmlnKTtcbiAgICBsZXQgcGx1Z2lucyA9IHRoaXMubG9hZFBsdWdpbnModGhpcy5wcm9qZWN0RGlyLCB0aGlzLmNvbmZpZyk7XG4gICAgbGV0IGZpbGVzID0gW107XG5cbiAgICBpZiAodGhpcy5jb25maWcubG9hZEVhZ2VybHkpIHtcblxuICAgICAgdGhpcy5jb25maWcubG9hZEVhZ2VybHkuZm9yRWFjaCgocGF0KSA9PiB7XG5cbiAgICAgICAgZ2xvYi5zeW5jKHBhdCwgeyBjd2Q6IHRoaXMucHJvamVjdERpciB9KS5mb3JFYWNoKGZ1bmN0aW9uKGZpbGUpIHtcblxuICAgICAgICAgIGZpbGVzLnB1c2goZmlsZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5jaGlsZCA9IGNwLmZvcmsocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vYXRvbS10ZXJuanMtc2VydmVyLXdvcmtlci5qcycpKTtcbiAgICB0aGlzLmNoaWxkLm9uKCdtZXNzYWdlJywgdGhpcy5vbldvcmtlck1lc3NhZ2UuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5jaGlsZC5vbignZXJyb3InLCB0aGlzLm9uRXJyb3IpO1xuICAgIHRoaXMuY2hpbGQub24oJ2Rpc2Nvbm5lY3QnLCB0aGlzLm9uRGlzY29ubmVjdCk7XG4gICAgdGhpcy5jaGlsZC5zZW5kKHtcblxuICAgICAgdHlwZTogJ2luaXQnLFxuICAgICAgZGlyOiB0aGlzLnByb2plY3REaXIsXG4gICAgICBjb25maWc6IHRoaXMuY29uZmlnLFxuICAgICAgZGVmczogZGVmcyxcbiAgICAgIHBsdWdpbnM6IHBsdWdpbnMsXG4gICAgICBmaWxlczogZmlsZXNcbiAgICB9KTtcbiAgfVxuXG4gIG9uRXJyb3IoZSkge1xuXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBDaGlsZCBwcm9jZXNzIGVycm9yOiAke2V9YCwge1xuXG4gICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgIH0pO1xuXHR9XG5cblx0b25EaXNjb25uZWN0KGUpIHtcblxuICAgIGNvbnNvbGUubG9nKGUpO1xuXHR9XG5cbiAgcmVxdWVzdCh0eXBlLCBkYXRhKSB7XG5cbiAgICBsZXQgcmVxdWVzdElEID0gdXVpZC52MSgpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgdGhpcy5yZXNvbHZlc1tyZXF1ZXN0SURdID0gcmVzb2x2ZTtcbiAgICAgIHRoaXMucmVqZWN0c1tyZXF1ZXN0SURdID0gcmVqZWN0O1xuXG4gICAgICB0aGlzLmNoaWxkLnNlbmQoe1xuXG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIGlkOiByZXF1ZXN0SUQsXG4gICAgICAgIGRhdGE6IGRhdGFcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZmx1c2goKSB7XG5cbiAgICB0aGlzLnJlcXVlc3QoJ2ZsdXNoJywge30pLnRoZW4oKCkgPT4ge1xuXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnQWxsIGZpbGVzIGZldGNoZWQgYW5kIGFuYWx5emVkLicpO1xuICAgIH0pO1xuICB9XG5cbiAgZG9udExvYWQoZmlsZSkge1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5kb250TG9hZCkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLmRvbnRMb2FkLnNvbWUoKHBhdCkgPT4ge1xuXG4gICAgICByZXR1cm4gbWluaW1hdGNoKGZpbGUsIHBhdCk7XG4gICAgfSk7XG4gIH1cblxuICBvbldvcmtlck1lc3NhZ2UoZSkge1xuXG4gICAgaWYgKGUuZXJyb3IgJiYgZS5lcnJvci5pc1VuY2F1Z2h0RXhjZXB0aW9uKSB7XG5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgVW5jYXVnaHRFeGNlcHRpb246ICR7ZS5lcnJvci5tZXNzYWdlfS4gUmVzdGFydGluZyBTZXJ2ZXIuLi5gLCB7XG5cbiAgICAgICAgZGlzbWlzc2FibGU6IGZhbHNlXG4gICAgICB9KTtcblxuICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5yZWplY3RzKSB7XG5cbiAgICAgICAgdGhpcy5yZWplY3RzW2tleV0oe30pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlc29sdmVzID0ge307XG4gICAgICB0aGlzLnJlamVjdHMgPSB7fTtcblxuICAgICAgdGhpcy5tYW5hZ2VyLnJlc3RhcnRTZXJ2ZXIoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGlzRXJyb3IgPSBlLmVycm9yICE9PSAnbnVsbCcgJiYgZS5lcnJvciAhPT0gJ3VuZGVmaW5lZCc7XG5cbiAgICBpZiAoaXNFcnJvcikge1xuXG4gICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICB9XG5cbiAgICBpZiAoIWUudHlwZSAmJiB0aGlzLnJlc29sdmVzW2UuaWRdKSB7XG5cbiAgICAgIGlmIChpc0Vycm9yKSB7XG5cbiAgICAgICAgdGhpcy5yZWplY3RzW2UuaWRdKGUuZXJyb3IpO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIHRoaXMucmVzb2x2ZXNbZS5pZF0oZS5kYXRhKTtcbiAgICAgIH1cblxuICAgICAgZGVsZXRlKHRoaXMucmVzb2x2ZXNbZS5pZF0pO1xuICAgICAgZGVsZXRlKHRoaXMucmVqZWN0c1tlLmlkXSk7XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIGlmICghdGhpcy5jaGlsZCkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jaGlsZC5kaXNjb25uZWN0KCk7XG4gICAgdGhpcy5jaGlsZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJlYWRKU09OKGZpbGVOYW1lKSB7XG5cbiAgICBpZiAodGhpcy5tYW5hZ2VyLmhlbHBlci5maWxlRXhpc3RzKGZpbGVOYW1lKSAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgZmlsZSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlTmFtZSwgJ3V0ZjgnKTtcblxuICAgIHRyeSB7XG5cbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGZpbGUpO1xuXG4gICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYEJhZCBKU09OIGluICR7ZmlsZU5hbWV9OiAke2UubWVzc2FnZX1gLCB7XG5cbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgIH0pO1xuICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgfVxuICB9XG5cbiAgcmVhZFByb2plY3RGaWxlKGZpbGVOYW1lKSB7XG5cbiAgICBsZXQgZGF0YSA9IHRoaXMucmVhZEpTT04oZmlsZU5hbWUpO1xuXG4gICAgaWYgKCFkYXRhKSB7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBvcHRpb24gaW4gdGhpcy5kZWZhdWx0Q29uZmlnKSBpZiAoIWRhdGEuaGFzT3duUHJvcGVydHkob3B0aW9uKSlcbiAgICAgIGRhdGFbb3B0aW9uXSA9IHRoaXMuZGVmYXVsdENvbmZpZ1tvcHRpb25dO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgZmluZEZpbGUoZmlsZSwgcHJvamVjdERpciwgZmFsbGJhY2tEaXIpIHtcblxuICAgIGxldCBsb2NhbCA9IHBhdGgucmVzb2x2ZShwcm9qZWN0RGlyLCBmaWxlKTtcblxuICAgIGlmICghdGhpcy5kaXNhYmxlTG9hZGluZ0xvY2FsICYmIGZzLmV4aXN0c1N5bmMobG9jYWwpKSB7XG5cbiAgICAgIHJldHVybiBsb2NhbDtcbiAgICB9XG5cbiAgICBsZXQgc2hhcmVkID0gcGF0aC5yZXNvbHZlKGZhbGxiYWNrRGlyLCBmaWxlKTtcblxuICAgIGlmIChmcy5leGlzdHNTeW5jKHNoYXJlZCkpIHtcblxuICAgICAgcmV0dXJuIHNoYXJlZDtcbiAgICB9XG4gIH1cblxuICBmaW5kRGVmcyhwcm9qZWN0RGlyLCBjb25maWcpIHtcblxuICAgIGxldCBkZWZzID0gW107XG4gICAgbGV0IHNyYyA9IGNvbmZpZy5saWJzLnNsaWNlKCk7XG5cbiAgICBpZiAoY29uZmlnLmVjbWFTY3JpcHQpIHtcblxuICAgICAgaWYgKHNyYy5pbmRleE9mKCdlY21hNicpID09IC0xICYmIGNvbmZpZy5lY21hVmVyc2lvbiA+PSA2KSB7XG5cbiAgICAgICAgc3JjLnVuc2hpZnQoJ2VjbWE2Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzcmMuaW5kZXhPZignZWNtYTUnKSA9PSAtMSkge1xuXG4gICAgICAgIHNyYy51bnNoaWZ0KCdlY21hNScpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3JjLmxlbmd0aDsgKytpKSB7XG5cbiAgICAgIGxldCBmaWxlID0gc3JjW2ldO1xuXG4gICAgICBpZiAoIS9cXC5qc29uJC8udGVzdChmaWxlKSkge1xuXG4gICAgICAgIGZpbGUgPSBgJHtmaWxlfS5qc29uYDtcbiAgICAgIH1cblxuICAgICAgbGV0IGZvdW5kID0gdGhpcy5maW5kRmlsZShmaWxlLCBwcm9qZWN0RGlyLCBwYXRoLnJlc29sdmUodGhpcy5kaXN0RGlyLCAnZGVmcycpKTtcblxuICAgICAgaWYgKCFmb3VuZCkge1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICBmb3VuZCA9IHJlcXVpcmUucmVzb2x2ZShgdGVybi0ke3NyY1tpXX1gKTtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYEZhaWxlZCB0byBmaW5kIGxpYnJhcnkgJHtzcmNbaV19XFxuYCwge1xuXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmb3VuZCkge1xuXG4gICAgICAgIGRlZnMucHVzaCh0aGlzLnJlYWRKU09OKGZvdW5kKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkZWZzO1xuICB9XG5cbiAgbG9hZFBsdWdpbnMocHJvamVjdERpciwgY29uZmlnKSB7XG5cbiAgICBsZXQgcGx1Z2lucyA9IGNvbmZpZy5wbHVnaW5zO1xuICAgIGxldCBvcHRpb25zID0ge307XG4gICAgdGhpcy5jb25maWcucGx1Z2luSW1wb3J0cyA9IFtdO1xuXG4gICAgZm9yIChsZXQgcGx1Z2luIGluIHBsdWdpbnMpIHtcblxuICAgICAgbGV0IHZhbCA9IHBsdWdpbnNbcGx1Z2luXTtcblxuICAgICAgaWYgKCF2YWwpIHtcblxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IGZvdW5kID0gdGhpcy5maW5kRmlsZShgJHtwbHVnaW59LmpzYCwgcHJvamVjdERpciwgcGF0aC5yZXNvbHZlKHRoaXMuZGlzdERpciwgJ3BsdWdpbicpKTtcblxuICAgICAgaWYgKCFmb3VuZCkge1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICBmb3VuZCA9IHJlcXVpcmUucmVzb2x2ZShgdGVybi0ke3BsdWdpbn1gKTtcblxuICAgICAgICB9IGNhdGNoKGUpIHt9XG4gICAgICB9XG5cbiAgICAgIGlmICghZm91bmQpIHtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgZm91bmQgPSByZXF1aXJlLnJlc29sdmUoYCR7dGhpcy5wcm9qZWN0RGlyfS9ub2RlX21vZHVsZXMvdGVybi0ke3BsdWdpbn1gKTtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYEZhaWxlZCB0byBmaW5kIHBsdWdpbiAke3BsdWdpbn1cXG5gLCB7XG5cbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5jb25maWcucGx1Z2luSW1wb3J0cy5wdXNoKGZvdW5kKTtcbiAgICAgIG9wdGlvbnNbcGF0aC5iYXNlbmFtZShwbHVnaW4pXSA9IHZhbDtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9ucztcbiAgfVxufVxuIl19
//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/lib/atom-ternjs-server.js
