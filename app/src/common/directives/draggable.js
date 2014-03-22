'use strict';

var module = angular.module('webApp');

module.directive('draggable', function() {
  return {
    restrict: 'A',
    scope: {
      item: '=item',
      candrag: '=candrag'
    },

    link: function (scope, element, attrs) {
      var el = element[0];

      if (scope.candrag) {
        el.draggable = true;
      }

      el.addEventListener(
        'dragstart',
        function(e) {
          if (scope.candrag) {
            e.dataTransfer.setData('item', scope.item._id);
            this.parentNode.classList.add('dnd-drag');
          }
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