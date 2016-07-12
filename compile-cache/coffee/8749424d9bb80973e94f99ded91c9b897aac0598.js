(function() {
  var TypeView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TypeView = (function(_super) {
    __extends(TypeView, _super);

    function TypeView() {
      return TypeView.__super__.constructor.apply(this, arguments);
    }

    TypeView.prototype.createdCallback = function() {
      this.getModel();
      this.addEventListener('click', (function(_this) {
        return function() {
          return _this.getModel().destroyOverlay();
        };
      })(this), false);
      this.container = document.createElement('div');
      return this.appendChild(this.container);
    };

    TypeView.prototype.initialize = function(model) {
      this.setModel(model);
      return this;
    };

    TypeView.prototype.getModel = function() {
      return this.model;
    };

    TypeView.prototype.setModel = function(model) {
      return this.model = model;
    };

    TypeView.prototype.setData = function(data) {
      return this.container.innerHTML = data.label;
    };

    TypeView.prototype.destroy = function() {
      return this.remove();
    };

    return TypeView;

  })(HTMLElement);

  module.exports = document.registerElement('atom-ternjs-type', {
    prototype: TypeView.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXR5cGUtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsUUFBQTtJQUFBO21TQUFBOztBQUFBLEVBQU07QUFFSiwrQkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsdUJBQUEsZUFBQSxHQUFpQixTQUFBLEdBQUE7QUFDZixNQUFBLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsT0FBbEIsRUFBMkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDekIsS0FBQyxDQUFBLFFBQUQsQ0FBQSxDQUFXLENBQUMsY0FBWixDQUFBLEVBRHlCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0IsRUFFRSxLQUZGLENBREEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUpiLENBQUE7YUFLQSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxTQUFkLEVBTmU7SUFBQSxDQUFqQixDQUFBOztBQUFBLHVCQVFBLFVBQUEsR0FBWSxTQUFDLEtBQUQsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxLQUFWLENBQUEsQ0FBQTthQUNBLEtBRlU7SUFBQSxDQVJaLENBQUE7O0FBQUEsdUJBWUEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxNQURPO0lBQUEsQ0FaVixDQUFBOztBQUFBLHVCQWVBLFFBQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxLQUFELEdBQVMsTUFERDtJQUFBLENBZlYsQ0FBQTs7QUFBQSx1QkFrQkEsT0FBQSxHQUFTLFNBQUMsSUFBRCxHQUFBO2FBQ1AsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLEdBQXVCLElBQUksQ0FBQyxNQURyQjtJQUFBLENBbEJULENBQUE7O0FBQUEsdUJBcUJBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFDUCxJQUFDLENBQUEsTUFBRCxDQUFBLEVBRE87SUFBQSxDQXJCVCxDQUFBOztvQkFBQTs7S0FGcUIsWUFBdkIsQ0FBQTs7QUFBQSxFQTBCQSxNQUFNLENBQUMsT0FBUCxHQUFpQixRQUFRLENBQUMsZUFBVCxDQUF5QixrQkFBekIsRUFBNkM7QUFBQSxJQUFBLFNBQUEsRUFBVyxRQUFRLENBQUMsU0FBcEI7R0FBN0MsQ0ExQmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/lib/atom-ternjs-type-view.coffee
