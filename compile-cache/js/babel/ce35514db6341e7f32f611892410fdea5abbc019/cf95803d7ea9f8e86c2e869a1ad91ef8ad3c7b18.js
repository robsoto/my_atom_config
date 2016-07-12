"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ConfigView = undefined;
var _ = require('underscore-plus');

var Config = (function () {
  function Config(manager) {
    _classCallCheck(this, Config);

    this.manager = manager;

    this.config = undefined;
    this.projectConfig = undefined;
    this.editors = [];
  }

  _createClass(Config, [{
    key: 'getContent',
    value: function getContent(filePath, projectRoot) {

      var error = false;
      var content = this.manager.helper.getFileContent(filePath, projectRoot);

      if (!content) {

        return;
      }

      try {

        content = JSON.parse(content);
      } catch (e) {

        atom.notifications.addInfo('Error parsing .tern-project. Please check if it is a valid JSON file.', {

          dismissable: true
        });
        return;
      }

      return content;
    }
  }, {
    key: 'prepareLibs',
    value: function prepareLibs(localConfig, configStub) {

      var libs = {};

      if (!localConfig.libs) {

        localConfig.libs = {};
      } else {

        var libsAsObject = {};
        for (var lib of localConfig.libs) {

          libsAsObject[lib] = true;
        }

        localConfig.libs = libsAsObject;
      }

      for (var lib of Object.keys(configStub.libs)) {

        if (!localConfig.libs[lib]) {

          libs[lib] = false;
        } else {

          libs[lib] = true;
        }
      }

      for (var lib of Object.keys(localConfig.libs)) {

        if (lib === 'ecma5' || lib === 'ecma6') {

          atom.notifications.addInfo('You are using a outdated .tern-project file. Please remove libs ecma5, ecma6 manually and restart the Server via Packages -> Atom Ternjs -> Restart server. Then configure the project via Packages -> Atom Ternjs -> Configure project.', {

            dismissable: true
          });
        }

        if (!libs[lib]) {

          libs[lib] = true;
        }
      }

      localConfig.libs = libs;

      return localConfig;
    }
  }, {
    key: 'prepareEcma',
    value: function prepareEcma(localConfig, configStub) {

      var ecmaVersions = {};

      for (var lib of Object.keys(configStub.ecmaVersions)) {

        ecmaVersions[lib] = configStub.ecmaVersions[lib];
      }

      localConfig.ecmaVersions = ecmaVersions;

      if (localConfig.ecmaVersion) {

        for (var lib of Object.keys(localConfig.ecmaVersions)) {

          if (lib === 'ecmaVersion' + localConfig.ecmaVersion) {

            localConfig.ecmaVersions[lib] = true;
          } else {

            localConfig.ecmaVersions[lib] = false;
          }
        }
      }

      return localConfig;
    }
  }, {
    key: 'registerEvents',
    value: function registerEvents() {
      var _this = this;

      var close = this.configView.getClose();
      var cancel = this.configView.getCancel();

      close.addEventListener('click', function (e) {

        _this.updateConfig();
        _this.hide();
        _this.manager.helper.focusEditor();
      });

      cancel.addEventListener('click', function (e) {

        _this.destroyEditors();
        _this.hide();
        _this.manager.helper.focusEditor();
      });
    }
  }, {
    key: 'mergeConfigObjects',
    value: function mergeConfigObjects(obj1, obj2) {

      return _.deepExtend({}, obj1, obj2);
    }
  }, {
    key: 'hide',
    value: function hide() {

      if (!this.configPanel) {

        return;
      }

      this.configPanel.hide();
    }
  }, {
    key: 'clear',
    value: function clear() {

      this.hide();
      this.destroyEditors();
      this.config = undefined;
      this.projectConfig = undefined;

      if (!this.configView) {

        return;
      }

      this.configView.removeContent();
    }
  }, {
    key: 'gatherData',
    value: function gatherData() {

      var configStub = this.getContent('../tern-config.json', false);

      if (!configStub) {

        return;
      }

      this.projectConfig = this.getContent('/.tern-project', true);

      this.config = {};
      this.config = this.mergeConfigObjects(this.projectConfig, this.config);

      if (this.projectConfig) {

        this.config = this.prepareEcma(this.config, configStub);
        this.config = this.prepareLibs(this.config, configStub);

        for (var plugin in this.config.plugins) {

          if (this.config.plugins[plugin]) {

            this.config.plugins[plugin].active = true;
          }
        }

        this.config = this.mergeConfigObjects(configStub, this.config);
      } else {

        this.config = configStub;
      }

      return true;
    }
  }, {
    key: 'removeEditor',
    value: function removeEditor(editor) {

      if (!editor) {

        return;
      }

      var idx = this.editors.indexOf(editor);

      if (idx === -1) {

        return;
      }

      this.editors.splice(idx, 1);
    }
  }, {
    key: 'destroyEditors',
    value: function destroyEditors() {

      for (var editor of this.editors) {

        var buffer = editor.getModel().getBuffer();
        buffer.destroy();
      }

      this.editors = [];
    }
  }, {
    key: 'updateConfig',
    value: function updateConfig() {

      this.config.loadEagerly = [];
      this.config.dontLoad = [];

      for (var editor of this.editors) {

        var buffer = editor.getModel().getBuffer();
        var text = buffer.getText().trim();

        if (text === '') {

          continue;
        }

        this.config[editor.__ternjs_section].push(text);
      }

      this.destroyEditors();

      var newConfig = this.buildNewConfig();
      var newConfigJSON = JSON.stringify(newConfig, null, 2);

      this.manager.helper.updateTernFile(newConfigJSON, true);
    }
  }, {
    key: 'buildNewConfig',
    value: function buildNewConfig() {

      var newConfig = {};

      for (var key of Object.keys(this.config.ecmaVersions)) {

        if (this.config.ecmaVersions[key]) {

          newConfig.ecmaVersion = Number(key[key.length - 1]);
          break;
        }
      }

      if (!_.isEmpty(this.config.libs)) {

        newConfig.libs = [];

        for (var key of Object.keys(this.config.libs)) {

          if (this.config.libs[key]) {

            newConfig.libs.push(key);
          }
        }
      }

      if (this.config.loadEagerly.length !== 0) {

        newConfig.loadEagerly = this.config.loadEagerly;
      }

      if (this.config.dontLoad.length !== 0) {

        newConfig.dontLoad = this.config.dontLoad;
      }

      if (this.projectConfig && !_.isEmpty(this.projectConfig.plugins)) {

        newConfig.plugins = this.projectConfig.plugins;
      }

      return newConfig;
    }
  }, {
    key: 'initConfigView',
    value: function initConfigView() {

      if (!ConfigView) {

        ConfigView = require('./atom-ternjs-config-view');
      }

      this.configView = new ConfigView();
      this.configView.initialize(this);

      this.configPanel = atom.workspace.addRightPanel({

        item: this.configView,
        priority: 0
      });
      this.configPanel.hide();

      this.registerEvents();
    }
  }, {
    key: 'show',
    value: function show() {

      if (!this.configView) {

        this.initConfigView();
      }

      this.clear();

      atom.views.getView(this.configPanel).classList.add('atom-ternjs-config-panel');

      if (!this.gatherData()) {

        atom.notifications.addInfo('There is no active project. Please re-open or focus at least one JavaScript file of the project to configure.', {

          dismissable: true
        });
        return;
      }

      this.configView.buildOptionsMarkup(this.manager);
      this.configPanel.show();
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      if (this.configView) {

        this.configView.destroy();
      }
      this.configView = undefined;

      if (this.configPanel) {

        this.configPanel.destroy();
      }
      this.configPanel = undefined;
    }
  }]);

  return Config;
})();

