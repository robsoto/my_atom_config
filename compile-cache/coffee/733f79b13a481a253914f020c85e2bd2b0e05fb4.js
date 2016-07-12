(function() {
  var LaunchModeView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  LaunchModeView = (function(_super) {
    __extends(LaunchModeView, _super);

    function LaunchModeView() {
      return LaunchModeView.__super__.constructor.apply(this, arguments);
    }

    LaunchModeView.prototype.initialize = function(_arg) {
      var devMode, safeMode, _ref;
      _ref = _arg != null ? _arg : {}, safeMode = _ref.safeMode, devMode = _ref.devMode;
      this.classList.add('inline-block', 'icon', 'icon-color-mode');
      if (devMode) {
        this.classList.add('text-error');
        return this.tooltipDisposable = atom.tooltips.add(this, {
          title: 'This window is in dev mode'
        });
      } else if (safeMode) {
        this.classList.add('text-success');
        return this.tooltipDisposable = atom.tooltips.add(this, {
          title: 'This window is in safe mode'
        });
      }
    };

    LaunchModeView.prototype.detachedCallback = function() {
      var _ref;
      return (_ref = this.tooltipDisposable) != null ? _ref.dispose() : void 0;
    };

    return LaunchModeView;

  })(HTMLElement);

  module.exports = document.registerElement('status-bar-launch-mode', {
    prototype: LaunchModeView.prototype,
    "extends": 'span'
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvc3RhdHVzLWJhci9saWIvbGF1bmNoLW1vZGUtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsY0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQU07QUFDSixxQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsNkJBQUEsVUFBQSxHQUFZLFNBQUMsSUFBRCxHQUFBO0FBQ1YsVUFBQSx1QkFBQTtBQUFBLDRCQURXLE9BQW9CLElBQW5CLGdCQUFBLFVBQVUsZUFBQSxPQUN0QixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxjQUFmLEVBQStCLE1BQS9CLEVBQXVDLGlCQUF2QyxDQUFBLENBQUE7QUFDQSxNQUFBLElBQUcsT0FBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsWUFBZixDQUFBLENBQUE7ZUFDQSxJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQWxCLEVBQXdCO0FBQUEsVUFBQSxLQUFBLEVBQU8sNEJBQVA7U0FBeEIsRUFGdkI7T0FBQSxNQUdLLElBQUcsUUFBSDtBQUNILFFBQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsY0FBZixDQUFBLENBQUE7ZUFDQSxJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQWxCLEVBQXdCO0FBQUEsVUFBQSxLQUFBLEVBQU8sNkJBQVA7U0FBeEIsRUFGbEI7T0FMSztJQUFBLENBQVosQ0FBQTs7QUFBQSw2QkFTQSxnQkFBQSxHQUFrQixTQUFBLEdBQUE7QUFDaEIsVUFBQSxJQUFBOzJEQUFrQixDQUFFLE9BQXBCLENBQUEsV0FEZ0I7SUFBQSxDQVRsQixDQUFBOzswQkFBQTs7S0FEMkIsWUFBN0IsQ0FBQTs7QUFBQSxFQWFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFFBQVEsQ0FBQyxlQUFULENBQXlCLHdCQUF6QixFQUFtRDtBQUFBLElBQUEsU0FBQSxFQUFXLGNBQWMsQ0FBQyxTQUExQjtBQUFBLElBQXFDLFNBQUEsRUFBUyxNQUE5QztHQUFuRCxDQWJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/rsoto/.atom/packages/status-bar/lib/launch-mode-view.coffee
