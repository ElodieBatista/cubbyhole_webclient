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

                            $location.path('/files').search({path: node.getPath()});

                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                        } else {
                            // event.node is null
                            // a node was deselected
                            // e.previous_node contains the deselected node
                            scope.files = [];

                            $location.path('/files').search({path: ''});

                            if (!scope.$$phase) {
                                scope.$apply();
                            }
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
                            if (node.type === 'folder') {
                                $tree.tree('selectNode', node);
                            } else {
                                $tree.tree('selectNode', node.parent);
                            }
                        }
                    }
                }
            });

            scope.selectNode = function(nodeName) {
                var $tree = $('#tree-view'),
                    node = $tree.tree('getNodeByName', nodeName);

                if (node.type === 'folder') {
                    $tree.tree('selectNode', node);
                }

                $location.path('/files').search({path: node.getPath()});

                if (!scope.$$phase) {
                    scope.$apply();
                }
            };

            scope.addFolder = function(name) {
                scope.addNode('folder', name);

                $('.modal').modal('hide');
                $('.input-modal').val('');
            };

            scope.addNode = function(type, name) {
                var $tree = $('#tree-view'),
                    node = $tree.tree('getSelectedNode');

                $tree.tree(
                    'appendNode',
                    {
                        type: type,
                        name: name
                    },
                    node
                );
            };

            $('.action-bar-item').mouseenter(function() {
                var img = $(this).find(':first-child');
                var src = img.attr('src');
                img.attr('src', function(i, e) {
                    return e.replace('.svg', '_white.svg');
                });
            }).mouseleave(function() {
                var img = $(this).find(':first-child');
                var src = img.attr('src');
                    img.attr('src', function(i, e) {
                    return e.replace(src, src.substr(0, src.indexOf('_white.svg')) + '.svg');
                });
            });
        }
    };
});