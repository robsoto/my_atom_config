(function() {
  var ConfigView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ConfigView = (function(_super) {
    __extends(ConfigView, _super);

    function ConfigView() {
      return ConfigView.__super__.constructor.apply(this, arguments);
    }

    ConfigView.prototype.createdCallback = function() {
      var container;
      this.classList.add('atom-ternjs-config');
      container = document.createElement('div');
      this.content = document.createElement('div');
      this.content.classList.add('content');
      this.close = document.createElement('button');
      this.close.classList.add('btn', 'atom-ternjs-config-close');
      this.close.innerHTML = 'Save & Restart Server';
      this.cancel = document.createElement('button');
      this.cancel.classList.add('btn', 'atom-ternjs-config-close');
      this.cancel.innerHTML = 'Cancel';
      container.appendChild(this.content);
      return this.appendChild(container);
    };

    ConfigView.prototype.initialize = function(model) {
      this.setModel(model);
      return this;
    };

    ConfigView.prototype.buildOptionsMarkup = function(manager) {
      var config, header, project, text, title, wrapper, _ref;
      project = (_ref = manager.client) != null ? _ref.projectDir : void 0;
      config = this.getModel().config;
      title = document.createElement('h2');
      title.innerHTML = project;
      this.content.appendChild(title);
      this.content.appendChild(this.buildRadio('ecmaVersion'));
      this.content.appendChild(this.buildBoolean('libs'));
      this.content.appendChild(this.buildStringArray(config.loadEagerly, 'loadEagerly'));
      this.content.appendChild(this.buildStringArray(config.dontLoad, 'dontLoad'));
      wrapper = document.createElement('section');
      header = document.createElement('h2');
      header.innerHTML = 'plugins';
      text = document.createElement('p');
      text.innerHTML = 'This section isn\'t implemented yet.<br />Please add plugins manually by editing your .tern-project file located in your root-path.';
      wrapper.appendChild(header);
      wrapper.appendChild(text);
      this.content.appendChild(wrapper);
      this.content.appendChild(this.close);
      return this.content.appendChild(this.cancel);
    };

    ConfigView.prototype.buildStringArray = function(obj, section) {
      var doc, header, path, wrapper, _i, _len;
      wrapper = document.createElement('section');
      wrapper.dataset.type = section;
      header = document.createElement('h2');
      header.innerHTML = section;
      doc = document.createElement('p');
      doc.innerHTML = this.getModel().config.docs[section].doc;
      wrapper.appendChild(header);
      wrapper.appendChild(doc);
      for (_i = 0, _len = obj.length; _i < _len; _i++) {
        path = obj[_i];
        wrapper.appendChild(this.createInputWrapper(path, section));
      }
      if (obj.length === 0) {
        wrapper.appendChild(this.createInputWrapper(null, section));
      }
      return wrapper;
    };

    ConfigView.prototype.createInputWrapper = function(path, section) {
      var editor, inputWrapper;
      inputWrapper = document.createElement('div');
      inputWrapper.classList.add('input-wrapper');
      editor = this.createTextEditor(path);
      editor.__ternjs_section = section;
      inputWrapper.appendChild(editor);
      inputWrapper.appendChild(this.createAdd(section));
      inputWrapper.appendChild(this.createSub(editor));
      return inputWrapper;
    };

    ConfigView.prototype.createSub = function(editor) {
      var sub;
      sub = document.createElement('span');
      sub.classList.add('sub');
      sub.classList.add('inline-block');
      sub.classList.add('status-removed');
      sub.classList.add('icon');
      sub.classList.add('icon-diff-removed');
      sub.addEventListener('click', (function(_this) {
        return function(e) {
          var inputWrapper;
          _this.getModel().removeEditor(editor);
          inputWrapper = e.target.closest('.input-wrapper');
          return inputWrapper.parentNode.removeChild(inputWrapper);
        };
      })(this), false);
      return sub;
    };

    ConfigView.prototype.createAdd = function(section) {
      var add;
      add = document.createElement('span');
      add.classList.add('add');
      add.classList.add('inline-block');
      add.classList.add('status-added');
      add.classList.add('icon');
      add.classList.add('icon-diff-added');
      add.addEventListener('click', (function(_this) {
        return function(e) {
          return e.target.closest('section').appendChild(_this.createInputWrapper(null, section));
        };
      })(this), false);
      return add;
    };

    ConfigView.prototype.createTextEditor = function(path) {
      var item;
      item = document.createElement('atom-text-editor');
      item.setAttribute('mini', true);
      if (path) {
        item.getModel().getBuffer().setText(path);
      }
      this.getModel().editors.push(item);
      return item;
    };

    ConfigView.prototype.buildRadio = function(section) {
      var doc, header, inputWrapper, key, label, radio, wrapper, _i, _len, _ref;
      wrapper = document.createElement('section');
      wrapper.classList.add(section);
      header = document.createElement('h2');
      header.innerHTML = section;
      doc = document.createElement('p');
      doc.innerHTML = this.getModel().config.docs[section].doc;
      wrapper.appendChild(header);
      wrapper.appendChild(doc);
      _ref = Object.keys(this.getModel().config.ecmaVersions);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        inputWrapper = document.createElement('div');
        inputWrapper.classList.add('input-wrapper');
        label = document.createElement('span');
        label.innerHTML = key;
        radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'ecmaVersions';
        radio.checked = this.getModel().config.ecmaVersions[key];
        radio.__ternjs_key = key;
        radio.addEventListener('change', (function(_this) {
          return function(e) {
            var _j, _len1, _ref1;
            _ref1 = Object.keys(_this.getModel().config.ecmaVersions);
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              key = _ref1[_j];
              _this.getModel().config.ecmaVersions[key] = false;
            }
            return _this.getModel().config.ecmaVersions[e.target.__ternjs_key] = e.target.checked;
          };
        })(this), false);
        inputWrapper.appendChild(label);
        inputWrapper.appendChild(radio);
        wrapper.appendChild(inputWrapper);
      }
      return wrapper;
    };

    ConfigView.prototype.buildBoolean = function(section) {
      var checkbox, header, inputWrapper, key, label, wrapper, _i, _len, _ref;
      wrapper = document.createElement('section');
      wrapper.classList.add(section);
      header = document.createElement('h2');
      header.innerHTML = section;
      wrapper.appendChild(header);
      _ref = Object.keys(this.getModel().config.libs);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        inputWrapper = document.createElement('div');
        inputWrapper.classList.add('input-wrapper');
        label = document.createElement('span');
        label.innerHTML = key;
        checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = this.getModel().config.libs[key];
        checkbox.__ternjs_key = key;
        checkbox.addEventListener('change', (function(_this) {
          return function(e) {
            return _this.getModel().config.libs[e.target.__ternjs_key] = e.target.checked;
          };
        })(this), false);
        inputWrapper.appendChild(label);
        inputWrapper.appendChild(checkbox);
        wrapper.appendChild(inputWrapper);
      }
      return wrapper;
    };

    ConfigView.prototype.removeContent = function() {
      var _ref;
      return (_ref = this.content) != null ? _ref.innerHTML = '' : void 0;
    };

    ConfigView.prototype.getClose = function() {
      return this.close;
    };

    ConfigView.prototype.getCancel = function() {
      return this.cancel;
    };

    ConfigView.prototype.destroy = function() {
      return this.remove();
    };

    ConfigView.prototype.getModel = function() {
      return this.model;
    };

    ConfigView.prototype.setModel = function(model) {
      return this.model = model;
    };

    return ConfigView;

  })(HTMLElement);

  module.exports = document.registerElement('atom-ternjs-config', {
    prototype: ConfigView.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWNvbmZpZy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxVQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBTTtBQUVKLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx5QkFBQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLFVBQUEsU0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsb0JBQWYsQ0FBQSxDQUFBO0FBQUEsTUFFQSxTQUFBLEdBQVksUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FGWixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBSFgsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsU0FBdkIsQ0FKQSxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsS0FBRCxHQUFTLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCLENBTFQsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBakIsQ0FBcUIsS0FBckIsRUFBNEIsMEJBQTVCLENBTkEsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxTQUFQLEdBQW1CLHVCQVBuQixDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsTUFBRCxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCLENBUlYsQ0FBQTtBQUFBLE1BU0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBbEIsQ0FBc0IsS0FBdEIsRUFBNkIsMEJBQTdCLENBVEEsQ0FBQTtBQUFBLE1B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

//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/lib/atom-ternjs-config-view.coffee
