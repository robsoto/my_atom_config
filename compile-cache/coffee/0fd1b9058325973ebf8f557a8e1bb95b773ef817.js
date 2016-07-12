(function() {
  describe('Linter Behavior', function() {
    var bottomContainer, getLinter, getMessage, linter, linterState, trigger, _ref;
    linter = null;
    linterState = null;
    bottomContainer = null;
    _ref = require('./common'), getLinter = _ref.getLinter, trigger = _ref.trigger;
    getMessage = function(type, filePath) {
      return {
        type: type,
        text: 'Some Message',
        filePath: filePath,
        range: [[0, 0], [1, 1]]
      };
    };
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          linter = atom.packages.getActivePackage('linter').mainModule.instance;
          linterState = linter.state;
          return bottomContainer = linter.views.bottomContainer;
        });
      });
    });
    describe('Bottom Tabs', function() {
      it('defaults to file tab', function() {
        return expect(linterState.scope).toBe('File');
      });
      it('changes tab on click', function() {
        trigger(bottomContainer.getTab('Project'), 'click');
        return expect(linterState.scope).toBe('Project');
      });
      it('toggles panel visibility on click', function() {
        var timesCalled;
        timesCalled = 0;
        bottomContainer.onShouldTogglePanel(function() {
          return ++timesCalled;
        });
        trigger(bottomContainer.getTab('Project'), 'click');
        expect(timesCalled).toBe(0);
        trigger(bottomContainer.getTab('Project'), 'click');
        return expect(timesCalled).toBe(1);
      });
      it('re-enables panel when another tab is clicked', function() {
        var timesCalled;
        timesCalled = 0;
        bottomContainer.onShouldTogglePanel(function() {
          return ++timesCalled;
        });
        trigger(bottomContainer.getTab('File'), 'click');
        expect(timesCalled).toBe(1);
        trigger(bottomContainer.getTab('Project'), 'click');
        return expect(timesCalled).toBe(1);
      });
      return it('updates count on pane change', function() {
        var messages, provider;
        provider = getLinter();
        expect(bottomContainer.getTab('File').count).toBe(0);
        messages = [getMessage('Error', __dirname + '/fixtures/file.txt')];
        linter.setMessages(provider, messages);
        linter.messages.updatePublic();
        return waitsForPromise(function() {
          return atom.workspace.open('file.txt').then(function() {
            expect(bottomContainer.getTab('File').count).toBe(1);
            expect(linter.views.bottomPanel.getVisibility()).toBe(true);
            return atom.workspace.open('/tmp/non-existing-file');
          }).then(function() {
            expect(bottomContainer.getTab('File').count).toBe(0);
            return expect(linter.views.bottomPanel.getVisibility()).toBe(false);
          });
        });
      });
    });
    return describe('Markers', function() {
      return it('automatically marks files when they are opened if they have any markers', function() {
        var messages, provider;
        provider = getLinter();
        messages = [getMessage('Error', '/etc/passwd')];
        linter.setMessages(provider, messages);
        linter.messages.updatePublic();
        return waitsForPromise(function() {
          return atom.workspace.open('/etc/passwd').then(function() {
            var activeEditor;
            activeEditor = atom.workspace.getActiveTextEditor();
            return expect(activeEditor.getMarkers().length > 0).toBe(true);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvbGludGVyLWJlaGF2aW9yLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsUUFBQSwwRUFBQTtBQUFBLElBQUEsTUFBQSxHQUFTLElBQVQsQ0FBQTtBQUFBLElBQ0EsV0FBQSxHQUFjLElBRGQsQ0FBQTtBQUFBLElBRUEsZUFBQSxHQUFrQixJQUZsQixDQUFBO0FBQUEsSUFHQSxPQUF1QixPQUFBLENBQVEsVUFBUixDQUF2QixFQUFDLGlCQUFBLFNBQUQsRUFBWSxlQUFBLE9BSFosQ0FBQTtBQUFBLElBS0EsVUFBQSxHQUFhLFNBQUMsSUFBRCxFQUFPLFFBQVAsR0FBQTtBQUNYLGFBQU87QUFBQSxRQUFDLE1BQUEsSUFBRDtBQUFBLFFBQU8sSUFBQSxFQUFNLGNBQWI7QUFBQSxRQUE2QixVQUFBLFFBQTdCO0FBQUEsUUFBdUMsS0FBQSxFQUFPLENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULENBQTlDO09BQVAsQ0FEVztJQUFBLENBTGIsQ0FBQTtBQUFBLElBUUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFFBQTlCLENBQXVDLENBQUMsSUFBeEMsQ0FBNkMsU0FBQSxHQUFBO0FBQzNDLFVBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0IsUUFBL0IsQ0FBd0MsQ0FBQyxVQUFVLENBQUMsUUFBN0QsQ0FBQTtBQUFBLFVBQ0EsV0FBQSxHQUFjLE1BQU0sQ0FBQyxLQURyQixDQUFB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

//# sourceURL=/home/rsoto/.atom/packages/linter/spec/linter-behavior-spec.coffee
