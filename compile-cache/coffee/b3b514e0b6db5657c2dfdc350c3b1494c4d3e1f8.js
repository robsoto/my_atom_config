(function() {
  describe("Status Bar package", function() {
    var editor, statusBar, statusBarService, workspaceElement, _ref;
    _ref = [], editor = _ref[0], statusBar = _ref[1], statusBarService = _ref[2], workspaceElement = _ref[3];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return waitsForPromise(function() {
        return atom.packages.activatePackage('status-bar').then(function(pack) {
          statusBar = workspaceElement.querySelector("status-bar");
          return statusBarService = pack.mainModule.provideStatusBar();
        });
      });
    });
    describe("@activate()", function() {
      return it("appends only one status bar", function() {
        expect(workspaceElement.querySelectorAll('status-bar').length).toBe(1);
        atom.workspace.getActivePane().splitRight({
          copyActiveItem: true
        });
        return expect(workspaceElement.querySelectorAll('status-bar').length).toBe(1);
      });
    });
    describe("@deactivate()", function() {
      return it("removes the status bar view", function() {
        atom.packages.deactivatePackage("status-bar");
        return expect(workspaceElement.querySelector('status-bar')).toBeNull();
      });
    });
    describe("when status-bar:toggle is triggered", function() {
      beforeEach(function() {
        return jasmine.attachToDOM(workspaceElement);
      });
      return it("hides or shows the status bar", function() {
        atom.commands.dispatch(workspaceElement, 'status-bar:toggle');
        expect(workspaceElement.querySelector('status-bar').parentNode).not.toBeVisible();
        atom.commands.dispatch(workspaceElement, 'status-bar:toggle');
        return expect(workspaceElement.querySelector('status-bar').parentNode).toBeVisible();
      });
    });
    return describe("the 'status-bar' service", function() {
      return it("allows tiles to be added, removed, and retrieved", function() {
        var dummyView, tile;
        dummyView = document.createElement("div");
        tile = statusBarService.addLeftTile({
          item: dummyView
        });
        expect(statusBar).toContain(dummyView);
        expect(statusBarService.getLeftTiles()).toContain(tile);
        tile.destroy();
        expect(statusBar).not.toContain(dummyView);
        expect(statusBarService.getLeftTiles()).not.toContain(tile);
        dummyView = document.createElement("div");
        tile = statusBarService.addRightTile({
          item: dummyView
        });
        expect(statusBar).toContain(dummyView);
        expect(statusBarService.getRightTiles()).toContain(tile);
        tile.destroy();
        expect(statusBar).not.toContain(dummyView);
        return expect(statusBarService.getRightTiles()).not.toContain(tile);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvc3RhdHVzLWJhci9zcGVjL3N0YXR1cy1iYXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUEsR0FBQTtBQUM3QixRQUFBLDJEQUFBO0FBQUEsSUFBQSxPQUEwRCxFQUExRCxFQUFDLGdCQUFELEVBQVMsbUJBQVQsRUFBb0IsMEJBQXBCLEVBQXNDLDBCQUF0QyxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7YUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixZQUE5QixDQUEyQyxDQUFDLElBQTVDLENBQWlELFNBQUMsSUFBRCxHQUFBO0FBQy9DLFVBQUEsU0FBQSxHQUFZLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLFlBQS9CLENBQVosQ0FBQTtpQkFDQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFoQixDQUFBLEVBRjRCO1FBQUEsQ0FBakQsRUFEYztNQUFBLENBQWhCLEVBSFM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBVUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO2FBQ3RCLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7QUFDaEMsUUFBQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsZ0JBQWpCLENBQWtDLFlBQWxDLENBQStDLENBQUMsTUFBdkQsQ0FBOEQsQ0FBQyxJQUEvRCxDQUFvRSxDQUFwRSxDQUFBLENBQUE7QUFBQSxRQUNBLElBQUks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

//# sourceURL=/home/rsoto/.atom/packages/status-bar/spec/status-bar-spec.coffee
