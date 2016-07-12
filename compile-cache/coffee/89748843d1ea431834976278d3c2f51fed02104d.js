(function() {
  var $, fs, os, path, process;

  fs = require('fs-plus');

  path = require('path');

  os = require('os');

  process = require('process');

  $ = require('atom-space-pen-views').$;

  describe("Built-in Status Bar Tiles", function() {
    var dummyView, statusBar, workspaceElement, _ref;
    _ref = [], statusBar = _ref[0], workspaceElement = _ref[1], dummyView = _ref[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      dummyView = document.createElement("div");
      statusBar = null;
      waitsForPromise(function() {
        return atom.packages.activatePackage('status-bar');
      });
      return runs(function() {
        return statusBar = workspaceElement.querySelector("status-bar");
      });
    });
    describe("the file info, cursor and selection tiles", function() {
      var buffer, cursorPosition, editor, fileInfo, selectionCount, _ref1;
      _ref1 = [], editor = _ref1[0], buffer = _ref1[1], fileInfo = _ref1[2], cursorPosition = _ref1[3], selectionCount = _ref1[4];
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.js');
        });
        return runs(function() {
          var launchMode, _ref2;
          _ref2 = statusBar.getLeftTiles().map(function(tile) {
            return tile.getItem();
          }), launchMode = _ref2[0], fileInfo = _ref2[1], cursorPosition = _ref2[2], selectionCount = _ref2[3];
          editor = atom.workspace.getActiveTextEditor();
          return buffer = editor.getBuffer();
        });
      });
      describe("when associated with an unsaved buffer", function() {
        return it("displays 'untitled' instead of the buffer's path, but still displays the buffer position", function() {
          waitsForPromise(function() {
            return atom.workspace.open();
          });
          return runs(function() {
            atom.views.performDocumentUpdate();
            expect(fileInfo.currentPath.textContent).toBe('untitled');
            expect(cursorPosition.textContent).toBe('1:1');
            return expect(selectionCount).toBeHidden();
          });
        });
      });
      describe("when the associated editor's path changes", function() {
        return it("updates the path in the status bar", function() {
          waitsForPromise(function() {
            return atom.workspace.open('sample.txt');
          });
          return runs(function() {
            return expect(fileInfo.currentPath.textContent).toBe('sample.txt');
          });
        });
      });
      describe("when associated with remote file path", function() {
        beforeEach(function() {
          jasmine.attachToDOM(workspaceElement);
          dummyView.getPath = function() {
            return 'remote://server:123/folder/remote_file.txt';
          };
          return atom.workspace.getActivePane().activateItem(dummyView);
        });
        it("updates the path in the status bar", function() {
          expect(fileInfo.currentPath.textContent).toBe('remote://server:123/folder/remote_file.txt');
          return expect(fileInfo.currentPath).toBeVisible();
        });
        return it("when the path is clicked", function() {
          fileInfo.currentPath.click();
          return expect(atom.clipboard.read()).toBe('/folder/remote_file.txt');
        });
      });
      describe("when buffer's path is clicked", function() {
        return it("copies the absolute path into the clipboard if available", function() {
          waitsForPromise(function() {
            return atom.workspace.open('sample.txt');
          });
          return runs(function() {
            fileInfo.currentPath.click();
            return expect(atom.clipboard.read()).toBe(fileInfo.getActiveItem().getPath());
          });
        });
      });
      describe("when buffer's path is shift-clicked", function() {
        return it("copies the relative path into the clipboard if available", function() {
          waitsForPromise(function() {
            return atom.workspace.open('sample.txt');
          });
          return runs(function() {
            var event;
            event = new MouseEvent('click', {
              shiftKey: true
            });
            fileInfo.currentPath.dispatchEvent(event);
            return expect(atom.clipboard.read()).toBe('sample.txt');
          });
        });
      });
      describe("when path of an unsaved buffer is clicked", function() {
        return it("copies the 'untitled' into clipboard", function() {
          waitsForPromise(function() {
            return atom.workspace.open();
          });
          return runs(function() {
            fileInfo.currentPath.click();
            return expect(atom.clipboard.read()).toBe('untitled');
          });
        });
      });
      describe("when buffer's path is not clicked", function() {
        return it("doesn't display a path tooltip", function() {
          jasmine.attachToDOM(workspaceElement);
          waitsForPromise(function() {
            return atom.workspace.open();
          });
          return runs(function() {
            return expect(document.querySelector('.tooltip')).not.toExist();
          });
        });
      });
      describe("when buffer's path is clicked", function() {
        return it("displays path tooltip and the tooltip disappears after ~2 seconds", function() {
          jasmine.attachToDOM(workspaceElement);
          waitsForPromise(function() {
            return atom.workspace.open();
          });
          return runs(function() {
            fileInfo.currentPath.click();
            expect(document.querySelector('.tooltip')).toBeVisible();
            advanceClock(2100);
            return expect(document.querySelector('.tooltip')).not.toExist();
          });
        });
      });
      describe("when saved buffer's path is clicked", function() {
        it("displays a tooltip containing text 'Copied:' and an absolute native path", function() {
          jasmine.attachToDOM(workspaceElement);
          waitsForPromise(function() {
            return atom.workspace.open('sample.txt');
          });
          return runs(function() {
            fileInfo.currentPath.click();
            return expect(document.querySelector('.tooltip')).toHaveText("Copied: " + (fileInfo.getActiveItem().getPath()));
          });
        });
        it("displays a tooltip containing text 'Copied:' for an absolute Unix path", function() {
          jasmine.attachToDOM(workspaceElement);
          dummyView.getPath = function() {
            return '/user/path/for/my/file.txt';
          };
          atom.workspace.getActivePane().activateItem(dummyView);
          return runs(function() {
            fileInfo.currentPath.click();
            return expect(document.querySelector('.tooltip')).toHaveText("Copied: " + (dummyView.getPath()));
          });
        });
        return it("displays a tooltip containing text 'Copied:' for an absolute Windows path", function() {
          jasmine.attachToDOM(workspaceElement);
          dummyView.getPath = function() {
            return 'c:\\user\\path\\for\\my\\file.txt';
          };
          atom.workspace.getActivePane().activateItem(dummyView);
          return runs(function() {
            fileInfo.currentPath.click();
            return expect(document.querySelector('.tooltip')).toHaveText("Copied: " + (dummyView.getPath()));
          });
        });
      });
      describe("when unsaved buffer's path is clicked", function() {
        return it("displays a tooltip containing text 'Copied: untitled", function() {
          jasmine.attachToDOM(workspaceElement);
          waitsForPromise(function() {
            return atom.workspace.open();
          });
          return runs(function() {
            fileInfo.currentPath.click();
            return expect(document.querySelector('.tooltip')).toHaveText("Copied: untitled");
          });
        });
      });
      describe("when the associated editor's buffer's content changes", function() {
        return it("enables the buffer modified indicator", function() {
          expect(fileInfo.classList.contains('buffer-modified')).toBe(false);
          editor.insertText("\n");
          advanceClock(buffer.stoppedChangingDelay);
          expect(fileInfo.classList.contains('buffer-modified')).toBe(true);
          return editor.backspace();
        });
      });
      describe("when the buffer content has changed from the content on disk", function() {
        it("disables the buffer modified indicator on save", function() {
          var filePath;
          filePath = path.join(os.tmpdir(), "atom-whitespace.txt");
          fs.writeFileSync(filePath, "");
          waitsForPromise(function() {
            return atom.workspace.open(filePath);
          });
          return runs(function() {
            editor = atom.workspace.getActiveTextEditor();
            expect(fileInfo.classList.contains('buffer-modified')).toBe(false);
            editor.insertText("\n");
            advanceClock(buffer.stoppedChangingDelay);
            expect(fileInfo.classList.contains('buffer-modified')).toBe(true);
            editor.getBuffer().save();
            return expect(fileInfo.classList.contains('buffer-modified')).toBe(false);
          });
        });
        it("disables the buffer modified indicator if the content matches again", function() {
          expect(fileInfo.classList.contains('buffer-modified')).toBe(false);
          editor.insertText("\n");
          advanceClock(buffer.stoppedChangingDelay);
          expect(fileInfo.classList.contains('buffer-modified')).toBe(true);
          editor.backspace();
          advanceClock(buffer.stoppedChangingDelay);
          return expect(fileInfo.classList.contains('buffer-modified')).toBe(false);
        });
        return it("disables the buffer modified indicator when the change is undone", function() {
          expect(fileInfo.classList.contains('buffer-modified')).toBe(false);
          editor.insertText("\n");
          advanceClock(buffer.stoppedChangingDelay);
          expect(fileInfo.classList.contains('buffer-modified')).toBe(true);
          editor.undo();
          advanceClock(buffer.stoppedChangingDelay);
          return expect(fileInfo.classList.contains('buffer-modified')).toBe(false);
        });
      });
      describe("when the buffer changes", function() {
        it("updates the buffer modified indicator for the new buffer", function() {
          expect(fileInfo.classList.contains('buffer-modified')).toBe(false);
          waitsForPromise(function() {
            return atom.workspace.open('sample.txt');
          });
          return runs(function() {
            editor = atom.workspace.getActiveTextEditor();
            editor.insertText("\n");
            advanceClock(buffer.stoppedChangingDelay);
            return expect(fileInfo.classList.contains('buffer-modified')).toBe(true);
          });
        });
        return it("doesn't update the buffer modified indicator for the old buffer", function() {
          var oldBuffer;
          oldBuffer = editor.getBuffer();
          expect(fileInfo.classList.contains('buffer-modified')).toBe(false);
          waitsForPromise(function() {
            return atom.workspace.open('sample.txt');
          });
          return runs(function() {
            oldBuffer.setText("new text");
            advanceClock(buffer.stoppedChangingDelay);
            return expect(fileInfo.classList.contains('buffer-modified')).toBe(false);
          });
        });
      });
      describe("when the associated editor's cursor position changes", function() {
        return it("updates the cursor position in the status bar", function() {
          jasmine.attachToDOM(workspaceElement);
          editor.setCursorScreenPosition([1, 2]);
          atom.views.performDocumentUpdate();
          return expect(cursorPosition.textContent).toBe('2:3');
        });
      });
      describe("when the associated editor's selection changes", function() {
        return it("updates the selection count in the status bar", function() {
          jasmine.attachToDOM(workspaceElement);
          editor.setSelectedBufferRange([[0, 0], [0, 0]]);
          atom.views.performDocumentUpdate();
          expect(selectionCount.textContent).toBe('');
          editor.setSelectedBufferRange([[0, 0], [0, 2]]);
          atom.views.performDocumentUpdate();
          expect(selectionCount.textContent).toBe('(1, 2)');
          editor.setSelectedBufferRange([[0, 0], [1, 30]]);
          atom.views.performDocumentUpdate();
          return expect(selectionCount.textContent).toBe("(2, " + (process.platform === 'win32' ? 61 : 60) + ")");
        });
      });
      describe("when the active pane item does not implement getCursorBufferPosition()", function() {
        return it("hides the cursor position view", function() {
          jasmine.attachToDOM(workspaceElement);
          atom.workspace.getActivePane().activateItem(dummyView);
          atom.views.performDocumentUpdate();
          return expect(cursorPosition).toBeHidden();
        });
      });
      describe("when the active pane item implements getTitle() but not getPath()", function() {
        return it("displays the title", function() {
          jasmine.attachToDOM(workspaceElement);
          dummyView.getTitle = function() {
            return 'View Title';
          };
          atom.workspace.getActivePane().activateItem(dummyView);
          expect(fileInfo.currentPath.textContent).toBe('View Title');
          return expect(fileInfo.currentPath).toBeVisible();
        });
      });
      describe("when the active pane item neither getTitle() nor getPath()", function() {
        return it("hides the path view", function() {
          jasmine.attachToDOM(workspaceElement);
          atom.workspace.getActivePane().activateItem(dummyView);
          return expect(fileInfo.currentPath).toBeHidden();
        });
      });
      describe("when the active pane item's title changes", function() {
        return it("updates the path view with the new title", function() {
          var callback, callbacks, _i, _len;
          jasmine.attachToDOM(workspaceElement);
          callbacks = [];
          dummyView.onDidChangeTitle = function(fn) {
            callbacks.push(fn);
            return {
              dispose: function() {}
            };
          };
          dummyView.getTitle = function() {
            return 'View Title';
          };
          atom.workspace.getActivePane().activateItem(dummyView);
          expect(fileInfo.currentPath.textContent).toBe('View Title');
          dummyView.getTitle = function() {
            return 'New Title';
          };
          for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
            callback = callbacks[_i];
            callback();
          }
          return expect(fileInfo.currentPath.textContent).toBe('New Title');
        });
      });
      describe('the cursor position tile', function() {
        beforeEach(function() {
          return atom.config.set('status-bar.cursorPositionFormat', 'foo %L bar %C');
        });
        it('respects a format string', function() {
          jasmine.attachToDOM(workspaceElement);
          editor.setCursorScreenPosition([1, 2]);
          atom.views.performDocumentUpdate();
          return expect(cursorPosition.textContent).toBe('foo 2 bar 3');
        });
        it('updates when the configuration changes', function() {
          jasmine.attachToDOM(workspaceElement);
          editor.setCursorScreenPosition([1, 2]);
          atom.views.performDocumentUpdate();
          expect(cursorPosition.textContent).toBe('foo 2 bar 3');
          atom.config.set('status-bar.cursorPositionFormat', 'baz %C quux %L');
          atom.views.performDocumentUpdate();
          return expect(cursorPosition.textContent).toBe('baz 3 quux 2');
        });
        return describe("when clicked", function() {
          return it("triggers the go-to-line toggle event", function() {
            var eventHandler;
            eventHandler = jasmine.createSpy('eventHandler');
            atom.commands.add('atom-text-editor', 'go-to-line:toggle', eventHandler);
            cursorPosition.click();
            return expect(eventHandler).toHaveBeenCalled();
          });
        });
      });
      return describe('the selection count tile', function() {
        var expectedCharacters;
        expectedCharacters = process.platform === 'win32' ? 61 : 60;
        beforeEach(function() {
          return atom.config.set('status-bar.selectionCountFormat', '%L foo %C bar selected');
        });
        it('respects a format string', function() {
          jasmine.attachToDOM(workspaceElement);
          editor.setSelectedBufferRange([[0, 0], [1, 30]]);
          return expect(selectionCount.textContent).toBe("2 foo " + expectedCharacters + " bar selected");
        });
        return it('updates when the configuration changes', function() {
          jasmine.attachToDOM(workspaceElement);
          editor.setSelectedBufferRange([[0, 0], [1, 30]]);
          expect(selectionCount.textContent).toBe("2 foo " + expectedCharacters + " bar selected");
          atom.config.set('status-bar.selectionCountFormat', 'Selection: baz %C quux %L');
          return expect(selectionCount.textContent).toBe("Selection: baz " + expectedCharacters + " quux 2");
        });
      });
    });
    return describe("the git tile", function() {
      var gitView, hover;
      gitView = null;
      hover = function(element, fn) {
        element.dispatchEvent(new CustomEvent('mouseenter', {
          bubbles: false
        }));
        element.dispatchEvent(new CustomEvent('mouseover', {
          bubbles: true
        }));
        advanceClock(atom.tooltips.defaults.delay.show);
        fn();
        element.dispatchEvent(new CustomEvent('mouseleave', {
          bubbles: false
        }));
        element.dispatchEvent(new CustomEvent('mouseout', {
          bubbles: true
        }));
        return advanceClock(atom.tooltips.defaults.delay.show);
      };
      beforeEach(function() {
        var _ref1;
        return _ref1 = statusBar.getRightTiles().map(function(tile) {
          return tile.getItem();
        }), gitView = _ref1[0], _ref1;
      });
      describe("the git ahead/behind count labels", function() {
        beforeEach(function() {
          return jasmine.attachToDOM(workspaceElement);
        });
        afterEach(function() {
          return fs.removeSync(atom.project.getDirectories()[0].resolve('.git'));
        });
        it("shows the number of commits that can be pushed/pulled", function() {
          var filePath, projectPath, repo;
          fs.copySync(atom.project.getDirectories()[0].resolve('git/ahead-behind-repo.git'), atom.project.getDirectories()[0].resolve('git/working-dir/.git'));
          projectPath = atom.project.getDirectories()[0].resolve('git/working-dir');
          atom.project.setPaths([projectPath]);
          filePath = atom.project.getDirectories()[0].resolve('a.txt');
          repo = atom.project.getRepositories()[0].async;
          waitsForPromise(function() {
            return atom.workspace.open(filePath).then(function() {
              return repo.refreshStatus();
            }).then(function() {
              return gitView.updateStatusPromise;
            });
          });
          return runs(function() {
            var aheadElement, behindElement;
            behindElement = document.body.querySelector(".commits-behind-label");
            aheadElement = document.body.querySelector(".commits-ahead-label");
            expect(aheadElement).toBeVisible();
            expect(behindElement).toBeVisible();
            return expect(aheadElement.textContent).toContain('1');
          });
        });
        return it("stays hidden when no commits can be pushed/pulled", function() {
          var filePath, projectPath, repo;
          fs.copySync(atom.project.getDirectories()[0].resolve('git/no-ahead-behind-repo.git'), atom.project.getDirectories()[0].resolve('git/working-dir/.git'));
          projectPath = atom.project.getDirectories()[0].resolve('git/working-dir');
          atom.project.setPaths([projectPath]);
          filePath = atom.project.getDirectories()[0].resolve('a.txt');
          repo = atom.project.getRepositories()[0].async;
          waitsForPromise(function() {
            return atom.workspace.open(filePath).then(function() {
              return repo.refreshStatus();
            }).then(function() {
              return gitView.updateStatusPromise;
            });
          });
          return runs(function() {
            var aheadElement, behindElement;
            behindElement = document.body.querySelector(".commits-behind-label");
            aheadElement = document.body.querySelector(".commits-ahead-label");
            expect(aheadElement).not.toBeVisible();
            return expect(behindElement).not.toBeVisible();
          });
        });
      });
      describe("the git branch label", function() {
        var projectPath;
        projectPath = null;
        beforeEach(function() {
          projectPath = atom.project.getDirectories()[0].resolve('git/working-dir');
          fs.moveSync(path.join(projectPath, 'git.git'), path.join(projectPath, '.git'));
          return jasmine.attachToDOM(workspaceElement);
        });
        afterEach(function() {
          return fs.moveSync(path.join(projectPath, '.git'), path.join(projectPath, 'git.git'));
        });
        it("displays the current branch for files in repositories", function() {
          atom.project.setPaths([projectPath]);
          waitsForPromise(function() {
            return atom.workspace.open('a.txt').then(function() {
              return gitView.updateBranchPromise;
            });
          });
          runs(function() {
            var currentBranch;
            currentBranch = atom.project.getRepositories()[0].getShortHead();
            expect(gitView.branchArea).toBeVisible();
            expect(gitView.branchLabel.textContent).toBe(currentBranch);
            atom.workspace.getActivePane().destroyItems();
            expect(gitView.branchArea).toBeVisible();
            expect(gitView.branchLabel.textContent).toBe(currentBranch);
            return atom.workspace.getActivePane().activateItem(dummyView);
          });
          waitsForPromise(function() {
            return gitView.updateBranchPromise;
          });
          return runs(function() {
            return expect(gitView.branchArea).not.toBeVisible();
          });
        });
        it("displays the current branch tooltip", function() {
          atom.project.setPaths([projectPath]);
          waitsForPromise(function() {
            return atom.workspace.open('a.txt').then(function() {
              return gitView.updateBranchPromise;
            });
          });
          return runs(function() {
            var currentBranch;
            currentBranch = atom.project.getRepositories()[0].getShortHead();
            return hover(gitView.branchArea, function() {
              return expect(document.body.querySelector(".tooltip").innerText).toBe("On branch " + currentBranch);
            });
          });
        });
        it("doesn't display the current branch for a file not in a repository", function() {
          atom.project.setPaths([os.tmpdir()]);
          waitsForPromise(function() {
            return atom.workspace.open(path.join(os.tmpdir(), 'temp.txt')).then(function() {
              return gitView.updateBranchPromise;
            });
          });
          return runs(function() {
            return expect(gitView.branchArea).toBeHidden();
          });
        });
        return it("doesn't display the current branch for a file outside the current project", function() {
          waitsForPromise(function() {
            return atom.workspace.open(path.join(os.tmpdir(), 'atom-specs', 'not-in-project.txt')).then(function() {
              return gitView.updateBranchPromise;
            });
          });
          return runs(function() {
            return expect(gitView.branchArea).toBeHidden();
          });
        });
      });
      return describe("the git status label", function() {
        var filePath, ignorePath, ignoredPath, newPath, originalPathText, projectPath, repo, _ref1;
        _ref1 = [], repo = _ref1[0], filePath = _ref1[1], originalPathText = _ref1[2], newPath = _ref1[3], ignorePath = _ref1[4], ignoredPath = _ref1[5], projectPath = _ref1[6];
        beforeEach(function() {
          projectPath = atom.project.getDirectories()[0].resolve('git/working-dir');
          fs.moveSync(path.join(projectPath, 'git.git'), path.join(projectPath, '.git'));
          atom.project.setPaths([projectPath]);
          filePath = atom.project.getDirectories()[0].resolve('a.txt');
          newPath = atom.project.getDirectories()[0].resolve('new.txt');
          fs.writeFileSync(newPath, "I'm new here");
          ignorePath = path.join(projectPath, '.gitignore');
          fs.writeFileSync(ignorePath, 'ignored.txt');
          ignoredPath = path.join(projectPath, 'ignored.txt');
          fs.writeFileSync(ignoredPath, '');
          jasmine.attachToDOM(workspaceElement);
          repo = atom.project.getRepositories()[0].async;
          originalPathText = fs.readFileSync(filePath, 'utf8');
          return waitsForPromise(function() {
            return repo.refreshStatus();
          });
        });
        afterEach(function() {
          fs.writeFileSync(filePath, originalPathText);
          fs.removeSync(newPath);
          fs.removeSync(ignorePath);
          fs.removeSync(ignoredPath);
          return fs.moveSync(path.join(projectPath, '.git'), path.join(projectPath, 'git.git'));
        });
        it("displays the modified icon for a changed file", function() {
          waitsForPromise(function() {
            return atom.workspace.open(filePath).then(function() {
              fs.writeFileSync(filePath, "i've changed for the worse");
              return repo.refreshStatusForPath(filePath);
            }).then(function() {
              return gitView.updateStatusPromise;
            });
          });
          return runs(function() {
            return expect(gitView.gitStatusIcon).toHaveClass('icon-diff-modified');
          });
        });
        it("displays the 1 line added and not committed tooltip", function() {
          waitsForPromise(function() {
            return atom.workspace.open(filePath).then(function() {
              fs.writeFileSync(filePath, "i've changed for the worse");
              return repo.refreshStatusForPath(filePath);
            }).then(function() {
              return gitView.updateStatusPromise;
            });
          });
          return runs(function() {
            return hover(gitView.gitStatusIcon, function() {
              return expect(document.body.querySelector(".tooltip").innerText).toBe("1 line added to this file not yet committed");
            });
          });
        });
        it("displays the x lines added and not committed tooltip", function() {
          waitsForPromise(function() {
            return atom.workspace.open(filePath).then(function() {
              fs.writeFileSync(filePath, "i've changed" + os.EOL + "for the worse");
              return repo.refreshStatusForPath(filePath);
            }).then(function() {
              return gitView.updateStatusPromise;
            });
          });
          return runs(function() {
            return hover(gitView.gitStatusIcon, function() {
              return expect(document.body.querySelector(".tooltip").innerText).toBe("2 lines added to this file not yet committed");
            });
          });
        });
        it("doesn't display the modified icon for an unchanged file", function() {
          waitsForPromise(function() {
            return atom.workspace.open(filePath).then(function() {
              return repo.refreshStatusForPath(filePath);
            }).then(function() {
              return gitView.updateStatusPromise;
            });
          });
          return runs(function() {
            return expect(gitView.gitStatusIcon).toHaveText('');
          });
        });
        it("displays the new icon for a new file", function() {
          waitsForPromise(function() {
            return atom.workspace.open(newPath).then(function() {
              return repo.refreshStatusForPath(newPath);
            }).then(function() {
              return gitView.updateStatusPromise;
            });
          });
          return runs(function() {
            expect(gitView.gitStatusIcon).toHaveClass('icon-diff-added');
            return hover(gitView.gitStatusIcon, function() {
              return expect(document.body.querySelector(".tooltip").innerText).toBe("1 line in this new file not yet committed");
            });
          });
        });
        it("displays the 1 line added and not committed to new file tooltip", function() {
          waitsForPromise(function() {
            return atom.workspace.open(newPath).then(function() {
              return repo.refreshStatusForPath(newPath);
            }).then(function() {
              return gitView.updateStatusPromise;
            });
          });
          return runs(function() {
            return hover(gitView.gitStatusIcon, function() {
              return expect(document.body.querySelector(".tooltip").innerText).toBe("1 line in this new file not yet committed");
            });
          });
        });
        it("displays the x lines added and not committed to new file tooltip", function() {
          fs.writeFileSync(newPath, "I'm new" + os.EOL + "here");
          waitsForPromise(function() {
            return atom.workspace.open(newPath).then(function() {
              return repo.refreshStatusForPath(newPath);
            }).then(function() {
              return gitView.updateStatusPromise;
            });
          });
          return runs(function() {
            return hover(gitView.gitStatusIcon, function() {
              return expect(document.body.querySelector(".tooltip").innerText).toBe("2 lines in this new file not yet committed");
            });
          });
        });
        it("displays the ignored icon for an ignored file", function() {
          waitsForPromise(function() {
            return atom.workspace.open(ignoredPath).then(function() {
              return gitView.updateStatusPromise;
            });
          });
          return runs(function() {
            expect(gitView.gitStatusIcon).toHaveClass('icon-diff-ignored');
            return hover(gitView.gitStatusIcon, function() {
              return expect(document.body.querySelector(".tooltip").innerText).toBe("File is ignored by git");
            });
          });
        });
        it("updates when a status-changed event occurs", function() {
          waitsForPromise(function() {
            return atom.workspace.open(filePath).then(function() {
              fs.writeFileSync(filePath, "i've changed for the worse");
              return repo.refreshStatusForPath(filePath);
            }).then(function() {
              return gitView.updateStatusPromise;
            });
          });
          return runs(function() {
            expect(gitView.gitStatusIcon).toHaveClass('icon-diff-modified');
            waitsForPromise(function() {
              fs.writeFileSync(filePath, originalPathText);
              return repo.refreshStatusForPath(filePath).then(function() {
                return gitView.updateStatusPromise;
              });
            });
            return runs(function() {
              return expect(gitView.gitStatusIcon).not.toHaveClass('icon-diff-modified');
            });
          });
        });
        it("displays the diff stat for modified files", function() {
          waitsForPromise(function() {
            return atom.workspace.open(filePath).then(function() {
              fs.writeFileSync(filePath, "i've changed for the worse");
              return repo.refreshStatusForPath(filePath);
            }).then(function() {
              return gitView.updateStatusPromise;
            });
          });
          return runs(function() {
            return expect(gitView.gitStatusIcon).toHaveText('+1');
          });
        });
        it("displays the diff stat for new files", function() {
          waitsForPromise(function() {
            return atom.workspace.open(newPath).then(function() {
              return repo.refreshStatusForPath(newPath);
            }).then(function() {
              return gitView.updateStatusPromise;
            });
          });
          return runs(function() {
            return expect(gitView.gitStatusIcon).toHaveText('+1');
          });
        });
        return it("does not display for files not in the current project", function() {
          waitsForPromise(function() {
            return atom.workspace.open('/tmp/atom-specs/not-in-project.txt').then(function() {
              return gitView.updateStatusPromise;
            });
          });
          return runs(function() {
            return expect(gitView.gitStatusIcon).toBeHidden();
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvc3RhdHVzLWJhci9zcGVjL2J1aWx0LWluLXRpbGVzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBSFYsQ0FBQTs7QUFBQSxFQUlDLElBQUssT0FBQSxDQUFRLHNCQUFSLEVBQUwsQ0FKRCxDQUFBOztBQUFBLEVBTUEsUUFBQSxDQUFTLDJCQUFULEVBQXNDLFNBQUEsR0FBQTtBQUNwQyxRQUFBLDRDQUFBO0FBQUEsSUFBQSxPQUEyQyxFQUEzQyxFQUFDLG1CQUFELEVBQVksMEJBQVosRUFBOEIsbUJBQTlCLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBbkIsQ0FBQTtBQUFBLE1BQ0EsU0FBQSxHQUFZLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBRFosQ0FBQTtBQUFBLE1BRUEsU0FBQSxHQUFZLElBRlosQ0FBQTtBQUFBLE1BSUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsWUFBOUIsRUFEYztNQUFBLENBQWhCLENBSkEsQ0FBQTthQU9BLElBQUEsQ0FBSyxTQUFBLEdBQUE7ZUFDSCxTQUFBLEdBQVksZ0JBQWdCLENBQUMs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

//# sourceURL=/home/rsoto/.atom/packages/status-bar/spec/built-in-tiles-spec.coffee
