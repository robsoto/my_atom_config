(function() {
  var Range, SelectorCache, SelfClosingTags, TagFinder, _;

  Range = require('atom').Range;

  _ = require('underscore-plus');

  SelectorCache = require('./selector-cache');

  SelfClosingTags = require('./self-closing-tags');

  module.exports = TagFinder = (function() {
    function TagFinder(editor) {
      this.editor = editor;
      this.tagPattern = /(<(\/?))([^\s>]+)([\s>]|$)/;
      this.wordRegex = /[^>\r\n]*/;
      this.tagSelector = SelectorCache.get('meta.tag | punctuation.definition.tag');
      this.commentSelector = SelectorCache.get('comment.*');
    }

    TagFinder.prototype.patternForTagName = function(tagName) {
      tagName = _.escapeRegExp(tagName);
      return new RegExp("(<" + tagName + "([\\s>]|$))|(</" + tagName + ">)", 'gi');
    };

    TagFinder.prototype.isRangeCommented = function(range) {
      var scopes;
      scopes = this.editor.scopeDescriptorForBufferPosition(range.start).getScopesArray();
      return this.commentSelector.matches(scopes);
    };

    TagFinder.prototype.isTagRange = function(range) {
      var scopes;
      scopes = this.editor.scopeDescriptorForBufferPosition(range.start).getScopesArray();
      return this.tagSelector.matches(scopes);
    };

    TagFinder.prototype.isCursorOnTag = function() {
      return this.tagSelector.matches(this.editor.getLastCursor().getScopeDescriptor().getScopesArray());
    };

    TagFinder.prototype.findStartTag = function(tagName, endPosition) {
      var pattern, scanRange, startRange, unpairedCount;
      scanRange = new Range([0, 0], endPosition);
      pattern = this.patternForTagName(tagName);
      startRange = null;
      unpairedCount = 0;
      this.editor.backwardsScanInBufferRange(pattern, scanRange, (function(_this) {
        return function(_arg) {
          var match, range, stop;
          match = _arg.match, range = _arg.range, stop = _arg.stop;
          if (_this.isRangeCommented(range)) {
            return;
          }
          if (match[1]) {
            unpairedCount--;
            if (unpairedCount < 0) {
              startRange = range.translate([0, 1], [0, -match[2].length]);
              return stop();
            }
          } else {
            return unpairedCount++;
          }
        };
      })(this));
      return startRange;
    };

    TagFinder.prototype.findEndTag = function(tagName, startPosition) {
      var endRange, pattern, scanRange, unpairedCount;
      scanRange = new Range(startPosition, this.editor.buffer.getEndPosition());
      pattern = this.patternForTagName(tagName);
      endRange = null;
      unpairedCount = 0;
      this.editor.scanInBufferRange(pattern, scanRange, (function(_this) {
        return function(_arg) {
          var match, range, stop;
          match = _arg.match, range = _arg.range, stop = _arg.stop;
          if (_this.isRangeCommented(range)) {
            return;
          }
          if (match[1]) {
            return unpairedCount++;
          } else {
            unpairedCount--;
            if (unpairedCount < 0) {
              endRange = range.translate([0, 2], [0, -1]);
              return stop();
            }
          }
        };
      })(this));
      return endRange;
    };

    TagFinder.prototype.findStartEndTags = function() {
      var endPosition, ranges;
      ranges = null;
      endPosition = this.editor.getLastCursor().getCurrentWordBufferRange({
        wordRegex: this.wordRegex
      }).end;
      this.editor.backwardsScanInBufferRange(this.tagPattern, [[0, 0], endPosition], (function(_this) {
        return function(_arg) {
          var endRange, entireMatch, isClosingTag, match, prefix, range, startRange, stop, suffix, tagName;
          match = _arg.match, range = _arg.range, stop = _arg.stop;
          stop();
          entireMatch = match[0], prefix = match[1], isClosingTag = match[2], tagName = match[3], suffix = match[4];
          if (range.start.row === range.end.row) {
            startRange = range.translate([0, prefix.length], [0, -suffix.length]);
          } else {
            startRange = Range.fromObject([range.start.translate([0, prefix.length]), [range.start.row, Infinity]]);
          }
          if (isClosingTag) {
            endRange = _this.findStartTag(tagName, startRange.start);
          } else {
            endRange = _this.findEndTag(tagName, startRange.end);
          }
          if ((startRange != null) && (endRange != null)) {
            return ranges = {
              startRange: startRange,
              endRange: endRange
            };
          }
        };
      })(this));
      return ranges;
    };

    TagFinder.prototype.findEnclosingTags = function() {
      var ranges;
      if (ranges = this.findStartEndTags()) {
        if (this.isTagRange(ranges.startRange) && this.isTagRange(ranges.endRange)) {
          return ranges;
        }
      }
      return null;
    };

    TagFinder.prototype.findMatchingTags = function() {
      if (this.isCursorOnTag()) {
        return this.findStartEndTags();
      }
    };

    TagFinder.prototype.parseFragment = function(fragment, stack, matchExpr, cond) {
      var match, topElem;
      match = fragment.match(matchExpr);
      while (match && cond(stack)) {
        if (SelfClosingTags.indexOf(match[1]) === -1) {
          topElem = stack[stack.length - 1];
          if (match[2] && topElem === match[2]) {
            stack.pop();
          } else if (match[1]) {
            stack.push(match[1]);
          }
        }
        fragment = fragment.substr(match.index + match[0].length);
        match = fragment.match(matchExpr);
      }
      return stack;
    };

    TagFinder.prototype.tagsNotClosedInFragment = function(fragment) {
      return this.parseFragment(fragment, [], /<(\w[-\w]*(?:\:\w[-\w]*)?)|<\/(\w[-\w]*(?:\:\w[-\w]*)?)/, function() {
        return true;
      });
    };

    TagFinder.prototype.tagDoesNotCloseInFragment = function(tags, fragment) {
      var escapedTag, matchExpr, stack, stackLength, tag;
      if (tags.length === 0) {
        return false;
      }
      stack = tags;
      stackLength = stack.length;
      tag = tags[tags.length - 1];
      escapedTag = _.escapeRegExp(tag);
      matchExpr = new RegExp("<(" + escapedTag + ")|<\/(" + escapedTag + ")");
      stack = this.parseFragment(fragment, stack, matchExpr, function(s) {
        return s.length >= stackLength || s[s.length - 1] === tag;
      });
      return stack.length > 0 && stack[stack.length - 1] === tag;
    };

    TagFinder.prototype.closingTagForFragments = function(preFragment, postFragment) {
      var tag, tags;
      tags = this.tagsNotClosedInFragment(preFragment);
      tag = tags[tags.length - 1];
      if (this.tagDoesNotCloseInFragment(tags, postFragment)) {
        return tag;
      } else {
        return null;
      }
    };

    return TagFinder;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYnJhY2tldC1tYXRjaGVyL2xpYi90YWctZmluZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtREFBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBRmhCLENBQUE7O0FBQUEsRUFHQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUixDQUhsQixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsbUJBQUUsTUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsNEJBQWQsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxXQURiLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxXQUFELEdBQWUsYUFBYSxDQUFDLEdBQWQsQ0FBa0IsdUNBQWxCLENBRmYsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGVBQUQsR0FBbUIsYUFBYSxDQUFDLEdBQWQsQ0FBa0IsV0FBbEIsQ0FIbkIsQ0FEVztJQUFBLENBQWI7O0FBQUEsd0JBTUEsaUJBQUEsR0FBbUIsU0FBQyxPQUFELEdBQUE7QUFDakIsTUFBQSxPQUFBLEdBQVUsQ0FBQyxDQUFDLFlBQUYsQ0FBZSxPQUFmLENBQVYsQ0FBQTthQUNJLElBQUEsTUFBQSxDQUFRLElBQUEsR0FBSSxPQUFKLEdBQVksaUJBQVosR0FBNkIsT0FBN0IsR0FBcUMsSUFBN0MsRUFBa0QsSUFBbEQsRUFGYTtJQUFBLENBTm5CLENB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

//# sourceURL=/home/rsoto/.atom/packages/bracket-matcher/lib/tag-finder.coffee
