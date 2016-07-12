Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

var fetchCompletionsForEditor = _asyncToGenerator(function* (editor, prefix) {
  var hackLanguage = yield (0, (_HackLanguage2 || _HackLanguage()).getHackLanguageForUri)(editor.getPath());
  var filePath = editor.getPath();
  if (!hackLanguage || !filePath) {
    return [];
  }

  (0, (_assert2 || _assert()).default)(filePath);
  var contents = editor.getText();
  var cursor = editor.getLastCursor();
  var offset = editor.getBuffer().characterIndexForPosition(cursor.getBufferPosition());
  // The returned completions may have unrelated results, even though the offset is set on the end
  // of the prefix.
  var completions = yield hackLanguage.getCompletions(filePath, contents, offset);
  // Filter out the completions that do not contain the prefix as a token in the match text case
  // insentively.
  var tokenLowerCase = prefix.toLowerCase();

  var hackCompletionsComparator = compareHackCompletions(prefix);
  return completions.filter(function (completion) {
    (0, (_assert2 || _assert()).default)(completion.displayText != null);
    return completion.displayText.toLowerCase().indexOf(tokenLowerCase) >= 0;
  })
  // Sort the auto-completions based on a scoring function considering:
  // case sensitivity, position in the completion, private functions and alphabetical order.
  .sort(function (completion1, completion2) {
    return hackCompletionsComparator(completion1, completion2);
  });
});

exports.compareHackCompletions = compareHackCompletions;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _atom2;

function _atom() {
  return _atom2 = require('atom');
}

var _nuclideAnalytics2;

function _nuclideAnalytics() {
  return _nuclideAnalytics2 = require('../../nuclide-analytics');
}

var _HackLanguage2;

function _HackLanguage() {
  return _HackLanguage2 = require('./HackLanguage');
}

var _assert2;

function _assert() {
  return _assert2 = _interopRequireDefault(require('assert'));
}

var FIELD_ACCESSORS = ['->', '::'];
var PREFIX_LOOKBACK = Math.max.apply(null, FIELD_ACCESSORS.map(function (prefix) {
  return prefix.length;
}));

var AutocompleteProvider = (function () {
  function AutocompleteProvider() {
    _classCallCheck(this, AutocompleteProvider);
  }

  /**
   * Returns true if `bufferPosition` is prefixed with any of the passed `checkPrefixes`.
   */

  _createDecoratedClass(AutocompleteProvider, [{
    key: 'getAutocompleteSuggestions',
    decorators: [(0, (_nuclideAnalytics2 || _nuclideAnalytics()).trackTiming)('hack.getAutocompleteSuggestions')],
    value: _asyncToGenerator(function* (request) {
      var editor = request.editor;
      var bufferPosition = request.bufferPosition;

      var replacementPrefix = findHackPrefix(editor);

      if (!replacementPrefix && !hasPrefix(editor, bufferPosition, FIELD_ACCESSORS, PREFIX_LOOKBACK)) {
        return [];
      }

      var completions = yield fetchCompletionsForEditor(editor, replacementPrefix);

      return completions.map(function (completion) {
        return _extends({}, completion, {
          replacementPrefix: completion.replacementPrefix === '' ? replacementPrefix : completion.replacementPrefix
        });
      });
    })
  }]);

  return AutocompleteProvider;
})();

exports.default = AutocompleteProvider;
function hasPrefix(editor, bufferPosition, checkPrefixes, prefixLookback) {
  var priorChars = editor.getTextInBufferRange(new (_atom2 || _atom()).Range(new (_atom2 || _atom()).Point(bufferPosition.row, bufferPosition.column - prefixLookback), bufferPosition));
  return checkPrefixes.some(function (prefix) {
    return priorChars.endsWith(prefix);
  });
}

function findHackPrefix(editor) {
  var cursor = editor.getLastCursor();
  // We use custom wordRegex to adopt php variables starting with $.
  var currentRange = cursor.getCurrentWordBufferRange({ wordRegex: /(\$\w*)|\w+/ });
  // Current word might go beyond the cursor, so we cut it.
  var range = new (_atom2 || _atom()).Range(currentRange.start, new (_atom2 || _atom()).Point(cursor.getBufferRow(), cursor.getBufferColumn()));
  var prefix = editor.getTextInBufferRange(range).trim();
  // Prefix could just be $ or ends with string literal.
  if (prefix === '$' || !/[\W]$/.test(prefix)) {
    return prefix;
  } else {
    return '';
  }
}

var MATCH_PREFIX_CASE_SENSITIVE_SCORE = 6;
var MATCH_PREFIX_CASE_INSENSITIVE_SCORE = 4;
var MATCH_TOKEN_CASE_SENSITIVE_SCORE = 2;
var MATCH_TOKEN_CASE_INSENSITIVE_SCORE = 0;
var MATCH_PRIVATE_FUNCTION_PENALTY = -4;
var MATCH_APLHABETICAL_SCORE = 1;

function compareHackCompletions(token) {
  var tokenLowerCase = token.toLowerCase();

  return function (completion1, completion2) {
    // Prefer completions with larger prefixes.
    (0, (_assert2 || _assert()).default)(completion1.replacementPrefix != null);
    (0, (_assert2 || _assert()).default)(completion2.replacementPrefix != null);
    var prefixComparison = completion2.replacementPrefix.length - completion1.replacementPrefix.length;
    if (prefixComparison !== 0) {
      return prefixComparison;
    }

    (0, (_assert2 || _assert()).default)(completion1.displayText != null);
    (0, (_assert2 || _assert()).default)(completion2.displayText != null);
    var texts = [completion1.displayText, completion2.displayText];
    var scores = texts.map(function (text, i) {
      if (text.startsWith(token)) {
        // Matches starting with the prefix gets the highest score.
        return MATCH_PREFIX_CASE_SENSITIVE_SCORE;
      } else if (text.toLowerCase().startsWith(tokenLowerCase)) {
        // Ignore case score matches gets a good score.
        return MATCH_PREFIX_CASE_INSENSITIVE_SCORE;
      }

      var score = undefined;
      if (text.indexOf(token) !== -1) {
        // Small score for a match that contains the token case-sensitive.
        score = MATCH_TOKEN_CASE_SENSITIVE_SCORE;
      } else {
        // Zero score for a match that contains the token without case-sensitive matching.
        score = MATCH_TOKEN_CASE_INSENSITIVE_SCORE;
      }

      // Private functions gets negative score.
      if (text.startsWith('_')) {
        score += MATCH_PRIVATE_FUNCTION_PENALTY;
      }
      return score;
    });
    // Finally, consider the alphabetical order, but not higher than any other score.
    if (texts[0] < texts[1]) {
      scores[0] += MATCH_APLHABETICAL_SCORE;
    } else {
      scores[1] += MATCH_APLHABETICAL_SCORE;
    }
    return scores[1] - scores[0];
  };
}