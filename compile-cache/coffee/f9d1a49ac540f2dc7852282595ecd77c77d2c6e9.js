(function() {
  var Point;

  Point = require('atom').Point;

  describe("bracket matching", function() {
    var buffer, editor, editorElement, _ref;
    _ref = [], editorElement = _ref[0], editor = _ref[1], buffer = _ref[2];
    beforeEach(function() {
      atom.config.set('bracket-matcher.autocompleteBrackets', true);
      waitsForPromise(function() {
        return atom.workspace.open('sample.js');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('bracket-matcher');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-javascript');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-xml');
      });
      return runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        editorElement = atom.views.getView(editor);
        return buffer = editor.getBuffer();
      });
    });
    describe("matching bracket highlighting", function() {
      var expectHighlights, expectNoHighlights;
      expectNoHighlights = function() {
        var decorations;
        decorations = editor.getHighlightDecorations().filter(function(decoration) {
          return decoration.properties["class"] === 'bracket-matcher';
        });
        return expect(decorations.length).toBe(0);
      };
      expectHighlights = function(startBufferPosition, endBufferPosition) {
        var decorations;
        decorations = editor.getHighlightDecorations().filter(function(decoration) {
          return decoration.properties["class"] === 'bracket-matcher';
        });
        expect(decorations.length).toBe(2);
        expect(decorations[0].marker.getStartBufferPosition()).toEqual(startBufferPosition);
        return expect(decorations[1].marker.getStartBufferPosition()).toEqual(endBufferPosition);
      };
      describe("when the cursor is before a starting pair", function() {
        return it("highlights the starting pair and ending pair", function() {
          editor.moveToEndOfLine();
          editor.moveLeft();
          return expectHighlights([0, 28], [12, 0]);
        });
      });
      describe("when the cursor is after a starting pair", function() {
        return it("highlights the starting pair and ending pair", function() {
          editor.moveToEndOfLine();
          return expectHighlights([0, 28], [12, 0]);
        });
      });
      describe("when the cursor is before an ending pair", function() {
        return it("highlights the starting pair and ending pair", function() {
          editor.moveToBottom();
          editor.moveLeft();
          editor.moveLeft();
          return expectHighlights([12, 0], [0, 28]);
        });
      });
      describe("when the cursor is after an ending pair", function() {
        return it("highlights the starting pair and ending pair", function() {
          editor.moveToBottom();
          editor.moveLeft();
          return expectHighlights([12, 0], [0, 28]);
        });
      });
      describe("when there are unpaired brackets", function() {
        return it("highlights the correct start/end pairs", function() {
          editor.setText('(()');
          editor.setCursorBufferPosition([0, 0]);
          expectNoHighlights();
          editor.setCursorBufferPosition([0, 1]);
          expectHighlights([0, 1], [0, 2]);
          editor.setCursorBufferPosition([0, 2]);
          expectHighlights([0, 1], [0, 2]);
          editor.setText('())');
          editor.setCursorBufferPosition([0, 0]);
          expectHighlights([0, 0], [0, 1]);
          editor.setCursorBufferPosition([0, 1]);
          expectHighlights([0, 0], [0, 1]);
          editor.setCursorBufferPosition([0, 2]);
          return expectNoHighlights();
        });
      });
      describe("when the cursor is moved off a pair", function() {
        return it("removes the starting pair and ending pair highlights", function() {
          editor.moveToEndOfLine();
          expectHighlights([0, 28], [12, 0]);
          editor.moveToBeginningOfLine();
          return expectNoHighlights();
        });
      });
      describe("when the pair moves", function() {
        return it("repositions the highlights", function() {
          editor.moveToEndOfLine();
          editor.moveLeft();
          expectHighlights([0, 28], [12, 0]);
          editor.deleteToBeginningOfLine();
          return expectHighlights([0, 0], [12, 0]);
        });
      });
      describe("pair balancing", function() {
        return describe("when a second starting pair preceeds the first ending pair", function() {
          return it("advances to the second ending pair", function() {
            editor.setCursorBufferPosition([8, 42]);
            return expectHighlights([8, 42], [8, 54]);
          });
        });
      });
      describe("when the cursor is destroyed", function() {
        return it("updates the highlights to use the editor's last cursor", function() {
          editor.setCursorBufferPosition([0, 29]);
          editor.addCursorAtBufferPosition([9, 0]);
          expectHighlights([0, 28], [12, 0]);
          editor.getCursors()[0].destroy();
          expectNoHighlights();
          editor.setCursorBufferPosition([0, 29]);
          return expectHighlights([0, 28], [12, 0]);
        });
      });
      return describe("HTML/XML tag matching", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('sample.xml');
          });
          return runs(function() {
            editor = atom.workspace.getActiveTextEditor();
            editorElement = atom.views.getView(editor);
            return buffer = editor.buffer, editor;
          });
        });
        describe("when on an opening tag", function() {
          return it("highlight the opening and closing tag", function() {
            buffer.setText("<test>\n  <test>text</test>\n  <!-- </test> -->\n</test>");
            editor.setCursorBufferPosition([0, 0]);
            expectHighlights([0, 1], [3, 2]);
            editor.setCursorBufferPosition([0, 1]);
            return expectHighlights([0, 1], [3, 2]);
          });
        });
        describe("when on a closing tag", function() {
          return it("highlight the opening and closing tag", function() {
            buffer.setText("<test>\n  <!-- <test> -->\n  <test>text</test>\n</test>");
            editor.setCursorBufferPosition([3, 0]);
            expectHighlights([3, 2], [0, 1]);
            editor.setCursorBufferPosition([3, 2]);
            expectHighlights([3, 2], [0, 1]);
            buffer.setText("<test>\n  <test>text</test>\n  <test>text</test>\n</test>");
            editor.setCursorBufferPosition([1, Infinity]);
            expectHighlights([1, 14], [1, 3]);
            editor.setCursorBufferPosition([2, Infinity]);
            return expectHighlights([2, 14], [2, 3]);
          });
        });
        describe("when the tag spans multiple lines", function() {
          return it("highlights the opening and closing tag", function() {
            buffer.setText("<test\n  a=\"test\">\n  text\n</test>");
            editor.setCursorBufferPosition([3, 2]);
            expectHighlights([3, 2], [0, 1]);
            editor.setCursorBufferPosition([0, 1]);
            return expectHighlights([0, 1], [3, 2]);
          });
        });
        describe("when the tag has attributes", function() {
          return it("highlights the opening and closing tags", function() {
            buffer.setText("<test a=\"test\">\n  text\n</test>");
            editor.setCursorBufferPosition([2, 2]);
            expectHighlights([2, 2], [0, 1]);
            editor.setCursorBufferPosition([0, 7]);
            return expectHighlights([0, 1], [2, 2]);
          });
        });
        return describe("when the opening and closing tags are on the same line", function() {
          return it("highlight the opening and closing tags", function() {
            buffer.setText("<test>text</test>");
            editor.setCursorBufferPosition([0, 2]);
            expectHighlights([0, 1], [0, 12]);
            editor.setCursorBufferPosition([0, 12]);
            return expectHighlights([0, 12], [0, 1]);
          });
        });
      });
    });
    describe("when bracket-matcher:go-to-matching-bracket is triggered", function() {
      describe("when the cursor is before the starting pair", function() {
        return it("moves the cursor to after the ending pair", function() {
          editor.moveToEndOfLine();
          editor.moveLeft();
          atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
          return expect(editor.getCursorBufferPosition()).toEqual([12, 1]);
        });
      });
      describe("when the cursor is after the starting pair", function() {
        return it("moves the cursor to before the ending pair", function() {
          editor.moveToEndOfLine();
          atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
          return expect(editor.getCursorBufferPosition()).toEqual([12, 0]);
        });
      });
      describe("when the cursor is before the ending pair", function() {
        return it("moves the cursor to after the starting pair", function() {
          editor.setCursorBufferPosition([12, 0]);
          atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 29]);
        });
      });
      describe("when the cursor is after the ending pair", function() {
        return it("moves the cursor to before the starting pair", function() {
          editor.setCursorBufferPosition([12, 1]);
          atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 28]);
        });
      });
      return describe("when the cursor is not adjacent to a pair", function() {
        describe("when within a `{}` pair", function() {
          return it("moves the cursor to before the enclosing brace", function() {
            editor.setCursorBufferPosition([11, 2]);
            atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
            return expect(editor.getCursorBufferPosition()).toEqual([0, 28]);
          });
        });
        describe("when within a `()` pair", function() {
          return it("moves the cursor to before the enclosing brace", function() {
            editor.setCursorBufferPosition([2, 14]);
            atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
            return expect(editor.getCursorBufferPosition()).toEqual([2, 7]);
          });
        });
        return describe('in HTML/XML files', function() {
          beforeEach(function() {
            waitsForPromise(function() {
              return atom.workspace.open('sample.xml');
            });
            return runs(function() {
              editor = atom.workspace.getActiveTextEditor();
              editorElement = atom.views.getView(editor);
              return buffer = editor.buffer, editor;
            });
          });
          describe('when within a <tag></tag> pair', function() {
            return it("moves the cursor to the starting tag", function() {
              editor.setCursorBufferPosition([5, 10]);
              atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
              return expect(editor.getCursorBufferPosition()).toEqual([4, 9]);
            });
          });
          describe('when on a starting <tag>', function() {
            return it('moves the cursor to the end </tag>', function() {
              editor.setCursorBufferPosition([1, 2]);
              atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
              expect(editor.getCursorBufferPosition()).toEqual([15, 2]);
              editor.setCursorBufferPosition([1, 3]);
              atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
              expect(editor.getCursorBufferPosition()).toEqual([15, 4]);
              editor.setCursorBufferPosition([1, 4]);
              atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
              expect(editor.getCursorBufferPosition()).toEqual([15, 5]);
              editor.setCursorBufferPosition([1, 5]);
              atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
              expect(editor.getCursorBufferPosition()).toEqual([15, 6]);
              editor.setCursorBufferPosition([1, 6]);
              atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
              expect(editor.getCursorBufferPosition()).toEqual([15, 7]);
              editor.setCursorBufferPosition([1, 7]);
              atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
              expect(editor.getCursorBufferPosition()).toEqual([15, 8]);
              editor.setCursorBufferPosition([1, 8]);
              atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
              expect(editor.getCursorBufferPosition()).toEqual([15, 8]);
              editor.setCursorBufferPosition([1, 9]);
              atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
              expect(editor.getCursorBufferPosition()).toEqual([15, 8]);
              editor.setCursorBufferPosition([1, 10]);
              atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
              expect(editor.getCursorBufferPosition()).toEqual([15, 8]);
              editor.setCursorBufferPosition([1, 16]);
              atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
              return expect(editor.getCursorBufferPosition()).toEqual([15, 8]);
            });
          });
          return describe('when on an ending </tag>', function() {
            return it('moves the cursor to the start <tag>', function() {
              editor.setCursorBufferPosition([15, 2]);
              atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
              expect(editor.getCursorBufferPosition()).toEqual([1, 2]);
              editor.setCursorBufferPosition([15, 3]);
              atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
              expect(editor.getCursorBufferPosition()).toEqual([1, 3]);
              editor.setCursorBufferPosition([15, 4]);
              atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
              expect(editor.getCursorBufferPosition()).toEqual([1, 3]);
              editor.setCursorBufferPosition([15, 5]);
              atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
              expect(editor.getCursorBufferPosition()).toEqual([1, 4]);
              editor.setCursorBufferPosition([15, 6]);
              atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
              expect(editor.getCursorBufferPosition()).toEqual([1, 5]);
              editor.setCursorBufferPosition([15, 7]);
              atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
              expect(editor.getCursorBufferPosition()).toEqual([1, 6]);
              editor.setCursorBufferPosition([15, 8]);
              atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
              expect(editor.getCursorBufferPosition()).toEqual([1, 7]);
              editor.setCursorBufferPosition([15, 9]);
              atom.commands.dispatch(editorElement, "bracket-matcher:go-to-matching-bracket");
              return expect(editor.getCursorBufferPosition()).toEqual([1, 7]);
            });
          });
        });
      });
    });
    describe("when bracket-matcher:go-to-enclosing-bracket is triggered", function() {
      describe("when within a `{}` pair", function() {
        return it("moves the cursor to before the enclosing brace", function() {
          editor.setCursorBufferPosition([11, 2]);
          atom.commands.dispatch(editorElement, "bracket-matcher:go-to-enclosing-bracket");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 28]);
        });
      });
      return describe("when within a `()` pair", function() {
        return it("moves the cursor to before the enclosing brace", function() {
          editor.setCursorBufferPosition([2, 14]);
          atom.commands.dispatch(editorElement, "bracket-matcher:go-to-enclosing-bracket");
          return expect(editor.getCursorBufferPosition()).toEqual([2, 7]);
        });
      });
    });
    describe("when bracket-match:select-inside-brackets is triggered", function() {
      describe("when the cursor on the left side of a bracket", function() {
        return it("selects the text inside the brackets", function() {
          editor.setCursorBufferPosition([0, 28]);
          atom.commands.dispatch(editorElement, "bracket-matcher:select-inside-brackets");
          return expect(editor.getSelectedBufferRange()).toEqual([[0, 29], [12, 0]]);
        });
      });
      describe("when the cursor on the right side of a bracket", function() {
        return it("selects the text inside the brackets", function() {
          editor.setCursorBufferPosition([1, 30]);
          atom.commands.dispatch(editorElement, "bracket-matcher:select-inside-brackets");
          return expect(editor.getSelectedBufferRange()).toEqual([[1, 30], [9, 2]]);
        });
      });
      describe("when the cursor is inside the brackets", function() {
        return it("selects the text for the closest outer brackets", function() {
          editor.setCursorBufferPosition([6, 6]);
          atom.commands.dispatch(editorElement, "bracket-matcher:select-inside-brackets");
          return expect(editor.getSelectedBufferRange()).toEqual([[4, 29], [7, 4]]);
        });
      });
      return describe('HTML/XML text', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('sample.xml');
          });
          return runs(function() {
            editor = atom.workspace.getActiveTextEditor();
            editorElement = atom.views.getView(editor);
            return buffer = editor.buffer, editor;
          });
        });
        describe('when the cursor is on a starting tag', function() {
          return it('selects the text inside the starting/closing tag', function() {
            editor.setCursorBufferPosition([4, 9]);
            atom.commands.dispatch(editorElement, "bracket-matcher:select-inside-brackets");
            return expect(editor.getSelectedBufferRange()).toEqual([[4, 13], [6, 8]]);
          });
        });
        describe('when the cursor is on an ending tag', function() {
          return it('selects the text inside the starting/closing tag', function() {
            editor.setCursorBufferPosition([15, 8]);
            atom.commands.dispatch(editorElement, "bracket-matcher:select-inside-brackets");
            return expect(editor.getSelectedBufferRange()).toEqual([[1, 8], [15, 2]]);
          });
        });
        return describe('when the cursor is inside a tag', function() {
          return it('selects the text inside the starting/closing tag', function() {
            editor.setCursorBufferPosition([12, 8]);
            atom.commands.dispatch(editorElement, "bracket-matcher:select-inside-brackets");
            return expect(editor.getSelectedBufferRange()).toEqual([[11, 11], [13, 6]]);
          });
        });
      });
    });
    describe("when bracket-matcher:remove-matching-brackets is triggered", function() {
      describe("when the cursor is not in front of any pair", function() {
        return it("performs a regular backspace action", function() {
          editor.setCursorBufferPosition([0, 1]);
          atom.commands.dispatch(editorElement, "bracket-matcher:remove-matching-brackets");
          expect(editor.lineTextForBufferRow(0)).toEqual('ar quicksort = function () {');
          return expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
        });
      });
      describe("when the cursor is at the beginning of a line", function() {
        return it("performs a regular backspace action", function() {
          editor.setCursorBufferPosition([12, 0]);
          atom.commands.dispatch(editorElement, "bracket-matcher:remove-matching-brackets");
          expect(editor.lineTextForBufferRow(11)).toEqual('  return sort(Array.apply(this, arguments));};');
          return expect(editor.getCursorBufferPosition()).toEqual([11, 44]);
        });
      });
      describe("when the cursor is on the left side of a starting pair", function() {
        return it("performs a regular backspace action", function() {
          editor.setCursorBufferPosition([0, 28]);
          atom.commands.dispatch(editorElement, "bracket-matcher:remove-matching-brackets");
          expect(editor.lineTextForBufferRow(0)).toEqual('var quicksort = function (){');
          return expect(editor.getCursorBufferPosition()).toEqual([0, 27]);
        });
      });
      describe("when the cursor is on the left side of an ending pair", function() {
        return it("performs a regular backspace action", function() {
          editor.setCursorBufferPosition([7, 4]);
          atom.commands.dispatch(editorElement, "bracket-matcher:remove-matching-brackets");
          expect(editor.lineTextForBufferRow(7)).toEqual('  }');
          return expect(editor.getCursorBufferPosition()).toEqual([7, 2]);
        });
      });
      describe("when the cursor is on the right side of a starting pair, the ending pair on another line", function() {
        return it("removes both pairs", function() {
          editor.setCursorBufferPosition([0, 29]);
          atom.commands.dispatch(editorElement, "bracket-matcher:remove-matching-brackets");
          expect(editor.lineTextForBufferRow(0)).toEqual('var quicksort = function () ');
          expect(editor.lineTextForBufferRow(12)).toEqual(';');
          return expect(editor.getCursorBufferPosition()).toEqual([0, 28]);
        });
      });
      describe("when the cursor is on the right side of an ending pair, the starting pair on another line", function() {
        return it("removes both pairs", function() {
          editor.setCursorBufferPosition([7, 5]);
          atom.commands.dispatch(editorElement, "bracket-matcher:remove-matching-brackets");
          expect(editor.lineTextForBufferRow(4)).toEqual('    while(items.length > 0) ');
          expect(editor.lineTextForBufferRow(7)).toEqual('    ');
          return expect(editor.getCursorBufferPosition()).toEqual([7, 4]);
        });
      });
      describe("when the cursor is on the right side of a starting pair, the ending pair on the same line", function() {
        return it("removes both pairs", function() {
          editor.setCursorBufferPosition([11, 14]);
          atom.commands.dispatch(editorElement, "bracket-matcher:remove-matching-brackets");
          expect(editor.lineTextForBufferRow(11)).toEqual('  return sortArray.apply(this, arguments);');
          return expect(editor.getCursorBufferPosition()).toEqual([11, 13]);
        });
      });
      describe("when the cursor is on the right side of an ending pair, the starting pair on the same line", function() {
        return it("removes both pairs", function() {
          editor.setCursorBufferPosition([11, 43]);
          atom.commands.dispatch(editorElement, "bracket-matcher:remove-matching-brackets");
          expect(editor.lineTextForBufferRow(11)).toEqual('  return sortArray.apply(this, arguments);');
          return expect(editor.getCursorBufferPosition()).toEqual([11, 41]);
        });
      });
      describe("when a starting pair is selected", function() {
        return it("removes both pairs", function() {
          editor.setSelectedBufferRange([[11, 13], [11, 14]]);
          atom.commands.dispatch(editorElement, "bracket-matcher:remove-matching-brackets");
          expect(editor.lineTextForBufferRow(11)).toEqual('  return sortArray.apply(this, arguments);');
          return expect(editor.getCursorBufferPosition()).toEqual([11, 13]);
        });
      });
      return describe("when an ending pair is selected", function() {
        return it("removes both pairs", function() {
          editor.setSelectedBufferRange([[11, 42], [11, 43]]);
          atom.commands.dispatch(editorElement, "bracket-matcher:remove-matching-brackets");
          expect(editor.lineTextForBufferRow(11)).toEqual('  return sortArray.apply(this, arguments);');
          return expect(editor.getCursorBufferPosition()).toEqual([11, 41]);
        });
      });
    });
    describe("matching bracket deletion", function() {
      beforeEach(function() {
        return editor.buffer.setText("");
      });
      describe("when selection is not a matching pair of brackets", function() {
        return it("does not change the text", function() {
          editor.insertText("\"woah(");
          editor.selectAll();
          atom.commands.dispatch(editorElement, "bracket-matcher:remove-brackets-from-selection");
          return expect(editor.buffer.getText()).toBe("\"woah(");
        });
      });
      return describe("when selecting a matching pair of brackets", function() {
        describe("on the same line", function() {
          beforeEach(function() {
            editor.buffer.setText("it \"does something\", :meta => true");
            editor.setSelectedBufferRange([[0, 3], [0, 19]]);
            return atom.commands.dispatch(editorElement, "bracket-matcher:remove-brackets-from-selection");
          });
          it("removes the brackets", function() {
            return expect(editor.buffer.getText()).toBe("it does something, :meta => true");
          });
          return it("selects the newly unbracketed text", function() {
            return expect(editor.getSelectedText()).toBe("does something");
          });
        });
        return describe("on separate lines", function() {
          beforeEach(function() {
            editor.buffer.setText("it (\"does something\" do\nend)");
            editor.setSelectedBufferRange([[0, 3], [1, 4]]);
            return atom.commands.dispatch(editorElement, "bracket-matcher:remove-brackets-from-selection");
          });
          it("removes the brackets", function() {
            return expect(editor.buffer.getText()).toBe("it \"does something\" do\nend");
          });
          return it("selects the newly unbracketed text", function() {
            return expect(editor.getSelectedText()).toBe("\"does something\" do\nend");
          });
        });
      });
    });
    describe("matching bracket insertion", function() {
      beforeEach(function() {
        editor.buffer.setText("");
        return atom.config.set('editor.autoIndent', true);
      });
      describe("when more than one character is inserted", function() {
        return it("does not insert a matching bracket", function() {
          editor.insertText("woah(");
          return expect(editor.buffer.getText()).toBe("woah(");
        });
      });
      describe("when there is a word character after the cursor", function() {
        return it("does not insert a matching bracket", function() {
          editor.buffer.setText("ab");
          editor.setCursorBufferPosition([0, 1]);
          editor.insertText("(");
          return expect(editor.buffer.getText()).toBe("a(b");
        });
      });
      describe("when autocompleteBrackets configuration is disabled globally", function() {
        return it("does not insert a matching bracket", function() {
          atom.config.set('bracket-matcher.autocompleteBrackets', false);
          editor.buffer.setText("}");
          editor.setCursorBufferPosition([0, 0]);
          editor.insertText('{');
          expect(buffer.lineForRow(0)).toBe("{}");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
        });
      });
      describe("when autocompleteBrackets configuration is disabled in scope", function() {
        return it("does not insert a matching bracket", function() {
          atom.config.set('bracket-matcher.autocompleteBrackets', true);
          atom.config.set('bracket-matcher.autocompleteBrackets', false, {
            scopeSelector: '.source.js'
          });
          editor.buffer.setText("}");
          editor.setCursorBufferPosition([0, 0]);
          editor.insertText('{');
          expect(buffer.lineForRow(0)).toBe("{}");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
        });
      });
      describe("when there are multiple cursors", function() {
        return it("inserts ) at each cursor", function() {
          editor.buffer.setText("()\nab\n[]\n12");
          editor.setCursorBufferPosition([3, 1]);
          editor.addCursorAtBufferPosition([2, 1]);
          editor.addCursorAtBufferPosition([1, 1]);
          editor.addCursorAtBufferPosition([0, 1]);
          editor.insertText(')');
          return expect(editor.buffer.getText()).toBe("())\na)b\n[)]\n1)2");
        });
      });
      describe("when there is a non-word character after the cursor", function() {
        return it("inserts a closing bracket after an opening bracket is inserted", function() {
          editor.buffer.setText("}");
          editor.setCursorBufferPosition([0, 0]);
          editor.insertText('{');
          expect(buffer.lineForRow(0)).toBe("{}}");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
        });
      });
      describe("when the cursor is at the end of the line", function() {
        return it("inserts a closing bracket after an opening bracket is inserted", function() {
          editor.buffer.setText("");
          editor.insertText('{');
          expect(buffer.lineForRow(0)).toBe("{}");
          expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
          editor.buffer.setText("");
          editor.insertText('(');
          expect(buffer.lineForRow(0)).toBe("()");
          expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
          editor.buffer.setText("");
          editor.insertText('[');
          expect(buffer.lineForRow(0)).toBe("[]");
          expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
          editor.buffer.setText("");
          editor.insertText('"');
          expect(buffer.lineForRow(0)).toBe('""');
          expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
          editor.buffer.setText("");
          editor.insertText("'");
          expect(buffer.lineForRow(0)).toBe("''");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
        });
      });
      describe("when the cursor is on a closing bracket and a closing bracket is inserted", function() {
        describe("when the closing bracket was there previously", function() {
          return it("inserts a closing bracket", function() {
            editor.insertText('()x');
            editor.setCursorBufferPosition([0, 1]);
            editor.insertText(')');
            expect(buffer.lineForRow(0)).toBe("())x");
            return expect(editor.getCursorBufferPosition().column).toBe(2);
          });
        });
        return describe("when the closing bracket was automatically inserted from inserting an opening bracket", function() {
          it("only moves cursor over the closing bracket one time", function() {
            editor.insertText('(');
            expect(buffer.lineForRow(0)).toBe("()");
            editor.setCursorBufferPosition([0, 1]);
            editor.insertText(')');
            expect(buffer.lineForRow(0)).toBe("()");
            expect(editor.getCursorBufferPosition()).toEqual([0, 2]);
            editor.setCursorBufferPosition([0, 1]);
            editor.insertText(')');
            expect(buffer.lineForRow(0)).toBe("())");
            return expect(editor.getCursorBufferPosition()).toEqual([0, 2]);
          });
          it("moves cursor over the closing bracket after other text is inserted", function() {
            editor.insertText('(');
            editor.insertText('ok cool');
            expect(buffer.lineForRow(0)).toBe("(ok cool)");
            editor.setCursorBufferPosition([0, 8]);
            editor.insertText(')');
            expect(buffer.lineForRow(0)).toBe("(ok cool)");
            return expect(editor.getCursorBufferPosition()).toEqual([0, 9]);
          });
          it("works with nested brackets", function() {
            editor.insertText('(');
            editor.insertText('1');
            editor.insertText('(');
            editor.insertText('2');
            expect(buffer.lineForRow(0)).toBe("(1(2))");
            editor.setCursorBufferPosition([0, 4]);
            editor.insertText(')');
            expect(buffer.lineForRow(0)).toBe("(1(2))");
            expect(editor.getCursorBufferPosition()).toEqual([0, 5]);
            editor.insertText(')');
            expect(buffer.lineForRow(0)).toBe("(1(2))");
            return expect(editor.getCursorBufferPosition()).toEqual([0, 6]);
          });
          it("works with mixed brackets", function() {
            editor.insertText('(');
            editor.insertText('}');
            expect(buffer.lineForRow(0)).toBe("(})");
            editor.insertText(')');
            expect(buffer.lineForRow(0)).toBe("(})");
            return expect(editor.getCursorBufferPosition()).toEqual([0, 3]);
          });
          return it("closes brackets with the same begin/end character correctly", function() {
            editor.insertText('"');
            editor.insertText('ok');
            expect(buffer.lineForRow(0)).toBe('"ok"');
            expect(editor.getCursorBufferPosition()).toEqual([0, 3]);
            editor.insertText('"');
            expect(buffer.lineForRow(0)).toBe('"ok"');
            return expect(editor.getCursorBufferPosition()).toEqual([0, 4]);
          });
        });
      });
      describe("when there is text selected on a single line", function() {
        it("wraps the selection with brackets", function() {
          editor.setText('text');
          editor.moveToBottom();
          editor.selectToTop();
          editor.selectAll();
          editor.insertText('(');
          expect(buffer.getText()).toBe('(text)');
          expect(editor.getSelectedBufferRange()).toEqual([[0, 1], [0, 5]]);
          return expect(editor.getLastSelection().isReversed()).toBeTruthy();
        });
        describe("when the bracket-matcher.wrapSelectionsInBrackets is falsy globally", function() {
          return it("does not wrap the selection in brackets", function() {
            atom.config.set('bracket-matcher.wrapSelectionsInBrackets', false);
            editor.setText('text');
            editor.moveToBottom();
            editor.selectToTop();
            editor.selectAll();
            editor.insertText('(');
            expect(buffer.getText()).toBe('(');
            return expect(editor.getSelectedBufferRange()).toEqual([[0, 1], [0, 1]]);
          });
        });
        return describe("when the bracket-matcher.wrapSelectionsInBrackets is falsy in scope", function() {
          return it("does not wrap the selection in brackets", function() {
            atom.config.set('bracket-matcher.wrapSelectionsInBrackets', true);
            atom.config.set('bracket-matcher.wrapSelectionsInBrackets', false, {
              scopeSelector: '.source.js'
            });
            editor.setText('text');
            editor.moveToBottom();
            editor.selectToTop();
            editor.selectAll();
            editor.insertText('(');
            expect(buffer.getText()).toBe('(');
            return expect(editor.getSelectedBufferRange()).toEqual([[0, 1], [0, 1]]);
          });
        });
      });
      describe("when there is text selected on multiple lines", function() {
        it("wraps the selection with brackets", function() {
          editor.insertText('text\nabcd');
          editor.moveToBottom();
          editor.selectToTop();
          editor.selectAll();
          editor.insertText('(');
          expect('(text\nabcd)').toBe(buffer.getText());
          expect(editor.getSelectedBufferRange()).toEqual([[0, 1], [1, 4]]);
          return expect(editor.getLastSelection().isReversed()).toBeTruthy();
        });
        return describe("when there are multiple selections", function() {
          return it("wraps each selection with brackets", function() {
            editor.setText("a b\nb c\nc b");
            editor.setSelectedBufferRanges([[[0, 2], [0, 3]], [[1, 0], [1, 1]], [[2, 2], [2, 3]]]);
            editor.insertText('"');
            expect(editor.getSelectedBufferRanges()).toEqual([[[0, 3], [0, 4]], [[1, 1], [1, 2]], [[2, 3], [2, 4]]]);
            expect(buffer.lineForRow(0)).toBe('a "b"');
            expect(buffer.lineForRow(1)).toBe('"b" c');
            return expect(buffer.lineForRow(2)).toBe('c "b"');
          });
        });
      });
      describe("when inserting a quote", function() {
        describe("when a word character is before the cursor", function() {
          return it("does not automatically insert the closing quote", function() {
            editor.buffer.setText("abc");
            editor.moveToEndOfLine();
            editor.insertText('"');
            expect(editor.getText()).toBe('abc"');
            editor.buffer.setText("abc");
            editor.moveToEndOfLine();
            editor.insertText("'");
            return expect(editor.getText()).toBe("abc'");
          });
        });
        describe("when a backslash character is before the cursor", function() {
          return it("does not automatically insert the closing quote", function() {
            editor.buffer.setText("\\");
            editor.moveToEndOfLine();
            editor.insertText('"');
            expect(editor.getText()).toBe('\\"');
            editor.buffer.setText("\\");
            editor.moveToEndOfLine();
            editor.insertText("'");
            return expect(editor.getText()).toBe("\\'");
          });
        });
        describe("when an escape sequence is before the cursor", function() {
          return it("does not automatically insert the closing quote", function() {
            editor.buffer.setText('"\\"');
            editor.moveToEndOfLine();
            editor.insertText('"');
            expect(editor.getText()).toBe('"\\""');
            editor.buffer.setText("\"\\'");
            editor.moveToEndOfLine();
            editor.insertText('"');
            expect(editor.getText()).toBe("\"\\'\"");
            editor.buffer.setText("'\\\"");
            editor.moveToEndOfLine();
            editor.insertText("'");
            expect(editor.getText()).toBe("'\\\"'");
            editor.buffer.setText("'\\'");
            editor.moveToEndOfLine();
            editor.insertText("'");
            return expect(editor.getText()).toBe("'\\''");
          });
        });
        describe("when a quote is before the cursor", function() {
          return it("does not automatically insert the closing quote", function() {
            editor.buffer.setText("''");
            editor.moveToEndOfLine();
            editor.insertText("'");
            expect(editor.getText()).toBe("'''");
            editor.buffer.setText('""');
            editor.moveToEndOfLine();
            editor.insertText('"');
            expect(editor.getText()).toBe('"""');
            editor.buffer.setText('``');
            editor.moveToEndOfLine();
            editor.insertText('`');
            expect(editor.getText()).toBe('```');
            editor.buffer.setText("''");
            editor.moveToEndOfLine();
            editor.insertText('"');
            return expect(editor.getText()).toBe("''\"\"");
          });
        });
        describe("when a non word character is before the cursor", function() {
          return it("automatically inserts the closing quote", function() {
            editor.buffer.setText("ab@");
            editor.moveToEndOfLine();
            editor.insertText('"');
            expect(editor.getText()).toBe('ab@""');
            return expect(editor.getCursorBufferPosition()).toEqual([0, 4]);
          });
        });
        describe("when the cursor is on an empty line", function() {
          return it("automatically inserts the closing quote", function() {
            editor.buffer.setText("");
            editor.insertText('"');
            expect(editor.getText()).toBe('""');
            return expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
          });
        });
        describe("when the select option to Editor::insertText is true", function() {
          return it("does not automatically insert the closing quote", function() {
            editor.buffer.setText("");
            editor.insertText('"', {
              select: true
            });
            expect(editor.getText()).toBe('"');
            return expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
          });
        });
        return describe("when the undo option to Editor::insertText is 'skip'", function() {
          return it("does not automatically insert the closing quote", function() {
            editor.buffer.setText("");
            editor.insertText('"', {
              undo: 'skip'
            });
            expect(editor.getText()).toBe('"');
            return expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
          });
        });
      });
      describe("when return is pressed inside a matching pair", function() {
        it("puts the cursor on the indented empty line", function() {
          editor.insertText('void main() ');
          editor.insertText('{');
          expect(editor.getText()).toBe('void main() {}');
          editor.insertNewline();
          expect(editor.getCursorBufferPosition()).toEqual([1, 2]);
          expect(buffer.lineForRow(1)).toBe('  ');
          expect(buffer.lineForRow(2)).toBe('}');
          editor.setText('  void main() ');
          editor.insertText('{');
          expect(editor.getText()).toBe('  void main() {}');
          editor.insertNewline();
          expect(editor.getCursorBufferPosition()).toEqual([1, 4]);
          expect(buffer.lineForRow(1)).toBe('    ');
          return expect(buffer.lineForRow(2)).toBe('  }');
        });
        describe("when undo is triggered", function() {
          return it("removes both newlines", function() {
            editor.insertText('void main() ');
            editor.insertText('{');
            editor.insertNewline();
            editor.undo();
            return expect(editor.getText()).toBe('void main() {}');
          });
        });
        return describe('when editor.autoIndent is disabled', function() {
          beforeEach(function() {
            return atom.config.set('editor.autoIndent', false);
          });
          return it('does not auto-indent the empty line and closing bracket', function() {
            editor.insertText('  void main() ');
            editor.insertText('{');
            expect(editor.getText()).toBe('  void main() {}');
            editor.insertNewline();
            expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
            expect(buffer.lineForRow(1)).toBe('');
            return expect(buffer.lineForRow(2)).toBe('}');
          });
        });
      });
      return describe("when in language specific scope", function() {
        return describe("string interpolation", function() {
          beforeEach(function() {
            waitsForPromise(function() {
              return atom.packages.activatePackage("language-ruby");
            });
            return runs(function() {
              return buffer.setPath('foo.rb');
            });
          });
          it("should insert curly braces inside doubly quoted string", function() {
            editor.insertText("foo = ");
            editor.insertText('"');
            editor.insertText("#");
            expect(editor.getText()).toBe('foo = "#{}"');
            editor.undo();
            return expect(editor.getText()).toBe('foo = ""');
          });
          it("should not insert curly braces inside singly quoted string", function() {
            editor.insertText("foo = ");
            editor.insertText("'");
            editor.insertText("#");
            return expect(editor.getText()).toBe("foo = '#'");
          });
          it("should insert curly braces inside % string", function() {
            editor.insertText("foo = %");
            editor.insertText('(');
            editor.insertText("#");
            return expect(editor.getText()).toBe('foo = %(#{})');
          });
          it("should not insert curly braces inside non-interpolated % string", function() {
            editor.insertText("foo = %q");
            editor.insertText("(");
            editor.insertText("#");
            return expect(editor.getText()).toBe("foo = %q(#)");
          });
          it("should insert curly braces inside interpolated symbol", function() {
            editor.insertText("foo = :");
            editor.insertText('"');
            editor.insertText("#");
            return expect(editor.getText()).toBe('foo = :"#{}"');
          });
          it('wraps the selection in the interpolation brackets when the selection is a single line', function() {
            editor.setText('foo = "a bar"');
            editor.setSelectedBufferRange([[0, 9], [0, 12]]);
            editor.insertText('#');
            expect(editor.getText()).toBe('foo = "a #{bar}"');
            expect(editor.getSelectedBufferRange()).toEqual([[0, 11], [0, 14]]);
            editor.undo();
            expect(editor.getText()).toBe('foo = "a bar"');
            return expect(editor.getSelectedBufferRange()).toEqual([[0, 9], [0, 12]]);
          });
          return it('does not wrap the selection in the interpolation brackets when the selection is mutli-line', function() {
            editor.setText('foo = "a bar"\nfoo = "a bar"');
            editor.setSelectedBufferRange([[0, 9], [1, 12]]);
            editor.insertText('#');
            expect(editor.getText()).toBe('foo = "a #{}"');
            expect(editor.getSelectedBufferRange()).toEqual([[0, 11], [0, 11]]);
            editor.undo();
            expect(editor.getText()).toBe('foo = "a bar"\nfoo = "a bar"');
            return expect(editor.getSelectedBufferRange()).toEqual([[0, 9], [1, 12]]);
          });
        });
      });
    });
    describe("matching bracket deletion", function() {
      it("deletes the end bracket when it directly precedes a begin bracket that is being backspaced", function() {
        buffer.setText("");
        editor.setCursorBufferPosition([0, 0]);
        editor.insertText('{');
        expect(buffer.lineForRow(0)).toBe("{}");
        editor.backspace();
        return expect(buffer.lineForRow(0)).toBe("");
      });
      it("does not delete end bracket even if it directly precedes a begin bracket if autocomplete is turned off globally", function() {
        atom.config.set('bracket-matcher.autocompleteBrackets', false);
        buffer.setText("");
        editor.setCursorBufferPosition([0, 0]);
        editor.insertText("{");
        expect(buffer.lineForRow(0)).toBe("{");
        editor.insertText("}");
        expect(buffer.lineForRow(0)).toBe("{}");
        editor.setCursorBufferPosition([0, 1]);
        editor.backspace();
        return expect(buffer.lineForRow(0)).toBe("}");
      });
      return it("does not delete end bracket even if it directly precedes a begin bracket if autocomplete is turned off in scope", function() {
        atom.config.set('bracket-matcher.autocompleteBrackets', true);
        atom.config.set('bracket-matcher.autocompleteBrackets', false, {
          scopeSelector: '.source.js'
        });
        buffer.setText("");
        editor.setCursorBufferPosition([0, 0]);
        editor.insertText("{");
        expect(buffer.lineForRow(0)).toBe("{");
        editor.insertText("}");
        expect(buffer.lineForRow(0)).toBe("{}");
        editor.setCursorBufferPosition([0, 1]);
        editor.backspace();
        return expect(buffer.lineForRow(0)).toBe("}");
      });
    });
    return describe('bracket-matcher:close-tag', function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.html');
        });
        return runs(function() {
          editor = atom.workspace.getActiveTextEditor();
          editorElement = atom.views.getView(editor);
          return buffer = editor.buffer, editor;
        });
      });
      it('closes the first unclosed tag', function() {
        editor.setCursorBufferPosition([5, 14]);
        atom.commands.dispatch(editorElement, 'bracket-matcher:close-tag');
        expect(editor.getCursorBufferPosition()).toEqual([5, 18]);
        return expect(editor.getTextInRange([[5, 14], [5, 18]])).toEqual('</a>');
      });
      it('closes the following unclosed tags if called repeatedly', function() {
        editor.setCursorBufferPosition([5, 14]);
        atom.commands.dispatch(editorElement, 'bracket-matcher:close-tag');
        atom.commands.dispatch(editorElement, 'bracket-matcher:close-tag');
        expect(editor.getCursorBufferPosition()).toEqual([5, 22]);
        return expect(editor.getTextInRange([[5, 18], [5, 22]])).toEqual('</p>');
      });
      it('does not close any tag if no unclosed tag can be found at the insertion point', function() {
        editor.setCursorBufferPosition([5, 14]);
        atom.commands.dispatch(editorElement, 'bracket-matcher:close-tag');
        atom.commands.dispatch(editorElement, 'bracket-matcher:close-tag');
        editor.setCursorBufferPosition([13, 11]);
        atom.commands.dispatch(editorElement, 'bracket-matcher:close-tag');
        atom.commands.dispatch(editorElement, 'bracket-matcher:close-tag');
        editor.setCursorBufferPosition([15, 0]);
        atom.commands.dispatch(editorElement, 'bracket-matcher:close-tag');
        atom.commands.dispatch(editorElement, 'bracket-matcher:close-tag');
        editor.setCursorBufferPosition([11, 9]);
        atom.commands.dispatch(editorElement, 'bracket-matcher:close-tag');
        return expect(editor.getCursorBufferPosition()).toEqual([11, 9]);
      });
      it('does not get confused in case of nested identical tags -- tag not closing', function() {
        editor.setCursorBufferPosition([13, 11]);
        atom.commands.dispatch(editorElement, 'bracket-matcher:close-tag');
        atom.commands.dispatch(editorElement, 'bracket-matcher:close-tag');
        return expect(editor.getCursorBufferPosition()).toEqual([13, 16]);
      });
      return it('does not get confused in case of nested identical tags -- tag closing', function() {
        editor.setCursorBufferPosition([13, 11]);
        atom.commands.dispatch(editorElement, 'bracket-matcher:close-tag');
        expect(editor.getCursorBufferPosition()).toEqual([13, 16]);
        expect(editor.getTextInRange([[13, 10], [13, 16]])).toEqual('</div>');
        atom.commands.dispatch(editorElement, 'bracket-matcher:close-tag');
        return expect(editor.getCursorBufferPosition()).toEqual([13, 16]);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYnJhY2tldC1tYXRjaGVyL3NwZWMvYnJhY2tldC1tYXRjaGVyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLEtBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixRQUFBLG1DQUFBO0FBQUEsSUFBQSxPQUFrQyxFQUFsQyxFQUFDLHVCQUFELEVBQWdCLGdCQUFoQixFQUF3QixnQkFBeEIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixFQUF3RCxJQUF4RCxDQUFBLENBQUE7QUFBQSxNQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFdBQXBCLEVBRGM7TUFBQSxDQUFoQixDQUZBLENBQUE7QUFBQSxNQUtBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGlCQUE5QixFQURjO01BQUEsQ0FBaEIsQ0FMQSxDQUFBO0FBQUEsTUFRQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixxQkFBOUIsRUFEYztNQUFBLENBQWhCLENBUkEsQ0FBQTtBQUFBLE1BV0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsY0FBOUIsRUFEYztNQUFBLENBQWhCLENBWEEsQ0FBQTthQWNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFD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

//# sourceURL=/home/rsoto/.atom/packages/bracket-matcher/spec/bracket-matcher-spec.coffee
