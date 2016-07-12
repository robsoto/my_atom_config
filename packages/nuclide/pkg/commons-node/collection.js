Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.arrayRemove = arrayRemove;
exports.arrayEqual = arrayEqual;
exports.arrayCompact = arrayCompact;
exports.mapUnion = mapUnion;
exports.mapFilter = mapFilter;
exports.mapEqual = mapEqual;
exports.setIntersect = setIntersect;
exports.isEmpty = isEmpty;
exports.keyMirror = keyMirror;
exports.collect = collect;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function arrayRemove(array, element) {
  var index = array.indexOf(element);
  if (index >= 0) {
    array.splice(index, 1);
  }
}

function arrayEqual(array1, array2, equalComparator) {
  if (array1.length !== array2.length) {
    return false;
  }
  var equalFunction = equalComparator || function (a, b) {
    return a === b;
  };
  return array1.every(function (item1, i) {
    return equalFunction(item1, array2[i]);
  });
}

/**
 * Returns a copy of the input Array with all `null` and `undefined` values filtered out.
 * Allows Flow to typecheck the common `filter(x => x != null)` pattern.
 */

function arrayCompact(array) {
  var result = [];
  for (var elem of array) {
    if (elem != null) {
      result.push(elem);
    }
  }
  return result;
}

/**
 * Merges a given arguments of maps into one Map, with the latest maps
 * overriding the values of the prior maps.
 */

function mapUnion() {
  var unionMap = new Map();

  for (var _len = arguments.length, maps = Array(_len), _key = 0; _key < _len; _key++) {
    maps[_key] = arguments[_key];
  }

  for (var map of maps) {
    for (var _ref3 of map) {
      var _ref2 = _slicedToArray(_ref3, 2);

      var _key2 = _ref2[0];
      var _value = _ref2[1];

      unionMap.set(_key2, _value);
    }
  }
  return unionMap;
}

function mapFilter(map, selector) {
  var selected = new Map();
  for (var _ref43 of map) {
    var _ref42 = _slicedToArray(_ref43, 2);

    var _key3 = _ref42[0];
    var _value2 = _ref42[1];

    if (selector(_key3, _value2)) {
      selected.set(_key3, _value2);
    }
  }
  return selected;
}

function mapEqual(map1, map2) {
  if (map1.size !== map2.size) {
    return false;
  }
  for (var _ref53 of map1) {
    var _ref52 = _slicedToArray(_ref53, 2);

    var key1 = _ref52[0];
    var value1 = _ref52[1];

    if (map2.get(key1) !== value1) {
      return false;
    }
  }
  return true;
}

function setIntersect(a, b) {
  return new Set(Array.from(a).filter(function (e) {
    return b.has(e);
  }));
}

/**
 * O(1)-check if a given object is empty (has no properties, inherited or not)
 */

function isEmpty(obj) {
  for (var _key4 in obj) {
    // eslint-disable-line no-unused-vars
    return false;
  }
  return true;
}

/**
 * Constructs an enumeration with keys equal to their value.
 * e.g. keyMirror({a: null, b: null}) => {a: 'a', b: 'b'}
 *
 * Based off the equivalent function in www.
 */

function keyMirror(obj) {
  var ret = {};
  Object.keys(obj).forEach(function (key) {
    ret[key] = key;
  });
  return ret;
}

/**
 * Given an array of [key, value] pairs, construct a map where the values for
 * each key are collected into an array of values, in order.
 */

function collect(pairs) {
  var result = new Map();
  for (var pair of pairs) {
    var _pair = _slicedToArray(pair, 2);

    var k = _pair[0];
    var v = _pair[1];

    var list = result.get(k);
    if (list == null) {
      list = [];
      result.set(k, list);
    }
    list.push(v);
  }
  return result;
}

var MultiMap = (function () {
  function MultiMap() {
    _classCallCheck(this, MultiMap);

    this._map = new Map();
    this.size = 0;
  }

  /*
   * Returns the set of values associated with the given key. Do not mutate the given set. Copy it
   * if you need to store it past the next operation on this MultiMap.
   */

  _createClass(MultiMap, [{
    key: 'get',
    value: function get(key) {
      var set = this._map.get(key);
      if (set == null) {
        return new Set();
      }
      return set;
    }

    /*
     * Mimics the Map.prototype.set interface. Deliberately did not choose "set" as the name since the
     * implication is that it removes the previous binding.
     */
  }, {
    key: 'add',
    value: function add(key, value) {
      var set = this._map.get(key);
      if (set == null) {
        set = new Set();
        this._map.set(key, set);
      }
      if (!set.has(value)) {
        set.add(value);
        this.size++;
      }
      return this;
    }

    /*
     * Deletes a single binding. Returns true iff the binding existed.
     */
  }, {
    key: 'delete',
    value: function _delete(key, value) {
      var set = this.get(key);
      var didRemove = set.delete(value);
      if (set.size === 0) {
        this._map.delete(key);
      }
      if (didRemove) {
        this.size--;
      }
      return didRemove;
    }

    /*
     * Deletes all bindings associated with the given key. Returns true iff any bindings were deleted.
     */
  }, {
    key: 'deleteAll',
    value: function deleteAll(key) {
      var set = this.get(key);
      this.size -= set.size;
      return this._map.delete(key);
    }
  }, {
    key: 'clear',
    value: function clear() {
      this._map.clear();
      this.size = 0;
    }
  }, {
    key: 'has',
    value: function has(key, value) {
      return this.get(key).has(value);
    }
  }, {
    key: 'hasAny',
    value: function hasAny(key) {
      return this._map.has(key);
    }
  }]);

  return MultiMap;
})();

exports.MultiMap = MultiMap;

// Invariant: no empty sets. They should be removed instead.

// TODO may be worth defining a getter but no setter, to mimic Map. But please just behave and
// don't mutate this from outside this class.
//
// Invariant: equal to the sum of the sizes of all the sets contained in this._map
/* The total number of key-value bindings contained */