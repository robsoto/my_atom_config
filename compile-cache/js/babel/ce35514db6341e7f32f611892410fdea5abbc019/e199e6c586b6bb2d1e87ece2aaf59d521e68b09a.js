"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Server = undefined;
var Client = undefined;
var Documentation = undefined;
var Helper = undefined;
var PackageConfig = undefined;
var Config = undefined;
var Type = undefined;
var Reference = undefined;
var Rename = undefined;
var _ = require('underscore-plus');

var Manager = (function () {
  function Manager(provider) {
    _classCallCheck(this, Manager);

    this.provider = provider;

    this.disposables = [];

    this.grammars = ['JavaScript'];

    this.clients = [];
    this.client = undefined;
    this.servers = [];
    this.server = undefined;

    this.editors = [];

    this.rename = undefined;
    this.type = undefined;
    this.reference = undefined;
    this.documentation = undefined;

    this.initialised = false;

    window.setTimeout(this.init.bind(this), 0);
  }

  _createClass(Manager, [{
    key: 'init',
    value: function init() {
      var _this = this;

      Helper = require('./atom-ternjs-helper.coffee');
      PackageConfig = require('./atom-ternjs-package-config');
      Config = require('./atom-ternjs-config');

      this.helper = new Helper(this);
      this.packageConfig = new PackageConfig(this);
      this.config = new Config(this);
      this.provider.init(this);
      this.initServers();

      this.registerHelperCommands();

      this.disposables.push(atom.project.onDidChangePaths(function (paths) {

        _this.destroyServer(paths);
        _this.checkPaths(paths);
        _this.setActiveServerAndClient();
      }));
    }
  }, {
    key: 'activate',
    value: function activate() {

      this.initialised = true;
      this.registerEvents();
      this.registerCommands();
    }
  }, {
    key: 'destroyObject',
    value: function destroyObject(object) {

      if (object) {

        object.destroy();
      }
      object = undefined;
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      for (var server of this.servers) {

        server.destroy();
        server = undefined;
      }
      this.servers = [];

      for (var client of this.clients) {

        client = undefined;
      }
      this.clients = [];

      this.server = undefined;
      this.client = undefined;
      this.unregisterEventsAndCommands();
      this.provider = undefined;

      this.destroyObject(this.config);
      this.destroyObject(this.packageConfig);
      this.destroyObject(this.reference);
      this.destroyObject(this.rename);
      this.destroyObject(this.type);
      this.destroyObject(this.helper);

      this.initialised = false;
    }
  }, {
    key: 'unregisterEventsAndCommands',
    value: function unregisterEventsAndCommands() {

      for (var disposable of this.disposables) {

        if (!disposable) {

          continue;
        }

        disposable.dispose();
      }

      this.disposables = [];
    }
  }, {
    key: 'initServers',
    value: function initServers() {

      var dirs = atom.project.getDirectories();

      if (dirs.length === 0) {

        return;
      }

      for (var dir of dirs) {

        dir = atom.project.relativizePath(dir.path)[0];

        if (this.helper.isDirectory(dir)) {

          this.startServer(dir);
        }
      }
    }
  }, {
    key: 'startServer',
    value: function startServer(dir) {

      if (!Server) {

        Server = require('./atom-ternjs-server');
      }

      if (this.getServerForProject(dir)) {

        return;
      }

      var client = this.getClientForProject(dir);

      if (!client) {

        if (!Client) {

          Client = require('./atom-ternjs-client');
        }

        var clientIdx = this.clients.push(new Client(this, dir)) - 1;
        client = this.clients[clientIdx];
      }

      this.servers.push(new Server(dir, client, this));

      if (this.servers.length === this.clients.length) {

        if (!this.initialised) {

          this.activate();
        }

        this.setActiveServerAndClient(dir);
      }
    }
  }, {
    key: 'setActiveServerAndClient',
    value: function setActiveServerAndClient(URI) {

      if (!URI) {

        var activePane = atom.workspace.getActivePaneItem();

        if (activePane && activePane.getURI) {

          URI = activePane.getURI();
        } else {

          this.server = undefined;
          this.client = undefined;

          return;
        }
      }

      var dir = atom.project.relativizePath(URI)[0];
      var server = this.getServerForProject(dir);
      var client = this.getClientForProject(dir);

      if (server && client) {

        this.server = server;
        this.config.gatherData();
        this.client = client;
      } else {

        this.server = undefined;
        this.config.clear();
        this.client = undefined;
      }
    }
  }, {
    key: 'checkPaths',
    value: function checkPaths(paths) {

      for (var path of paths) {

        var dir = atom.project.relativizePath(path)[0];

        if (this.helper.isDirectory(dir)) {

          this.startServer(dir);
        }
      }
    }
  }, {
    key: 'destroyServer',
    value: function destroyServer(paths) {

      if (this.servers.length === 0) {

        return;
      }

      var serverIdx = undefined;

      for (var i = 0; i < this.servers.length; i++) {

        if (paths.indexOf(this.servers[i].projectDir) === -1) {

          serverIdx = i;
          break;
        }
      }

      if (serverIdx === undefined) {

        return;
      }

      var server = this.servers[serverIdx];
      var client = this.getClientForProject(server.projectDir);
      client = undefined;

      server.destroy();
      server = undefined;

      this.servers.splice(serverIdx, 1);
    }
  }, {
    key: 'getServerForProject',
    value: function getServerForProject(projectDir) {

      for (var server of this.servers) {

        if (server.projectDir === projectDir) {

          return server;
        }
      }

      return false;
    }
  }, {
    key: 'getClientForProject',
    value: function getClientForProject(projectDir) {

      for (var client of this.clients) {

        if (client.projectDir === projectDir) {

          return client;
        }
      }

      return false;
    }
  }, {
    key: 'getEditor',
    value: function getEditor(editor) {

      for (var _editor of this.editors) {

        if (_editor.id === editor.id) {

          return _editor;
        }
      }
    }
  }, {
    key: 'isValidEditor',
    value: function isValidEditor(editor) {

      if (!editor || !editor.getGrammar || editor.mini) {

        return;
      }

      if (!editor.getGrammar()) {

        return;
      }

      if (this.grammars.indexOf(editor.getGrammar().name) === -1) {

        return false;
      }

      return true;
    }
  }, {
    key: 'onDidChangeCursorPosition',
    value: function onDidChangeCursorPosition(editor, e) {

      if (this.packageConfig.options.inlineFnCompletion) {

        if (!this.type) {

          Type = require('./atom-ternjs-type');
          this.type = new Type(this);
        }

        this.type.queryType(editor, e.cursor);
      }

      if (this.rename) {

        this.rename.hide();
      }
    }
  }, {
    key: 'registerEvents',
    value: function registerEvents() {
      var _this2 = this;

      this.disposables.push(atom.workspace.observeTextEditors(function (editor) {

        if (!_this2.isValidEditor(editor)) {

          return;
        }

        // Register valid editor
        _this2.editors.push({

          id: editor.id,
          diffs: []
        });

        if (!_this2.initCalled) {

          _this2.init();
        }

        var editorView = atom.views.getView(editor);

        if (editorView) {

          _this2.disposables.push(editorView.addEventListener('click', function (e) {

            if (!e[_this2.helper.accessKey]) {

              return;
            }

            if (_this2.client) {

              _this2.client.definition();
            }
          }));
        }

        var scrollView = undefined;

        if (!editorView.shadowRoot) {

          scrollView = editorView.querySelector('.scroll-view');
        } else {

          scrollView = editorView.shadowRoot.querySelector('.scroll-view');
        }

        if (scrollView) {

          _this2.disposables.push(scrollView.addEventListener('mousemove', function (e) {

            if (!e[_this2.helper.accessKey]) {

              return;
            }

            if (e.target.classList.contains('line')) {

              return;
            }

            e.target.classList.add('atom-ternjs-hover');
          }));

          _this2.disposables.push(scrollView.addEventListener('mouseout', function (e) {

            e.target.classList.remove('atom-ternjs-hover');
          }));
        }

        _this2.disposables.push(editor.onDidChangeCursorPosition(function (e) {

          if (_this2.type) {

            _this2.type.destroyOverlay();
          }

          if (_this2.documentation) {

            _this2.documentation.destroyOverlay();
          }
        }));

        _this2.disposables.push(editor.onDidChangeCursorPosition(_.debounce(_this2.onDidChangeCursorPosition.bind(_this2, editor), 300)));

        _this2.disposables.push(editor.getBuffer().onDidSave(function (e) {

          if (_this2.client) {

            _this2.client.update(editor);
          }
        }));

        _this2.disposables.push(editor.getBuffer().onDidChange(function (e) {

          _this2.getEditor(editor).diffs.push(e);
        }));
      }));

      this.disposables.push(atom.workspace.onDidChangeActivePaneItem(function (item) {

        if (_this2.config) {

          _this2.config.clear();
        }

        if (_this2.type) {

          _this2.type.destroyOverlay();
        }

        if (_this2.rename) {

          _this2.rename.hide();
        }

        if (!_this2.isValidEditor(item)) {

          if (_this2.reference) {

            _this2.reference.hide();
          }
        } else {

          _this2.setActiveServerAndClient(item.getURI());
        }
      }));
    }
  }, {
    key: 'registerHelperCommands',
    value: function registerHelperCommands() {
      var _this3 = this;

      this.disposables.push(atom.commands.add('atom-workspace', 'atom-ternjs:openConfig', function (e) {

        if (!_this3.config) {

          _this3.config = new Config(_this3);
        }

        _this3.config.show();
      }));
    }
  }, {
    key: 'registerCommands',
    value: function registerCommands() {
      var _this4 = this;

      this.disposables.push(atom.commands.add('atom-text-editor', 'core:cancel', function (e) {

        if (_this4.config) {

          _this4.config.hide();
        }

        if (_this4.type) {

          _this4.type.destroyOverlay();
        }

        if (_this4.rename) {

          _this4.rename.hide();
        }

        if (_this4.reference) {

          _this4.reference.hide();
        }

        if (_this4.documentation) {

          _this4.documentation.destroyOverlay();
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:listFiles', function (e) {

        if (_this4.client) {

          _this4.client.files().then(function (data) {

            console.dir(data);
          });
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:flush', function (e) {

        if (_this4.server) {

          _this4.server.flush();
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:documentation', function (e) {

        if (!_this4.documentation) {

          Documentation = require('./atom-ternjs-documentation');
          _this4.documentation = new Documentation(_this4);
        }

        if (_this4.client) {

          _this4.documentation.request();
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:references', function (e) {

        if (!_this4.reference) {

          Reference = require('./atom-ternjs-reference');
          _this4.reference = new Reference(_this4);
        }

        _this4.reference.findReference();
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:rename', function (e) {

        if (!_this4.rename) {

          Rename = require('./atom-ternjs-rename');
          _this4.rename = new Rename(_this4);
        }

        _this4.rename.show();
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:markerCheckpointBack', function (e) {

        if (_this4.helper) {

          _this4.helper.markerCheckpointBack();
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:startCompletion', function (e) {

        if (_this4.provider) {

          _this4.provider.forceCompletion();
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:definition', function (e) {

        if (_this4.client) {

          _this4.client.definition();
        }
      }));

      this.disposables.push(atom.commands.add('atom-workspace', 'atom-ternjs:restart', function (e) {

        _this4.restartServer();
      }));
    }
  }, {
    key: 'restartServer',
    value: function restartServer() {

      if (!this.server) {

        return;
      }

      var dir = this.server.projectDir;

      for (var i = 0; i < this.servers.length; i++) {

        if (dir === this.servers[i].projectDir) {

          serverIdx = i;
          break;
        }
      }

      if (this.server) {

        this.server.destroy();
      }

      this.server = undefined;
      this.servers.splice(serverIdx, 1);
      this.startServer(dir);
    }
  }]);

  return Manager;
})();

exports['default'] = Manager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Jzb3RvLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7OztBQUVaLElBQUksTUFBTSxZQUFBLENBQUM7QUFDWCxJQUFJLE1BQU0sWUFBQSxDQUFDO0FBQ1gsSUFBSSxhQUFhLFlBQUEsQ0FBQztBQUNsQixJQUFJLE1BQU0sWUFBQSxDQUFDO0FBQ1gsSUFBSSxhQUFhLFlBQUEsQ0FBQztBQUNsQixJQUFJLE1BQU0sWUFBQSxDQUFDO0FBQ1gsSUFBSSxJQUFJLFlBQUEsQ0FBQztBQUNULElBQUksU0FBUyxZQUFBLENBQUM7QUFDZCxJQUFJLE1BQU0sWUFBQSxDQUFDO0FBQ1gsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0lBRWQsT0FBTztBQUVmLFdBRlEsT0FBTyxDQUVkLFFBQVEsRUFBRTswQkFGSCxPQUFPOztBQUl4QixRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFekIsUUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7O0FBRXRCLFFBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFL0IsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFDeEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7O0FBRXhCLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUVsQixRQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUN4QixRQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztBQUN0QixRQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMzQixRQUFJLENBQUMsYUFBYSxH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SSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O0FBRTVDLFlBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFOztBQUV0QyxtQkFBUyxHQUFHLENBQUMsQ0FBQztBQUNkLGdCQUFNO1NBQ1A7T0FDRjs7QUFFRCxVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7O0FBRWYsWUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUN2Qjs7QUFFRCxVQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUN4QixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUN2Qjs7O1NBdm1Ca0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLW1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5sZXQgU2VydmVyO1xubGV0IENsaWVudDtcbmxldCBEb2N1bWVudGF0aW9uO1xubGV0IEhlbHBlcjtcbmxldCBQYWNrYWdlQ29uZmlnO1xubGV0IENvbmZpZztcbmxldCBUeXBlO1xubGV0IFJlZmVyZW5jZTtcbmxldCBSZW5hbWU7XG5sZXQgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUtcGx1cycpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYW5hZ2VyIHtcblxuICBjb25zdHJ1Y3Rvcihwcm92aWRlcikge1xuXG4gICAgdGhpcy5wcm92aWRlciA9IHByb3ZpZGVyO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuXG4gICAgdGhpcy5ncmFtbWFycyA9IFsnSmF2YVNjcmlwdCddO1xuXG4gICAgdGhpcy5jbGllbnRzID0gW107XG4gICAgdGhpcy5jbGllbnQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zZXJ2ZXJzID0gW107XG4gICAgdGhpcy5zZXJ2ZXIgPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLmVkaXRvcnMgPSBbXTtcblxuICAgIHRoaXMucmVuYW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudHlwZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnJlZmVyZW5jZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmRvY3VtZW50YXRpb24gPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLmluaXRpYWxpc2VkID0gZmFsc2U7XG5cbiAgICB3aW5kb3cuc2V0VGltZW91dCh0aGlzLmluaXQuYmluZCh0aGlzKSwgMCk7XG4gIH1cblxuICBpbml0KCkge1xuXG4gICAgSGVscGVyID0gcmVxdWlyZSgnLi9hdG9tLXRlcm5qcy1oZWxwZXIuY29mZmVlJyk7XG4gICAgUGFja2FnZUNvbmZpZyA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtcGFja2FnZS1jb25maWcnKTtcbiAgICBDb25maWcgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLWNvbmZpZycpO1xuXG4gICAgdGhpcy5oZWxwZXIgPSBuZXcgSGVscGVyKHRoaXMpO1xuICAgIHRoaXMucGFja2FnZUNvbmZpZyA9IG5ldyBQYWNrYWdlQ29uZmlnKHRoaXMpO1xuICAgIHRoaXMuY29uZmlnID0gbmV3IENvbmZpZyh0aGlzKTtcbiAgICB0aGlzLnByb3ZpZGVyLmluaXQodGhpcyk7XG4gICAgdGhpcy5pbml0U2VydmVycygpO1xuXG4gICAgdGhpcy5yZWdpc3RlckhlbHBlckNvbW1hbmRzKCk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5wcm9qZWN0Lm9uRGlkQ2hhbmdlUGF0aHMoKHBhdGhzKSA9PiB7XG5cbiAgICAgIHRoaXMuZGVzdHJveVNlcnZlcihwYXRocyk7XG4gICAgICB0aGlzLmNoZWNrUGF0aHMocGF0aHMpO1xuICAgICAgdGhpcy5zZXRBY3RpdmVTZXJ2ZXJBbmRDbGllbnQoKTtcbiAgICB9KSk7XG4gIH1cblxuICBhY3RpdmF0ZSgpIHtcblxuICAgIHRoaXMuaW5pdGlhbGlzZWQgPSB0cnVlO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcbiAgICB0aGlzLnJlZ2lzdGVyQ29tbWFuZHMoKTtcbiAgfVxuXG4gIGRlc3Ryb3lPYmplY3Qob2JqZWN0KSB7XG5cbiAgICBpZiAob2JqZWN0KSB7XG5cbiAgICAgIG9iamVjdC5kZXN0cm95KCk7XG4gICAgfVxuICAgIG9iamVjdCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICBmb3IgKGxldCBzZXJ2ZXIgb2YgdGhpcy5zZXJ2ZXJzKSB7XG5cbiAgICAgIHNlcnZlci5kZXN0cm95KCk7XG4gICAgICBzZXJ2ZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRoaXMuc2VydmVycyA9IFtdO1xuXG4gICAgZm9yIChsZXQgY2xpZW50IG9mIHRoaXMuY2xpZW50cykge1xuXG4gICAgICBjbGllbnQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuXG4gICAgdGhpcy5zZXJ2ZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jbGllbnQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy51bnJlZ2lzdGVyRXZlbnRzQW5kQ29tbWFuZHMoKTtcbiAgICB0aGlzLnByb3ZpZGVyID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5kZXN0cm95T2JqZWN0KHRoaXMuY29uZmlnKTtcbiAgICB0aGlzLmRlc3Ryb3lPYmplY3QodGhpcy5wYWNrYWdlQ29uZmlnKTtcbiAgICB0aGlzLmRlc3Ryb3lPYmplY3QodGhpcy5yZWZlcmVuY2UpO1xuICAgIHRoaXMuZGVzdHJveU9iamVjdCh0aGlzLnJlbmFtZSk7XG4gICAgdGhpcy5kZXN0cm95T2JqZWN0KHRoaXMudHlwZSk7XG4gICAgdGhpcy5kZXN0cm95T2JqZWN0KHRoaXMuaGVscGVyKTtcblxuICAgIHRoaXMuaW5pdGlhbGlzZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHVucmVnaXN0ZXJFdmVudHNBbmRDb21tYW5kcygpIHtcblxuICAgIGZvciAobGV0IGRpc3Bvc2FibGUgb2YgdGhpcy5kaXNwb3NhYmxlcykge1xuXG4gICAgICBpZiAoIWRpc3Bvc2FibGUpIHtcblxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgZGlzcG9zYWJsZS5kaXNwb3NlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuICB9XG5cbiAgaW5pdFNlcnZlcnMoKSB7XG5cbiAgICBsZXQgZGlycyA9IGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpO1xuXG4gICAgaWYgKGRpcnMubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBkaXIgb2YgZGlycykge1xuXG4gICAgICBkaXIgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZGlyLnBhdGgpWzBdO1xuXG4gICAgICBpZiAodGhpcy5oZWxwZXIuaXNEaXJlY3RvcnkoZGlyKSkge1xuXG4gICAgICAgIHRoaXMuc3RhcnRTZXJ2ZXIoZGlyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdGFydFNlcnZlcihkaXIpIHtcblxuICAgIGlmICghU2VydmVyKSB7XG5cbiAgICAgIFNlcnZlciA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtc2VydmVyJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZ2V0U2VydmVyRm9yUHJvamVjdChkaXIpKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgY2xpZW50ID0gdGhpcy5nZXRDbGllbnRGb3JQcm9qZWN0KGRpcik7XG5cbiAgICBpZiAoIWNsaWVudCkge1xuXG4gICAgICBpZiAoIUNsaWVudCkge1xuXG4gICAgICAgIENsaWVudCA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtY2xpZW50Jyk7XG4gICAgICB9XG5cbiAgICAgIGxldCBjbGllbnRJZHggPSB0aGlzLmNsaWVudHMucHVzaChuZXcgQ2xpZW50KHRoaXMsIGRpcikpIC0gMTtcbiAgICAgIGNsaWVudCA9IHRoaXMuY2xpZW50c1tjbGllbnRJZHhdO1xuICAgIH1cblxuICAgIHRoaXMuc2VydmVycy5wdXNoKG5ldyBTZXJ2ZXIoZGlyLCBjbGllbnQsIHRoaXMpKTtcblxuICAgIGlmICh0aGlzLnNlcnZlcnMubGVuZ3RoID09PSB0aGlzLmNsaWVudHMubGVuZ3RoKSB7XG5cbiAgICAgIGlmICghdGhpcy5pbml0aWFsaXNlZCkge1xuXG4gICAgICAgIHRoaXMuYWN0aXZhdGUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRBY3RpdmVTZXJ2ZXJBbmRDbGllbnQoZGlyKTtcbiAgICB9XG4gIH1cblxuICBzZXRBY3RpdmVTZXJ2ZXJBbmRDbGllbnQoVVJJKSB7XG5cbiAgICBpZiAoIVVSSSkge1xuXG4gICAgICBsZXQgYWN0aXZlUGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCk7XG5cbiAgICAgIGlmIChhY3RpdmVQYW5lICYmIGFjdGl2ZVBhbmUuZ2V0VVJJKSB7XG5cbiAgICAgICAgVVJJID0gYWN0aXZlUGFuZS5nZXRVUkkoKTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICB0aGlzLnNlcnZlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5jbGllbnQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBkaXIgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoVVJJKVswXTtcbiAgICBsZXQgc2VydmVyID0gdGhpcy5nZXRTZXJ2ZXJGb3JQcm9qZWN0KGRpcik7XG4gICAgbGV0IGNsaWVudCA9IHRoaXMuZ2V0Q2xpZW50Rm9yUHJvamVjdChkaXIpO1xuXG4gICAgaWYgKHNlcnZlciAmJiBjbGllbnQpIHtcblxuICAgICAgdGhpcy5zZXJ2ZXIgPSBzZXJ2ZXI7XG4gICAgICB0aGlzLmNvbmZpZy5nYXRoZXJEYXRhKCk7XG4gICAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIHRoaXMuc2VydmVyID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5jb25maWcuY2xlYXIoKTtcbiAgICAgIHRoaXMuY2xpZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrUGF0aHMocGF0aHMpIHtcblxuICAgIGZvciAobGV0IHBhdGggb2YgcGF0aHMpIHtcblxuICAgICAgbGV0IGRpciA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChwYXRoKVswXTtcblxuICAgICAgaWYgKHRoaXMuaGVscGVyLmlzRGlyZWN0b3J5KGRpcikpIHtcblxuICAgICAgICB0aGlzLnN0YXJ0U2VydmVyKGRpcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveVNlcnZlcihwYXRocykge1xuXG4gICAgaWYgKHRoaXMuc2VydmVycy5sZW5ndGggPT09IDApIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBzZXJ2ZXJJZHg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2VydmVycy5sZW5ndGg7IGkrKykge1xuXG4gICAgICBpZiAocGF0aHMuaW5kZXhPZih0aGlzLnNlcnZlcnNbaV0ucHJvamVjdERpcikgPT09IC0xKSB7XG5cbiAgICAgICAgc2VydmVySWR4ID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlcnZlcklkeCA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgc2VydmVyID0gdGhpcy5zZXJ2ZXJzW3NlcnZlcklkeF07XG4gICAgbGV0IGNsaWVudCA9IHRoaXMuZ2V0Q2xpZW50Rm9yUHJvamVjdChzZXJ2ZXIucHJvamVjdERpcik7XG4gICAgY2xpZW50ID0gdW5kZWZpbmVkO1xuXG4gICAgc2VydmVyLmRlc3Ryb3koKTtcbiAgICBzZXJ2ZXIgPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLnNlcnZlcnMuc3BsaWNlKHNlcnZlcklkeCwgMSk7XG4gIH1cblxuICBnZXRTZXJ2ZXJGb3JQcm9qZWN0KHByb2plY3REaXIpIHtcblxuICAgIGZvciAobGV0IHNlcnZlciBvZiB0aGlzLnNlcnZlcnMpIHtcblxuICAgICAgaWYgKHNlcnZlci5wcm9qZWN0RGlyID09PSBwcm9qZWN0RGlyKSB7XG5cbiAgICAgICAgcmV0dXJuIHNlcnZlcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRDbGllbnRGb3JQcm9qZWN0KHByb2plY3REaXIpIHtcblxuICAgIGZvciAobGV0IGNsaWVudCBvZiB0aGlzLmNsaWVudHMpIHtcblxuICAgICAgaWYgKGNsaWVudC5wcm9qZWN0RGlyID09PSBwcm9qZWN0RGlyKSB7XG5cbiAgICAgICAgcmV0dXJuIGNsaWVudDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRFZGl0b3IoZWRpdG9yKSB7XG5cbiAgICBmb3IgKGxldCBfZWRpdG9yIG9mIHRoaXMuZWRpdG9ycykge1xuXG4gICAgICBpZiAoX2VkaXRvci5pZCA9PT0gZWRpdG9yLmlkKSB7XG5cbiAgICAgICAgcmV0dXJuIF9lZGl0b3I7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaXNWYWxpZEVkaXRvcihlZGl0b3IpIHtcblxuICAgIGlmICghZWRpdG9yIHx8ICFlZGl0b3IuZ2V0R3JhbW1hciB8fCBlZGl0b3IubWluaSkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFlZGl0b3IuZ2V0R3JhbW1hcigpKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5ncmFtbWFycy5pbmRleE9mKGVkaXRvci5nZXRHcmFtbWFyKCkubmFtZSkgPT09IC0xKSB7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oZWRpdG9yLCBlKSB7XG5cbiAgICBpZiAodGhpcy5wYWNrYWdlQ29uZmlnLm9wdGlvbnMuaW5saW5lRm5Db21wbGV0aW9uKSB7XG5cbiAgICAgIGlmICghdGhpcy50eXBlKSB7XG5cbiAgICAgICAgVHlwZSA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtdHlwZScpO1xuICAgICAgICB0aGlzLnR5cGUgPSBuZXcgVHlwZSh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50eXBlLnF1ZXJ5VHlwZShlZGl0b3IsIGUuY3Vyc29yKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZW5hbWUpIHtcblxuICAgICAgdGhpcy5yZW5hbWUuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyRXZlbnRzKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycygoZWRpdG9yKSA9PiB7XG5cbiAgICAgIGlmICghdGhpcy5pc1ZhbGlkRWRpdG9yKGVkaXRvcikpIHtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFJlZ2lzdGVyIHZhbGlkIGVkaXRvclxuICAgICAgdGhpcy5lZGl0b3JzLnB1c2goe1xuXG4gICAgICAgIGlkOiBlZGl0b3IuaWQsXG4gICAgICAgIGRpZmZzOiBbXVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghdGhpcy5pbml0Q2FsbGVkKSB7XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICB9XG5cbiAgICAgIGxldCBlZGl0b3JWaWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcik7XG5cbiAgICAgIGlmIChlZGl0b3JWaWV3KSB7XG5cbiAgICAgICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGVkaXRvclZpZXcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXG4gICAgICAgICAgaWYgKCFlW3RoaXMuaGVscGVyLmFjY2Vzc0tleV0pIHtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLmNsaWVudCkge1xuXG4gICAgICAgICAgICB0aGlzLmNsaWVudC5kZWZpbml0aW9uKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICB9XG5cbiAgICAgIGxldCBzY3JvbGxWaWV3O1xuXG4gICAgICBpZiAoIWVkaXRvclZpZXcuc2hhZG93Um9vdCkge1xuXG4gICAgICAgIHNjcm9sbFZpZXcgPSBlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5zY3JvbGwtdmlldycpO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIHNjcm9sbFZpZXcgPSBlZGl0b3JWaWV3LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignLnNjcm9sbC12aWV3Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzY3JvbGxWaWV3KSB7XG5cbiAgICAgICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKHNjcm9sbFZpZXcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGUpID0+IHtcblxuICAgICAgICAgIGlmICghZVt0aGlzLmhlbHBlci5hY2Nlc3NLZXldKSB7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdsaW5lJykpIHtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2F0b20tdGVybmpzLWhvdmVyJyk7XG4gICAgICAgIH0pKTtcblxuICAgICAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goc2Nyb2xsVmlldy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIChlKSA9PiB7XG5cbiAgICAgICAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdhdG9tLXRlcm5qcy1ob3ZlcicpO1xuICAgICAgICB9KSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChlZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbigoZSkgPT4ge1xuXG4gICAgICAgIGlmICh0aGlzLnR5cGUpIHtcblxuICAgICAgICAgIHRoaXMudHlwZS5kZXN0cm95T3ZlcmxheSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRhdGlvbikge1xuXG4gICAgICAgICAgdGhpcy5kb2N1bWVudGF0aW9uLmRlc3Ryb3lPdmVybGF5KCk7XG4gICAgICAgIH1cbiAgICAgIH0pKTtcblxuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uKF8uZGVib3VuY2UodGhpcy5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uLmJpbmQodGhpcywgZWRpdG9yKSwgMzAwKSkpO1xuXG4gICAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkU2F2ZSgoZSkgPT4ge1xuXG4gICAgICAgIGlmICh0aGlzLmNsaWVudCkge1xuXG4gICAgICAgICAgdGhpcy5jbGllbnQudXBkYXRlKGVkaXRvcik7XG4gICAgICAgIH1cbiAgICAgIH0pKTtcblxuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGVkaXRvci5nZXRCdWZmZXIoKS5vbkRpZENoYW5nZSgoZSkgPT4ge1xuXG4gICAgICAgIHRoaXMuZ2V0RWRpdG9yKGVkaXRvcikuZGlmZnMucHVzaChlKTtcbiAgICAgIH0pKTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSgoaXRlbSkgPT4ge1xuXG4gICAgICBpZiAodGhpcy5jb25maWcpIHtcblxuICAgICAgICB0aGlzLmNvbmZpZy5jbGVhcigpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy50eXBlKSB7XG5cbiAgICAgICAgdGhpcy50eXBlLmRlc3Ryb3lPdmVybGF5KCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnJlbmFtZSkge1xuXG4gICAgICAgIHRoaXMucmVuYW1lLmhpZGUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmlzVmFsaWRFZGl0b3IoaXRlbSkpIHtcblxuICAgICAgICBpZiAodGhpcy5yZWZlcmVuY2UpIHtcblxuICAgICAgICAgIHRoaXMucmVmZXJlbmNlLmhpZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIHRoaXMuc2V0QWN0aXZlU2VydmVyQW5kQ2xpZW50KGl0ZW0uZ2V0VVJJKCkpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfVxuXG4gIHJlZ2lzdGVySGVscGVyQ29tbWFuZHMoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2F0b20tdGVybmpzOm9wZW5Db25maWcnLCAoZSkgPT4ge1xuXG4gICAgICBpZiAoIXRoaXMuY29uZmlnKSB7XG5cbiAgICAgICAgdGhpcy5jb25maWcgPSBuZXcgQ29uZmlnKHRoaXMpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbmZpZy5zaG93KCk7XG4gICAgfSkpO1xuICB9XG5cbiAgcmVnaXN0ZXJDb21tYW5kcygpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdjb3JlOmNhbmNlbCcsIChlKSA9PiB7XG5cbiAgICAgIGlmICh0aGlzLmNvbmZpZykge1xuXG4gICAgICAgIHRoaXMuY29uZmlnLmhpZGUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMudHlwZSkge1xuXG4gICAgICAgIHRoaXMudHlwZS5kZXN0cm95T3ZlcmxheSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5yZW5hbWUpIHtcblxuICAgICAgICB0aGlzLnJlbmFtZS5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnJlZmVyZW5jZSkge1xuXG4gICAgICAgIHRoaXMucmVmZXJlbmNlLmhpZGUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZG9jdW1lbnRhdGlvbikge1xuXG4gICAgICAgIHRoaXMuZG9jdW1lbnRhdGlvbi5kZXN0cm95T3ZlcmxheSgpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczpsaXN0RmlsZXMnLCAoZSkgPT4ge1xuXG4gICAgICBpZiAodGhpcy5jbGllbnQpIHtcblxuICAgICAgICB0aGlzLmNsaWVudC5maWxlcygpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICAgIGNvbnNvbGUuZGlyKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnYXRvbS10ZXJuanM6Zmx1c2gnLCAoZSkgPT4ge1xuXG4gICAgICBpZiAodGhpcy5zZXJ2ZXIpIHtcblxuICAgICAgICB0aGlzLnNlcnZlci5mbHVzaCgpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczpkb2N1bWVudGF0aW9uJywgKGUpID0+IHtcblxuICAgICAgaWYgKCF0aGlzLmRvY3VtZW50YXRpb24pIHtcblxuICAgICAgICBEb2N1bWVudGF0aW9uID0gcmVxdWlyZSgnLi9hdG9tLXRlcm5qcy1kb2N1bWVudGF0aW9uJyk7XG4gICAgICAgIHRoaXMuZG9jdW1lbnRhdGlvbiA9IG5ldyBEb2N1bWVudGF0aW9uKHRoaXMpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jbGllbnQpIHtcblxuICAgICAgICB0aGlzLmRvY3VtZW50YXRpb24ucmVxdWVzdCgpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczpyZWZlcmVuY2VzJywgKGUpID0+IHtcblxuICAgICAgaWYgKCF0aGlzLnJlZmVyZW5jZSkge1xuXG4gICAgICAgIFJlZmVyZW5jZSA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtcmVmZXJlbmNlJyk7XG4gICAgICAgIHRoaXMucmVmZXJlbmNlID0gbmV3IFJlZmVyZW5jZSh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZWZlcmVuY2UuZmluZFJlZmVyZW5jZSgpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczpyZW5hbWUnLCAoZSkgPT4ge1xuXG4gICAgICAgIGlmICghdGhpcy5yZW5hbWUpIHtcblxuICAgICAgICAgIFJlbmFtZSA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtcmVuYW1lJyk7XG4gICAgICAgICAgdGhpcy5yZW5hbWUgPSBuZXcgUmVuYW1lKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZW5hbWUuc2hvdygpO1xuICAgICAgfVxuICAgICkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2F0b20tdGVybmpzOm1hcmtlckNoZWNrcG9pbnRCYWNrJywgKGUpID0+IHtcblxuICAgICAgaWYgKHRoaXMuaGVscGVyKSB7XG5cbiAgICAgICAgdGhpcy5oZWxwZXIubWFya2VyQ2hlY2twb2ludEJhY2soKTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnYXRvbS10ZXJuanM6c3RhcnRDb21wbGV0aW9uJywgKGUpID0+IHtcblxuICAgICAgaWYgKHRoaXMucHJvdmlkZXIpIHtcblxuICAgICAgICB0aGlzLnByb3ZpZGVyLmZvcmNlQ29tcGxldGlvbigpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczpkZWZpbml0aW9uJywgKGUpID0+IHtcblxuICAgICAgaWYgKHRoaXMuY2xpZW50KSB7XG5cbiAgICAgICAgdGhpcy5jbGllbnQuZGVmaW5pdGlvbigpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYXRvbS10ZXJuanM6cmVzdGFydCcsIChlKSA9PiB7XG5cbiAgICAgIHRoaXMucmVzdGFydFNlcnZlcigpO1xuICAgIH0pKTtcbiAgfVxuXG4gIHJlc3RhcnRTZXJ2ZXIoKSB7XG5cbiAgICBpZiAoIXRoaXMuc2VydmVyKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZGlyID0gdGhpcy5zZXJ2ZXIucHJvamVjdERpcjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zZXJ2ZXJzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgIGlmIChkaXIgPT09IHRoaXMuc2VydmVyc1tpXS5wcm9qZWN0RGlyKSB7XG5cbiAgICAgICAgc2VydmVySWR4ID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2VydmVyKSB7XG5cbiAgICAgIHRoaXMuc2VydmVyLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICB0aGlzLnNlcnZlciA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnNlcnZlcnMuc3BsaWNlKHNlcnZlcklkeCwgMSk7XG4gICAgdGhpcy5zdGFydFNlcnZlcihkaXIpO1xuICB9XG59XG4iXX0=
//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/lib/atom-ternjs-manager.js
