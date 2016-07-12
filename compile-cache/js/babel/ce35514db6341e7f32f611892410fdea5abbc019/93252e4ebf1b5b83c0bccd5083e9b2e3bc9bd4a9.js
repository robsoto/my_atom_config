"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Function = require('loophole').Function;
var _ = require('underscore-plus');

var REGEXP_LINE = /(([\$\w]+[\w-]*)|([.:;'"[{( ]+))$/g;

var Provider = (function () {
  function Provider(manager) {
    _classCallCheck(this, Provider);

    this.manager = undefined;
    this.force = false;

    // automcomplete-plus
    this.selector = '.source.js';
    this.disableForSelector = '.source.js .comment';
    this.inclusionPriority = 1;
    this.excludeLowerPriority = false;

    this.line = undefined;
    this.lineMatchResult = undefined;
    this.tempPrefix = undefined;
    this.suggestionsArr = undefined;
    this.suggestion = undefined;
    this.suggestionClone = undefined;
  }

  _createClass(Provider, [{
    key: 'init',
    value: function init(manager) {

      this.manager = manager;
      this.excludeLowerPriority = this.manager.packageConfig.options.excludeLowerPriorityProviders;

      if (this.manager.packageConfig.options.displayAboveSnippets) {

        this.suggestionPriority = 2;
      }
    }
  }, {
    key: 'isValidPrefix',
    value: function isValidPrefix(prefix, prefixLast) {

      if (prefixLast === undefined) {

        return false;
      }

      if (prefixLast === '\.') {

        return true;
      }

      if (prefixLast.match(/;|\s/)) {

        return false;
      }

      if (prefix.length > 1) {

        prefix = '_' + prefix;
      }

      try {

        new Function('var ' + prefix)();
      } catch (e) {

        return false;
      }

      return true;
    }
  }, {
    key: 'checkPrefix',
    value: function checkPrefix(prefix) {

      if (prefix.match(/(\s|;|\.|\"|\')$/) || prefix.replace(/\s/g, '').length === 0) {

        return '';
      }

      return prefix;
    }
  }, {
    key: 'getPrefix',
    value: function getPrefix(editor, bufferPosition) {

      this.line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      this.lineMatchResult = this.line.match(REGEXP_LINE);

      if (this.lineMatchResult) {

        return this.lineMatchResult[0];
      }
    }
  }, {
    key: 'getSuggestions',
    value: function getSuggestions(_ref) {
      var _this = this;

      var editor = _ref.editor;
      var bufferPosition = _ref.bufferPosition;
      var scopeDescriptor = _ref.scopeDescriptor;
      var prefix = _ref.prefix;
      var activatedManually = _ref.activatedManually;

      return new Promise(function (resolve) {

        if (!_this.manager.client) {

          return resolve([]);
        }

        _this.tempPrefix = _this.getPrefix(editor, bufferPosition) || prefix;

        if (!_this.isValidPrefix(_this.tempPrefix, _this.tempPrefix[_this.tempPrefix.length - 1]) && !_this.force && !activatedManually) {

          return resolve([]);
        }

        prefix = _this.checkPrefix(_this.tempPrefix);

        _this.manager.client.update(editor).then(function (data) {

          if (!data) {

            return resolve([]);
          }

          _this.manager.client.completions(atom.project.relativizePath(editor.getURI())[1], {

            line: bufferPosition.row,
            ch: bufferPosition.column

          }).then(function (data) {

            if (!data) {

              return resolve([]);
            }

            if (!data.completions.length) {

              return resolve([]);
            }

            _this.suggestionsArr = [];

            var scopesPath = scopeDescriptor.getScopesArray();
            var isInFunDef = scopesPath.indexOf('meta.function.js') > -1;

            for (var obj of data.completions) {

              obj = _this.manager.helper.formatTypeCompletion(obj, isInFunDef);

              _this.suggestion = {

                text: obj.name,
                replacementPrefix: prefix,
                className: null,
                type: obj._typeSelf,
                leftLabel: obj.leftLabel,
                snippet: obj._snippet,
                displayText: obj._displayText,
                description: obj.doc || null,
                descriptionMoreURL: obj.url || null
              };

              if (_this.manager.packageConfig.options.useSnippetsAndFunction && obj._hasParams) {

                _this.suggestionClone = _.clone(_this.suggestion);
                _this.suggestionClone.type = 'snippet';

                if (obj._hasParams) {

                  _this.suggestion.snippet = obj.name + '(${0:})';
                } else {

                  _this.suggestion.snippet = obj.name + '()';
                }

                _this.suggestionsArr.push(_this.suggestion);
                _this.suggestionsArr.push(_this.suggestionClone);
              } else {

                _this.suggestionsArr.push(_this.suggestion);
              }
            }

            resolve(_this.suggestionsArr);
          })['catch'](function (err) {

            console.log(err);
            resolve([]);
          });
        });
      });
    }
  }, {
    key: 'forceCompletion',
    value: function forceCompletion() {

      this.force = true;
      atom.commands.dispatch(atom.views.getView(atom.workspace.getActiveTextEditor()), 'autocomplete-plus:activate');
      this.force = false;
    }
  }]);

  return Provider;
})();

exports['default'] = Provider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Jzb3RvLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7QUFFWixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDO0FBQzVDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOztBQUVuQyxJQUFNLFdBQVcsR0FBRyxvQ0FBb0MsQ0FBQzs7SUFFcEMsUUFBUTtBQUVoQixXQUZRLFFBQVEsQ0FFZixPQUFPLEVBQUU7MEJBRkYsUUFBUTs7QUFJekIsUUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFDekIsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7OztBQUduQixRQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQztBQUM3QixRQUFJLENBQUMsa0JBQWtCLEdBQUcscUJBQXFCLENBQUM7QUFDaEQsUUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQztBQUMzQixRQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDOztBQUVsQyxRQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztBQUN0QixRQUFJLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztBQUNqQyxRQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztBQUM1QixRQUFJLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQztBQUNoQyxRQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztBQUM1QixRQUFJLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztHQUNsQzs7ZUFuQmtCLFFBQVE7O1dBcUJ2QixjQUFDLE9BQU8sRUFBRTs7QUFFWixVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixVQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FB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aEIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztBQUMvRyxVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjs7O1NBOUxrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiIvaG9tZS9yc290by8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5sZXQgRnVuY3Rpb24gPSByZXF1aXJlKCdsb29waG9sZScpLkZ1bmN0aW9uO1xubGV0IF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlLXBsdXMnKTtcblxuY29uc3QgUkVHRVhQX0xJTkUgPSAvKChbXFwkXFx3XStbXFx3LV0qKXwoWy46OydcIlt7KCBdKykpJC9nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm92aWRlciB7XG5cbiAgY29uc3RydWN0b3IobWFuYWdlcikge1xuXG4gICAgdGhpcy5tYW5hZ2VyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZm9yY2UgPSBmYWxzZTtcblxuICAgIC8vIGF1dG9tY29tcGxldGUtcGx1c1xuICAgIHRoaXMuc2VsZWN0b3IgPSAnLnNvdXJjZS5qcyc7XG4gICAgdGhpcy5kaXNhYmxlRm9yU2VsZWN0b3IgPSAnLnNvdXJjZS5qcyAuY29tbWVudCc7XG4gICAgdGhpcy5pbmNsdXNpb25Qcmlvcml0eSA9IDE7XG4gICAgdGhpcy5leGNsdWRlTG93ZXJQcmlvcml0eSA9IGZhbHNlO1xuXG4gICAgdGhpcy5saW5lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMubGluZU1hdGNoUmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudGVtcFByZWZpeCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnN1Z2dlc3Rpb25zQXJyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc3VnZ2VzdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnN1Z2dlc3Rpb25DbG9uZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGluaXQobWFuYWdlcikge1xuXG4gICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICB0aGlzLmV4Y2x1ZGVMb3dlclByaW9yaXR5ID0gdGhpcy5tYW5hZ2VyLnBhY2thZ2VDb25maWcub3B0aW9ucy5leGNsdWRlTG93ZXJQcmlvcml0eVByb3ZpZGVycztcblxuICAgIGlmICh0aGlzLm1hbmFnZXIucGFja2FnZUNvbmZpZy5vcHRpb25zLmRpc3BsYXlBYm92ZVNuaXBwZXRzKSB7XG5cbiAgICAgIHRoaXMuc3VnZ2VzdGlvblByaW9yaXR5ID0gMjtcbiAgICB9XG4gIH1cblxuICBpc1ZhbGlkUHJlZml4KHByZWZpeCwgcHJlZml4TGFzdCkge1xuXG4gICAgaWYgKHByZWZpeExhc3QgPT09IHVuZGVmaW5lZCkge1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHByZWZpeExhc3QgPT09ICdcXC4nKSB7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChwcmVmaXhMYXN0Lm1hdGNoKC87fFxccy8pKSB7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAocHJlZml4Lmxlbmd0aCA+IDEpIHtcblxuICAgICAgcHJlZml4ID0gYF8ke3ByZWZpeH1gO1xuICAgIH1cblxuICAgIHRyeSB7XG5cbiAgICAgIChuZXcgRnVuY3Rpb24oYHZhciAke3ByZWZpeH1gKSkoKTtcblxuICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY2hlY2tQcmVmaXgocHJlZml4KSB7XG5cbiAgICBpZiAocHJlZml4Lm1hdGNoKC8oXFxzfDt8XFwufFxcXCJ8XFwnKSQvKSB8fCBwcmVmaXgucmVwbGFjZSgvXFxzL2csICcnKS5sZW5ndGggPT09IDApIHtcblxuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHJldHVybiBwcmVmaXg7XG4gIH1cblxuICBnZXRQcmVmaXgoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikge1xuXG4gICAgdGhpcy5saW5lID0gZWRpdG9yLmdldFRleHRJblJhbmdlKFtbYnVmZmVyUG9zaXRpb24ucm93LCAwXSwgYnVmZmVyUG9zaXRpb25dKTtcbiAgICB0aGlzLmxpbmVNYXRjaFJlc3VsdCA9IHRoaXMubGluZS5tYXRjaChSRUdFWFBfTElORSk7XG5cbiAgICBpZiAodGhpcy5saW5lTWF0Y2hSZXN1bHQpIHtcblxuICAgICAgcmV0dXJuIHRoaXMubGluZU1hdGNoUmVzdWx0WzBdO1xuICAgIH1cbiAgfVxuXG4gIGdldFN1Z2dlc3Rpb25zKHtlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBzY29wZURlc2NyaXB0b3IsIHByZWZpeCwgYWN0aXZhdGVkTWFudWFsbHl9KSB7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblxuICAgICAgaWYgKCF0aGlzLm1hbmFnZXIuY2xpZW50KSB7XG5cbiAgICAgICAgcmV0dXJuIHJlc29sdmUoW10pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRlbXBQcmVmaXggPSB0aGlzLmdldFByZWZpeChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSB8fCBwcmVmaXg7XG5cbiAgICAgIGlmICghdGhpcy5pc1ZhbGlkUHJlZml4KHRoaXMudGVtcFByZWZpeCwgdGhpcy50ZW1wUHJlZml4W3RoaXMudGVtcFByZWZpeC5sZW5ndGggLSAxXSkgJiYgIXRoaXMuZm9yY2UgJiYgIWFjdGl2YXRlZE1hbnVhbGx5KSB7XG5cbiAgICAgICAgcmV0dXJuIHJlc29sdmUoW10pO1xuICAgICAgfVxuXG4gICAgICBwcmVmaXggPSB0aGlzLmNoZWNrUHJlZml4KHRoaXMudGVtcFByZWZpeCk7XG5cbiAgICAgIHRoaXMubWFuYWdlci5jbGllbnQudXBkYXRlKGVkaXRvcikudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgIGlmICghZGF0YSkge1xuXG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tYW5hZ2VyLmNsaWVudC5jb21wbGV0aW9ucyhhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKVsxXSwge1xuXG4gICAgICAgICAgbGluZTogYnVmZmVyUG9zaXRpb24ucm93LFxuICAgICAgICAgIGNoOiBidWZmZXJQb3NpdGlvbi5jb2x1bW5cblxuICAgICAgICB9KS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICBpZiAoIWRhdGEpIHtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoW10pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghZGF0YS5jb21wbGV0aW9ucy5sZW5ndGgpIHtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoW10pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbnNBcnIgPSBbXTtcblxuICAgICAgICAgIGxldCBzY29wZXNQYXRoID0gc2NvcGVEZXNjcmlwdG9yLmdldFNjb3Blc0FycmF5KCk7XG4gICAgICAgICAgbGV0IGlzSW5GdW5EZWYgPSBzY29wZXNQYXRoLmluZGV4T2YoJ21ldGEuZnVuY3Rpb24uanMnKSA+IC0xO1xuXG4gICAgICAgICAgZm9yIChsZXQgb2JqIG9mIGRhdGEuY29tcGxldGlvbnMpIHtcblxuICAgICAgICAgICAgb2JqID0gdGhpcy5tYW5hZ2VyLmhlbHBlci5mb3JtYXRUeXBlQ29tcGxldGlvbihvYmosIGlzSW5GdW5EZWYpO1xuXG4gICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb24gPSB7XG5cbiAgICAgICAgICAgICAgdGV4dDogb2JqLm5hbWUsXG4gICAgICAgICAgICAgIHJlcGxhY2VtZW50UHJlZml4OiBwcmVmaXgsXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICAgICAgICAgICAgdHlwZTogb2JqLl90eXBlU2VsZixcbiAgICAgICAgICAgICAgbGVmdExhYmVsOiBvYmoubGVmdExhYmVsLFxuICAgICAgICAgICAgICBzbmlwcGV0OiBvYmouX3NuaXBwZXQsXG4gICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBvYmouX2Rpc3BsYXlUZXh0LFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogb2JqLmRvYyB8fCBudWxsLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbk1vcmVVUkw6IG9iai51cmwgfHwgbnVsbFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHRoaXMubWFuYWdlci5wYWNrYWdlQ29uZmlnLm9wdGlvbnMudXNlU25pcHBldHNBbmRGdW5jdGlvbiAmJiBvYmouX2hhc1BhcmFtcykge1xuXG4gICAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbkNsb25lID0gXy5jbG9uZSh0aGlzLnN1Z2dlc3Rpb24pO1xuICAgICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25DbG9uZS50eXBlID0gJ3NuaXBwZXQnO1xuXG4gICAgICAgICAgICAgIGlmIChvYmouX2hhc1BhcmFtcykge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uLnNuaXBwZXQgPSBgJHtvYmoubmFtZX0oJFxcezA6XFx9KWA7XG5cbiAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbi5zbmlwcGV0ID0gYCR7b2JqLm5hbWV9KClgO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uc0Fyci5wdXNoKHRoaXMuc3VnZ2VzdGlvbik7XG4gICAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbnNBcnIucHVzaCh0aGlzLnN1Z2dlc3Rpb25DbG9uZSk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uc0Fyci5wdXNoKHRoaXMuc3VnZ2VzdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZSh0aGlzLnN1Z2dlc3Rpb25zQXJyKTtcblxuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG5cbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgIHJlc29sdmUoW10pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZm9yY2VDb21wbGV0aW9uKCkge1xuXG4gICAgdGhpcy5mb3JjZSA9IHRydWU7XG4gICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKSwgJ2F1dG9jb21wbGV0ZS1wbHVzOmFjdGl2YXRlJyk7XG4gICAgdGhpcy5mb3JjZSA9IGZhbHNlO1xuICB9XG59XG4iXX0=
//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/lib/atom-ternjs-provider.js
