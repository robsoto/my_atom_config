'use babel';

var _ref = [];
var workspaceElement = _ref[0];
var editor = _ref[1];
var editorElement = _ref[2];

var path = require('path');

function sharedSetup(useTernLint) {

  atom.project.setPaths([path.join(__dirname, 'fixtures')]);
  atom.config.set('atom-ternjs.lint', useTernLint);
  workspaceElement = atom.views.getView(atom.workspace);

  waitsForPromise(function () {

    return atom.packages.activatePackage('atom-ternjs').then(function (pkg) {

      package = pkg.mainModule;
    });
  });

  waitsForPromise(function () {

    return atom.workspace.open('test.js');
  });

  runs(function () {

    editor = atom.workspace.getActiveTextEditor();
    editorElement = atom.views.getView(editor);
  });
}

describe('atom-ternjs', function () {

  beforeEach(function () {

    sharedSetup(true);
  });

  describe('activate()', function () {

    it('activates atom-ternjs and initializes the autocomplete-plus provider', function () {

      expect(package.provider).toBeDefined();
    });

    it('activates atom-ternjs and initializes the manager', function () {

      expect(package.manager).toBeDefined();
    });

    it('does not provide the linter provider if tern-lint config is set to true', function () {

      expect(package.useLint).toMatch(/true/);
      expect(package.providerLinter).toBeDefined();
    });
  });

  describe('deactivate()', function () {

    beforeEach(function () {

      editor.setCursorBufferPosition([4, 15]);
      atom.packages.deactivatePackage('atom-ternjs');
    });

    it('deactivates atom-ternjs', function () {

      expect(package.manager).toBeUndefined();
      expect(package.provider).toBeUndefined();
      expect(package.useLint).toBeUndefined();
      expect(package.providerLinter).toBeUndefined();
    });

    it('destroys all views', function () {

      expect(workspaceElement.querySelectorAll('atom-ternjs-reference').length).toBe(0);
      expect(workspaceElement.querySelectorAll('atom-ternjs-rename').length).toBe(0);
      expect(workspaceElement.querySelectorAll('atom-ternjs-config').length).toBe(0);
      expect(workspaceElement.querySelectorAll('atom-ternjs-documentation').length).toBe(0);
      expect(workspaceElement.querySelectorAll('atom-ternjs-type').length).toBe(0);
      expect(editorElement.querySelectorAll('atom-text-editor::shadow .scroll-view .atom-ternjs-definition-marker').length).toBe(0);
    });
  });
});

