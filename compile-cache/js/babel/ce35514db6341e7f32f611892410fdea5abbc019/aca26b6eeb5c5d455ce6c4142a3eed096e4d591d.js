"use babel";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DocumentationView = (function (_HTMLElement) {
  _inherits(DocumentationView, _HTMLElement);

  function DocumentationView() {
    _classCallCheck(this, DocumentationView);

    _get(Object.getPrototypeOf(DocumentationView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(DocumentationView, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      this.getModel();
      this.addEventListener('click', function () {

        _this.getModel().destroyOverlay();
      }, false);

      this.container = document.createElement('div');

      this.container.onmousewheel = function (e) {

        e.stopPropagation();
      };

      this.appendChild(this.container);
    }
  }, {
    key: 'initialize',
    value: function initialize(model) {

      this.setModel(model);

      return this;
    }
  }, {
    key: 'getModel',
    value: function getModel() {

      return this.model;
    }
  }, {
    key: 'setModel',
    value: function setModel(model) {

      this.model = model;
    }
  }, {
    key: 'setData',
    value: function setData(data) {

      this.container.innerHTML = '\n\n      <h3>' + data.type + '</h3>\n      <p>' + data.doc + '</p>\n      <a href="' + data.url + '">' + data.url + '</p>\n    ';
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      this.remove();
    }
  }]);

  return DocumentationView;
})(HTMLElement);

module.exports = document.registerElement('atom-ternjs-documentation', {

  prototype: DocumentationView.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Jzb3RvLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1kb2N1bWVudGF0aW9uLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7O0lBRU4saUJBQWlCO1lBQWpCLGlCQUFpQjs7V0FBakIsaUJBQWlCOzBCQUFqQixpQkFBaUI7OytCQUFqQixpQkFBaUI7OztlQUFqQixpQkFBaUI7O1dBRU4sMkJBQUc7OztBQUVoQixVQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDaEIsVUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFNOztBQUVuQyxjQUFLLFFBQVEsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO09BRWxDLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRVYsVUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUvQyxVQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxVQUFDLENBQUMsRUFBSzs7QUFFbkMsU0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO09BQ3JCLENBQUM7O0FBRUYsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDbEM7OztXQUVTLG9CQUFDLEtBQUssRUFBRTs7QUFFaEIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFckIsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1dBRU8sb0JBQUc7O0FBRVQsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0tBQ25COzs7V0FFTyxrQkFBQyxLQUFLLEVBQUU7O0FBRWQsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDcEI7OztXQUVNLGlCQUFDLElBQUksRUFBRTs7QUFFWixVQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsc0JBRWhCLElBQUksQ0FBQyxJQUFJLHdCQUNWLElBQUksQ0FBQyxHQUFHLDZCQUNGLElBQUksQ0FBQyxHQUFHLFVBQUssSUFBSSxDQUFDLEdBQUcsZUFDakMsQ0FBQztLQUNIOzs7V0FFTSxtQkFBRzs7QUFFUixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O1NBbkRHLGlCQUFpQjtHQUFTLFdBQVc7O0FBc0QzQyxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsMkJBQTJCLEVBQUU7O0FBRXJFLFdBQVMsRUFBRSxpQkFBaUIsQ0FBQyxTQUFTO0NBQ3ZDLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9yc290by8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbi12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuY2xhc3MgRG9jdW1lbnRhdGlvblZpZXcgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuXG4gICAgdGhpcy5nZXRNb2RlbCgpO1xuICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cbiAgICAgIHRoaXMuZ2V0TW9kZWwoKS5kZXN0cm95T3ZlcmxheSgpO1xuXG4gICAgfSwgZmFsc2UpO1xuXG4gICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIHRoaXMuY29udGFpbmVyLm9ubW91c2V3aGVlbCA9IChlKSA9PiB7XG5cbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfTtcblxuICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShtb2RlbCkge1xuXG4gICAgdGhpcy5zZXRNb2RlbChtb2RlbCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGdldE1vZGVsKCkge1xuXG4gICAgcmV0dXJuIHRoaXMubW9kZWw7XG4gIH1cblxuICBzZXRNb2RlbChtb2RlbCkge1xuXG4gICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICB9XG5cbiAgc2V0RGF0YShkYXRhKSB7XG5cbiAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSBgXG5cbiAgICAgIDxoMz4ke2RhdGEudHlwZX08L2gzPlxuICAgICAgPHA+JHtkYXRhLmRvY308L3A+XG4gICAgICA8YSBocmVmPVwiJHtkYXRhLnVybH1cIj4ke2RhdGEudXJsfTwvcD5cbiAgICBgO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIHRoaXMucmVtb3ZlKCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2F0b20tdGVybmpzLWRvY3VtZW50YXRpb24nLCB7XG5cbiAgcHJvdG90eXBlOiBEb2N1bWVudGF0aW9uVmlldy5wcm90b3R5cGVcbn0pO1xuIl19
//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/lib/atom-ternjs-documentation-view.js
