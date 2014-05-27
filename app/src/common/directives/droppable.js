'use strict';

var module = angular.module('webApp');

module.directive('droppable', function() {
  return {
    restrict: 'A',
    scope: {
      item: '=item',
      candrop: '=candrop',
      doDrop: '=dodrop'
    },

    link: function (scope, element, attrs) {
      var el = element[0];

      el.addEventListener(
        'dragenter',
        function(e) {
          if (scope.candrop && !el.classList.contains('dnd-drag')) {
            this.classList.add('dnd-over');
          }
          return false;
        },
        false
      );

      el.addEventListener(
        'dragleave',
        function(e) {
          this.classList.remove('dnd-over');
          return false;
        },
        false
      );

      el.addEventListener(
        'drop',
        function(e) {
          this.classList.remove('dnd-over');

          var itemId = e.dataTransfer.getData('text');
          var itemContainerId = scope.item._id;

          if (scope.candrop && itemId !== '' && itemId !== itemContainerId) {
            scope.doDrop(itemId, itemContainerId);
          }

          return false;
        },
        false
      );
    }
  };
});