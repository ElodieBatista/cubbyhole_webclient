'use strict';

var module = angular.module('webApp');

/**
 * Format date MM/DD/YYYY HH:MM:SS
 */
module.filter('date', function() {
  return function(dateStr) {
    if (!dateStr) return '';
    var date = new Date(dateStr);
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' +
      (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' +
      (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':' +
      (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
  };
});