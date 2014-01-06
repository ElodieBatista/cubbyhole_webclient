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

                $('#panel-left').resizable({
                    handles: 'e',
                    containment: '#tree-view-container'
                });

                angular.element(element[0].children[0]).tree({
                    data: scope.items,
                    onCanDisplayNode: function(node) {
                        return node.type === 'folder';
                    }
                });

                angular.element(element[0].children[0]).bind(
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