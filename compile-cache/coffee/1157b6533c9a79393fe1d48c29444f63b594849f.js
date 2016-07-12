(function() {
  var TagFinder, tagFinder;

  TagFinder = require('../lib/tag-finder');

  tagFinder = new TagFinder();

  describe('closeTag', function() {
    describe('TagFinder::parseFragment', function() {
      var fragment;
      fragment = "";
      beforeEach(function() {
        return fragment = "<html><head><body></body>";
      });
      it('returns the last not closed elem in fragment, matching a given pattern', function() {
        var stack;
        stack = tagFinder.parseFragment(fragment, [], /<(\w+)|<\/(\w*)/, function() {
          return true;
        });
        return expect(stack[stack.length - 1]).toBe("head");
      });
      it('stops when cond become true', function() {
        var stack;
        stack = tagFinder.parseFragment(fragment, [], /<(\w+)|<\/(\w*)/, function() {
          return false;
        });
        return expect(stack.length).toBe(0);
      });
      return it('uses the given match expression to match tags', function() {
        var stack;
        stack = tagFinder.parseFragment(fragment, [], /<(body)|(notag)/, function() {
          return true;
        });
        return expect(stack[stack.length - 1]).toBe("body");
      });
    });
    describe('TagFinder::tagsNotClosedInFragment', function() {
      it('returns the outermost tag not closed in an HTML fragment', function() {
        var fragment, tags;
        fragment = "<html><head></head><body><h1><p></p>";
        tags = tagFinder.tagsNotClosedInFragment(fragment);
        return expect(tags).toEqual(['html', 'body', 'h1']);
      });
      it('detects an incomplete tag', function() {
        var fragment, tags;
        fragment = '<html<body<h1';
        tags = tagFinder.tagsNotClosedInFragment(fragment);
        return expect(tags).toEqual(['html', 'body', 'h1']);
      });
      it('is not confused by tag attributes', function() {
        var fragment, tags;
        fragment = '<html><head></head><body class="c"><h1 class="p"><p></p>';
        tags = tagFinder.tagsNotClosedInFragment(fragment);
        return expect(tags).toEqual(['html', 'body', 'h1']);
      });
      return it('is not confused by namespace prefixes', function() {
        var fragment, tags;
        fragment = '<xhtml:html><xhtml:body><xhtml:h1>';
        tags = tagFinder.tagsNotClosedInFragment(fragment);
        return expect(tags).toEqual(['xhtml:html', 'xhtml:body', 'xhtml:h1']);
      });
    });
    describe('TagFinder::tagDoesNotCloseInFragment', function() {
      it('returns true if the given tag is not closed in the given fragment', function() {
        var fragment;
        fragment = "</other1></other2></html>";
        return expect(tagFinder.tagDoesNotCloseInFragment("body", fragment)).toBe(true);
      });
      it('returns false if the given tag is closed in the given fragment', function() {
        var fragment;
        fragment = "</other1></body></html>";
        return expect(tagFinder.tagDoesNotCloseInFragment(["body"], fragment)).toBe(false);
      });
      it('returns true even if the given tag is re-opened and re-closed', function() {
        var fragment;
        fragment = "<other> </other><body></body><html>";
        return expect(tagFinder.tagDoesNotCloseInFragment(["body"], fragment)).toBe(true);
      });
      return it('returns false even if the given tag is re-opened and re-closed before closing', function() {
        var fragment;
        fragment = "<other> </other><body></body></body><html>";
        return expect(tagFinder.tagDoesNotCloseInFragment(["body"], fragment)).toBe(false);
      });
    });
    return describe('TagFinder::closingTagForFragments', function() {
      it('returns the last opened in preFragment tag that is not closed in postFragment', function() {
        var postFragment, preFragment;
        preFragment = "<html><head></head><body><h1></h1><p>";
        postFragment = "</body></html>";
        return expect(tagFinder.closingTagForFragments(preFragment, postFragment)).toBe("p");
      });
      it('correctly handles empty postFragment', function() {
        var postFragment, preFragment;
        preFragment = "<html><head></head><body><h1></h1><p>";
        postFragment = "";
        return expect(tagFinder.closingTagForFragments(preFragment, postFragment)).toBe("p");
      });
      it("correctly handles malformed tags", function() {
        var postFragment, preFragment;
        preFragment = "<html><head></head></htm";
        postFragment = "";
        return expect(tagFinder.closingTagForFragments(preFragment, postFragment)).toBe("html");
      });
      it('returns null if there is no open tag to be closed', function() {
        var postFragment, preFragment;
        preFragment = "<html><head></head><body><h1></h1><p>";
        postFragment = "</p></body></html>";
        return expect(tagFinder.closingTagForFragments(preFragment, postFragment)).toBe(null);
      });
      return it("correctly closes tags containing hyphens", function() {
        var postFragment, preFragment;
        preFragment = "<html><head></head><body><h1></h1><my-element>";
        postFragment = "</body></html>";
        return expect(tagFinder.closingTagForFragments(preFragment, postFragment)).toBe("my-element");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYnJhY2tldC1tYXRjaGVyL3NwZWMvY2xvc2UtdGFnLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9CQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxtQkFBUixDQUFaLENBQUE7O0FBQUEsRUFDQSxTQUFBLEdBQWdCLElBQUEsU0FBQSxDQUFBLENBRGhCLENBQUE7O0FBQUEsRUFHQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsSUFBQSxRQUFBLENBQVMsMEJBQVQsRUFBcUMsU0FBQSxHQUFBO0FBQ25DLFVBQUEsUUFBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLEVBQVgsQ0FBQTtBQUFBLE1BRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULFFBQUEsR0FBVyw0QkFERjtNQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsTUFLQSxFQUFBLENBQUcsd0VBQUgsRUFBNkUsU0FBQSxHQUFBO0FBQzNFLFlBQUEsS0FBQTtBQUFBLFFBQUEsS0FBQSxHQUFRLFNBQVMsQ0FBQyxhQUFWLENBQXdCLFFBQXhCLEVBQWtDLEVBQWxDLEVBQXNDLGlCQUF0QyxFQUF5RCxTQUFBLEdBQUE7aUJBQUcsS0FBSDtRQUFBLENBQXpELENBQVIsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxLQUFNLENBQUEsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFmLENBQWIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxNQUFyQyxFQUYyRTtNQUFBLENBQTdFLENBTEEsQ0FBQTtBQUFBLE1BU0EsRUFBQSxDQUFHLDZCQUFILEVBQW1DLFNBQUEsR0FBQTtBQUNqQyxZQUFBLEtBQUE7QUFBQSxRQUFBLEtBQUEsR0FBUSxTQUFTLENBQUMsYUFBVixDQUF3QixRQUF4QixFQUFrQyxFQUFs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

//# sourceURL=/home/rsoto/.atom/packages/bracket-matcher/spec/close-tag-spec.coffee
