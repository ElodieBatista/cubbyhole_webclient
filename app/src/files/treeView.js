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
                bfs(scope.items);
            });

            function bfs(sourceNode, val) {
                if (sourceNode === null) { return null; }

                var queue = [];
                queue.push(sourceNode);

                while (queue.length !== 0) {
                    var node = queue.shift();
                    console.log(node.name);

                    if (node.previous) {
                        if (node.next) {
                            $('#treeview #' + node.previous + ' > ul').append('<li id="' + node.id + '">' + node.name + ' <ul></ul></li>');
                        } else {
                            $('#treeview #' + node.previous + ' > ul').append('<li id="' + node.id + '">' + node.name + '</li>');
                        }
                    } else {
                        if (node.next) {
                            $('#treeview ul.tree-view').append('<li id="' + node.id + '">' + node.name + ' <ul></ul></li>');
                        } else {
                            $('#treeview ul.tree-view').append('<li id="' + node.id + '">' + node.name + '</li>');
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




        }
    };
});