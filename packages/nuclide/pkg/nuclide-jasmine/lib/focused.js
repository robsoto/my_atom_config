'use strict';
/* @noflow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/**
 * A port of Atom's focused specs.
 * https://github.com/atom/jasmine-focused/blob/c922330/src/jasmine-focused.coffee
 *
 * Flow is disabled because all of this is non-standard.
 */
require('jasmine-node');

function setGlobalFocusPriority(priority) {
  const env = jasmine.getEnv();
  if (!env.focusPriority) {
    env.focusPriority = 1;
  }
  if (priority > env.focusPriority) {
    env.focusPriority = priority;
  }
}

function fdescribe(description, specDefinitions, priority) {
  if (priority == null) {
    priority = 1;
  }
  setGlobalFocusPriority(priority);
  const suite = describe(description, specDefinitions);
  suite.focusPriority = priority;
  return suite;
}
global.fdescribe = fdescribe;

function ffdescribe(description, specDefinitions) {
  return fdescribe(description, specDefinitions, 2);
}
global.ffdescribe = ffdescribe;

function fffdescribe(description, specDefinitions) {
  return fdescribe(description, specDefinitions, 3);
}
global.fffdescribe = fffdescribe;

function fit(description, definition, priority) {
  if (priority == null) {
    priority = 1;
  }
  setGlobalFocusPriority(priority);
  const spec = it(description, definition);
  spec.focusPriority = priority;
  return spec;
}
global.fit = fit;

function ffit(description, specDefinitions) {
  return fit(description, specDefinitions, 2);
}
global.ffit = ffit;

function fffit(description, specDefinitions) {
  return fit(description, specDefinitions, 3);
}
global.fffit = fffit;

jasmine.getEnv().specFilter = function(spec) {
  const env = jasmine.getEnv();
  const globalFocusPriority = env.focusPriority;
  const parent = spec.parentSuite != null ? spec.parentSuite : spec.suite;
  if (!globalFocusPriority) {
    return true;
  } else if (spec.focusPriority >= globalFocusPriority) {
    return true;
  } else if (!parent) {
    return false;
  } else {
    return env.specFilter(parent);
  }
};

// jasmine-node has ddescribe and iit. Remove them in favor of focus.
if (typeof jasmine.Env.prototype.ddescribe === 'function') {
  delete jasmine.Env.prototype.ddescribe;
}

if (typeof jasmine.Env.prototype.iit === 'function') {
  delete jasmine.Env.prototype.iit;
}
