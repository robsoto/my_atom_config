(function() {
  var Linter, Pep8Linter, linterPath,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  linterPath = atom.packages.getLoadedPackage("linter").path;

  console.log(linterPath);

  Linter = require("" + linterPath + "/lib/linter");

  Pep8Linter = (function(_super) {
    __extends(Pep8Linter, _super);

    Pep8Linter.syntax = ['source.python'];

    Pep8Linter.prototype.cmd = 'pep8';

    Pep8Linter.prototype.executablePath = null;

    Pep8Linter.prototype.linterName = 'pep8';

    Pep8Linter.prototype.regex = ':(?<line>\\d+):(?<col>\\d+): ((?<error>E\\d+)|(?<warning>W\\d+)) (?<message>.*?)\n';

    function Pep8Linter(editor) {
      var errorCodes;
      Pep8Linter.__super__.constructor.call(this, editor);
      errorCodes = atom.config.get('linter-python-pep8.ignoreErrorCodes');
      if (errorCodes) {
        this.cmd += " --ignore=" + (errorCodes.toString());
      }
      atom.config.observe('linter-python-pep8.pep8DirToExecutable', (function(_this) {
        return function() {
          return _this.executablePath = atom.config.get('linter-python-pep8.pep8DirToExecutable');
        };
      })(this));
    }

    Pep8Linter.prototype.destroy = function() {
      return atom.config.unobserve('linter-python-pep8.pep8DirToExecutable');
    };

    return Pep8Linter;

  })(Linter);

  module.exports = Pep8Linter;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvbGludGVyLXB5dGhvbi1wZXA4L2xpYi9saW50ZXItcHl0aG9uLXBlcDguY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixRQUEvQixDQUF3QyxDQUFDLElBQXRELENBQUE7O0FBQUEsRUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLFVBQVosQ0FEQSxDQUFBOztBQUFBLEVBRUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxFQUFBLEdBQUcsVUFBSCxHQUFjLGFBQXRCLENBRlQsQ0FBQTs7QUFBQSxFQUlNO0FBQ0osaUNBQUEsQ0FBQTs7QUFBQSxJQUFBLFVBQUMsQ0FBQSxNQUFELEdBQVMsQ0FBQyxlQUFELENBQVQsQ0FBQTs7QUFBQSx5QkFFQSxHQUFBLEdBQUssTUFGTCxDQUFBOztBQUFBLHlCQUlBLGNBQUEsR0FBZ0IsSUFKaEIsQ0FBQTs7QUFBQSx5QkFNQSxVQUFBLEdBQVksTUFOWixDQUFBOztBQUFBLHlCQVNBLEtBQUEsR0FDRSxvRkFWRixDQUFBOztBQWFhLElBQUEsb0JBQUMsTUFBRCxHQUFBO0FBQ1gsVUFBQSxVQUFBO0FBQUEsTUFBQSw0Q0FBTSxNQUFOLENBQUEsQ0FBQTtBQUFBLE1BRUEsVUFBQSxHQUFhLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQ0FBaEIsQ0FGYixDQUFBO0FBSUEsTUFBQSxJQUFHLFVBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxHQUFELElBQVMsWUFBQSxHQUFXLENBQUMsVUFBVSxDQUFDLFFBQVgsQ0FBQSxDQUFELENBQXBCLENBREY7T0FKQTtBQUFBLE1BT0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLHdDQUFwQixFQUE4RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUM1RCxLQUFDLENBQUEsY0FBRCxHQUFrQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0NBQWhCLEVBRDBDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUQsQ0FQQSxDQURXO0lBQUEsQ0FiYjs7QUFBQSx5QkF3QkEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBWixDQUFzQix3Q0FBdEIsRUFETztJQUFBLENBeEJULENBQUE7O3NCQUFBOztLQUR1QixPQUp6QixDQUFBOztBQUFBLEVBZ0NBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBaENqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/rsoto/.atom/packages/linter-python-pep8/lib/linter-python-pep8.coffee
