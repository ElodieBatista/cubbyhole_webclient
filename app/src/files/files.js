'use strict';

var module = angular.module('webApp');

module.config(function config($routeProvider) {
    $routeProvider
        .when('/files',
        {
            templateUrl: '/src/files/files.tpl.html',
            controller: 'FilesCtrl',
            reloadOnSearch: false,
            authRequired: true
        })
});

module.controller('FilesCtrl',
    function FilesCtrl($rootScope, $scope, $routeParams) {
        // Highlight first btn in the nav bar
        $rootScope.navtop = 0;

        // TODO: Request all files to API

        var json_from_api = [
            {
                id: -1,
                type: 'folder',
                name: 'My Cubbyhole',
                children: [
                    {
                        type: 'folder',
                        name: 'America',
                        children: [
                            {
                                type: 'folder',
                                name: 'United States of America',
                                children: [
                                    {
                                        type: 'file',
                                        name: 'California'
                                    },
                                    {
                                        type: 'folder',
                                        name: 'Washington',
                                        children: [
                                            {
                                                type: 'folder',
                                                name: 'Orange County',
                                                children: [
                                                    {
                                                        type: 'folder',
                                                        name: 'Kirkland',
                                                        children: [
                                                            {
                                                                type: 'folder',
                                                                name: 'Orange County',
                                                                children: [
                                                                    {
                                                                        type: 'folder',
                                                                        name: 'Kirkland',
                                                                        children: [
                                                                            {
                                                                                type: 'folder',
                                                                                name: 'Orange County',
                                                                                children: [
                                                                                    {
                                                                                        type: 'folder',
                                                                                        name: 'Kirkland',
                                                                                        children: [
                                                                                            {
                                                                                                type: 'folder',
                                                                                                name: 'Orange County',
                                                                                                children: [
                                                                                                    {
                                                                                                        type: 'folder',
                                                                                                        name: 'Kirkland',
                                                                                                        children: [
                                                                                                            {
                                                                                                                type: 'folder',
                                                                                                                name: 'Orange County',
                                                                                                                children: [
                                                                                                                    {
                                                                                                                        type: 'folder',
                                                                                                                        name: 'Kirkland',
                                                                                                                        children: [
                                                                                                                            {
                                                                                                                                type: 'folder',
                                                                                                                                name: 'Orange County',
                                                                                                                                children: [
                                                                                                                                    {
                                                                                                                                        type: 'folder',
                                                                                                                                        name: 'Kirkland',
                                                                                                                                        children: [
                                                                                                                                            {
                                                                                                                                                type: 'folder',
                                                                                                                                                name: 'Orange County',
                                                                                                                                                children: [
                                                                                                                                                    {
                                                                                                                                                        type: 'folder',
                                                                                                                                                        name: 'Kirkland',
                                                                                                                                                        children: [

                                                                                                                                                        ]
                                                                                                                                                    }
                                                                                                                                                ]
                                                                                                                                            }
                                                                                                                                        ]
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            }
                                                                                                                        ]
                                                                                                                    }
                                                                                                                ]
                                                                                                            }
                                                                                                        ]
                                                                                                    }
                                                                                                ]
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
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
                                name: 'France',
                                children: [
                                    {
                                        type: 'folder',
                                        name: 'Midi-Pyrénéessssssssssssssssssssssssssssssssssssssssss',
                                        children: [
                                            {
                                                type: 'folder',
                                                name: 'Haute-Garonne',
                                                children: [
                                                    {
                                                        type: 'file',
                                                        name: 'Toulouse'
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
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
                            },
                            {
                                type: 'file',
                                name: 'Tasmania'
                            }
                        ]
                    },
                    {
                        type: 'folder',
                        name: 'Asia'
                    }
                ]
            }
        ];

        $scope.folders = null;

        // Temp: while no API request
        $rootScope.displaySpinner = true;

        // Simulate delay from API
        setTimeout(function() {
            $scope.folders = json_from_api;
            // Temp: while no API request
            $rootScope.displaySpinner = false;
            $scope.$apply();
        }, 2000);

        $scope.path = $routeParams.path;

        $scope.newFolder = function(form) {
            if (form.$valid) {
                // TODO: Send a new folder request to the API
                console.log($routeParams.path);

                $scope.addFolder(form.name);
            }
        };
    }
);