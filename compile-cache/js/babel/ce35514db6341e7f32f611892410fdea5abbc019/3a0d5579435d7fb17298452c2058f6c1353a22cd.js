'use babel';

describe('The pylint provider for Linter', function () {
  var lint = require('../lib/main').provideLinter().lint;

  beforeEach(function () {
    waitsForPromise(function () {
      return Promise.all([atom.packages.activatePackage('linter-pylint'), atom.packages.activatePackage('language-python').then(function () {
        return atom.workspace.open(__dirname + '/files/good.py');
      })]);
    });
  });

  it('should be in the packages list', function () {
    return expect(atom.packages.isPackageLoaded('linter-pylint')).toBe(true);
  });

  it('should be an active package', function () {
    return expect(atom.packages.isPackageActive('linter-pylint')).toBe(true);
  });

  describe('checks bad.py and', function () {
    var editor = null;
    beforeEach(function () {
      waitsForPromise(function () {
        return atom.workspace.open(__dirname + '/files/bad.py').then(function (openEditor) {
          editor = openEditor;
        });
      });
    });

    it('finds at least one message', function () {
      return lint(editor).then(function (messages) {
        expect(messages.length).toBeGreaterThan(0);
      });
    });

    it('verifies that message', function () {
      return lint(editor).then(function (messages) {
        expect(messages[0].type).toBeDefined();
        expect(messages[0].type).toEqual('convention');
        expect(messages[0].html).not.toBeDefined();
        expect(messages[0].text).toBeDefined();
        expect(messages[0].text).toEqual('C0111 Missing module docstring');
        expect(messages[0].filePath).toBeDefined();
        expect(messages[0].filePath).toMatch(/.+spec[\\\/]files[\\\/]bad\.py$/);
        expect(messages[0].range).toBeDefined();
        expect(messages[0].range.length).toEqual(2);
        expect(messages[0].range).toEqual([[0, 0], [0, 4]]);
      });
    });
  });

  it('finds nothing wrong with an empty file', function () {
    waitsForPromise(function () {
      return atom.workspace.open(__dirname + '/files/empty.py').then(function (editor) {
        return lint(editor).then(function (messages) {
          expect(messages.length).toEqual(0);
        });
      });
    });
  });

  it('finds nothing wrong with a valid file', function () {
    waitsForPromise(function () {
      return atom.workspace.open(__dirname + '/files/good.py').then(function (editor) {
        return lint(editor).then(function (messages) {
          expect(messages.length).toEqual(0);
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Jzb3RvLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1weWxpbnQvc3BlYy9saW50ZXItcHlsaW50LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOztBQUVaLFFBQVEsQ0FBQyxnQ0FBZ0MsRUFBRSxZQUFNO0FBQy9DLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUM7O0FBRXpELFlBQVUsQ0FBQyxZQUFNO0FBQ2YsbUJBQWUsQ0FBQyxZQUFNO0FBQ3BCLGFBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsRUFDOUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUM7ZUFDcEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLGdCQUFnQixDQUFDO09BQUEsQ0FDbEQsQ0FDRixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7O0FBRUgsSUFBRSxDQUFDLGdDQUFnQyxFQUFFLFlBQU07QUFDekMsV0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDMUUsQ0FBQyxDQUFDOztBQUVILElBQUUsQ0FBQyw2QkFBNkIsRUFBRSxZQUFNO0FBQ3RDLFdBQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzFFLENBQUMsQ0FBQzs7QUFFSCxVQUFRLENBQUMsbUJBQW1CLEVBQUUsWUFBTTtBQUNsQyxRQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbEIsY0FBVSxD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QyxTQUFTLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDdEUsZUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQ25DLGdCQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwQyxDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvbGludGVyLXB5bGludC9zcGVjL2xpbnRlci1weWxpbnQtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5kZXNjcmliZSgnVGhlIHB5bGludCBwcm92aWRlciBmb3IgTGludGVyJywgKCkgPT4ge1xuICBjb25zdCBsaW50ID0gcmVxdWlyZSgnLi4vbGliL21haW4nKS5wcm92aWRlTGludGVyKCkubGludDtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xpbnRlci1weWxpbnQnKSxcbiAgICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLXB5dGhvbicpLnRoZW4oKCkgPT5cbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKF9fZGlybmFtZSArICcvZmlsZXMvZ29vZC5weScpXG4gICAgICAgIClcbiAgICAgIF0pO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGJlIGluIHRoZSBwYWNrYWdlcyBsaXN0JywgKCkgPT4ge1xuICAgIHJldHVybiBleHBlY3QoYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VMb2FkZWQoJ2xpbnRlci1weWxpbnQnKSkudG9CZSh0cnVlKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBiZSBhbiBhY3RpdmUgcGFja2FnZScsICgpID0+IHtcbiAgICByZXR1cm4gZXhwZWN0KGF0b20ucGFja2FnZXMuaXNQYWNrYWdlQWN0aXZlKCdsaW50ZXItcHlsaW50JykpLnRvQmUodHJ1ZSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdjaGVja3MgYmFkLnB5IGFuZCcsICgpID0+IHtcbiAgICBsZXQgZWRpdG9yID0gbnVsbDtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKF9fZGlybmFtZSArICcvZmlsZXMvYmFkLnB5JykudGhlbihvcGVuRWRpdG9yID0+IHtcbiAgICAgICAgICBlZGl0b3IgPSBvcGVuRWRpdG9yO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2ZpbmRzIGF0IGxlYXN0IG9uZSBtZXNzYWdlJywgKCkgPT4ge1xuICAgICAgcmV0dXJuIGxpbnQoZWRpdG9yKS50aGVuKG1lc3NhZ2VzID0+IHtcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgndmVyaWZpZXMgdGhhdCBtZXNzYWdlJywgKCkgPT4ge1xuICAgICAgcmV0dXJuIGxpbnQoZWRpdG9yKS50aGVuKG1lc3NhZ2VzID0+IHtcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnR5cGUpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS50eXBlKS50b0VxdWFsKCdjb252ZW50aW9uJyk7XG4gICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5odG1sKS5ub3QudG9CZURlZmluZWQoKTtcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnRleHQpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS50ZXh0KS50b0VxdWFsKCdDMDExMSBNaXNzaW5nIG1vZHVsZSBkb2NzdHJpbmcnKTtcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmZpbGVQYXRoKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0uZmlsZVBhdGgpLnRvTWF0Y2goLy4rc3BlY1tcXFxcXFwvXWZpbGVzW1xcXFxcXC9dYmFkXFwucHkkLyk7XG4gICAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5yYW5nZSkudG9CZURlZmluZWQoKTtcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnJhbmdlLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnJhbmdlKS50b0VxdWFsKFtbMCwgMF0sIFswLCA0XV0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdmaW5kcyBub3RoaW5nIHdyb25nIHdpdGggYW4gZW1wdHkgZmlsZScsICgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oX19kaXJuYW1lICsgJy9maWxlcy9lbXB0eS5weScpLnRoZW4oZWRpdG9yID0+IHtcbiAgICAgICAgcmV0dXJuIGxpbnQoZWRpdG9yKS50aGVuKG1lc3NhZ2VzID0+IHtcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0VxdWFsKDApO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnZmluZHMgbm90aGluZyB3cm9uZyB3aXRoIGEgdmFsaWQgZmlsZScsICgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oX19kaXJuYW1lICsgJy9maWxlcy9nb29kLnB5JykudGhlbihlZGl0b3IgPT4ge1xuICAgICAgICByZXR1cm4gbGludChlZGl0b3IpLnRoZW4obWVzc2FnZXMgPT4ge1xuICAgICAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/home/rsoto/.atom/packages/linter-pylint/spec/linter-pylint-spec.js
