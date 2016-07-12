"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var DocumentationView = require('./atom-ternjs-documentation-view');

var Documentation = (function () {
  function Documentation(manager) {
    _classCallCheck(this, Documentation);

    this.manager = manager;
    this.view = new DocumentationView();
    this.view.initialize(this);

    atom.views.getView(atom.workspace).appendChild(this.view);
  }

  _createClass(Documentation, [{
    key: 'request',
    value: function request() {
      var _this = this;

      var editor = atom.workspace.getActiveTextEditor();

      if (!editor) {

        return;
      }

      var cursor = editor.getLastCursor();
      var position = cursor.getBufferPosition();

      this.manager.client.update(editor).then(function (data) {

        _this.manager.client.documentation(atom.project.relativizePath(editor.getURI())[1], {

          line: position.row,
          ch: position.column

        }).then(function (data) {

          if (!data) {

            return;
          }

          _this.view.setData({

            doc: _this.manager.helper.replaceTags(data.doc),
            origin: data.origin,
            type: _this.manager.helper.formatType(data),
            url: data.url || ''
          });

          _this.show();
        });
      });
    }
  }, {
    key: 'show',
    value: function show() {

      if (!this.marker) {

        var editor = atom.workspace.getActiveTextEditor();
        var cursor = editor.getLastCursor();

        if (!editor || !cursor) {

          return;
        }

        this.marker = cursor.getMarker();

        if (!this.marker) {

          return;
        }

        this.overlayDecoration = editor.decorateMarker(this.marker, {

          type: 'overlay',
          item: this.view,
          'class': 'atom-ternjs-documentation',
          position: 'tale',
          invalidate: 'touch'
        });
      } else {

        this.marker.setProperties({

          type: 'overlay',
          item: this.view,
          'class': 'atom-ternjs-documentation',
          position: 'tale',
          invalidate: 'touch'
        });
      }
    }
  }, {
    key: 'destroyOverlay',
    value: function destroyOverlay() {

      if (this.overlayDecoration) {

        this.overlayDecoration.destroy();
      }

      this.overlayDecoration = null;
      this.marker = null;
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      this.destroyOverlay();
      this.view.destroy();
      this.view = undefined;
    }
  }]);

  return Documentation;
})();

