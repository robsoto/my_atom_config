"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Manager = require('./atom-ternjs-manager');
var Provider = require('./atom-ternjs-provider');
var LinterTern = undefined;

var AtomTernjs = (function () {
  function AtomTernjs() {
    _classCallCheck(this, AtomTernjs);

    this.manager = undefined;
    this.provider = undefined;
    this.useLint = undefined;
    this.providerLinter = undefined;

    this.config = require('./config.json');
  }

  _createClass(AtomTernjs, [{
    key: 'activate',
    value: function activate() {

      this.provider = new Provider();
      this.manager = new Manager(this.provider);
      this.useLint = atom.config.get('atom-ternjs.lint');

      if (!this.useLint) {

        return;
      }

      LinterTern = require('./linter');
      this.providerLinter = new LinterTern(this.manager);
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {

      this.manager.destroy();
      this.manager = undefined;
      this.provider = undefined;
      this.useLint = undefined;
      this.providerLinter = undefined;
    }
  }, {
    key: 'provide',
    value: function provide() {

      return this.provider;
    }
  }, {
    key: 'provideLinter',
    value: function provideLinter() {

      if (!this.useLint) {

        return;
      }

      return this.providerLinter;
    }
  }]);

  return AtomTernjs;
})();

exports['default'] = new AtomTernjs();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Jzb3RvLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7QUFFWixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUMvQyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNqRCxJQUFJLFVBQVUsWUFBQSxDQUFDOztJQUVULFVBQVU7QUFFSCxXQUZQLFVBQVUsR0FFQTswQkFGVixVQUFVOztBQUlaLFFBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO0FBQzFCLFFBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDOztBQUVoQyxRQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztHQUN4Qzs7ZUFWRyxVQUFVOztXQVlOLG9CQUFHOztBQUVULFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztBQUMvQixVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQyxVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7O0FBRW5ELFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFOztBQUVqQixlQUFPO09BQ1I7O0FBRUQsZ0JBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDakMsVUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDcEQ7OztXQUVTLHNCQUFHOztBQUVYLFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDdkIsVUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFDekIsVUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7QUFDMUIsVUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFDekIsVUFBSSxDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUM7S0FDakM7OztXQUVNLG1CQUFHOztBQUVSLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztLQUN0Qjs7O1dBRVkseUJBQUc7O0FBRWQsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7O0FBRWpCLGVBQU87T0FDUjs7QUFFRCxhQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7S0FDNUI7OztTQWpERyxVQUFVOzs7cUJBb0RELElBQUksVUFBVSxFQUFFIiwiZmlsZSI6Ii9ob21lL3Jzb3RvLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmxldCBNYW5hZ2VyID0gcmVxdWlyZSgnLi9hdG9tLXRlcm5qcy1tYW5hZ2VyJyk7XG5sZXQgUHJvdmlkZXIgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLXByb3ZpZGVyJyk7XG5sZXQgTGludGVyVGVybjtcblxuY2xhc3MgQXRvbVRlcm5qcyB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB0aGlzLm1hbmFnZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5wcm92aWRlciA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnVzZUxpbnQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5wcm92aWRlckxpbnRlciA9IHVuZGVmaW5lZDtcblxuICAgIHRoaXMuY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcuanNvbicpO1xuICB9XG5cbiAgYWN0aXZhdGUoKSB7XG5cbiAgICB0aGlzLnByb3ZpZGVyID0gbmV3IFByb3ZpZGVyKCk7XG4gICAgdGhpcy5tYW5hZ2VyID0gbmV3IE1hbmFnZXIodGhpcy5wcm92aWRlcik7XG4gICAgdGhpcy51c2VMaW50ID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLXRlcm5qcy5saW50Jyk7XG5cbiAgICBpZiAoIXRoaXMudXNlTGludCkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgTGludGVyVGVybiA9IHJlcXVpcmUoJy4vbGludGVyJyk7XG4gICAgdGhpcy5wcm92aWRlckxpbnRlciA9IG5ldyBMaW50ZXJUZXJuKHRoaXMubWFuYWdlcik7XG4gIH1cblxuICBkZWFjdGl2YXRlKCkge1xuXG4gICAgdGhpcy5tYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICB0aGlzLm1hbmFnZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5wcm92aWRlciA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnVzZUxpbnQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5wcm92aWRlckxpbnRlciA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByb3ZpZGUoKSB7XG5cbiAgICByZXR1cm4gdGhpcy5wcm92aWRlcjtcbiAgfVxuXG4gIHByb3ZpZGVMaW50ZXIoKSB7XG5cbiAgICBpZiAoIXRoaXMudXNlTGludCkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXJMaW50ZXI7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEF0b21UZXJuanMoKTtcbiJdfQ==
//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/lib/atom-ternjs.js
