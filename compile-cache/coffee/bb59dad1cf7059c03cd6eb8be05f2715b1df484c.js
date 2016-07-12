(function() {
  var CompositeDisposable, Emitter, SearchModel, _;

  _ = require('underscore-plus');

  Emitter = require('emissary').Emitter;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = SearchModel = (function() {
    Emitter.includeInto(SearchModel);

    SearchModel.resultClass = 'isearch-result';

    SearchModel.currentClass = 'isearch-current';

    function SearchModel(state) {
      var _ref, _ref1;
      if (state == null) {
        state = {};
      }
      this.editSession = null;
      this.startMarker = null;
      this.markers = [];
      this.currentMarker = null;
      this.currentDecoration = null;
      this.lastPosition = null;
      this.pattern = '';
      this.direction = 'forward';
      this.useRegex = (_ref = state.useRegex) != null ? _ref : false;
      this.caseSensitive = (_ref1 = state.caseSensitive) != null ? _ref1 : false;
      this.valid = false;
      this.history = state.history || [];
      this.subscriptions = null;
    }

    SearchModel.prototype.hasStarted = function() {
      return this.startMarker === !null;
    };

    SearchModel.prototype.activePaneItemChanged = function() {
      if (this.editSession) {
        this.editSession = null;
        this.destroyResultMarkers();
      }
      return this.start;
    };

    SearchModel.prototype.start = function(pattern) {
      var markerAttributes, paneItem, range;
      if (pattern == null) {
        pattern = None;
      }
      this.cleanup();
      this.subscriptions = new CompositeDisposable;
      if (pattern) {
        this.pattern = pattern;
      }
      paneItem = atom.workspace.getActivePaneItem();
      if ((paneItem != null ? typeof paneItem.getBuffer === "function" ? paneItem.getBuffer() : void 0 : void 0) != null) {
        this.editSession = paneItem;
        this.subscriptions.add(this.editSession.getBuffer().onDidStopChanging((function(_this) {
          return function(args) {
            return _this.updateMarkers();
          };
        })(this)));
        markerAttributes = {
          invalidate: 'inside',
          replicate: false,
          persistent: false,
          isCurrent: false
        };
        range = this.editSession.getSelectedBufferRange();
        this.startMarker = this.editSession.markBufferRange(range, markerAttributes);
        return this.updateMarkers();
      }
    };

    SearchModel.prototype.stopSearch = function(pattern) {
      var buffer, func;
      if (pattern && pattern !== this.pattern && this.editSession) {
        this.pattern = pattern;
        buffer = this.editSession.getBuffer();
        func = buffer[this.direction === 'forward' ? 'scan' : 'backwardsScan'];
        func.call(buffer, this.getRegex(), (function(_this) {
          return function(_arg) {
            var range, stop;
            range = _arg.range, stop = _arg.stop;
            _this.editSession.setSelectedBufferRange(range);
            return stop();
          };
        })(this));
      } else {
        this.moveCursorToCurrent();
      }
      return this.cleanup();
    };

    SearchModel.prototype.slurp = function() {
      var cursor, end, scanRange, start, text, _ref;
      cursor = this.editSession.getCursors()[0];
      text = '';
      if (!this.pattern.length) {
        text = this.editSession.getSelectedText();
        if (!text.length) {
          start = cursor.getBufferPosition();
          end = cursor.getNextWordBoundaryBufferPosition();
          if (end) {
            text = this.editSession.getTextInRange([start, end]);
          }
        }
      } else if (this.currentMarker) {
        _ref = this.currentMarker.getBufferRange(), start = _ref.start, end = _ref.end;
        scanRange = [end, this.editSession.getEofBufferPosition()];
        this.editSession.scanInBufferRange(cursor.wordRegExp(), scanRange, (function(_this) {
          return function(_arg) {
            var range, stop, _ref1;
            range = _arg.range, stop = _arg.stop;
            if (!((_ref1 = range.end) != null ? _ref1.isEqual(end) : void 0)) {
              text = _this.editSession.getTextInRange([start, range.end]);
              return stop();
            }
          };
        })(this));
      }
      if (text.length) {
        this.pattern = text;
        return this.updateMarkers();
      }
    };

    SearchModel.prototype.moveCursorToCurrent = function() {
      if (this.lastPosition) {
        return this.editSession.setSelectedBufferRange(this.lastPosition);
      }
    };

    SearchModel.prototype.cancelSearch = function() {
      var _ref, _ref1;
      if (this.startMarker) {
        if ((_ref = this.editSession) != null) {
          if ((_ref1 = _ref.getLastCursor()) != null) {
            _ref1.setBufferPosition(this.startMarker.getHeadBufferPosition());
          }
        }
      }
      return this.cleanup();
    };

    SearchModel.prototype.cleanup = function() {
      var _ref;
      if (!atom.config.get('isearch.keepOptionsAfterSearch')) {
        this.useRegex = false;
        this.caseSensitive = false;
        this.emit('updatedOptions');
      }
      if (this.startMarker) {
        this.startMarker.destroy();
      }
      this.startMarker = null;
      this.lastPosition = null;
      this.destroyResultMarkers();
      if (this.editSession) {
        this.editSession = null;
      }
      if (this.pattern && this.history[this.history.length - 1] !== this.pattern) {
        this.history.push(this.pattern);
      }
      this.pattern = '';
      return (_ref = this.subscriptions) != null ? _ref.dispose() : void 0;
    };

    SearchModel.prototype.updateMarkers = function() {
      var bufferRange, id, marker, markersToRemoveById, updatedMarkers, _i, _len, _ref;
      if ((this.editSession == null) || !this.pattern) {
        this.destroyResultMarkers();
        return;
      }
      this.valid = true;
      bufferRange = [[0, 0], [Infinity, Infinity]];
      updatedMarkers = [];
      markersToRemoveById = {};
      _ref = this.markers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        markersToRemoveById[marker.id] = marker;
      }
      this.editSession.scanInBufferRange(this.getRegex(), bufferRange, (function(_this) {
        return function(_arg) {
          var range;
          range = _arg.range;
          if (marker = _this.findMarker(range)) {
            delete markersToRemoveById[marker.id];
          } else {
            marker = _this.createMarker(range);
          }
          return updatedMarkers.push(marker);
        };
      })(this));
      for (id in markersToRemoveById) {
        marker = markersToRemoveById[id];
        marker.destroy();
      }
      this.markers = updatedMarkers;
      return this.moveToClosestResult();
    };

    SearchModel.prototype.findNext = function() {
      return this.moveToClosestResult(true);
    };

    SearchModel.prototype.moveToClosestResult = function(force) {
      var _ref;
      this.currentMarker = (this.direction === 'forward') && this.findMarkerForward(force) || this.findMarkerBackward(force);
      if ((_ref = this.currentDecoration) != null) {
        _ref.destroy();
      }
      this.currentDecoration = null;
      if (this.currentMarker) {
        this.editSession.scrollToScreenRange(this.currentMarker.getScreenRange());
        this.currentDecoration = this.editSession.decorateMarker(this.currentMarker, {
          type: 'highlight',
          "class": this.constructor.currentClass
        });
        return this.lastPosition = this.currentMarker.getBufferRange();
      }
    };

    SearchModel.prototype.findMarkerForward = function(force) {
      var comp, marker, markerStartPosition, range, start, _i, _len, _ref, _ref1;
      if (!this.markers.length) {
        return null;
      }
      range = this.lastPosition || ((_ref = this.startMarker) != null ? _ref.getScreenRange() : void 0) || this.editSession.getSelection().getBufferRange();
      start = range.start;
      _ref1 = this.markers;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        marker = _ref1[_i];
        markerStartPosition = marker.bufferMarker.getStartPosition();
        comp = markerStartPosition.compare(start);
        if (comp > 0 || (comp === 0 && !force)) {
          return marker;
        }
      }
      return this.markers[0];
    };

    SearchModel.prototype.findMarkerBackward = function(force) {
      var comp, marker, markerStartPosition, prev, range, start, _i, _len, _ref, _ref1;
      if (!this.markers.length) {
        return null;
      }
      range = this.lastPosition || ((_ref = this.startMarker) != null ? _ref.getScreenRange() : void 0) || this.editSession.getSelection().getBufferRange();
      start = range.start;
      prev = null;
      _ref1 = this.markers;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        marker = _ref1[_i];
        markerStartPosition = marker.bufferMarker.getStartPosition();
        comp = markerStartPosition.compare(start);
        if (comp === 0 && !force) {
          return marker;
        }
        if (comp < 0) {
          prev = marker;
        } else {
          break;
        }
      }
      return prev || this.markers[this.markers.length - 1];
    };

    SearchModel.prototype.destroyResultMarkers = function() {
      var marker, _i, _len, _ref, _ref1;
      this.valid = false;
      _ref1 = (_ref = this.markers) != null ? _ref : [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        marker = _ref1[_i];
        marker.destroy();
      }
      this.markers = [];
      this.currentMarker = null;
      return this.currentDecoration = null;
    };

    SearchModel.prototype.update = function(newParams) {
      var currentParams;
      if (newParams == null) {
        newParams = {};
      }
      currentParams = {
        pattern: this.pattern,
        direction: this.direction,
        useRegex: this.useRegex,
        caseSensitive: this.caseSensitive
      };
      _.defaults(newParams, currentParams);
      if (!(this.valid && _.isEqual(newParams, currentParams))) {
        _.extend(this, newParams);
        return this.updateMarkers();
      }
    };

    SearchModel.prototype.getRegex = function() {
      var flags, normalSearchRegex;
      flags = 'g';
      if (!this.caseSensitive) {
        flags += 'i';
      }
      normalSearchRegex = RegExp(_.escapeRegExp(this.pattern), flags);
      if (this.useRegex) {
        try {
          return new RegExp(this.pattern, flags);
        } catch (_error) {
          return normalSearchRegex;
        }
      } else {
        return normalSearchRegex;
      }
    };

    SearchModel.prototype.createMarker = function(range) {
      var decoration, marker, markerAttributes;
      markerAttributes = {
        "class": this.constructor.resultClass,
        invalidate: 'inside',
        replicate: false,
        persistent: false,
        isCurrent: false
      };
      marker = this.editSession.markBufferRange(range, markerAttributes);
      decoration = this.editSession.decorateMarker(marker, {
        type: 'highlight',
        "class": this.constructor.resultClass
      });
      return marker;
    };

    SearchModel.prototype.findMarker = function(range) {
      var attributes;
      attributes = {
        "class": this.constructor.resultClass,
        startPosition: range.start,
        endPosition: range.end
      };
      return _.find(this.editSession.findMarkers(attributes), function(marker) {
        return marker.isValid();
      });
    };

    return SearchModel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvaW5jcmVtZW50YWwtc2VhcmNoL2xpYi9zZWFyY2gtbW9kZWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBT0E7QUFBQSxNQUFBLDRDQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQyxVQUFXLE9BQUEsQ0FBUSxVQUFSLEVBQVgsT0FERCxDQUFBOztBQUFBLEVBRUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUZELENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxPQUFPLENBQUMsV0FBUixDQUFvQixXQUFwQixDQUFBLENBQUE7O0FBQUEsSUFFQSxXQUFDLENBQUEsV0FBRCxHQUFjLGdCQUZkLENBQUE7O0FBQUEsSUFHQSxXQUFDLENBQUEsWUFBRCxHQUFlLGlCQUhmLENBQUE7O0FBS2EsSUFBQSxxQkFBQyxLQUFELEdBQUE7QUFFWCxVQUFBLFdBQUE7O1FBRlksUUFBTTtPQUVsQjtBQUFBLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFmLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFIZixDQUFBO0FBQUEsTUFVQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBVlgsQ0FBQTtBQUFBLE1BYUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFiakIsQ0FBQTtBQUFBLE1BaUJBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQWpCckIsQ0FBQTtBQUFBLE1Bd0JBLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBeEJoQixDQUFBO0FBQUEsTUE2QkEsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQTdCWCxDQUFBO0FBQUEsTUE4QkEsSUFBQyxDQUFBLFNBQUQsR0FBYSxTQTlCYixDQUFBO0FB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

//# sourceURL=/home/rsoto/.atom/packages/incremental-search/lib/search-model.coffee