exports['default'] = Documentation;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Jzb3RvLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1kb2N1bWVudGF0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7OztBQUVaLElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7O0lBRS9DLGFBQWE7QUFFckIsV0FGUSxhQUFhLENBRXBCLE9BQU8sRUFBRTswQkFGRixhQUFhOztBQUk5QixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksaUJBQWlCLEVBQUUsQ0FBQztBQUNwQyxRQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFM0IsUUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDM0Q7O2VBVGtCLGFBQWE7O1dBV3pCLG1CQUFHOzs7QUFFUixVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7O0FBRWxELFVBQUksQ0FBQyxNQUFNLEVBQUU7O0FBRVgsZUFBTztPQUNSOztBQUVELFVBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUNwQyxVQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7QUFFMUMsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksRUFBSzs7QUFFaEQsY0FBSyxPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTs7QUFFakYsY0FBSSxFQUFFLFFBQVEsQ0FBQyxHQUFHO0FBQ2xCLFlBQUUsRUFBRSxRQUFRLENBQUMsTUFBTTs7U0FFcEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksRUFBSzs7QUFFaEIsY0FBSSxDQUFDLElBQUksRUFBRTs7QUFFVCxtQkFBTztXQUNSOztBQUVELGdCQUFLLElBQUksQ0FBQyxPQUFPLENBQUM7O0FBRWhCLGVBQUcsRUFBRSxNQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDOUMsa0JBQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtBQUNuQixnQkFBSSxFQUFFLE1BQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO0FBQzFDLGVBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUU7V0FDcEIsQ0FBQyxDQUFDOztBQUVILGdCQUFLLElBQUksRUFBRSxDQUFDO1NBQ2IsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0o7OztXQUVHLGdCQUFHOztBQUVMLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFOztBQUVoQixZQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDbEQsWUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDOztBQUVwQyxZQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFOztBQUV0QixpQkFBTztTQUNSOztBQUVELFlBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUVqQyxZQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTs7QUFFaEIsaUJBQU87U0FDUjs7QUFFRCxZQUFJLENBQUMsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFOztBQUUxRCxjQUFJLEVBQUUsU0FBUztBQUNmLGNBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtBQUNmLG1CQUFPLDJCQUEyQjtBQUNsQyxrQkFBUSxFQUFFLE1BQU07QUFDaEIsb0JBQVUsRUFBRSxPQUFPO1NBQ3BCLENBQUMsQ0FBQztPQUVKLE1BQU07O0FBRUwsWUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUM7O0FBRXhCLGNBQUksRUFBRSxTQUFTO0FBQ2YsY0FBSSxFQUFFLElBQUksQ0FBQyxJQUFJO0FBQ2YsbUJBQU8sMkJBQTJCO0FBQ2xDLGtCQUFRLEVBQUUsTUFBTTtBQUNoQixvQkFBVSxFQUFFLE9BQU87U0FDcEIsQ0FBQyxDQUFDO09BQ0o7S0FDRjs7O1dBRWEsMEJBQUc7O0FBRWYsVUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7O0FBRTFCLFlBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUNsQzs7QUFFRCxVQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0FBQzlCLFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0tBQ3BCOzs7V0FFTSxtQkFBRzs7QUFFUixVQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdEIsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNwQixVQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztLQUN2Qjs7O1NBM0drQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9yc290by8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmxldCBEb2N1bWVudGF0aW9uVmlldyA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbi12aWV3Jyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvY3VtZW50YXRpb24ge1xuXG4gIGNvbnN0cnVjdG9yKG1hbmFnZXIpIHtcblxuICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG4gICAgdGhpcy52aWV3ID0gbmV3IERvY3VtZW50YXRpb25WaWV3KCk7XG4gICAgdGhpcy52aWV3LmluaXRpYWxpemUodGhpcyk7XG5cbiAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLmFwcGVuZENoaWxkKHRoaXMudmlldyk7XG4gIH1cblxuICByZXF1ZXN0KCkge1xuXG4gICAgbGV0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuICAgIGlmICghZWRpdG9yKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgY3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKTtcbiAgICBsZXQgcG9zaXRpb24gPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKTtcblxuICAgIHRoaXMubWFuYWdlci5jbGllbnQudXBkYXRlKGVkaXRvcikudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICB0aGlzLm1hbmFnZXIuY2xpZW50LmRvY3VtZW50YXRpb24oYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRVUkkoKSlbMV0sIHtcblxuICAgICAgICBsaW5lOiBwb3NpdGlvbi5yb3csXG4gICAgICAgIGNoOiBwb3NpdGlvbi5jb2x1bW5cblxuICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgIGlmICghZGF0YSkge1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy52aWV3LnNldERhdGEoe1xuXG4gICAgICAgICAgZG9jOiB0aGlzLm1hbmFnZXIuaGVscGVyLnJlcGxhY2VUYWdzKGRhdGEuZG9jKSxcbiAgICAgICAgICBvcmlnaW46IGRhdGEub3JpZ2luLFxuICAgICAgICAgIHR5cGU6IHRoaXMubWFuYWdlci5oZWxwZXIuZm9ybWF0VHlwZShkYXRhKSxcbiAgICAgICAgICB1cmw6IGRhdGEudXJsIHx8ICcnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzaG93KCkge1xuXG4gICAgaWYgKCF0aGlzLm1hcmtlcikge1xuXG4gICAgICBsZXQgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgICAgbGV0IGN1cnNvciA9IGVkaXRvci5nZXRMYXN0Q3Vyc29yKCk7XG5cbiAgICAgIGlmICghZWRpdG9yIHx8ICFjdXJzb3IpIHtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMubWFya2VyID0gY3Vyc29yLmdldE1hcmtlcigpO1xuXG4gICAgICBpZiAoIXRoaXMubWFya2VyKSB7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm92ZXJsYXlEZWNvcmF0aW9uID0gZWRpdG9yLmRlY29yYXRlTWFya2VyKHRoaXMubWFya2VyLCB7XG5cbiAgICAgICAgdHlwZTogJ292ZXJsYXknLFxuICAgICAgICBpdGVtOiB0aGlzLnZpZXcsXG4gICAgICAgIGNsYXNzOiAnYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbicsXG4gICAgICAgIHBvc2l0aW9uOiAndGFsZScsXG4gICAgICAgIGludmFsaWRhdGU6ICd0b3VjaCdcbiAgICAgIH0pO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgdGhpcy5tYXJrZXIuc2V0UHJvcGVydGllcyh7XG5cbiAgICAgICAgdHlwZTogJ292ZXJsYXknLFxuICAgICAgICBpdGVtOiB0aGlzLnZpZXcsXG4gICAgICAgIGNsYXNzOiAnYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbicsXG4gICAgICAgIHBvc2l0aW9uOiAndGFsZScsXG4gICAgICAgIGludmFsaWRhdGU6ICd0b3VjaCdcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3lPdmVybGF5KCkge1xuXG4gICAgaWYgKHRoaXMub3ZlcmxheURlY29yYXRpb24pIHtcblxuICAgICAgdGhpcy5vdmVybGF5RGVjb3JhdGlvbi5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy5vdmVybGF5RGVjb3JhdGlvbiA9IG51bGw7XG4gICAgdGhpcy5tYXJrZXIgPSBudWxsO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIHRoaXMuZGVzdHJveU92ZXJsYXkoKTtcbiAgICB0aGlzLnZpZXcuZGVzdHJveSgpO1xuICAgIHRoaXMudmlldyA9IHVuZGVmaW5lZDtcbiAgfVxufVxuIl19
//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/lib/atom-ternjs-documentation.js
