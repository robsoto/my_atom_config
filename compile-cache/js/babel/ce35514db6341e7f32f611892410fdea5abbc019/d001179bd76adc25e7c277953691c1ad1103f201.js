"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var PackageConfig = (function () {
  function PackageConfig(manager) {
    _classCallCheck(this, PackageConfig);

    this.manager = manager;

    this.disposables = [];
    this.options = {

      excludeLowerPriority: atom.config.get('atom-ternjs.excludeLowerPriorityProviders'),
      inlineFnCompletion: atom.config.get('atom-ternjs.inlineFnCompletion'),
      useSnippets: atom.config.get('atom-ternjs.useSnippets'),
      displayAboveSnippets: atom.config.get('atom-ternjs.displayAboveSnippets'),
      useSnippetsAndFunction: atom.config.get('atom-ternjs.useSnippetsAndFunction'),
      sort: atom.config.get('atom-ternjs.sort'),
      guess: atom.config.get('atom-ternjs.guess'),
      urls: atom.config.get('atom-ternjs.urls'),
      origins: atom.config.get('atom-ternjs.origins'),
      caseInsensitive: atom.config.get('atom-ternjs.caseInsensitive'),
      documentation: atom.config.get('atom-ternjs.documentation')
    };

    this.registerEvents();
  }

  _createClass(PackageConfig, [{
    key: 'registerEvents',
    value: function registerEvents() {
      var _this = this;

      this.disposables.push(atom.config.observe('atom-ternjs.excludeLowerPriorityProviders', function (value) {

        _this.options.excludeLowerPriority = value;

        if (_this.manager.provider) {

          _this.manager.provider.excludeLowerPriority = value;
        }
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.inlineFnCompletion', function (value) {

        _this.options.inlineFnCompletion = value;

        if (_this.manager.type) {

          _this.manager.type.destroyOverlay();
        }
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.useSnippets', function (value) {

        _this.options.useSnippets = value;

        if (!value) {

          return;
        }
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.useSnippetsAndFunction', function (value) {

        _this.options.useSnippetsAndFunction = value;

        if (!value) {

          return;
        }
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.sort', function (value) {

        _this.options.sort = value;
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.guess', function (value) {

        _this.options.guess = value;
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.urls', function (value) {

        _this.options.urls = value;
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.origins', function (value) {

        _this.options.origins = value;
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.caseInsensitive', function (value) {

        _this.options.caseInsensitive = value;
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.documentation', function (value) {

        _this.options.documentation = value;
      }));
    }
  }, {
    key: 'unregisterEvents',
    value: function unregisterEvents() {

      for (var disposable of this.disposables) {

        disposable.dispose();
      }

      this.disposables = [];
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      this.unregisterEvents();
    }
  }]);

  return PackageConfig;
})();

