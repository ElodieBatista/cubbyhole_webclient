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
            var $tree;

            scope.$watch(attrs.items, function(newValue, oldValue) {
                if (newValue !== undefined && newValue !== null) {
                    scope.items = newValue;

                    $tree = $('#tree-view');

                    $tree.bind(
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

                    $tree.bind(
                        'tree.init',
                        function() {
                            scope.openRoot();
                        }
                    );

                    $tree.tree({
                        data: scope.items,
                        onCanDisplayNode: function(node) {
                            return node.type === 'folder';
                        }
                    });

                    if (scope.path !== undefined && scope.path !== '') {
                        // Unroll the tree & Select the last node of the url
                        var node,
                            nodes = scope.path.split(',');

                        for (var i = 0, l = nodes.length; i < l; i++) {
                            node = $tree.tree('getNodeBy', 'name', nodes[i]);

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
                }
            });


            scope.openRoot = function() {
                var node = $tree.tree('getNodeBy', '_id', -1);

                $tree.tree('openNode', node);
                scope.selectNode('My Cubbyhole');
            };


            scope.selectNode = function(nodeName) {
                var node = $tree.tree('getNodeBy', 'name', nodeName);

                if (node.type === 'folder') {
                    $tree.tree('selectNode', node);
                }

                $location.path('/files').search({path: node.getPath()});

                if (!scope.$$phase) {
                    scope.$apply();
                }
            };


            scope.openModalNewFolder = function() {
                var node = $tree.tree('getSelectedNode');
                scope.modalOpts = {
                    title: 'Create a folder',
                    iconClass: 'fa-folder',
                    submitFn: scope.newFolder,
                    placeholder: 'Folder name',
                    submitFnExtraParam: node._id,
                    submitBtnVal: 'Add'
                };

                $('#appmodal').modal('show');
            };


            scope.openModalRenameItem = function(item) {
                scope.modalOpts = {
                    title: 'Rename ' + item.name + ' ' + item.type,
                    iconClass: 'fa-' + item.type,
                    submitFn: scope.renameItem,
                    placeholder: item.name,
                    submitFnExtraParam: item.parent,
                    submitBtnVal: 'Rename'
                };

                $('#appmodal').modal('show');
            };


            scope.openModalNewFiles = function() {
                scope.modalOpts = {
                    title: 'Upload files',
                    iconClass: 'fa-file',
                    submitBtnVal: 'Add',
                    submitFn: scope.onFileSelect,
                    submitFnExtraParam: null,
                    template:
                            '<div class="modal-body">' +
                                '<div class="input-prepend" ng-class="{\'input-prepend-active\': focused}">' +
                                    '<i class="fa input-icon" ng-class="modalOpts.iconClass"></i>' +
                                    '<input class="input-text" type="file" ng-file-select="modalOpts.submitFnExtraParam = $files;" multiple required />' +
                                '</div>' +
                            '</div>'
                };

                $('#appmodal').modal('show');
            };


            scope.addFolder = function(folder) {
                scope.addNode(folder);

                $('.modal').modal('hide');
                $('.modal input:not([type="submit"]').val('');
            };


            scope.renameAnItem = function(name) {
                var node = $tree.tree('getNodeBy', 'name', scope.modalOpts.placeholder);

                $tree.tree(
                    'updateNode',
                    node,
                    {
                        name: name
                    }
                );

                $('.modal').modal('hide');
                $('.modal input:not([type="submit"]').val('');
            };


            scope.addNode = function(item) {
                var node = $tree.tree('getSelectedNode');

                $tree.tree(
                    'appendNode',
                    item,
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