describe('atom-ternjs', function () {

  beforeEach(function () {

    sharedSetup(false);
  });

  describe('activate()', function () {

    it('does not provide the linter provider if tern-lint config is set to false', function () {

      expect(package.useLint).toMatch(/false/);
      expect(package.providerLinter).toBeUndefined();
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Jzb3RvLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL3NwZWMvYXRvbS10ZXJuanMtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7O1dBRXFDLEVBQUU7SUFBN0MsZ0JBQWdCO0lBQUUsTUFBTTtJQUFFLGFBQWE7O0FBQzVDLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFM0IsU0FBUyxXQUFXLENBQUMsV0FBVyxFQUFFOztBQUVoQyxNQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRCxNQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUNqRCxrQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7O0FBRXJELGlCQUFlLENBQUMsWUFBTTs7QUFFcEIsV0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFHLEVBQUs7O0FBRWhFLGFBQU8sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDO0tBQzFCLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQzs7QUFFSCxpQkFBZSxDQUFDLFlBQU07O0FBRXBCLFdBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDdkMsQ0FBQyxDQUFDOztBQUVILE1BQUksQ0FBQyxZQUFNOztBQUVULFVBQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDOUMsaUJBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUM1QyxDQUFD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QUFFLENBQUMsMEVBQTBFLEVBQUUsWUFBTTs7QUFFbkYsWUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDekMsWUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztLQUNoRCxDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvc3BlYy9hdG9tLXRlcm5qcy1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxubGV0IFt3b3Jrc3BhY2VFbGVtZW50LCBlZGl0b3IsIGVkaXRvckVsZW1lbnRdID0gW107XG5sZXQgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxuZnVuY3Rpb24gc2hhcmVkU2V0dXAodXNlVGVybkxpbnQpIHtcblxuICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW3BhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycpXSk7XG4gIGF0b20uY29uZmlnLnNldCgnYXRvbS10ZXJuanMubGludCcsIHVzZVRlcm5MaW50KTtcbiAgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSlcblxuICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuXG4gICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdhdG9tLXRlcm5qcycpLnRoZW4oKHBrZykgPT4ge1xuXG4gICAgICBwYWNrYWdlID0gcGtnLm1haW5Nb2R1bGU7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG5cbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3BlbigndGVzdC5qcycpO1xuICB9KTtcblxuICBydW5zKCgpID0+IHtcblxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcik7XG4gIH0pO1xufVxuXG5kZXNjcmliZSgnYXRvbS10ZXJuanMnLCAoKSA9PiB7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG5cbiAgICBzaGFyZWRTZXR1cCh0cnVlKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2FjdGl2YXRlKCknLCAoKSA9PiB7XG5cbiAgICBpdCgnYWN0aXZhdGVzIGF0b20tdGVybmpzIGFuZCBpbml0aWFsaXplcyB0aGUgYXV0b2NvbXBsZXRlLXBsdXMgcHJvdmlkZXInLCAoKSA9PiB7XG5cbiAgICAgIGV4cGVjdChwYWNrYWdlLnByb3ZpZGVyKS50b0JlRGVmaW5lZCgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2FjdGl2YXRlcyBhdG9tLXRlcm5qcyBhbmQgaW5pdGlhbGl6ZXMgdGhlIG1hbmFnZXInLCAoKSA9PiB7XG5cbiAgICAgIGV4cGVjdChwYWNrYWdlLm1hbmFnZXIpLnRvQmVEZWZpbmVkKCk7XG4gICAgfSk7XG5cbiAgICBpdCgnZG9lcyBub3QgcHJvdmlkZSB0aGUgbGludGVyIHByb3ZpZGVyIGlmIHRlcm4tbGludCBjb25maWcgaXMgc2V0IHRvIHRydWUnLCAoKSA9PiB7XG5cbiAgICAgIGV4cGVjdChwYWNrYWdlLnVzZUxpbnQpLnRvTWF0Y2goL3RydWUvKTtcbiAgICAgIGV4cGVjdChwYWNrYWdlLnByb3ZpZGVyTGludGVyKS50b0JlRGVmaW5lZCgpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZGVhY3RpdmF0ZSgpJywgKCkgPT4ge1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbNCwgMTVdKTtcbiAgICAgIGF0b20ucGFja2FnZXMuZGVhY3RpdmF0ZVBhY2thZ2UoJ2F0b20tdGVybmpzJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnZGVhY3RpdmF0ZXMgYXRvbS10ZXJuanMnLCAoKSA9PiB7XG5cbiAgICAgIGV4cGVjdChwYWNrYWdlLm1hbmFnZXIpLnRvQmVVbmRlZmluZWQoKTtcbiAgICAgIGV4cGVjdChwYWNrYWdlLnByb3ZpZGVyKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgICBleHBlY3QocGFja2FnZS51c2VMaW50KS50b0JlVW5kZWZpbmVkKCk7XG4gICAgICBleHBlY3QocGFja2FnZS5wcm92aWRlckxpbnRlcikudG9CZVVuZGVmaW5lZCgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2Rlc3Ryb3lzIGFsbCB2aWV3cycsICgpID0+IHtcblxuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYXRvbS10ZXJuanMtcmVmZXJlbmNlJykubGVuZ3RoKS50b0JlKDApO1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYXRvbS10ZXJuanMtcmVuYW1lJykubGVuZ3RoKS50b0JlKDApO1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYXRvbS10ZXJuanMtY29uZmlnJykubGVuZ3RoKS50b0JlKDApO1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbicpLmxlbmd0aCkudG9CZSgwKTtcbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2F0b20tdGVybmpzLXR5cGUnKS5sZW5ndGgpLnRvQmUoMCk7XG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhdG9tLXRleHQtZWRpdG9yOjpzaGFkb3cgLnNjcm9sbC12aWV3IC5hdG9tLXRlcm5qcy1kZWZpbml0aW9uLW1hcmtlcicpLmxlbmd0aCkudG9CZSgwKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2F0b20tdGVybmpzJywgKCkgPT4ge1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuXG4gICAgc2hhcmVkU2V0dXAoZmFsc2UpO1xuICB9KTtcblxuICBkZXNjcmliZSgnYWN0aXZhdGUoKScsICgpID0+IHtcblxuICAgIGl0KCdkb2VzIG5vdCBwcm92aWRlIHRoZSBsaW50ZXIgcHJvdmlkZXIgaWYgdGVybi1saW50IGNvbmZpZyBpcyBzZXQgdG8gZmFsc2UnLCAoKSA9PiB7XG5cbiAgICAgIGV4cGVjdChwYWNrYWdlLnVzZUxpbnQpLnRvTWF0Y2goL2ZhbHNlLyk7XG4gICAgICBleHBlY3QocGFja2FnZS5wcm92aWRlckxpbnRlcikudG9CZVVuZGVmaW5lZCgpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/spec/atom-ternjs-spec.js
