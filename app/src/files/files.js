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

        var Files = $resource($rootScope.srvEndpoint + '/item', {}, {
            'get': {
                method: 'GET'
            },
            'post': {
                method:'POST',
                params: {
                    type:'@type',
                    name:'@name',
                    parent:'@parent'
                }
            },
            'put': {
                method:'PUT',
                params: {
                    name:'@name',
                    path:'@path'
                }
            },
            'delete': {
                method:'DELETE',
                params: {
                    id:'@id'
                }
            }
        });

        $scope.folders = null;

        Files.get(function(res) {
            $scope.folders = res.data;
        }, function(error) {
            console.log('Can\'t get the files.');
        });

        $scope.path = $routeParams.path;

        $scope.newFolder = function(form, parent) {
            if (form.$valid) {
                Files.post({'type':'folder', 'name':form.name, 'parent':parent}, function(res) {
                    $scope.addFolder(res.data);
                }, function(error) {
                    console.log('Can\'t create new folder.');
                });
            }
        };


        $scope.renameItem = function(form) {
            if (form.$valid) {
                //Files.put({'name':form.name, 'path':$routeParams.path}, function(res) {
                $scope.renameAnItem(form.name);
                /*}, function(err) {
                 console.log('Can\'t rename the item.');
                 });*/
            }
        };

        $scope.deleteItem = function(form) {
            if (form.$valid) {
                /*Files.delete({'id':form.id}, function(res) {
                    $scope.deleteAnItem(form.id);
                }, function(error) {
                    console.log('Can\'t delete the item.');
                });*/
            }
        };


        $scope.onFileSelect = function(form, $files) {
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.uploading = true;

                $scope.upload = $upload.upload({
                    url: $rootScope.srvEndpoint + '/item',
                    method: 'POST',
                    data: {
                        type: 'file',
                        parent: -1
                    },
                    file: file
                    /* set file formData name for 'Content-Desposition' header. Default: 'file' */
                    //fileFormDataName: myFile, //OR for HTML5 multiple upload only a list: ['name1', 'name2', ...]
                    /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
                    //formDataAppender: function(formData, key, val){} //#40#issuecomment-28612000
                }).progress(function(e) {
                    console.log('percent: ' + parseInt(100.0 * e.loaded / e.total));
                }).success(function(data, status, headers, config) {
                    console.log(data);
                    $scope.uploading = false;
                })
                .error(function(error) {
                    console.log(error);
                    $scope.uploading = false;
                });
            }
        };


        $scope.toggleItem = function(item) {
            if ($scope.itemActive === item) {
                $scope.itemActive = null;
            } else {
                $scope.itemActive = item;
            }
        };
    }
);