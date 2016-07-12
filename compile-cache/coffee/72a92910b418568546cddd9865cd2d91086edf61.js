(function() {
  var Tile;

  module.exports = Tile = (function() {
    function Tile(item, priority, collection) {
      this.item = item;
      this.priority = priority;
      this.collection = collection;
    }

    Tile.prototype.getItem = function() {
      return this.item;
    };

    Tile.prototype.getPriority = function() {
      return this.priority;
    };

    Tile.prototype.destroy = function() {
      this.collection.splice(this.collection.indexOf(this), 1);
      return atom.views.getView(this.item).remove();
    };

    return Tile;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvc3RhdHVzLWJhci9saWIvdGlsZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsSUFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLGNBQUUsSUFBRixFQUFTLFFBQVQsRUFBb0IsVUFBcEIsR0FBQTtBQUFpQyxNQUFoQyxJQUFDLENBQUEsT0FBQSxJQUErQixDQUFBO0FBQUEsTUFBekIsSUFBQyxDQUFBLFdBQUEsUUFBd0IsQ0FBQTtBQUFBLE1BQWQsSUFBQyxDQUFBLGFBQUEsVUFBYSxDQUFqQztJQUFBLENBQWI7O0FBQUEsbUJBRUEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxLQURNO0lBQUEsQ0FGVCxDQUFBOztBQUFBLG1CQUtBLFdBQUEsR0FBYSxTQUFBLEdBQUE7YUFDWCxJQUFDLENBQUEsU0FEVTtJQUFBLENBTGIsQ0FBQTs7QUFBQSxtQkFRQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsVUFBVSxDQUFDLE1BQVosQ0FBbUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQW9CLElBQXBCLENBQW5CLEVBQThDLENBQTlDLENBQUEsQ0FBQTthQUNBLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFDLENBQUEsSUFBcEIsQ0FBeUIsQ0FBQyxNQUExQixDQUFBLEVBRk87SUFBQSxDQVJULENBQUE7O2dCQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/rsoto/.atom/packages/status-bar/lib/tile.coffee
