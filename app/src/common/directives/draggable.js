'use strict';

var module = angular.module('webApp');

/**
 *
 */
module.directive('draggable', function() {
  return {
    restrict: 'A',
    scope: {
      item: '=item'
    },

    link: function (scope, element, attrs) {
      var el = element[0];

      el.draggable = true;

      el.addEventListener(
        'dragstart',
        function(e) {
          console.log('drag start');
          e.dataTransfer.setData('item', scope.item._id);
          this.classList.add('drag');
          return false;
        },
        false
      );

      el.addEventListener(
        'dragend',
        function(e) {
          console.log('drag end');
          this.classList.remove('drag');
          return false;
        },
        false
      );
    }
  };
});