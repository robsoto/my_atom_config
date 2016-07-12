var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomTernjsHelperJs = require('./atom-ternjs-helper.js');

"use babel";

var ReferenceView = (function (_HTMLElement) {
  _inherits(ReferenceView, _HTMLElement);

  function ReferenceView() {
    _classCallCheck(this, ReferenceView);

    _get(Object.getPrototypeOf(ReferenceView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ReferenceView, [{
    key: 'createdCallback',
    value: function createdCallback() {

      var container = document.createElement('div');

      this.content = document.createElement('div');
      this.closeButton = document.createElement('button');

      this.classList.add('atom-ternjs-reference');
      this.closeButton.classList.add('btn', 'atom-ternjs-reference-close');
      this.closeButton.innerHTML = 'Close';

      container.appendChild(this.closeButton);
      container.appendChild(this.content);

      this.appendChild(container);
    }
  }, {
    key: 'initialize',
    value: function initialize(model) {

      this.setModel(model);

      return this;
    }
  }, {
    key: 'clickHandle',
    value: function clickHandle(i) {

      this.getModel().goToReference(i);
    }
  }, {
    key: 'buildItems',
    value: function buildItems(data) {

      var headline = document.createElement('h2');
      var list = document.createElement('ul');
      var i = 0;

      this.content.innerHTML = '';
      headline.innerHTML = data.name + ' (' + data.type + ')';
      this.content.appendChild(headline);

      for (var item of data.refs) {

        var li = document.createElement('li');
        var lineText = (0, _atomTernjsHelperJs.replaceTags)(item.lineText);
        lineText = lineText.replace(data.name, '<strong>' + data.name + '</strong>');

        li.innerHTML = '\n        <h3>\n          <span>\n            <span class="darken">\n              (' + (item.position.row + 1) + ':' + item.position.column + '):\n            </span>\n            <span> ' + lineText + '</span>\n          </span>\n          <span class="darken"> (' + item.file + ')</span>\n          <div class="clear"></div>\n        </h3>\n      ';

        li.addEventListener('click', this.clickHandle.bind(this, i), false);
        list.appendChild(li);

        i++;
      }

      this.content.appendChild(list);
    }
  }, {
    key: 'getClose',
    value: function getClose() {

      return this.closeButton;
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
    key: 'destroy',
    value: function destroy() {

      this.remove();
    }
  }]);

  return ReferenceView;
})(HTMLElement);

module.exports = document.registerElement('atom-ternjs-reference', {

  prototype: ReferenceView.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Jzb3RvLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1yZWZlcmVuY2Utdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztrQ0FFMEIseUJBQXlCOztBQUZuRCxXQUFXLENBQUM7O0lBSU4sYUFBYTtZQUFiLGFBQWE7O1dBQWIsYUFBYTswQkFBYixhQUFhOzsrQkFBYixhQUFhOzs7ZUFBYixhQUFhOztXQUVGLDJCQUFHOztBQUVoQixVQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVoRCxVQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0MsVUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVwRCxVQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQzVDLFVBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztBQUNyRSxVQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7O0FBRXJDLGVBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3hDLGVBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVwQyxVQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzdCOzs7V0FFUyxvQkFBQyxLQUFLLEVBQUU7O0FBRWhCLFVBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXJCLGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztXQUVVLHFCQUFDLENBQUMsRUFBRTs7QUFFYixVQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2xDOzs7V0FFUyxvQkFBQyxJQUFJLEVBQUU7O0FBRWYsVUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QyxVQUFJLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hDLFVBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFVixVQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDNUIsY0FBUSxDQUFDLFNBQVMsR0FBTSxJQUFJLENBQUMsSUFBSSxVQUFLLElBQUksQ0FBQyxJQUFJLE1BQUcsQ0FBQztBQUNuRCxVQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFbkMsV0FBSyxJQUFNLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFOztBQUU1QixZQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDLFlBQUksUUFBUSxHQUFHLHFDQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQyxnQkFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksZUFBYSxJQUFJLENBQUMsSUFBSSxlQUFZLENBQUM7O0FBRXhFLFVBQUUsQ0FBQyxTQUFTLDZGQUlELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQSxTQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxvREFFekMsUUFBUSxxRUFFTSxJQUFJLENBQUMsSUFBSSx5RUFHckMsQ0FBQzs7QUFFRixVQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNwRSxZQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVyQixTQUFDLEVBQUUsQ0FBQztPQUNMOztBQUVELFVBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2hDOzs7V0FFTyxvQkFBRzs7QUFFVCxhQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7S0FDekI7OztXQUVPLG9CQUFHOztBQUVULGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztLQUNuQjs7O1dBRU8sa0JBQUMsS0FBSyxFQUFFOztBQUVkLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQ3BCOzs7V0FFTSxtQkFBRzs7QUFFUixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O1NBdkZHLGFBQWE7R0FBUyxXQUFXOztBQTBGdkMsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLHVCQUF1QixFQUFFOztBQUVqRSxXQUFTLEVBQUUsYUFBYSxDQUFDLFNBQVM7Q0FDbkMsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL3Jzb3RvLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1yZWZlcmVuY2Utdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCB7cmVwbGFjZVRhZ3N9IGZyb20gJy4vYXRvbS10ZXJuanMtaGVscGVyLmpzJztcblxuY2xhc3MgUmVmZXJlbmNlVmlldyBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG5cbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIHRoaXMuY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuY2xvc2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblxuICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnYXRvbS10ZXJuanMtcmVmZXJlbmNlJyk7XG4gICAgdGhpcy5jbG9zZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nLCAnYXRvbS10ZXJuanMtcmVmZXJlbmNlLWNsb3NlJyk7XG4gICAgdGhpcy5jbG9zZUJ1dHRvbi5pbm5lckhUTUwgPSAnQ2xvc2UnO1xuXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY2xvc2VCdXR0b24pO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRlbnQpO1xuXG4gICAgdGhpcy5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShtb2RlbCkge1xuXG4gICAgdGhpcy5zZXRNb2RlbChtb2RlbCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNsaWNrSGFuZGxlKGkpIHtcblxuICAgIHRoaXMuZ2V0TW9kZWwoKS5nb1RvUmVmZXJlbmNlKGkpO1xuICB9XG5cbiAgYnVpbGRJdGVtcyhkYXRhKSB7XG5cbiAgICBsZXQgaGVhZGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgIGxldCBsaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICBsZXQgaSA9IDA7XG5cbiAgICB0aGlzLmNvbnRlbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgaGVhZGxpbmUuaW5uZXJIVE1MID0gYCR7ZGF0YS5uYW1lfSAoJHtkYXRhLnR5cGV9KWA7XG4gICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKGhlYWRsaW5lKTtcblxuICAgIGZvciAoY29uc3QgaXRlbSBvZiBkYXRhLnJlZnMpIHtcblxuICAgICAgbGV0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGxldCBsaW5lVGV4dCA9IHJlcGxhY2VUYWdzKGl0ZW0ubGluZVRleHQpO1xuICAgICAgbGluZVRleHQgPSBsaW5lVGV4dC5yZXBsYWNlKGRhdGEubmFtZSwgYDxzdHJvbmc+JHtkYXRhLm5hbWV9PC9zdHJvbmc+YCk7XG5cbiAgICAgIGxpLmlubmVySFRNTCA9IGBcbiAgICAgICAgPGgzPlxuICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkYXJrZW5cIj5cbiAgICAgICAgICAgICAgKCR7aXRlbS5wb3NpdGlvbi5yb3cgKyAxfToke2l0ZW0ucG9zaXRpb24uY29sdW1ufSk6XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8c3Bhbj4gJHtsaW5lVGV4dH08L3NwYW4+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZGFya2VuXCI+ICgke2l0ZW0uZmlsZX0pPC9zcGFuPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjbGVhclwiPjwvZGl2PlxuICAgICAgICA8L2gzPlxuICAgICAgYDtcblxuICAgICAgbGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsaWNrSGFuZGxlLmJpbmQodGhpcywgaSksIGZhbHNlKTtcbiAgICAgIGxpc3QuYXBwZW5kQ2hpbGQobGkpO1xuXG4gICAgICBpKys7XG4gICAgfVxuXG4gICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKGxpc3QpO1xuICB9XG5cbiAgZ2V0Q2xvc2UoKSB7XG5cbiAgICByZXR1cm4gdGhpcy5jbG9zZUJ1dHRvbjtcbiAgfVxuXG4gIGdldE1vZGVsKCkge1xuXG4gICAgcmV0dXJuIHRoaXMubW9kZWw7XG4gIH1cblxuICBzZXRNb2RlbChtb2RlbCkge1xuXG4gICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIHRoaXMucmVtb3ZlKCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2F0b20tdGVybmpzLXJlZmVyZW5jZScsIHtcblxuICBwcm90b3R5cGU6IFJlZmVyZW5jZVZpZXcucHJvdG90eXBlXG59KTtcbiJdfQ==
//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/lib/atom-ternjs-reference-view.js
