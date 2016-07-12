(function() {
  var RenameView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  RenameView = (function(_super) {
    __extends(RenameView, _super);

    function RenameView() {
      return RenameView.__super__.constructor.apply(this, arguments);
    }

    RenameView.prototype.createdCallback = function() {
      var buttonClose, buttonRename, container, sub, title, wrapper;
      this.classList.add('atom-ternjs-rename');
      container = document.createElement('div');
      wrapper = document.createElement('div');
      title = document.createElement('h1');
      title.innerHTML = 'Rename';
      sub = document.createElement('h2');
      sub.innerHTML = 'Rename a variable in a scope-aware way. (experimental)';
      buttonClose = document.createElement('button');
      buttonClose.innerHTML = 'Close';
      buttonClose.id = 'close';
      buttonClose.classList.add('btn');
      buttonClose.classList.add('atom-ternjs-rename-close');
      buttonClose.addEventListener('click', (function(_this) {
        return function(e) {
          _this.model.hide();
        };
      })(this));
      this.nameEditor = document.createElement('atom-text-editor');
      this.nameEditor.setAttribute('mini', true);
      this.nameEditor.addEventListener('core:confirm', (function(_this) {
        return function(e) {
          return _this.rename();
        };
      })(this));
      buttonRename = document.createElement('button');
      buttonRename.innerHTML = 'Rename';
      buttonRename.id = 'close';
      buttonRename.classList.add('btn');
      buttonRename.classList.add('mt');
      buttonRename.addEventListener('click', (function(_this) {
        return function(e) {
          return _this.rename();
        };
      })(this));
      wrapper.appendChild(title);
      wrapper.appendChild(sub);
      wrapper.appendChild(this.nameEditor);
      wrapper.appendChild(buttonClose);
      wrapper.appendChild(buttonRename);
      container.appendChild(wrapper);
      return this.appendChild(container);
    };

    RenameView.prototype.initialize = function(model) {
      this.setModel(model);
      return this;
    };

    RenameView.prototype.getModel = function() {
      return this.model;
    };

    RenameView.prototype.setModel = function(model) {
      return this.model = model;
    };

    RenameView.prototype.rename = function() {
      var text;
      text = this.nameEditor.getModel().getBuffer().getText();
      if (!text) {
        return;
      }
      return this.model.updateAllAndRename(text);
    };

    RenameView.prototype.destroy = function() {
      return this.remove();
    };

    return RenameView;

  })(HTMLElement);

  module.exports = document.registerElement('atom-ternjs-rename', {
    prototype: RenameView.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXJlbmFtZS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxVQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBTTtBQUVKLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx5QkFBQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUVmLFVBQUEseURBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLG9CQUFmLENBQUEsQ0FBQTtBQUFBLE1BRUEsU0FBQSxHQUFZLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBRlosQ0FBQTtBQUFBLE1BR0EsT0FBQSxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBSFYsQ0FBQTtBQUFBLE1BS0EsS0FBQSxHQUFRLFFBQVEsQ0FBQyxhQUFULENBQXVCLElBQXZCLENBTFIsQ0FBQTtBQUFBLE1BTUEsS0FBSyxDQUFDLFNBQU4sR0FBa0IsUUFObEIsQ0FBQTtBQUFBLE1BUUEsR0FBQSxHQUFNLFFBQVEsQ0FBQyxhQUFULENBQXVCLElBQXZCLENBUk4sQ0FBQTtBQUFBLE1BU0EsR0FBRyxDQUFDLFNBQUosR0FBZ0Isd0RBVGhCLENBQUE7QUFBQSxNQVdBLFdBQUEsR0FBYyxRQUFRLENBQUMsYUFBVCxDQUF1QixRQUF2QixDQVhkLENBQUE7QUFBQSxNQVlBLFdBQVcsQ0FBQyxTQUFaLEdBQXdCLE9BWnhCLENBQUE7QUFBQSxNQWFBLFdBQVcsQ0FBQyxFQUFaLEdBQWlCLE9BYmpCLENBQUE7QUFBQSxNQWNBLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBdEIsQ0FBMEIsS0FBMUIsQ0FkQSxDQUFBO0FBQUEsTUFlQSxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQXRC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

//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/lib/atom-ternjs-rename-view.coffee
