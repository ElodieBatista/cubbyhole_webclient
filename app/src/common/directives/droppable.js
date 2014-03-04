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
          console.log('dragenter');
          if (scope.candrop) {
            this.classList.add('over');
          }
          return false;
        },
        false
      );

      el.addEventListener(
        'dragleave',
        function(e) {
          console.log('dragleave');
          this.classList.remove('over');
          return false;
        },
        false
      );

      el.addEventListener(
        'drop',
        function(e) {
          console.log('drop');
          // Stops some browsers from redirecting.
          if (e.stopPropagation) e.stopPropagation();

          this.classList.remove('over');

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