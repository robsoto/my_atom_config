(function() {
  var LinterTern;

  LinterTern = (function() {
    LinterTern.prototype.name = 'Tern';

    LinterTern.prototype.grammarScopes = ['source.js'];

    LinterTern.prototype.scope = 'file';

    LinterTern.prototype.lintOnFly = true;

    LinterTern.prototype.manager = null;

    function LinterTern(manager) {
      this.manager = manager;
      if (!this.manager) {
        return;
      }
    }

    LinterTern.prototype.lint = function(textEditor) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var URI, buffer, messages, text, _ref, _ref1, _ref2, _ref3;
          if (!((_ref = _this.manager.config) != null ? (_ref1 = _ref.config) != null ? (_ref2 = _ref1.plugins.lint) != null ? _ref2.active : void 0 : void 0 : void 0)) {
            return resolve([]);
          }
          if (!_this.manager.server) {
            return resolve([]);
          }
          messages = [];
          buffer = textEditor.getBuffer();
          URI = atom.project.relativizePath(textEditor.getURI())[1];
          text = textEditor.getText();
          return (_ref3 = _this.manager.client) != null ? _ref3.update(textEditor).then(function(data) {
            return _this.manager.client.lint(URI, text).then(function(data) {
              var message, positionFrom, positionTo, _i, _len, _ref4;
              if (!(data != null ? data.messages : void 0)) {
                return resolve([]);
              }
              _ref4 = data.messages;
              for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
                message = _ref4[_i];
                positionFrom = buffer.positionForCharacterIndex(message.from);
                positionTo = buffer.positionForCharacterIndex(message.to);
                messages.push({
                  text: message.message,
                  type: message.severity,
                  filePath: buffer.file.path,
                  range: [[positionFrom.row, positionFrom.column], [positionTo.row, positionTo.column]]
                });
              }
              return resolve(messages);
            });
          }) : void 0;
        };
      })(this));
    };

    return LinterTern;

  })();

  module.exports = LinterTern;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2xpbnRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsVUFBQTs7QUFBQSxFQUFNO0FBRUoseUJBQUEsSUFBQSxHQUFNLE1BQU4sQ0FBQTs7QUFBQSx5QkFDQSxhQUFBLEdBQWUsQ0FBQyxXQUFELENBRGYsQ0FBQTs7QUFBQSx5QkFFQSxLQUFBLEdBQU8sTUFGUCxDQUFBOztBQUFBLHlCQUdBLFNBQUEsR0FBVyxJQUhYLENBQUE7O0FBQUEseUJBSUEsT0FBQSxHQUFTLElBSlQsQ0FBQTs7QUFNYSxJQUFBLG9CQUFDLE9BQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxPQUFYLENBQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxJQUFlLENBQUEsT0FBZjtBQUFBLGNBQUEsQ0FBQTtPQUZXO0lBQUEsQ0FOYjs7QUFBQSx5QkFVQSxJQUFBLEdBQU0sU0FBQyxVQUFELEdBQUE7QUFDSixhQUFXLElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDakIsY0FBQSxzREFBQTtBQUFBLFVBQUEsSUFBQSxDQUFBLHFIQUE4RCxDQUFFLGtDQUFoRTtBQUFBLG1CQUFPLE9BQUEsQ0FBUSxFQUFSLENBQVAsQ0FBQTtXQUFBO0FBQ0EsVUFBQSxJQUFBLENBQUEsS0FBMEIsQ0FBQSxPQUFPLENBQUMsTUFBbEM7QUFBQSxtQkFBTyxPQUFBLENBQVEsRUFBUixDQUFQLENBQUE7V0FEQTtBQUFBLFVBR0EsUUFBQSxHQUFXLEVBSFgsQ0FBQTtBQUFBLFVBS0EsTUFBQSxHQUFTLFVBQVUsQ0FBQyxTQUFYLENBQUEsQ0FMVCxDQUFBO0FBQUEsVUFNQSxHQUFBLEdBQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLFVBQVUsQ0FBQyxNQUFYLENBQUEsQ0FBNUIsQ0FBaUQsQ0FBQSxDQUFBLENBTnZELENBQUE7QUFBQSxVQVFBLElBQUEsR0FBTyxVQUFVLENBQUMsT0FBWCxDQUFBLENBUlAsQ0FBQTsrREFTZSxDQUFFLE1BQWpCLENBQXdCLFVBQXhCLENBQW1DLENBQUMsSUFBcEMsQ0FBeUMsU0FBQyxJQUFELEdBQUE7bUJBQ3ZDLEtBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQWhCLENBQXFCLEdBQXJCLEVBQTBCLElBQTFCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsU0FBQyxJQUFELEdBQUE7QUFDbkMsa0JBQUEsa0RBQUE7QUFBQSxjQUFBLElBQUEsQ0FBQSxnQkFBeUIsSUFBSSxDQUFFLGtCQUEvQjtBQUFBLHVCQUFPLE9BQUEsQ0FBUSxFQUFSLENBQVAsQ0FBQTtlQUFBO0FBQ0E7QUFBQSxtQkFBQSw0Q0FBQTtvQ0FBQTtBQUNFLGdCQUFBLFlBQUEsR0FBZSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsT0FBTyxDQUFDLElBQXpDLENBQWYsQ0FBQTtBQUFBLGdCQUNBLFVBQUEsR0FBYSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsT0FBTyxDQUFDLEVBQXpDLENBRGIsQ0FBQTtBQUFBLGdCQUVBLFFBQVEsQ0FBQyxJQUFULENBQ0U7QUFBQSxrQkFBQSxJQUFBLEVBQU0sT0FBTyxDQUFDLE9BQWQ7QUFBQSxrQkFDQSxJQUFBLEVBQU0sT0FBTyxDQUFDLFFBRGQ7QUFBQSxrQkFFQSxRQUFBLEVBQVUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUZ0QjtBQUFBLGtCQUdBLEtBQUEsRUFBTyxDQUNMLENBQUMsWUFBWSxDQUFDLEdBQWQsRUFBbUIsWUFBWSxDQUFDLE1BQWhDLENBREssRUFFTCxDQUFDLFVBQVUsQ0FBQyxHQUFaLEVBQWlCLFVBQVUsQ0FBQyxNQUE1QixDQUZLLENBSFA7aUJBREYsQ0FGQSxDQURGO0FBQUEsZUFEQTtBQVlBLHFCQUFPLE9BQUEsQ0FBUSxRQUFSLENBQVAsQ0FibUM7WUFBQSxDQUFyQyxFQUR1QztVQUFBLENBQXpDLFdBVmlCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBUixDQUFYLENBREk7SUFBQSxDQVZOLENBQUE7O3NCQUFBOztNQUZGLENBQUE7O0FBQUEsRUF1Q0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUF2Q2pCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/lib/linter.coffee
