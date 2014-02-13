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
    function FilesCtrl($rootScope, $scope, $routeParams, $resource, $upload) {
        // Highlight first btn in the nav bar
        $rootScope.navtop = 0;

        // TODO: Request all files to API
        var Files = $resource($rootScope.srvEndpoint + 'item', {}, {
            'get': {
                method: 'GET'
            },
            'post': {
                method:'POST',
                params: {
                    type:'@type',
                    content:'@content'
                }
            }
        });


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

        /*Files.get(function(res) {
            $scope.folders = res.items;
            $scope.$apply();
        }, function(err) {
            console.log('Can\'t get the files.');
        });*/

        $scope.path = $routeParams.path;

        $scope.newFolder = function(form) {
            if (form.$valid) {
                // TODO: Send a new folder request to the API
                console.log($routeParams.path);

                $scope.addFolder(form.name);
            }
        };

        $scope.onFileSelect = function($files) {
            //$files: an array of files selected, each file has name, size, and type.
            //for (var i = 0; i < $files.length; i++) {
                //var file = $files[i];
            $scope.uploading = true;
                $scope.upload = $upload.upload({
                    url: $rootScope.srvEndpoint + 'item', //upload.php script, node.js route, or servlet url
                    method: 'POST',
                    // headers: {'headerKey': 'headerValue'},
                    data: {myObj: $scope.myModelObj},
                    file: $files //upload multiple files, this feature only works in HTML5 FromData browsers
                    // file: file,
                    /* set file formData name for 'Content-Desposition' header. Default: 'file' */
                    //fileFormDataName: myFile, //OR for HTML5 multiple upload only a list: ['name1', 'name2', ...]
                    /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
                    //formDataAppender: function(formData, key, val){} //#40#issuecomment-28612000
                }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    console.log(data);
                    $scope.uploading = false;
                })
                .error(function(err) {
                    console.log(err);
                    $scope.uploading = false;
                });
                //.then(success, error, progress);
            //}
        };
    }
);