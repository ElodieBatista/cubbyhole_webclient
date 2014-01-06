'use strict';

var module = angular.module('webApp');

module.config(function config($routeProvider) {
    $routeProvider
        .when('/files',
        {
            templateUrl: '/src/files/files.tpl.html',
            controller: 'FilesCtrl'
        })
});

module.controller('FilesCtrl',
    function FilesCtrl($rootScope, $scope) {
        console.log('Files Controller');
        $scope.test = 'test';

        var json_from_api = [
                {
                    type: 'folder',
                    name: 'America',
                    children: [
                        {
                            type: 'folder',
                            name: 'USA'
                        },
                        {
                            type: 'folder',
                            name: 'Canada'
                        }
                    ]
                },
                {
                    type: 'folder',
                    name: 'Europe',
                    children: [
                        {
                            type: 'folder',
                            name: 'France'
                        },
                        {
                            type: 'folder',
                            name: 'Portugal'
                        },
                        {
                            type: 'folder',
                            name: 'Spain'
                        }
                    ]
                },
                {
                    type: 'folder',
                    name: 'Oceania',
                    children: [
                        {
                            type: 'folder',
                            name: 'Australia'
                        }
                    ]
                }
            ];

        $scope.files = json_from_api;
    }
);