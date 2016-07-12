(function() {
  var BracketMatcher, BracketMatcherView;

  BracketMatcherView = null;

  BracketMatcher = null;

  module.exports = {
    activate: function() {
      return atom.workspace.observeTextEditors(function(editor) {
        var editorElement;
        editorElement = atom.views.getView(editor);
        if (BracketMatcherView == null) {
          BracketMatcherView = require('./bracket-matcher-view');
        }
        new BracketMatcherView(editor, editorElement);
        if (BracketMatcher == null) {
          BracketMatcher = require('./bracket-matcher');
        }
        return new BracketMatcher(editor, editorElement);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYnJhY2tldC1tYXRjaGVyL2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQ0FBQTs7QUFBQSxFQUFBLGtCQUFBLEdBQXFCLElBQXJCLENBQUE7O0FBQUEsRUFDQSxjQUFBLEdBQWlCLElBRGpCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxTQUFDLE1BQUQsR0FBQTtBQUNoQyxZQUFBLGFBQUE7QUFBQSxRQUFBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBQWhCLENBQUE7O1VBRUEscUJBQXNCLE9BQUEsQ0FBUSx3QkFBUjtTQUZ0QjtBQUFBLFFBR0ksSUFBQSxrQkFBQSxDQUFtQixNQUFuQixFQUEyQixhQUEzQixDQUhKLENBQUE7O1VBS0EsaUJBQWtCLE9BQUEsQ0FBUSxtQkFBUjtTQUxsQjtlQU1JLElBQUEsY0FBQSxDQUFlLE1BQWYsRUFBdUIsYUFBdkIsRUFQNEI7TUFBQSxDQUFsQyxFQURRO0lBQUEsQ0FBVjtHQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/rsoto/.atom/packages/bracket-matcher/lib/main.coffee