exports['default'] = Config;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Jzb3RvLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7O0FBRVosSUFBSSxVQUFVLFlBQUEsQ0FBQztBQUNmLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOztJQUVkLE1BQU07QUFFZCxXQUZRLE1BQU0sQ0FFYixPQUFPLEVBQUU7MEJBRkYsTUFBTTs7QUFJdkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7O0FBRXZCLFFBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDO0FBQy9CLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0dBQ25COztlQVRrQixNQUFNOztXQVdmLG9CQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUU7O0FBRWhDLFVBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNsQixVQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDOztBQUV4RSxVQUFJLENBQUMsT0FBTyxFQUFFOztBQUVaLGVBQU87T0FDUjs7QUFFRCxVQUFJOztBQUVGLGVBQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BRS9CLENBQUMsT0FBTSxDQUFDLEVBQUU7O0FBRVQsWUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsdUVBQXVFLEVBQUU7O0FBRWxHLHFCQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFDLENBQUM7QUFDSCxlQUFPO09BQ1I7O0FBRUQsYUFBTyxPQUFPLENBQUM7S0FDaEI7OztXQUVVLHFCQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUU7O0FBRW5DLFVBQUksSUFBSSxHQUFHLEVBQUUsQ0FB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QyxPQUFPLEVBQUUsQ0FBQztPQUMzQjtBQUNELFVBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDOztBQUU1QixVQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7O0FBRXBCLFlBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDNUI7QUFDRCxVQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztLQUM5Qjs7O1NBMVdrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiIvaG9tZS9yc290by8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxubGV0IENvbmZpZ1ZpZXc7XG5sZXQgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUtcGx1cycpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25maWcge1xuXG4gIGNvbnN0cnVjdG9yKG1hbmFnZXIpIHtcblxuICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnByb2plY3RDb25maWcgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5lZGl0b3JzID0gW107XG4gIH1cblxuICBnZXRDb250ZW50KGZpbGVQYXRoLCBwcm9qZWN0Um9vdCkge1xuXG4gICAgbGV0IGVycm9yID0gZmFsc2U7XG4gICAgbGV0IGNvbnRlbnQgPSB0aGlzLm1hbmFnZXIuaGVscGVyLmdldEZpbGVDb250ZW50KGZpbGVQYXRoLCBwcm9qZWN0Um9vdCk7XG5cbiAgICBpZiAoIWNvbnRlbnQpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG5cbiAgICAgIGNvbnRlbnQgPSBKU09OLnBhcnNlKGNvbnRlbnQpO1xuXG4gICAgfSBjYXRjaChlKSB7XG5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdFcnJvciBwYXJzaW5nIC50ZXJuLXByb2plY3QuIFBsZWFzZSBjaGVjayBpZiBpdCBpcyBhIHZhbGlkIEpTT04gZmlsZS4nLCB7XG5cbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgcHJlcGFyZUxpYnMobG9jYWxDb25maWcsIGNvbmZpZ1N0dWIpIHtcblxuICAgIGxldCBsaWJzID0ge307XG5cbiAgICBpZiAoIWxvY2FsQ29uZmlnLmxpYnMpIHtcblxuICAgICAgbG9jYWxDb25maWcubGlicyA9IHt9O1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgbGV0IGxpYnNBc09iamVjdCA9IHt9O1xuICAgICAgZm9yIChsZXQgbGliIG9mIGxvY2FsQ29uZmlnLmxpYnMpIHtcblxuICAgICAgICBsaWJzQXNPYmplY3RbbGliXSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGxvY2FsQ29uZmlnLmxpYnMgPSBsaWJzQXNPYmplY3Q7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgbGliIG9mIE9iamVjdC5rZXlzKGNvbmZpZ1N0dWIubGlicykpwqB7XG5cbiAgICAgIGlmICghbG9jYWxDb25maWcubGlic1tsaWJdKSB7XG5cbiAgICAgICAgbGlic1tsaWJdID0gZmFsc2U7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgbGlic1tsaWJdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBsaWIgb2YgT2JqZWN0LmtleXMobG9jYWxDb25maWcubGlicykpIHtcblxuICAgICAgaWYgKGxpYiA9PT0gJ2VjbWE1JyB8fCBsaWIgPT09ICdlY21hNicpIHtcblxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnWW91IGFyZSB1c2luZyBhIG91dGRhdGVkIC50ZXJuLXByb2plY3QgZmlsZS4gUGxlYXNlIHJlbW92ZSBsaWJzIGVjbWE1LCBlY21hNiBtYW51YWxseSBhbmQgcmVzdGFydCB0aGUgU2VydmVyIHZpYSBQYWNrYWdlcyAtPiBBdG9tIFRlcm5qcyAtPiBSZXN0YXJ0IHNlcnZlci4gVGhlbiBjb25maWd1cmUgdGhlIHByb2plY3QgdmlhIFBhY2thZ2VzIC0+IEF0b20gVGVybmpzIC0+IENvbmZpZ3VyZSBwcm9qZWN0LicsIHtcblxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWxpYnNbbGliXSkge1xuXG4gICAgICAgIGxpYnNbbGliXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbG9jYWxDb25maWcubGlicyA9IGxpYnM7XG5cbiAgICByZXR1cm4gbG9jYWxDb25maWc7XG4gIH1cblxuICBwcmVwYXJlRWNtYShsb2NhbENvbmZpZywgY29uZmlnU3R1Yikge1xuXG4gICAgbGV0IGVjbWFWZXJzaW9ucyA9IHt9O1xuXG4gICAgZm9yIChsZXQgbGliIG9mIE9iamVjdC5rZXlzKGNvbmZpZ1N0dWIuZWNtYVZlcnNpb25zKSkge1xuXG4gICAgICBlY21hVmVyc2lvbnNbbGliXSA9IGNvbmZpZ1N0dWIuZWNtYVZlcnNpb25zW2xpYl07XG4gICAgfVxuXG4gICAgbG9jYWxDb25maWcuZWNtYVZlcnNpb25zID0gZWNtYVZlcnNpb25zO1xuXG4gICAgaWYgKGxvY2FsQ29uZmlnLmVjbWFWZXJzaW9uKSB7XG5cbiAgICAgIGZvciAobGV0IGxpYiBvZiBPYmplY3Qua2V5cyhsb2NhbENvbmZpZy5lY21hVmVyc2lvbnMpKSB7XG5cbiAgICAgICAgaWYgKGxpYiA9PT0gJ2VjbWFWZXJzaW9uJyArIGxvY2FsQ29uZmlnLmVjbWFWZXJzaW9uKSB7XG5cbiAgICAgICAgICBsb2NhbENvbmZpZy5lY21hVmVyc2lvbnNbbGliXSA9IHRydWU7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIGxvY2FsQ29uZmlnLmVjbWFWZXJzaW9uc1tsaWJdID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbG9jYWxDb25maWc7XG4gIH1cblxuICByZWdpc3RlckV2ZW50cygpIHtcblxuICAgIGxldCBjbG9zZSA9IHRoaXMuY29uZmlnVmlldy5nZXRDbG9zZSgpO1xuICAgIGxldCBjYW5jZWwgPSB0aGlzLmNvbmZpZ1ZpZXcuZ2V0Q2FuY2VsKCk7XG5cbiAgICBjbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG5cbiAgICAgIHRoaXMudXBkYXRlQ29uZmlnKCk7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIHRoaXMubWFuYWdlci5oZWxwZXIuZm9jdXNFZGl0b3IoKTtcbiAgICB9KTtcblxuICAgIGNhbmNlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG5cbiAgICAgIHRoaXMuZGVzdHJveUVkaXRvcnMoKTtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgdGhpcy5tYW5hZ2VyLmhlbHBlci5mb2N1c0VkaXRvcigpO1xuICAgIH0pO1xuICB9XG5cbiAgbWVyZ2VDb25maWdPYmplY3RzKG9iajEsIG9iajIpIHtcblxuICAgIHJldHVybiBfLmRlZXBFeHRlbmQoe30sIG9iajEsIG9iajIpO1xuICB9XG5cbiAgaGlkZSgpIHtcblxuICAgIGlmICghdGhpcy5jb25maWdQYW5lbCkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWdQYW5lbC5oaWRlKCk7XG4gIH1cblxuICBjbGVhcigpIHtcblxuICAgIHRoaXMuaGlkZSgpO1xuICAgIHRoaXMuZGVzdHJveUVkaXRvcnMoKTtcbiAgICB0aGlzLmNvbmZpZyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnByb2plY3RDb25maWcgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnVmlldykge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWdWaWV3LnJlbW92ZUNvbnRlbnQoKTtcbiAgfVxuXG4gIGdhdGhlckRhdGEoKSB7XG5cbiAgICBsZXQgY29uZmlnU3R1YiA9IHRoaXMuZ2V0Q29udGVudCgnLi4vdGVybi1jb25maWcuanNvbicsIGZhbHNlKTtcblxuICAgIGlmICghY29uZmlnU3R1Yikge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5wcm9qZWN0Q29uZmlnID0gdGhpcy5nZXRDb250ZW50KCcvLnRlcm4tcHJvamVjdCcsIHRydWUpO1xuXG4gICAgdGhpcy5jb25maWcgPSB7fTtcbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWdPYmplY3RzKHRoaXMucHJvamVjdENvbmZpZywgdGhpcy5jb25maWcpO1xuXG4gICAgaWYgKHRoaXMucHJvamVjdENvbmZpZykge1xuXG4gICAgICB0aGlzLmNvbmZpZyA9IHRoaXMucHJlcGFyZUVjbWEodGhpcy5jb25maWcsIGNvbmZpZ1N0dWIpO1xuICAgICAgdGhpcy5jb25maWcgPSB0aGlzLnByZXBhcmVMaWJzKHRoaXMuY29uZmlnLCBjb25maWdTdHViKTtcblxuICAgICAgZm9yIChsZXQgcGx1Z2luIGluIHRoaXMuY29uZmlnLnBsdWdpbnMpIHtcblxuICAgICAgICBpZiAodGhpcy5jb25maWcucGx1Z2luc1twbHVnaW5dKSB7XG5cbiAgICAgICAgICB0aGlzLmNvbmZpZy5wbHVnaW5zW3BsdWdpbl0uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbmZpZyA9IHRoaXMubWVyZ2VDb25maWdPYmplY3RzKGNvbmZpZ1N0dWIsIHRoaXMuY29uZmlnKTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnU3R1YjtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJlbW92ZUVkaXRvcihlZGl0b3IpIHtcblxuICAgIGlmICghZWRpdG9yKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgaWR4ID0gdGhpcy5lZGl0b3JzLmluZGV4T2YoZWRpdG9yKTtcblxuICAgIGlmIChpZHggPT09IC0xKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmVkaXRvcnMuc3BsaWNlKGlkeCwgMSk7XG4gIH1cblxuXG4gIGRlc3Ryb3lFZGl0b3JzKCkge1xuXG4gICAgZm9yIChsZXQgZWRpdG9yIG9mIHRoaXMuZWRpdG9ycykge1xuXG4gICAgICBsZXQgYnVmZmVyID0gZWRpdG9yLmdldE1vZGVsKCkuZ2V0QnVmZmVyKCk7XG4gICAgICBidWZmZXIuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHRoaXMuZWRpdG9ycyA9IFtdO1xuICB9XG5cbiAgdXBkYXRlQ29uZmlnKCkge1xuXG4gICAgdGhpcy5jb25maWcubG9hZEVhZ2VybHkgPSBbXTtcbiAgICB0aGlzLmNvbmZpZy5kb250TG9hZCA9IFtdO1xuXG4gICAgZm9yIChsZXQgZWRpdG9yIG9mIHRoaXMuZWRpdG9ycykge1xuXG4gICAgICBsZXQgYnVmZmVyID0gZWRpdG9yLmdldE1vZGVsKCkuZ2V0QnVmZmVyKCk7XG4gICAgICBsZXQgdGV4dCA9IGJ1ZmZlci5nZXRUZXh0KCkudHJpbSgpO1xuXG4gICAgICBpZiAodGV4dCA9PT0gJycpIHtcblxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb25maWdbZWRpdG9yLl9fdGVybmpzX3NlY3Rpb25dLnB1c2godGV4dCk7XG4gICAgfVxuXG4gICAgdGhpcy5kZXN0cm95RWRpdG9ycygpO1xuXG4gICAgbGV0IG5ld0NvbmZpZyA9IHRoaXMuYnVpbGROZXdDb25maWcoKTtcbiAgICBsZXQgbmV3Q29uZmlnSlNPTiA9IEpTT04uc3RyaW5naWZ5KG5ld0NvbmZpZywgbnVsbCwgMik7XG5cbiAgICB0aGlzLm1hbmFnZXIuaGVscGVyLnVwZGF0ZVRlcm5GaWxlKG5ld0NvbmZpZ0pTT04sIHRydWUpO1xuICB9XG5cbiAgYnVpbGROZXdDb25maWcoKSB7XG5cbiAgICBsZXQgbmV3Q29uZmlnID0ge307XG5cbiAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5jb25maWcuZWNtYVZlcnNpb25zKSkge1xuXG4gICAgICBpZiAodGhpcy5jb25maWcuZWNtYVZlcnNpb25zW2tleV0pIHtcblxuICAgICAgICBuZXdDb25maWcuZWNtYVZlcnNpb24gPSBOdW1iZXIoa2V5W2tleS5sZW5ndGggLSAxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghXy5pc0VtcHR5KHRoaXMuY29uZmlnLmxpYnMpKSB7XG5cbiAgICAgIG5ld0NvbmZpZy5saWJzID0gW107XG5cbiAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyh0aGlzLmNvbmZpZy5saWJzKSkge1xuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5saWJzW2tleV0pIHtcblxuICAgICAgICAgIG5ld0NvbmZpZy5saWJzLnB1c2goa2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbmZpZy5sb2FkRWFnZXJseS5sZW5ndGggIT09IDApIHtcblxuICAgICAgbmV3Q29uZmlnLmxvYWRFYWdlcmx5ID0gdGhpcy5jb25maWcubG9hZEVhZ2VybHk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29uZmlnLmRvbnRMb2FkLmxlbmd0aCAhPT0gMCkge1xuXG4gICAgICBuZXdDb25maWcuZG9udExvYWQgPSB0aGlzLmNvbmZpZy5kb250TG9hZDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9qZWN0Q29uZmlnICYmICFfLmlzRW1wdHkodGhpcy5wcm9qZWN0Q29uZmlnLnBsdWdpbnMpKSB7XG5cbiAgICAgIG5ld0NvbmZpZy5wbHVnaW5zID0gdGhpcy5wcm9qZWN0Q29uZmlnLnBsdWdpbnM7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0NvbmZpZztcbiAgfVxuXG4gIGluaXRDb25maWdWaWV3KCkge1xuXG4gICAgaWYgKCFDb25maWdWaWV3KSB7XG5cbiAgICAgIENvbmZpZ1ZpZXcgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLWNvbmZpZy12aWV3Jyk7XG4gICAgfVxuXG5cbiAgICB0aGlzLmNvbmZpZ1ZpZXcgPSBuZXcgQ29uZmlnVmlldygpO1xuICAgIHRoaXMuY29uZmlnVmlldy5pbml0aWFsaXplKHRoaXMpO1xuXG4gICAgdGhpcy5jb25maWdQYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZFJpZ2h0UGFuZWwoe1xuXG4gICAgICBpdGVtOiB0aGlzLmNvbmZpZ1ZpZXcsXG4gICAgICBwcmlvcml0eTogMFxuICAgIH0pO1xuICAgIHRoaXMuY29uZmlnUGFuZWwuaGlkZSgpO1xuXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50cygpO1xuICB9XG5cbiAgc2hvdygpIHtcblxuICAgIGlmICghdGhpcy5jb25maWdWaWV3KSB7XG5cbiAgICAgIHRoaXMuaW5pdENvbmZpZ1ZpZXcoKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICBhdG9tLnZpZXdzLmdldFZpZXcodGhpcy5jb25maWdQYW5lbCkuY2xhc3NMaXN0LmFkZCgnYXRvbS10ZXJuanMtY29uZmlnLXBhbmVsJyk7XG5cbiAgICBpZiAoIXRoaXMuZ2F0aGVyRGF0YSgpKSB7XG5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdUaGVyZSBpcyBubyBhY3RpdmUgcHJvamVjdC4gUGxlYXNlIHJlLW9wZW4gb3IgZm9jdXMgYXQgbGVhc3Qgb25lIEphdmFTY3JpcHQgZmlsZSBvZiB0aGUgcHJvamVjdCB0byBjb25maWd1cmUuJywge1xuXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ1ZpZXcuYnVpbGRPcHRpb25zTWFya3VwKHRoaXMubWFuYWdlcik7XG4gICAgdGhpcy5jb25maWdQYW5lbC5zaG93KCk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuXG4gICAgaWYgKHRoaXMuY29uZmlnVmlldykge1xuXG4gICAgICB0aGlzLmNvbmZpZ1ZpZXcuZGVzdHJveSgpO1xuICAgIH1cbiAgICB0aGlzLmNvbmZpZ1ZpZXcgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAodGhpcy5jb25maWdQYW5lbCkge1xuXG4gICAgICB0aGlzLmNvbmZpZ1BhbmVsLmRlc3Ryb3koKTtcbiAgICB9XG4gICAgdGhpcy5jb25maWdQYW5lbCA9IHVuZGVmaW5lZDtcbiAgfVxufVxuIl19
//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/lib/atom-ternjs-config.js
