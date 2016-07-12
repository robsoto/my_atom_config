(function() {
  var BracketMatcherView, CompositeDisposable, Range, TagFinder, endPair, endPairMatches, pairRegexes, startPair, startPairMatches, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ = require('underscore-plus');

  Range = require('atom').Range;

  TagFinder = require('./tag-finder');

  startPairMatches = {
    '(': ')',
    '[': ']',
    '{': '}'
  };

  endPairMatches = {
    ')': '(',
    ']': '[',
    '}': '{'
  };

  pairRegexes = {};

  for (startPair in startPairMatches) {
    endPair = startPairMatches[startPair];
    pairRegexes[startPair] = new RegExp("[" + (_.escapeRegExp(startPair + endPair)) + "]", 'g');
  }

  module.exports = BracketMatcherView = (function() {
    function BracketMatcherView(editor, editorElement) {
      this.editor = editor;
      this.destroy = __bind(this.destroy, this);
      this.subscriptions = new CompositeDisposable;
      this.tagFinder = new TagFinder(this.editor);
      this.pairHighlighted = false;
      this.tagHighlighted = false;
      if (typeof this.editor.getBuffer().onDidChangeText === "function") {
        this.subscriptions.add(this.editor.getBuffer().onDidChangeText((function(_this) {
          return function() {
            return _this.updateMatch();
          };
        })(this)));
      } else {
        this.subscriptions.add(this.editor.onDidChange((function(_this) {
          return function() {
            return _this.updateMatch();
          };
        })(this)));
      }
      this.subscriptions.add(this.editor.onDidChangeGrammar((function(_this) {
        return function() {
          return _this.updateMatch();
        };
      })(this)));
      this.subscribeToCursor();
      this.subscriptions.add(atom.commands.add(editorElement, 'bracket-matcher:go-to-matching-bracket', (function(_this) {
        return function() {
          return _this.goToMatchingPair();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add(editorElement, 'bracket-matcher:go-to-enclosing-bracket', (function(_this) {
        return function() {
          return _this.goToEnclosingPair();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add(editorElement, 'bracket-matcher:select-inside-brackets', (function(_this) {
        return function() {
          return _this.selectInsidePair();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add(editorElement, 'bracket-matcher:close-tag', (function(_this) {
        return function() {
          return _this.closeTag();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add(editorElement, 'bracket-matcher:remove-matching-brackets', (function(_this) {
        return function() {
          return _this.removeMatchingBrackets();
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidDestroy(this.destroy));
      this.updateMatch();
    }

    BracketMatcherView.prototype.destroy = function() {
      return this.subscriptions.dispose();
    };

    BracketMatcherView.prototype.subscribeToCursor = function() {
      var cursor, cursorSubscriptions;
      cursor = this.editor.getLastCursor();
      if (cursor == null) {
        return;
      }
      cursorSubscriptions = new CompositeDisposable;
      cursorSubscriptions.add(cursor.onDidChangePosition((function(_this) {
        return function(_arg) {
          var textChanged;
          textChanged = _arg.textChanged;
          if (!textChanged) {
            return _this.updateMatch();
          }
        };
      })(this)));
      return cursorSubscriptions.add(cursor.onDidDestroy((function(_this) {
        return function() {
          cursorSubscriptions.dispose();
          _this.subscribeToCursor();
          if (_this.editor.isAlive()) {
            return _this.updateMatch();
          }
        };
      })(this)));
    };

    BracketMatcherView.prototype.updateMatch = function() {
      var currentPair, matchPosition, matchingPair, pair, position, _ref, _ref1;
      if (this.pairHighlighted) {
        this.editor.destroyMarker(this.startMarker.id);
        this.editor.destroyMarker(this.endMarker.id);
      }
      this.pairHighlighted = false;
      this.tagHighlighted = false;
      if (!this.editor.getLastSelection().isEmpty()) {
        return;
      }
      if (this.editor.isFoldedAtCursorRow()) {
        return;
      }
      _ref = this.findCurrentPair(startPairMatches), position = _ref.position, currentPair = _ref.currentPair, matchingPair = _ref.matchingPair;
      if (position) {
        matchPosition = this.findMatchingEndPair(position, currentPair, matchingPair);
      } else {
        _ref1 = this.findCurrentPair(endPairMatches), position = _ref1.position, currentPair = _ref1.currentPair, matchingPair = _ref1.matchingPair;
        if (position) {
          matchPosition = this.findMatchingStartPair(position, matchingPair, currentPair);
        }
      }
      if ((position != null) && (matchPosition != null)) {
        this.startMarker = this.createMarker([position, position.traverse([0, 1])]);
        this.endMarker = this.createMarker([matchPosition, matchPosition.traverse([0, 1])]);
        return this.pairHighlighted = true;
      } else {
        if (pair = this.tagFinder.findMatchingTags()) {
          this.startMarker = this.createMarker(pair.startRange);
          this.endMarker = this.createMarker(pair.endRange);
          this.pairHighlighted = true;
          return this.tagHighlighted = true;
        }
      }
    };

    BracketMatcherView.prototype.removeMatchingBrackets = function() {
      if (this.editor.hasMultipleCursors()) {
        return this.editor.backspace();
      }
      return this.editor.transact((function(_this) {
        return function() {
          var currentPair, matchPosition, matchingPair, position, text, _ref, _ref1;
          if (_this.editor.getLastSelection().isEmpty()) {
            _this.editor.selectLeft();
          }
          text = _this.editor.getSelectedText();
          if (startPairMatches.hasOwnProperty(text) || endPairMatches.hasOwnProperty(text)) {
            _ref = _this.findCurrentPair(startPairMatches), position = _ref.position, currentPair = _ref.currentPair, matchingPair = _ref.matchingPair;
            if (position) {
              matchPosition = _this.findMatchingEndPair(position, currentPair, matchingPair);
            } else {
              _ref1 = _this.findCurrentPair(endPairMatches), position = _ref1.position, currentPair = _ref1.currentPair, matchingPair = _ref1.matchingPair;
              if (position) {
                matchPosition = _this.findMatchingStartPair(position, matchingPair, currentPair);
              }
            }
            if ((position != null) && (matchPosition != null)) {
              _this.editor.setCursorBufferPosition(matchPosition);
              _this.editor["delete"]();
              if (position.row === matchPosition.row && endPairMatches.hasOwnProperty(currentPair)) {
                position = position.traverse([0, -1]);
              }
              _this.editor.setCursorBufferPosition(position);
              return _this.editor["delete"]();
            } else {
              return _this.editor.backspace();
            }
          } else {
            return _this.editor.backspace();
          }
        };
      })(this));
    };

    BracketMatcherView.prototype.findMatchingEndPair = function(startPairPosition, startPair, endPair) {
      var endPairPosition, scanRange, unpairedCount;
      scanRange = new Range(startPairPosition.traverse([0, 1]), this.editor.buffer.getEndPosition());
      endPairPosition = null;
      unpairedCount = 0;
      this.editor.scanInBufferRange(pairRegexes[startPair], scanRange, function(result) {
        switch (result.match[0]) {
          case startPair:
            return unpairedCount++;
          case endPair:
            unpairedCount--;
            if (unpairedCount < 0) {
              endPairPosition = result.range.start;
              return result.stop();
            }
        }
      });
      return endPairPosition;
    };

    BracketMatcherView.prototype.findMatchingStartPair = function(endPairPosition, startPair, endPair) {
      var scanRange, startPairPosition, unpairedCount;
      scanRange = new Range([0, 0], endPairPosition);
      startPairPosition = null;
      unpairedCount = 0;
      this.editor.backwardsScanInBufferRange(pairRegexes[startPair], scanRange, function(result) {
        switch (result.match[0]) {
          case startPair:
            unpairedCount--;
            if (unpairedCount < 0) {
              startPairPosition = result.range.start;
              return result.stop();
            }
            break;
          case endPair:
            return unpairedCount++;
        }
      });
      return startPairPosition;
    };

    BracketMatcherView.prototype.findAnyStartPair = function(cursorPosition) {
      var combinedRegExp, endPairRegExp, scanRange, startPairRegExp, startPosition, unpairedCount;
      scanRange = new Range([0, 0], cursorPosition);
      startPair = _.escapeRegExp(_.keys(startPairMatches).join(''));
      endPair = _.escapeRegExp(_.keys(endPairMatches).join(''));
      combinedRegExp = new RegExp("[" + startPair + endPair + "]", 'g');
      startPairRegExp = new RegExp("[" + startPair + "]", 'g');
      endPairRegExp = new RegExp("[" + endPair + "]", 'g');
      startPosition = null;
      unpairedCount = 0;
      this.editor.backwardsScanInBufferRange(combinedRegExp, scanRange, function(result) {
        if (result.match[0].match(endPairRegExp)) {
          return unpairedCount++;
        } else if (result.match[0].match(startPairRegExp)) {
          unpairedCount--;
          if (unpairedCount < 0) {
            startPosition = result.range.start;
            return result.stop();
          }
        }
      });
      return startPosition;
    };

    BracketMatcherView.prototype.createMarker = function(bufferRange) {
      var marker;
      marker = this.editor.markBufferRange(bufferRange);
      this.editor.decorateMarker(marker, {
        type: 'highlight',
        "class": 'bracket-matcher',
        deprecatedRegionClass: 'bracket-matcher'
      });
      return marker;
    };

    BracketMatcherView.prototype.findCurrentPair = function(matches) {
      var currentPair, matchingPair, position;
      position = this.editor.getCursorBufferPosition();
      currentPair = this.editor.getTextInRange(Range.fromPointWithDelta(position, 0, 1));
      if (!matches[currentPair]) {
        position = position.traverse([0, -1]);
        currentPair = this.editor.getTextInRange(Range.fromPointWithDelta(position, 0, 1));
      }
      if (matchingPair = matches[currentPair]) {
        return {
          position: position,
          currentPair: currentPair,
          matchingPair: matchingPair
        };
      } else {
        return {};
      }
    };

    BracketMatcherView.prototype.goToMatchingPair = function() {
      var endPosition, endRange, position, previousPosition, startPosition, startRange, tagCharacterOffset, tagLength, _ref;
      if (!this.pairHighlighted) {
        return this.goToEnclosingPair();
      }
      position = this.editor.getCursorBufferPosition();
      if (this.tagHighlighted) {
        startRange = this.startMarker.getBufferRange();
        tagLength = startRange.end.column - startRange.start.column;
        endRange = this.endMarker.getBufferRange();
        if (startRange.compare(endRange) > 0) {
          _ref = [endRange, startRange], startRange = _ref[0], endRange = _ref[1];
        }
        startRange = new Range(startRange.start.traverse([0, -1]), endRange.end.traverse([0, -1]));
        endRange = new Range(endRange.start.traverse([0, -2]), endRange.end.traverse([0, -2]));
        if (position.isLessThan(endRange.start)) {
          tagCharacterOffset = position.column - startRange.start.column;
          if (tagCharacterOffset > 0) {
            tagCharacterOffset++;
          }
          tagCharacterOffset = Math.min(tagCharacterOffset, tagLength + 2);
          return this.editor.setCursorBufferPosition(endRange.start.traverse([0, tagCharacterOffset]));
        } else {
          tagCharacterOffset = position.column - endRange.start.column;
          if (tagCharacterOffset > 1) {
            tagCharacterOffset--;
          }
          tagCharacterOffset = Math.min(tagCharacterOffset, tagLength + 1);
          return this.editor.setCursorBufferPosition(startRange.start.traverse([0, tagCharacterOffset]));
        }
      } else {
        previousPosition = position.traverse([0, -1]);
        startPosition = this.startMarker.getStartBufferPosition();
        endPosition = this.endMarker.getStartBufferPosition();
        if (position.isEqual(startPosition)) {
          return this.editor.setCursorBufferPosition(endPosition.traverse([0, 1]));
        } else if (previousPosition.isEqual(startPosition)) {
          return this.editor.setCursorBufferPosition(endPosition);
        } else if (position.isEqual(endPosition)) {
          return this.editor.setCursorBufferPosition(startPosition.traverse([0, 1]));
        } else if (previousPosition.isEqual(endPosition)) {
          return this.editor.setCursorBufferPosition(startPosition);
        }
      }
    };

    BracketMatcherView.prototype.goToEnclosingPair = function() {
      var endRange, matchPosition, pair, startRange, _ref;
      if (this.pairHighlighted) {
        return;
      }
      if (matchPosition = this.findAnyStartPair(this.editor.getCursorBufferPosition())) {
        return this.editor.setCursorBufferPosition(matchPosition);
      } else if (pair = this.tagFinder.findEnclosingTags()) {
        startRange = pair.startRange, endRange = pair.endRange;
        if (startRange.compare(endRange) > 0) {
          _ref = [endRange, startRange], startRange = _ref[0], endRange = _ref[1];
        }
        return this.editor.setCursorBufferPosition(pair.startRange.start);
      }
    };

    BracketMatcherView.prototype.selectInsidePair = function() {
      var endPosition, endRange, pair, rangeToSelect, startPosition, startRange, _ref, _ref1;
      if (this.pairHighlighted) {
        startRange = this.startMarker.getBufferRange();
        endRange = this.endMarker.getBufferRange();
        if (startRange.compare(endRange) > 0) {
          _ref = [endRange, startRange], startRange = _ref[0], endRange = _ref[1];
        }
        if (this.tagHighlighted) {
          startPosition = startRange.end;
          endPosition = endRange.start.traverse([0, -2]);
        } else {
          startPosition = startRange.start;
          endPosition = endRange.start;
        }
      } else {
        if (startPosition = this.findAnyStartPair(this.editor.getCursorBufferPosition())) {
          startPair = this.editor.getTextInRange(Range.fromPointWithDelta(startPosition, 0, 1));
          endPosition = this.findMatchingEndPair(startPosition, startPair, startPairMatches[startPair]);
        } else if (pair = this.tagFinder.findEnclosingTags()) {
          startRange = pair.startRange, endRange = pair.endRange;
          if (startRange.compare(endRange) > 0) {
            _ref1 = [endRange, startRange], startRange = _ref1[0], endRange = _ref1[1];
          }
          startPosition = startRange.end;
          endPosition = endRange.start.traverse([0, -2]);
        }
      }
      if ((startPosition != null) && (endPosition != null)) {
        rangeToSelect = new Range(startPosition.traverse([0, 1]), endPosition);
        return this.editor.setSelectedBufferRange(rangeToSelect);
      }
    };

    BracketMatcherView.prototype.closeTag = function() {
      var cursorPosition, postFragment, preFragment, tag, textLimits;
      cursorPosition = this.editor.getCursorBufferPosition();
      textLimits = this.editor.getBuffer().getRange();
      preFragment = this.editor.getTextInBufferRange([[0, 0], cursorPosition]);
      postFragment = this.editor.getTextInBufferRange([cursorPosition, [Infinity, Infinity]]);
      if (tag = this.tagFinder.closingTagForFragments(preFragment, postFragment)) {
        return this.editor.insertText("</" + tag + ">");
      }
    };

    return BracketMatcherView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYnJhY2tldC1tYXRjaGVyL2xpYi9icmFja2V0LW1hdGNoZXItdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0hBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQURKLENBQUE7O0FBQUEsRUFFQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FGRCxDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBSFosQ0FBQTs7QUFBQSxFQUtBLGdCQUFBLEdBQ0U7QUFBQSxJQUFBLEdBQUEsRUFBSyxHQUFMO0FBQUEsSUFDQSxHQUFBLEVBQUssR0FETDtBQUFBLElBRUEsR0FBQSxFQUFLLEdBRkw7R0FORixDQUFBOztBQUFBLEVBVUEsY0FBQSxHQUNFO0FBQUEsSUFBQSxHQUFBLEVBQUssR0FBTDtBQUFBLElBQ0EsR0FBQSxFQUFLLEdBREw7QUFBQSxJQUVBLEdBQUEsRUFBSyxHQUZMO0dBWEYsQ0FBQTs7QUFBQSxFQWVBLFdBQUEsR0FBYyxFQWZkLENBQUE7O0FBZ0JBLE9BQUEsNkJBQUE7MENBQUE7QUFDRSxJQUFBLFdBQVksQ0FBQSxTQUFBLENBQVosR0FBNkIsSUFBQSxNQUFBLENBQVEsR0FBQSxHQUFFLENBQUMsQ0FBQyxDQUFDLFlBQUYsQ0FBZSxTQUFBLEdBQVksT0FBM0IsQ0FBRCxDQUFGLEdBQXVDLEdBQS9DLEVBQW1ELEdBQW5ELENBQTdCLENBREY7QUFBQSxHQWhCQTs7QUFBQSxFQW1CQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSw0QkFBRSxNQUFGLEVBQVUsYUFBVixHQUFBO0FB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

//# sourceURL=/home/rsoto/.atom/packages/bracket-matcher/lib/bracket-matcher-view.coffee
