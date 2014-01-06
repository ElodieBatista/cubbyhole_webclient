'use strict';

var module = angular.module('webApp');

/**
 * Defines the way to display a tree view
 */
module.directive('treeView', function() {
    return {
        restrict: 'E',
        scope: '{}',
        templateUrl: '/src/files/treeView.tpl.html',

        link: function (scope, element, attrs) {
            scope.$watch(attrs.items, function(newValue, oldValue) {
                scope.items = newValue;

                $('#tree-view').tree({
                    data: scope.items,
                    onCanDisplayNode: function(node) {
                        return node.type === 'folder';
                    }
                });

                $('#tree-view').bind(
                    'tree.select',
                    function(event) {
                        // Node selected
                        if (event.node) {
                            var node = event.node;
                            scope.files = node.children;
                            scope.$apply();
                        } else {
                            scope.files = [];
                            scope.$apply();
                            // event.node is null
                            // a node was deselected
                            // e.previous_node contains the deselected node
                        }
                    }
                );
            });
        }
    };
});