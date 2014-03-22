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
  function FilesCtrl(conf, $rootScope, $scope, $routeParams, $upload, apiService) {
    // Highlight first btn in the nav bar
    $rootScope.navtop = 0;

    $scope.path = $routeParams.path;

    apiService.Items.get(function(res) {
      $scope.rootItem = res.data[0];
      $scope.folders = res.data;
    }, function(err) { $scope.errorShow(err); });


    $scope.addFolder = function(form, parentId) {
      if (form.name !== '') {
        apiService.Items.post({'type':'folder', 'name':form.name, 'parent':parentId}, function(res) {
          $scope.feAddFolder(res.data, parentId);
        }, function(err) { $scope.errorShow(err); });
      }
    };


    $scope.renameItem = function(form, item) {
      if (form.name !== '' && form.name !== item.name) {
        apiService.Item.put({'name':form.name, 'id':item._id}, function(res) {
          $scope.feRenameItem(res.data.name, item._id, res.data.parent);
        }, function(err) { $scope.errorShow(err); });
      }
    };


    $scope.deleteItem = function(form, id) {
      apiService.Item.delete({'id':id}, function(res) {
        $scope.feDeleteItem(id);
      }, function(err) { $scope.errorShow(err); });
    };


    $scope.copyItem = function(id, parentId) {
      apiService.Item.post({'id':id, 'parent':parentId}, function(res) {
        $scope.feAddNodes(res.data, parentId);
      }, function(err) { $scope.errorShow(err); });
    };


    $scope.moveItem = function(id, parentId) {
      apiService.Item.put({'id':id, 'parent':parentId}, function(res) {
        $scope.feMoveItem(id, parentId, res.data.name);
      }, function(err) { $scope.errorShow(err); });
    };


    $scope.shareItem = function(form, id) {
      if (form.member['0'].email.length > 0) {
        var members = [];

        for (var prop in form.member) {
          members.push(form.member[prop]);
        }

        apiService.Share.post({'id':id, 'with':members}, function(res) {
          $scope.feShareItems(id);
        }, function(err) { $scope.errorShow(err); });
      }
    };


    $scope.createSharedLink = function(item) {
      if (!item.isPublic) {
        apiService.Link.post({'id':item._id}, function(res) {
          item.isPublic = true;
          item.link = res.data.link;
          $scope.feOpenModalShareLink(item);
        }, function(err) { $scope.errorShow(err); });
      } else {
        $scope.feOpenModalShareLink(item);
      }
    };

    $scope.shareLink = function(form, id) {
      if (form.member['0'].email.length > 0) {
        var members = [];

        for (var prop in form.member) {
          members.push(form.member[prop]);
        }

        apiService.Link.put({'id':id, 'with':members}, function(res) {
        }, function(err) { $scope.errorShow(err); });
      }
    };


    $scope.onFileSelect = function(form, data) {
      var $files = (data.files ? data.files : data);
      var err = { custom: -1, param: '<br />' } ;

      for (var i = 0; i < $files.length; i++) {
        var file = $files[i];

        if (file.type !== '') {
          $scope.uploading = true;

          $scope.upload = $upload.upload({
            url: conf.epApi + '/item',
            method: 'POST',
            data: {
              type: 'file',
              parent: $scope.selectedNode._id
            },
            file: file
          }).progress(function(e) {
            var percent = parseInt(100.0 * e.loaded / e.total);
            $scope.feUpdateProgressBar(percent);
          }).success(function(res, status, headers, config) {
            $scope.uploading = false;
            $scope.feAddNode(res.data, $scope.selectedNode._id);
          }).error(function(err) {
            $scope.errorShow(err);
            $scope.uploading = false;
          });
        } else {
          err.custom = 0;
          err.param += file.name + '<br />';
        }
      }

      if (err.custom !== -1) {
        $scope.errorShow(err);
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