exports['default'] = PackageConfig;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Jzb3RvLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1wYWNrYWdlLWNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7SUFFUyxhQUFhO0FBRXJCLFdBRlEsYUFBYSxDQUVwQixPQUFPLEVBQUU7MEJBRkYsYUFBYTs7QUFJOUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7O0FBRXZCLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxPQUFPLEdBQUc7O0FBRWIsMEJBQW9CLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMkNBQTJDLENBQUM7QUFDbEYsd0JBQWtCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUM7QUFDckUsaUJBQVcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQztBQUN2RCwwQkFBb0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsQ0FBQztBQUN6RSw0QkFBc0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQztBQUM3RSxVQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7QUFDekMsV0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDO0FBQzNDLFVBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztBQUN6QyxhQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUM7QUFDL0MscUJBQWUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQztBQUMvRCxtQkFB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QUMsQ0FBQzs7QUFFSixVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsRUFBRSxVQUFDLEtBQUssRUFBSzs7QUFFaEYsY0FBSyxPQUFPLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztPQUNwQyxDQUFDLENBQUMsQ0FBQztLQUNMOzs7V0FFZSw0QkFBRzs7QUFFakIsV0FBSyxJQUFJLFVBQVUsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFOztBQUV2QyxrQkFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQ3RCOztBQUVELFVBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0tBQ3ZCOzs7V0FFTSxtQkFBRzs7QUFFUixVQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztLQUN6Qjs7O1NBL0drQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9yc290by8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcGFja2FnZS1jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWNrYWdlQ29uZmlnIHtcblxuICBjb25zdHJ1Y3RvcihtYW5hZ2VyKSB7XG5cbiAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuICAgIHRoaXMub3B0aW9ucyA9IHtcblxuICAgICAgZXhjbHVkZUxvd2VyUHJpb3JpdHk6IGF0b20uY29uZmlnLmdldCgnYXRvbS10ZXJuanMuZXhjbHVkZUxvd2VyUHJpb3JpdHlQcm92aWRlcnMnKSxcbiAgICAgIGlubGluZUZuQ29tcGxldGlvbjogYXRvbS5jb25maWcuZ2V0KCdhdG9tLXRlcm5qcy5pbmxpbmVGbkNvbXBsZXRpb24nKSxcbiAgICAgIHVzZVNuaXBwZXRzOiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tdGVybmpzLnVzZVNuaXBwZXRzJyksXG4gICAgICBkaXNwbGF5QWJvdmVTbmlwcGV0czogYXRvbS5jb25maWcuZ2V0KCdhdG9tLXRlcm5qcy5kaXNwbGF5QWJvdmVTbmlwcGV0cycpLFxuICAgICAgdXNlU25pcHBldHNBbmRGdW5jdGlvbjogYXRvbS5jb25maWcuZ2V0KCdhdG9tLXRlcm5qcy51c2VTbmlwcGV0c0FuZEZ1bmN0aW9uJyksXG4gICAgICBzb3J0OiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tdGVybmpzLnNvcnQnKSxcbiAgICAgIGd1ZXNzOiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tdGVybmpzLmd1ZXNzJyksXG4gICAgICB1cmxzOiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tdGVybmpzLnVybHMnKSxcbiAgICAgIG9yaWdpbnM6IGF0b20uY29uZmlnLmdldCgnYXRvbS10ZXJuanMub3JpZ2lucycpLFxuICAgICAgY2FzZUluc2Vuc2l0aXZlOiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tdGVybmpzLmNhc2VJbnNlbnNpdGl2ZScpLFxuICAgICAgZG9jdW1lbnRhdGlvbjogYXRvbS5jb25maWcuZ2V0KCdhdG9tLXRlcm5qcy5kb2N1bWVudGF0aW9uJylcbiAgICB9O1xuXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50cygpO1xuICB9XG5cbiAgcmVnaXN0ZXJFdmVudHMoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMuZXhjbHVkZUxvd2VyUHJpb3JpdHlQcm92aWRlcnMnLCAodmFsdWUpID0+IHtcblxuICAgICAgdGhpcy5vcHRpb25zLmV4Y2x1ZGVMb3dlclByaW9yaXR5ID0gdmFsdWU7XG5cbiAgICAgIGlmICh0aGlzLm1hbmFnZXIucHJvdmlkZXIpIHtcblxuICAgICAgICB0aGlzLm1hbmFnZXIucHJvdmlkZXIuZXhjbHVkZUxvd2VyUHJpb3JpdHkgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMuaW5saW5lRm5Db21wbGV0aW9uJywgKHZhbHVlKSA9PiB7XG5cbiAgICAgIHRoaXMub3B0aW9ucy5pbmxpbmVGbkNvbXBsZXRpb24gPSB2YWx1ZTtcblxuICAgICAgaWYgKHRoaXMubWFuYWdlci50eXBlKSB7XG5cbiAgICAgICAgdGhpcy5tYW5hZ2VyLnR5cGUuZGVzdHJveU92ZXJsYXkoKTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMudXNlU25pcHBldHMnLCAodmFsdWUpID0+IHtcblxuICAgICAgdGhpcy5vcHRpb25zLnVzZVNuaXBwZXRzID0gdmFsdWU7XG5cbiAgICAgIGlmICghdmFsdWUpIHtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLnVzZVNuaXBwZXRzQW5kRnVuY3Rpb24nLCAodmFsdWUpID0+IHtcblxuICAgICAgdGhpcy5vcHRpb25zLnVzZVNuaXBwZXRzQW5kRnVuY3Rpb24gPSB2YWx1ZTtcblxuICAgICAgaWYgKCF2YWx1ZSkge1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMuc29ydCcsICh2YWx1ZSkgPT4ge1xuXG4gICAgICB0aGlzLm9wdGlvbnMuc29ydCA9IHZhbHVlO1xuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLXRlcm5qcy5ndWVzcycsICh2YWx1ZSkgPT4ge1xuXG4gICAgICB0aGlzLm9wdGlvbnMuZ3Vlc3MgPSB2YWx1ZTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMudXJscycsICh2YWx1ZSkgPT4ge1xuXG4gICAgICB0aGlzLm9wdGlvbnMudXJscyA9IHZhbHVlO1xuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLXRlcm5qcy5vcmlnaW5zJywgKHZhbHVlKSA9PiB7XG5cbiAgICAgIHRoaXMub3B0aW9ucy5vcmlnaW5zID0gdmFsdWU7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLmNhc2VJbnNlbnNpdGl2ZScsICh2YWx1ZSkgPT4ge1xuXG4gICAgICB0aGlzLm9wdGlvbnMuY2FzZUluc2Vuc2l0aXZlID0gdmFsdWU7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLmRvY3VtZW50YXRpb24nLCAodmFsdWUpID0+IHtcblxuICAgICAgdGhpcy5vcHRpb25zLmRvY3VtZW50YXRpb24gPSB2YWx1ZTtcbiAgICB9KSk7XG4gIH1cblxuICB1bnJlZ2lzdGVyRXZlbnRzKCkge1xuXG4gICAgZm9yIChsZXQgZGlzcG9zYWJsZSBvZiB0aGlzLmRpc3Bvc2FibGVzKSB7XG5cbiAgICAgIGRpc3Bvc2FibGUuZGlzcG9zZSgpO1xuICAgIH1cblxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICB0aGlzLnVucmVnaXN0ZXJFdmVudHMoKTtcbiAgfVxufVxuIl19
//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/lib/atom-ternjs-package-config.js
