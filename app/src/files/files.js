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
  function FilesCtrl(conf, $rootScope, $scope, $routeParams, $resource, $upload) {
    // Highlight first btn in the nav bar
    $rootScope.navtop = 0;

    var Files = $resource(conf.epApi + '/item', {}, {
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
      }
    });

    var File = $resource(conf.epApi + '/item/:id', {id: '@id'}, {
      'get': {
        method:'GET'
      },
      'put': {
        method:'PUT',
        params: {
          name:'@name'
        }
      },
      'delete': {
        method:'DELETE'
      }
    });

    $scope.folders = null;

    $scope.path = $routeParams.path;

    Files.get(function(res) {
      $scope.folders = res.data;
    }, function(error) {
      console.log('Can\'t get the files.');
    });


    $scope.addFolder = function(form, parent) {
      if (form.$valid) {
        Files.post({'type':'folder', 'name':form.name, 'parent':parent}, function(res) {
          $scope.feAddFolder(res.data);
        }, function(error) {
          console.log('Can\'t create new folder.');
        });
      }
    };


    $scope.renameItem = function(form, id) {
      if (form.$valid) {
        File.put({'name':form.name, 'id':id}, function(res) {
          $scope.feRenameItem(res.data.name, id);
        }, function(err) {
          console.log('Can\'t rename the item.');
        });
      }
    };


    $scope.deleteItem = function(form, id) {
      if (form.$valid) {
        File.delete({'id':id}, function(res) {
          $scope.feDeleteItem(id);
        }, function(error) {
          console.log('Can\'t delete the item.');
        });
      }
    };


    $scope.onFileSelect = function(form, data) {
      var $files = (data.files ? data.files : data);

      for (var i = 0; i < $files.length; i++) {
        var file = $files[i];
        $scope.uploading = true;

        $scope.upload = $upload.upload({
          url: conf.epApi + '/item',
          method: 'POST',
          data: {
            type: 'file',
            parent: $scope.selectedNode._id
          },
          file: file
          /* set file formData name for 'Content-Desposition' header. Default: 'file' */
          //fileFormDataName: myFile, //OR for HTML5 multiple upload only a list: ['name1', 'name2', ...]
          /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
          //formDataAppender: function(formData, key, val){} //#40#issuecomment-28612000
        }).progress(function(e) {
            var percent = parseInt(100.0 * e.loaded / e.total);
            console.log('percent: ' + percent);
            $scope.feUpdateProgressBar(percent);
          }).success(function(res, status, headers, config) {
            console.log(res.data);
            $scope.uploading = false;
            $scope.feAddNode(res.data);
          }).error(function(error) {
            console.log(error);
            $scope.uploading = false;
          });
      }
    };


    $scope.toggleItem = function(item, forceSelect) {
      if ($scope.itemActive === item && !forceSelect) {
        $scope.itemActiveId = -1;
        $scope.itemActive = null;
      } else {
        $scope.itemActiveId = (item === null ? -1 : item._id);
        $scope.itemActive = item;
      }
    };
  }
);