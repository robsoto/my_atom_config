"use strict";

var versioning = require('../lib/util/versioning.js');
var fs = require('fs');
var path = require('path');

module.exports = exports;

exports.usage = 'Finds the require path for the node-pre-gyp installed module';

exports.validate = function(package_json) {
    versioning.validate_config(package_json);
};

exports.find = function(package_json_path,opts) {
   try {
     var package_json = JSON.parse(fs.readFileSync(package_json_path));
   } catch (err) {
     throw new Error('Invalid package.json at ' + package_json_path);
   }
   opts = opts || {};
   if (!opts.module_root) opts.module_root = path.dirname(package_json_path);
   var meta = versioning.evaluate(package_json,opts);
   return meta.module;
};
