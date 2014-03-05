'use strict';

var module = angular.module('webApp');

/**
 *
 */
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

      /*el.addEventListener(
        'dragover',
        function(e) {
          console.log('dragover');
          e.dataTransfer.dropEffect = 'move';
          // allows us to drop
          if (e.preventDefault) e.preventDefault();
          this.classList.add('over');
          return false;
        },
        false
      );*/

      el.addEventListener(
        'dragenter',
        function(e) {
          if (scope.candrop) {
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
          e.stopPropagation();

          this.classList.remove('dnd-over');

          var itemId = e.dataTransfer.getData('item');
          var itemContainerId = scope.item._id;
          scope.doDrop(itemId, itemContainerId);

          return false;
        },
        false
      );
    }
  };
});