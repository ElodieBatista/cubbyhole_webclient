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

    var File = $resource(conf.epApi + '/item/:id', {id:'@id'}, {
      'get': {
        method:'GET'
      },
      'post': {
        method:'POST',
        params: {
          parent:'@parent'
        }
      },
      'put': {
        method:'PUT',
        params: {
          name:'@name',
          parent:'@parent'
        }
      },
      'delete': {
        method:'DELETE'
      }
    });

    $scope.folders = null;

    $scope.path = $routeParams.path;

    Files.get(function(res) {
      $scope.rootItem = res.data[0];
      $scope.folders = res.data;
    }, function(error) {
      console.log('Can\'t get the files.');
    });


    $scope.addFolder = function(form, parentId) {
      if (form.name !== '') {
        Files.post({'type':'folder', 'name':form.name, 'parent':parentId}, function(res) {
          $scope.feAddFolder(res.data, parentId);
        }, function(error) {
          console.log('Can\'t create new folder.');
        });
      }
    };


    $scope.renameItem = function(form, id) {
      if (form.name !== '') {
        File.put({'name':form.name, 'id':id}, function(res) {
          $scope.feRenameItem(res.data.name, id, res.data.parent);
        }, function(err) {
          console.log('Can\'t rename the item.');
        });
      }
    };


    $scope.deleteItem = function(form, id) {
      File.delete({'id':id}, function(res) {
        $scope.feDeleteItem(id);
      }, function(error) {
        console.log('Can\'t delete the item.');
      });
    };


    $scope.copyItem = function(id, parentId) {
      // Angular doesn't like _ in html binding
      if (typeof id === 'object') {
        id = id._id;
        parentId = parentId._id;
      }
      File.post({'id':id, 'parent':parentId}, function(res) {
        $scope.feAddNodes(res.data, parentId);
      }, function(error) {
        console.log('Can\'t copy the item.');
      });
    };


    $scope.moveItem = function(id, parentId) {
      // Angular doesn't like _ in html binding
      if (typeof id === 'object') {
        id = id._id;
        parentId = parentId._id;
      }
      File.put({'id':id, 'parent':parentId}, function(res) {
        $scope.feMoveItem(id, parentId, res.data.name);
      }, function(error) {
        console.log('Can\'t move the item.');
      });
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
          $scope.feUpdateProgressBar(percent);
        }).success(function(res, status, headers, config) {
          $scope.uploading = false;
          $scope.feAddNode(res.data, $scope.selectedNode._id);
        }).error(function(error) {
          console.log(error);
          $scope.uploading = false;
        });
      }
    };


    $scope.toggleItem = function(item, forceSelect) {
      if ($scope.itemActive === item && !forceSelect) {
        $scope.itemActive = null;
      } else {
        $scope.itemActive = item;
      }
    };
  }
);