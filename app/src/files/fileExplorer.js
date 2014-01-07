'use strict';

var module = angular.module('webApp');

/**
 * Defines the way to display a tree view
 */
module.directive('fileExplorer', function($location) {
    return {
        restrict: 'E',
        scope: '{}',
        templateUrl: '/src/files/fileExplorer.tpl.html',

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

                            var path = node.name;

                            for (var i = 0, l = node.getLevel() - 1; i < l; i++) {
                                node = node.parent;
                                path = node.name + ',' + path;
                            }

                            $location.path('/files').search({path: path});

                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                        } else {
                            scope.files = [];

                            $location.path('/files').search({path: ''});

                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                            // event.node is null
                            // a node was deselected
                            // e.previous_node contains the deselected node
                        }
                    }
                );

                if (scope.path !== undefined) {
                    // Unroll the tree & Select the last node of the url
                    var node,
                        $tree = $('#tree-view'),
                        nodes = scope.path.split(',');

                    for (var i = 0, l = nodes.length; i < l; i++) {
                        node = $tree.tree('getNodeByName', nodes[i]);

                        if (node.children.length > 0) {
                            $tree.tree('openNode', node);

                            if (i === (l - 1)) {
                                $tree.tree('selectNode', node);
                            }
                        } else {
                            $tree.tree('selectNode', node);
                        }
                    }
                }
            });

            scope.selectNode = function(nodeName) {
                var node = $('#tree-view').tree('getNodeByName', nodeName);

                var path = node.name;

                for (var i = 0, l = node.getLevel() - 1; i < l; i++) {
                    node = node.parent;
                    path = node.name + ',' + path;
                }

                $location.path('/files').search({path: path});

                if (!scope.$$phase) {
                    scope.$apply();
                }
            }
        }
    };
});