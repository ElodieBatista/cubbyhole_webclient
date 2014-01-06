'use strict';

var module = angular.module('webApp');

/**
 * Defines the way to display a tree view
 */
module.directive('treeView', function($compile) {
    return {
        restrict: 'E',
        scope: '{}',
        templateUrl: '/src/files/treeView.tpl.html',

        link: function (scope, element, attrs) {
            scope.$watch(attrs.items, function(newValue, oldValue) {
                scope.items = newValue;
                scope.id_selected = scope.items.next[0].id;
                bfs(scope.items);
            });

            function bfs(sourceNode) {
                if (sourceNode === null) { return null; }

                var queue = [];
                queue.push(sourceNode);

                while (queue.length !== 0) {
                    var node = queue.shift();

                    if (node.previous) {
                        if (node.next) {
                            $('#treeview #' + node.previous + ' > ul').append($compile(
                                '<li id="' + node.id + '">' +
                                    '<span class="tree-view-item-selectable" ng-click="select(\'' + node.id + '\')" ng-class="itemClass(\'' + node.id + '\')">' + node.name + '</span> ' +
                                    '<ul></ul>' +
                                '</li>'
                            )(scope));
                        } else {
                            $('#treeview #' + node.previous + ' > ul').append($compile(
                                '<li id="' + node.id + '">' +
                                    '<span>' + node.name + '</span>' +
                                '</li>'
                            )(scope));
                        }
                    } else {
                        if (node.next) {
                            $('#treeview ul.tree-view').append($compile(
                                '<li id="' + node.id + '">' +
                                    '<span class="tree-view-item-selectable" ng-click="select(\'' + node.id + '\')" ng-class="itemClass(\'' + node.id + '\')">' + node.name + '</span> ' +
                                    '<ul></ul>' +
                                '</li>'
                            )(scope));
                        } else {
                            $('#treeview ul.tree-view').append($compile(
                                '<li id="' + node.id + '">' +
                                    '<span class="tree-view-item-selectable" ng-click="select(\'' + node.id + '\')" ng-class="itemClass(\'' + node.id + '\')">' + node.name + '</span>' +
                                '</li>'
                            )(scope));
                        }
                    }

                    if (node.next) {
                        for (var i = 0, l = node.next.length; i < l; i++) {
                            queue.push(node.next[i]);
                        }
                    }
                }
                return null;
            }


            scope.select = function(id_item) {
                scope.id_selected = id_item;
            };

            scope.itemClass = function(id_item) {
                return id_item === scope.id_selected ? 'tree-view-item-selected' : undefined;
            };
        }
    };
});