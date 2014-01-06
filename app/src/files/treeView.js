'use strict';

var module = angular.module('webApp');

/**
 * Defines the way to display a tree view
 */
module.directive('treeView', function() {
    return {
        restrict: 'E',
        scope: '{}',

        link: function (scope, element, attrs) {
            scope.$watch(attrs.items, function(newValue, oldValue) {
                scope.items = newValue;

                element.tree({
                    data: scope.items,
                    onCanDisplayNode: function(node) {
                        return node.type === 'folder';
                    }
                });
            });
        }
    };
});