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
            scope.token = localStorage.token;

            var $tree;

            scope.$watch(attrs.items, function(newValue) {
                if (newValue !== undefined && newValue !== null) {
                    scope.items = newValue;

                    $tree = $('#tree-view');

                    $tree.bind(
                        'tree.select',
                        function(event) {
                            // Node selected
                            if (event.node) {
                                scope.selectedNode = event.node;
                                scope.files = scope.selectedNode.children;

                                scope.toggleItem(null);

                                $location.path('/files').search({path: scope.selectedNode.getPath()});

                                if (!scope.$$phase) { scope.$apply(); }
                            } else {
                                // event.node is null
                                // a node was deselected
                                // e.previous_node contains the deselected node
                                scope.files = [];

                                $location.path('/files').search({path: ''});

                                if (!scope.$$phase) { scope.$apply(); }
                            }
                        }
                    );

                    $tree.bind(
                        'tree.init',
                        function() {
                            scope.feOpenRoot();
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
                            nodesName = scope.path.split(',');

                        for (var i = 0, l = nodesName.length; i < l; i++) {
                            node = $tree.tree('getNodeBy', 'name', nodesName[i], node);

                            // If path is incorrect
                            if (node === null) {
                                break;
                            }

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


            scope.feOpenRoot = function() {
                var node = $tree.tree('getNodeBy', '_id', '-1');
                $tree.tree('openNode', node);
                scope.feSelectNode(node);
            };


            scope.feSelectNode = function(node) {
                if (node.type === 'folder') {
                    $tree.tree('selectNode', node);
                }

                $location.path('/files').search({path: node.getPath()});

                if (!scope.$$phase) { scope.$apply(); }
            };


            scope.feOpenModalNewFolder = function() {
                scope.modalOpts = {
                    title: 'Create a folder',
                    iconClass: 'fa-folder',
                    submitFn: scope.addFolder,
                    placeholder: 'Folder name',
                    submitFnExtraParam: scope.selectedNode._id,
                    submitBtnVal: 'Add'
                };

                $('#appmodal').modal('show');
            };


            scope.feOpenModalRenameItem = function(item) {
                scope.modalOpts = {
                    title: 'Rename ' + item.name + ' ' + item.type,
                    iconClass: 'fa-' + item.type,
                    submitFn: scope.renameItem,
                    placeholder: item.name,
                    submitFnExtraParam: item._id,
                    submitBtnVal: 'Rename'
                };

                $('#appmodal').modal('show');
            };

            scope.feOpenModalDeleteItem = function(item) {
                scope.modalOpts = {
                    title: 'Delete ' + item.name + ' ' + item.type,
                    submitFn: scope.deleteItem,
                    submitFnExtraParam: item._id,
                    submitBtnVal: 'Delete',
                    template:
                            '<div class="modal-body">' +
                                '<p>Are you sure you want to delete this ' + item.type + '?</p>' +
                            '</div>'
                };

                $('#appmodal').modal('show');
            };


            scope.feOpenModalNewFiles = function() {
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


            scope.feAddFolder = function(folder) {
                scope.feAddNode(folder);

                $('.modal').modal('hide');
                $('.modal input:not([type="submit"]').val('');
            };


            scope.feRenameItem = function(name, id) {
                var node = $tree.tree('getNodeBy', '_id', id);

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


            scope.feDeleteItem = function(id) {
                var node = $tree.tree('getNodeBy', '_id', id);

                $tree.tree('removeNode', node);

                scope.toggleItem(null);

                $('.modal').modal('hide');
            };


            scope.feDownloadItem = function() {
              $('#file-explorer-form-download').submit();
            };


            scope.feAddNode = function(item) {
                $tree.tree('openNode', scope.selectedNode);

                $tree.tree(
                    'appendNode',
                    item,
                    scope.selectedNode
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