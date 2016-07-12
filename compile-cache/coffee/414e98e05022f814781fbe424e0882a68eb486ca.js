(function() {
  var BracketMatcher, CompositeDisposable, SelectorCache, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  CompositeDisposable = require('atom').CompositeDisposable;

  SelectorCache = require('./selector-cache');

  module.exports = BracketMatcher = (function() {
    BracketMatcher.prototype.pairsToIndent = {
      '(': ')',
      '[': ']',
      '{': '}'
    };

    BracketMatcher.prototype.defaultPairs = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
      '`': '`'
    };

    BracketMatcher.prototype.smartQuotePairs = {
      "“": "”",
      '‘': '’',
      "«": "»",
      "‹": "›"
    };

    BracketMatcher.prototype.toggleQuotes = function(includeSmartQuotes) {
      if (includeSmartQuotes) {
        return this.pairedCharacters = _.extend({}, this.defaultPairs, this.smartQuotePairs);
      } else {
        return this.pairedCharacters = this.defaultPairs;
      }
    };

    function BracketMatcher(editor, editorElement) {
      this.editor = editor;
      this.backspace = __bind(this.backspace, this);
      this.insertNewline = __bind(this.insertNewline, this);
      this.insertText = __bind(this.insertText, this);
      this.subscriptions = new CompositeDisposable;
      this.bracketMarkers = [];
      _.adviseBefore(this.editor, 'insertText', this.insertText);
      _.adviseBefore(this.editor, 'insertNewline', this.insertNewline);
      _.adviseBefore(this.editor, 'backspace', this.backspace);
      this.subscriptions.add(atom.commands.add(editorElement, 'bracket-matcher:remove-brackets-from-selection', (function(_this) {
        return function(event) {
          if (!_this.removeBrackets()) {
            return event.abortKeyBinding();
          }
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.unsubscribe();
        };
      })(this)));
    }

    BracketMatcher.prototype.insertText = function(text, options) {
      var autoCompleteOpeningBracket, bracketMarker, cursorBufferPosition, hasEscapeSequenceBeforeCursor, hasQuoteBeforeCursor, hasWordAfterCursor, hasWordBeforeCursor, nextCharacter, pair, previousCharacter, previousCharacters, range, skipOverExistingClosingBracket, _ref;
      if (!text) {
        return true;
      }
      if ((options != null ? options.select : void 0) || (options != null ? options.undo : void 0) === 'skip') {
        return true;
      }
      this.toggleQuotes(this.getScopedSetting('bracket-matcher.autocompleteSmartQuotes'));
      if (this.wrapSelectionInBrackets(text)) {
        return false;
      }
      if (this.editor.hasMultipleCursors()) {
        return true;
      }
      cursorBufferPosition = this.editor.getCursorBufferPosition();
      previousCharacters = this.editor.getTextInBufferRange([cursorBufferPosition.traverse([0, -2]), cursorBufferPosition]);
      nextCharacter = this.editor.getTextInBufferRange([cursorBufferPosition, cursorBufferPosition.traverse([0, 1])]);
      previousCharacter = previousCharacters.slice(-1);
      hasWordAfterCursor = /\w/.test(nextCharacter);
      hasWordBeforeCursor = /\w/.test(previousCharacter);
      hasQuoteBeforeCursor = previousCharacter === text[0];
      hasEscapeSequenceBeforeCursor = ((_ref = previousCharacters.match(/\\/g)) != null ? _ref.length : void 0) >= 1;
      if (text === '#' && this.isCursorOnInterpolatedString()) {
        autoCompleteOpeningBracket = this.getScopedSetting('bracket-matcher.autocompleteBrackets') && !hasEscapeSequenceBeforeCursor;
        text += '{';
        pair = '}';
      } else {
        autoCompleteOpeningBracket = this.getScopedSetting('bracket-matcher.autocompleteBrackets') && this.isOpeningBracket(text) && !hasWordAfterCursor && !(this.isQuote(text) && (hasWordBeforeCursor || hasQuoteBeforeCursor)) && !hasEscapeSequenceBeforeCursor;
        pair = this.pairedCharacters[text];
      }
      skipOverExistingClosingBracket = false;
      if (this.isClosingBracket(text) && nextCharacter === text && !hasEscapeSequenceBeforeCursor) {
        if (bracketMarker = _.find(this.bracketMarkers, function(marker) {
          return marker.isValid() && marker.getBufferRange().end.isEqual(cursorBufferPosition);
        })) {
          skipOverExistingClosingBracket = true;
        }
      }
      if (skipOverExistingClosingBracket) {
        bracketMarker.destroy();
        _.remove(this.bracketMarkers, bracketMarker);
        this.editor.moveRight();
        return false;
      } else if (autoCompleteOpeningBracket) {
        this.editor.insertText(text + pair);
        this.editor.moveLeft();
        range = [cursorBufferPosition, cursorBufferPosition.traverse([0, text.length])];
        this.bracketMarkers.push(this.editor.markBufferRange(range));
        return false;
      }
    };

    BracketMatcher.prototype.insertNewline = function() {
      var cursorBufferPosition, hasEscapeSequenceBeforeCursor, nextCharacter, previousCharacter, previousCharacters, _ref;
      if (this.editor.hasMultipleCursors()) {
        return;
      }
      if (!this.editor.getLastSelection().isEmpty()) {
        return;
      }
      this.toggleQuotes(this.getScopedSetting('bracket-matcher.autocompleteSmartQuotes'));
      cursorBufferPosition = this.editor.getCursorBufferPosition();
      previousCharacters = this.editor.getTextInBufferRange([cursorBufferPosition.traverse([0, -2]), cursorBufferPosition]);
      nextCharacter = this.editor.getTextInBufferRange([cursorBufferPosition, cursorBufferPosition.traverse([0, 1])]);
      previousCharacter = previousCharacters.slice(-1);
      hasEscapeSequenceBeforeCursor = ((_ref = previousCharacters.match(/\\/g)) != null ? _ref.length : void 0) >= 1;
      if (this.pairsToIndent[previousCharacter] === nextCharacter && !hasEscapeSequenceBeforeCursor) {
        this.editor.transact((function(_this) {
          return function() {
            var cursorRow;
            _this.editor.insertText("\n\n");
            _this.editor.moveUp();
            if (_this.getScopedSetting('editor.autoIndent')) {
              cursorRow = _this.editor.getCursorBufferPosition().row;
              return _this.editor.autoIndentBufferRows(cursorRow, cursorRow + 1);
            }
          };
        })(this));
        return false;
      }
    };

    BracketMatcher.prototype.backspace = function() {
      var cursorBufferPosition, hasEscapeSequenceBeforeCursor, nextCharacter, previousCharacter, previousCharacters, _ref;
      if (this.editor.hasMultipleCursors()) {
        return;
      }
      if (!this.editor.getLastSelection().isEmpty()) {
        return;
      }
      this.toggleQuotes(this.getScopedSetting('bracket-matcher.autocompleteSmartQuotes'));
      cursorBufferPosition = this.editor.getCursorBufferPosition();
      previousCharacters = this.editor.getTextInBufferRange([cursorBufferPosition.traverse([0, -2]), cursorBufferPosition]);
      nextCharacter = this.editor.getTextInBufferRange([cursorBufferPosition, cursorBufferPosition.traverse([0, 1])]);
      previousCharacter = previousCharacters.slice(-1);
      hasEscapeSequenceBeforeCursor = ((_ref = previousCharacters.match(/\\/g)) != null ? _ref.length : void 0) >= 1;
      if ((this.pairedCharacters[previousCharacter] === nextCharacter) && !hasEscapeSequenceBeforeCursor && this.getScopedSetting('bracket-matcher.autocompleteBrackets')) {
        this.editor.transact((function(_this) {
          return function() {
            _this.editor.moveLeft();
            _this.editor["delete"]();
            return _this.editor["delete"]();
          };
        })(this));
        return false;
      }
    };

    BracketMatcher.prototype.removeBrackets = function() {
      var bracketsRemoved;
      bracketsRemoved = false;
      this.toggleQuotes(this.getScopedSetting('bracket-matcher.autocompleteSmartQuotes'));
      this.editor.mutateSelectedText((function(_this) {
        return function(selection) {
          var options, range, selectionEnd, selectionStart, text;
          if (!_this.selectionIsWrappedByMatchingBrackets(selection)) {
            return;
          }
          range = selection.getBufferRange();
          options = {
            reversed: selection.isReversed()
          };
          selectionStart = range.start;
          if (range.start.row === range.end.row) {
            selectionEnd = range.end.traverse([0, -2]);
          } else {
            selectionEnd = range.end.traverse([0, -1]);
          }
          text = selection.getText();
          selection.insertText(text.substring(1, text.length - 1));
          selection.setBufferRange([selectionStart, selectionEnd], options);
          return bracketsRemoved = true;
        };
      })(this));
      return bracketsRemoved;
    };

    BracketMatcher.prototype.wrapSelectionInBrackets = function(bracket) {
      var pair, selectionWrapped;
      if (!this.getScopedSetting('bracket-matcher.wrapSelectionsInBrackets')) {
        return false;
      }
      if (bracket === '#') {
        if (!this.isCursorOnInterpolatedString()) {
          return false;
        }
        bracket = '#{';
        pair = '}';
      } else {
        if (!this.isOpeningBracket(bracket)) {
          return false;
        }
        pair = this.pairedCharacters[bracket];
      }
      selectionWrapped = false;
      this.editor.mutateSelectedText(function(selection) {
        var options, range, selectionEnd, selectionStart;
        if (selection.isEmpty()) {
          return;
        }
        if (bracket === '#{' && !selection.getBufferRange().isSingleLine()) {
          return;
        }
        selectionWrapped = true;
        range = selection.getBufferRange();
        options = {
          reversed: selection.isReversed()
        };
        selection.insertText("" + bracket + (selection.getText()) + pair);
        selectionStart = range.start.traverse([0, bracket.length]);
        if (range.start.row === range.end.row) {
          selectionEnd = range.end.traverse([0, bracket.length]);
        } else {
          selectionEnd = range.end;
        }
        return selection.setBufferRange([selectionStart, selectionEnd], options);
      });
      return selectionWrapped;
    };

    BracketMatcher.prototype.isQuote = function(string) {
      return /['"`]/.test(string);
    };

    BracketMatcher.prototype.isCursorOnInterpolatedString = function() {
      var segments;
      if (this.interpolatedStringSelector == null) {
        segments = ['*.*.*.interpolated.ruby', 'string.interpolated.ruby', 'string.regexp.interpolated.ruby', 'string.quoted.double.coffee', 'string.unquoted.heredoc.ruby', 'string.quoted.double.livescript', 'string.quoted.double.heredoc.livescript', 'string.quoted.double.elixir', 'string.quoted.double.heredoc.elixir', 'comment.documentation.heredoc.elixir'];
        this.interpolatedStringSelector = SelectorCache.get(segments.join(' | '));
      }
      return this.interpolatedStringSelector.matches(this.editor.getLastCursor().getScopeDescriptor().getScopesArray());
    };

    BracketMatcher.prototype.getInvertedPairedCharacters = function() {
      var close, open, _ref;
      if (this.invertedPairedCharacters) {
        return this.invertedPairedCharacters;
      }
      this.invertedPairedCharacters = {};
      _ref = this.pairedCharacters;
      for (open in _ref) {
        close = _ref[open];
        this.invertedPairedCharacters[close] = open;
      }
      return this.invertedPairedCharacters;
    };

    BracketMatcher.prototype.isOpeningBracket = function(string) {
      return this.pairedCharacters.hasOwnProperty(string);
    };

    BracketMatcher.prototype.isClosingBracket = function(string) {
      return this.getInvertedPairedCharacters().hasOwnProperty(string);
    };

    BracketMatcher.prototype.selectionIsWrappedByMatchingBrackets = function(selection) {
      var firstCharacter, lastCharacter, selectedText;
      if (selection.isEmpty()) {
        return false;
      }
      selectedText = selection.getText();
      firstCharacter = selectedText[0];
      lastCharacter = selectedText[selectedText.length - 1];
      return this.pairedCharacters[firstCharacter] === lastCharacter;
    };

    BracketMatcher.prototype.unsubscribe = function() {
      return this.subscriptions.dispose();
    };

    BracketMatcher.prototype.getScopedSetting = function(key) {
      return atom.config.get(key, {
        scope: this.editor.getLastCursor().getScopeDescriptor()
      });
    };

    return BracketMatcher;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYnJhY2tldC1tYXRjaGVyL2xpYi9icmFja2V0LW1hdGNoZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFEQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBRUEsYUFBQSxHQUFnQixPQUFBLENBQVEsa0JBQVIsQ0FGaEIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw2QkFBQSxhQUFBLEdBQ0U7QUFBQSxNQUFBLEdBQUEsRUFBSyxHQUFMO0FBQUEsTUFDQSxHQUFBLEVBQUssR0FETDtBQUFBLE1BRUEsR0FBQSxFQUFLLEdBRkw7S0FERixDQUFBOztBQUFBLDZCQUtBLFlBQUEsR0FDRTtBQUFBLE1BQUEsR0FBQSxFQUFLLEdBQUw7QUFBQSxNQUNBLEdBQUEsRUFBSyxHQURMO0FBQUEsTUFFQSxHQUFBLEVBQUssR0FGTDtBQUFBLE1BR0EsR0FBQSxFQUFLLEdBSEw7QUFBQSxNQUlBLEdBQUEsRUFBSyxHQUpMO0FBQUEsTUFLQSxHQUFBLEVBQUssR0FMTDtLQU5GLENBQUE7O0FBQUEsNkJBYUEsZUFBQSxHQUNFO0FBQUEsTUFBQSxHQUFBLEVBQUssR0FBTDtBQUFBLE1BQ0EsR0FBQSxFQUFLLEdBREw7QUFBQSxNQUVBLEdBQUEsRUFBSyxHQUZMO0FBQUEsTUFHQSxHQUFBLEVBQUssR0FITDtLQWRGLENBQUE7O0FBQUEsNkJBbUJBLFlBQUEsR0FBYyxTQUFDLGtCQUFELEdBQUE7QUFDWixNQUFBLElBQUcsa0JBQUg7ZUFDRSxJQUFDLENBQUEsZ0JBQUQsR0FBb0IsQ0FBQyxD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

//# sourceURL=/home/rsoto/.atom/packages/bracket-matcher/lib/bracket-matcher.coffee
