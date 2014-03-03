'use strict';

var module = angular.module('webApp');

/**
 * Get size from bytes
 */
module.filter('size', function() {
  return function(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    var i = parseInt(Math.log(bytes) / Math.log(1024));
    var result = bytes / Math.pow(1024, i);
    return result.toFixed(2) + ' ' + sizes[i];
  };
});