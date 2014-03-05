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
          e.dataTransfer.setData('item', scope.item._id);
          this.parentNode.classList.add('dnd-drag');
          return false;
        },
        false
      );

      el.addEventListener(
        'dragend',
        function(e) {
          this.parentNode.classList.remove('dnd-drag');
          return false;
        },
        false
      );
    }
  };
});