(function() {
  var ScopeSelector, cache;

  ScopeSelector = null;

  cache = {};

  exports.get = function(selector) {
    var scopeSelector;
    scopeSelector = cache[selector];
    if (scopeSelector == null) {
      if (ScopeSelector == null) {
        ScopeSelector = require('first-mate').ScopeSelector;
      }
      scopeSelector = new ScopeSelector(selector);
      cache[selector] = scopeSelector;
    }
    return scopeSelector;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYnJhY2tldC1tYXRjaGVyL2xpYi9zZWxlY3Rvci1jYWNoZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0JBQUE7O0FBQUEsRUFBQSxhQUFBLEdBQWdCLElBQWhCLENBQUE7O0FBQUEsRUFDQSxLQUFBLEdBQVEsRUFEUixDQUFBOztBQUFBLEVBR0EsT0FBTyxDQUFDLEdBQVIsR0FBYyxTQUFDLFFBQUQsR0FBQTtBQUNaLFFBQUEsYUFBQTtBQUFBLElBQUEsYUFBQSxHQUFnQixLQUFNLENBQUEsUUFBQSxDQUF0QixDQUFBO0FBQ0EsSUFBQSxJQUFPLHFCQUFQOztRQUNFLGdCQUFpQixPQUFBLENBQVEsWUFBUixDQUFxQixDQUFDO09BQXZDO0FBQUEsTUFDQSxhQUFBLEdBQW9CLElBQUEsYUFBQSxDQUFjLFFBQWQsQ0FEcEIsQ0FBQTtBQUFBLE1BRUEsS0FBTSxDQUFBLFFBQUEsQ0FBTixHQUFrQixhQUZsQixDQURGO0tBREE7V0FLQSxjQU5ZO0VBQUEsQ0FIZCxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/rsoto/.atom/packages/bracket-matcher/lib/selector-cache.coffee
