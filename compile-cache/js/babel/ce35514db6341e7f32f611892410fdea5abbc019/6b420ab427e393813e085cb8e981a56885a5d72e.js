'use babel';
'use strict';

var _this = this;

describe('AMU Font Options', function () {
    beforeEach(function () {
        _this.workspace = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(_this.workspace);

        waitsForPromise('Theme Activation', function () {
            return atom.packages.activatePackage('atom-material-ui');
        });
    });

    it('should be able to scale UI via font-size', function () {
        atom.config.set('atom-material-ui.fonts.fontSize', '18');
        expect(document.querySelector(':root').style.fontSize).toBe('18px');

        atom.config.set('atom-material-ui.fonts.fontSize', '16');
        expect(document.querySelector(':root').style.fontSize).toBe('16px');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Jzb3RvLy5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvc3BlYy9zZXR0aW5ncy1mb250LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDO0FBQ1osWUFBWSxDQUFDOzs7O0FBRWIsUUFBUSxDQUFDLGtCQUFrQixFQUFFLFlBQU07QUFDL0IsY0FBVSxDQUFDLFlBQU07QUFDYixjQUFLLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDcEQsZUFBTyxDQUFDLFdBQVcsQ0FBQyxNQUFLLFNBQVMsQ0FBQyxDQUFDOztBQUVwQyx1QkFBZSxDQUFDLGtCQUFrQixFQUFFLFlBQU07QUFDdEMsbUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQztTQUM1RCxDQUFDLENBQUM7S0FDTixDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLDBDQUEwQyxFQUFFLFlBQU07QUFDakQsWUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDekQsY0FBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFcEUsWUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDekQsY0FBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN2RSxDQUFDLENBQUM7Q0FDTixDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYXRvbS1tYXRlcmlhbC11aS9zcGVjL3NldHRpbmdzLWZvbnQtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuJ3VzZSBzdHJpY3QnO1xuXG5kZXNjcmliZSgnQU1VIEZvbnQgT3B0aW9ucycsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpO1xuICAgICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHRoaXMud29ya3NwYWNlKTtcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UoJ1RoZW1lIEFjdGl2YXRpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2F0b20tbWF0ZXJpYWwtdWknKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGJlIGFibGUgdG8gc2NhbGUgVUkgdmlhIGZvbnQtc2l6ZScsICgpID0+IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdhdG9tLW1hdGVyaWFsLXVpLmZvbnRzLmZvbnRTaXplJywgJzE4Jyk7XG4gICAgICAgIGV4cGVjdChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCc6cm9vdCcpLnN0eWxlLmZvbnRTaXplKS50b0JlKCcxOHB4Jyk7XG5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdhdG9tLW1hdGVyaWFsLXVpLmZvbnRzLmZvbnRTaXplJywgJzE2Jyk7XG4gICAgICAgIGV4cGVjdChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCc6cm9vdCcpLnN0eWxlLmZvbnRTaXplKS50b0JlKCcxNnB4Jyk7XG4gICAgfSk7XG59KTtcbiJdfQ==
//# sourceURL=/home/rsoto/.atom/packages/atom-material-ui/spec/settings-font-spec.js