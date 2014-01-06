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

        var json_from_api = {
            id: 'id_0',
            name: 'root',
            next: [
                {
                    id: 'id_10',
                    type: 'folder',
                    name: 'America',
                    previous: 'id_0',
                    next: [
                        {
                            id: 'id_11',
                            type: 'folder',
                            name: 'USA',
                            previous: 'id_10'
                        },
                        {
                            id: 'id_12',
                            type: 'folder',
                            name: 'Canada',
                            previous: 'id_10'
                        }
                    ]
                },
                {
                    id: 'id_20',
                    type: 'folder',
                    name: 'Europe',
                    previous: 'id_0',
                    next: [
                        {
                            id: 'id_21',
                            type: 'folder',
                            name: 'France',
                            previous: 'id_20'
                        },
                        {
                            id: 'id_22',
                            type: 'folder',
                            name: 'Portugal',
                            previous: 'id_20'
                        },
                        {
                            id: 'id_23',
                            type: 'folder',
                            name: 'Spain',
                            previous: 'id_20'
                        }
                    ]
                },
                {
                    id: 'id_30',
                    type: 'folder',
                    name: 'Oceania',
                    previous: 'id_0',
                    next: [
                        {
                            id: 'id_31',
                            type: 'folder',
                            name: 'Australia',
                            previous: 'id_30'
                        }
                    ]
                }
            ]
        };

        $scope.files = json_from_api;


    }
);