(function() {
  var ShowTodoView, TodosCollection, path, sample1Path, sample2Path;

  path = require('path');

  ShowTodoView = require('../lib/todo-view');

  TodosCollection = require('../lib/todo-collection');

  sample1Path = path.join(__dirname, 'fixtures/sample1');

  sample2Path = path.join(__dirname, 'fixtures/sample2');

  describe("Show Todo View", function() {
    var collection, showTodoView, _ref;
    _ref = [], showTodoView = _ref[0], collection = _ref[1];
    beforeEach(function() {
      var uri;
      atom.config.set('todo-show.findTheseTodos', ['TODO']);
      atom.config.set('todo-show.findUsingRegex', '/\\b(${TODOS}):?\\d*($|\\s.*$)/g');
      atom.project.setPaths([sample1Path]);
      collection = new TodosCollection;
      uri = 'atom://todo-show/todos';
      showTodoView = new ShowTodoView(collection, uri);
      return waitsFor(function() {
        return !showTodoView.isSearching();
      });
    });
    describe("View properties", function() {
      it("has a title, uri, etc.", function() {
        expect(showTodoView.getIconName()).toEqual('checklist');
        expect(showTodoView.getURI()).toEqual('atom://todo-show/todos');
        return expect(showTodoView.find('.btn-group')).toExist();
      });
      it("updates view info", function() {
        var count, getInfo;
        getInfo = function() {
          return showTodoView.todoInfo.text();
        };
        count = showTodoView.getTodos().length;
        expect(getInfo()).toBe("Found " + count + " results in workspace");
        showTodoView.collection.search();
        expect(getInfo()).toBe("Found ... results in workspace");
        waitsFor(function() {
          return !showTodoView.isSearching();
        });
        return runs(function() {
          expect(getInfo()).toBe("Found " + count + " results in workspace");
          showTodoView.collection.todos = ['a single todo'];
          showTodoView.updateInfo();
          return expect(getInfo()).toBe("Found 1 result in workspace");
        });
      });
      return it("updates view info details", function() {
        var getInfo;
        getInfo = function() {
          return showTodoView.todoInfo.text();
        };
        collection.setSearchScope('project');
        waitsFor(function() {
          return !showTodoView.isSearching();
        });
        return runs(function() {
          expect(getInfo()).toBe("Found 3 results in project sample1");
          collection.setSearchScope('open');
          waitsFor(function() {
            return !showTodoView.isSearching();
          });
          return runs(function() {
            return expect(getInfo()).toBe("Found 0 results in open files");
          });
        });
      });
    });
    return describe("Automatic update of todos", function() {
      it("refreshes on save", function() {
        expect(showTodoView.getTodos()).toHaveLength(3);
        waitsForPromise(function() {
          return atom.workspace.open('temp.txt');
        });
        return runs(function() {
          expect(showTodoView.isSearching()).toBe(true);
          waitsFor(function() {
            return !showTodoView.isSearching();
          });
          return runs(function() {
            var editor;
            editor = atom.workspace.getActiveTextEditor();
            editor.setText("# TODO: Test");
            editor.save();
            waitsFor(function() {
              return !showTodoView.isSearching();
            });
            return runs(function() {
              expect(showTodoView.getTodos()).toHaveLength(4);
              editor.setText("");
              editor.save();
              waitsFor(function() {
                return !showTodoView.isSearching();
              });
              return runs(function() {
                return expect(showTodoView.getTodos()).toHaveLength(3);
              });
            });
          });
        });
      });
      it("updates on search scope change", function() {
        expect(showTodoView.isSearching()).toBe(false);
        expect(collection.getSearchScope()).toBe('workspace');
        expect(showTodoView.getTodos()).toHaveLength(3);
        expect(collection.toggleSearchScope()).toBe('project');
        expect(showTodoView.isSearching()).toBe(true);
        waitsFor(function() {
          return !showTodoView.isSearching();
        });
        return runs(function() {
          expect(showTodoView.getTodos()).toHaveLength(3);
          expect(collection.toggleSearchScope()).toBe('open');
          expect(showTodoView.isSearching()).toBe(true);
          waitsFor(function() {
            return !showTodoView.isSearching();
          });
          return runs(function() {
            expect(showTodoView.getTodos()).toHaveLength(0);
            expect(collection.toggleSearchScope()).toBe('active');
            expect(showTodoView.isSearching()).toBe(true);
            waitsFor(function() {
              return !showTodoView.isSearching();
            });
            return runs(function() {
              expect(showTodoView.getTodos()).toHaveLength(0);
              expect(collection.toggleSearchScope()).toBe('workspace');
              return expect(showTodoView.isSearching()).toBe(true);
            });
          });
        });
      });
      it("handles search scope 'project'", function() {
        atom.project.addPath(sample2Path);
        waitsForPromise(function() {
          return atom.workspace.open(path.join(sample2Path, 'sample.txt'));
        });
        waitsFor(function() {
          return !showTodoView.isSearching();
        });
        return runs(function() {
          expect(showTodoView.getTodos()).toHaveLength(9);
          collection.setSearchScope('project');
          expect(showTodoView.isSearching()).toBe(true);
          waitsFor(function() {
            return !showTodoView.isSearching();
          });
          return runs(function() {
            expect(showTodoView.getTodos()).toHaveLength(6);
            waitsForPromise(function() {
              return atom.workspace.open(path.join(sample1Path, 'sample.c'));
            });
            waitsFor(function() {
              return !showTodoView.isSearching();
            });
            return runs(function() {
              return expect(showTodoView.getTodos()).toHaveLength(3);
            });
          });
        });
      });
      it("handles search scope 'open'", function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.c');
        });
        waitsFor(function() {
          return !showTodoView.isSearching();
        });
        return runs(function() {
          expect(showTodoView.getTodos()).toHaveLength(3);
          collection.setSearchScope('open');
          expect(showTodoView.isSearching()).toBe(true);
          waitsFor(function() {
            return !showTodoView.isSearching();
          });
          return runs(function() {
            expect(showTodoView.getTodos()).toHaveLength(1);
            waitsForPromise(function() {
              return atom.workspace.open('sample.js');
            });
            waitsFor(function() {
              return !showTodoView.isSearching();
            });
            return runs(function() {
              expect(showTodoView.getTodos()).toHaveLength(3);
              atom.workspace.getActivePane().itemAtIndex(0).destroy();
              waitsFor(function() {
                return !showTodoView.isSearching();
              });
              return runs(function() {
                return expect(showTodoView.getTodos()).toHaveLength(2);
              });
            });
          });
        });
      });
      return it("handles search scope 'active'", function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.c');
        });
        waitsForPromise(function() {
          return atom.workspace.open('sample.js');
        });
        waitsFor(function() {
          return !showTodoView.isSearching();
        });
        return runs(function() {
          expect(showTodoView.getTodos()).toHaveLength(3);
          collection.setSearchScope('active');
          expect(showTodoView.isSearching()).toBe(true);
          waitsFor(function() {
            return !showTodoView.isSearching();
          });
          return runs(function() {
            expect(showTodoView.getTodos()).toHaveLength(2);
            atom.workspace.getActivePane().activateItemAtIndex(0);
            waitsFor(function() {
              return !showTodoView.isSearching();
            });
            return runs(function() {
              return expect(showTodoView.getTodos()).toHaveLength(1);
            });
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvdG9kby1zaG93L3NwZWMvdG9kby12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZEQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUVBLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVIsQ0FGZixDQUFBOztBQUFBLEVBR0EsZUFBQSxHQUFrQixPQUFBLENBQVEsd0JBQVIsQ0FIbEIsQ0FBQTs7QUFBQSxFQUtBLFdBQUEsR0FBYyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsa0JBQXJCLENBTGQsQ0FBQTs7QUFBQSxFQU1BLFdBQUEsR0FBYyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsa0JBQXJCLENBTmQsQ0FBQTs7QUFBQSxFQVFBLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7QUFDekIsUUFBQSw4QkFBQTtBQUFBLElBQUEsT0FBNkIsRUFBN0IsRUFBQyxzQkFBRCxFQUFlLG9CQUFmLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLEdBQUE7QUFBQSxNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsRUFBNEMsQ0FBQyxNQUFELENBQTVDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQixFQUE0QyxrQ0FBNUMsQ0FEQSxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsQ0FBQyxXQUFELENBQXRCLENBSEEsQ0FBQTtBQUFBLE1BSUEsVUFBQSxHQUFhLEdBQUEsQ0FBQSxlQUpiLENBQUE7QUFBQSxNQUtBLEdBQUEs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

//# sourceURL=/home/rsoto/.atom/packages/todo-show/spec/todo-view-spec.coffee
