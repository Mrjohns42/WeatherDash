// BetterLog
// Inspired by log-prefix and log-timestamp
'use strict';

var util = require('util');

var funcs = {
  log: console.log.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};

function patch(fn, logType) {
  Object.keys(funcs).forEach(function(k) {
    console[k] = function() {
      var s = typeof fn === 'function' ? fn() : fn;
      arguments[0] = util.format(s, arguments[0]);
      if (logType) {
        arguments[0] = k.toUpperCase().padEnd(5) + ' ' + arguments[0];
      }
      funcs[k].apply(console, arguments);
    };
  });
}

// the default date format to print
function timestamp() {
  return '[' + new Date().toISOString() + ']';
}

function betterLog(fn, logType) {
  if (!logType) { logType = false; }
  patch(fn || timestamp, logType);
}


betterLog(); // initialize with default
module.exports = betterLog;
