'use strict';

var module = angular.module('webApp');

/**
 * Format date MM/DD/YYYY
 */
module.filter('date', function() {
  return function(dateStr) {
    if (!dateStr) return '';
    var date = new Date(dateStr);
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
  };
});