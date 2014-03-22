'use strict';

var module = angular.module('webApp');

module.config(function config($routeProvider) {
  $routeProvider
    .when('/sharing',
    {
      templateUrl: '/src/sharing/sharing.tpl.html',
      controller: 'SharingCtrl',
      reloadOnSearch: false,
      authRequired: true
    })
});

module.controller('SharingCtrl',
  function SharingCtrl(conf, $rootScope, $scope, $routeParams, $location, apiService) {
    $scope.items = [];

    $scope.path = $routeParams.id;
    $scope.itemActive = null;

    $scope.userId = $rootScope.getProfile().id;

    apiService.Shares.get(function(res) {
      $scope.items = res.data;

      if ($scope.path !== undefined) {
        $scope.itemActive = $scope.getItem($scope.path);
      }
    }, function(err) { $scope.errorShow(err); });


    $scope.inviteform = {
      email: '',
      permissions: 0
    };


    $scope.shareItem = function(form, id) {
      if (form.member['0'].email.length > 0) {
        var members = [];

        for (var prop in form.member) {
          members.push(form.member[prop]);
        }

        apiService.Share.post({'id':id, 'with':members}, function(res) {
          $scope.getItem(id).members = res.data.members;
        }, function(err) { $scope.errorShow(err); });
      }
    };


    $scope.confirmShare = function(itemId, memberId) {
      apiService.Share.put({'id':itemId}, function(res) {
        var item = $scope.getItem(itemId);
        for (var j = 0, le = item.members.length; j < le; j++) {
          if (item.members[j]._id === memberId) {
            item.members[j].accepted = true;
            break;
          }
        }
      }, function(err) { $scope.errorShow(err); });
    };


    $scope.updateSharePermission = function(itemId, memberId) {
      var item = $scope.getItem(itemId),
          permissions;
      for (var j = 0, le = item.members.length; j < le; j++) {
        if (item.members[j]._id === memberId) {
          permissions = item.members[j].permissions;
          break;
        }
      }
      apiService.Share.put({'id':itemId, 'member':memberId, 'permissions':permissions}, function(res) {
      }, function(err) { $scope.errorShow(err); });
    };


    $scope.revokeSharePermission = function(form, ids) {
      apiService.ShareRevoke.delete({'id':ids.itemId, 'member':ids.memberId}, function(res) {
        var item = $scope.getItem(ids.itemId);
        for (var j = 0, le = item.members.length; j < le; j++) {
          if (item.members[j]._id === ids.memberId) {
            item.members.splice(j, 1);
            break;
          }
        }
      }, function(err) { $scope.errorShow(err); });
    };


    $scope.leaveSharedItem = function(form, id) {
      apiService.Share.delete({'id':id}, function(res) {
        for (var i = 0, l = $scope.items.length; i < l; i++) {
          if ($scope.items[i]._id === id) {
            $scope.items.splice(i, 1);
            break;
          }
        }
      }, function(err) { $scope.errorShow(err); });
    };


    $scope.unshareItem = function(form, id) {
      apiService.Share.delete({'id':id}, function(res) {
        for (var i = 0, l = $scope.items.length; i < l; i++) {
          if ($scope.items[i]._id === id) {
            $scope.items.splice(i, 1);
            $scope.toggleItem(null);
            break;
          }
        }
      }, function(err) { $scope.errorShow(err); });
    };


    $scope.toggleItem = function(item, forceSelect) {
      if ($scope.itemActive === item && !forceSelect) {
        $scope.itemActive = null;
        $location.search('id', null);
      } else {
        $scope.itemActive = item;
        $location.path('/sharing').search({id: $scope.itemActive._id});
        if (!$scope.$$phase) { $scope.$apply(); }
      }
    };

    $scope.getItem = function(id) {
      for (var i = 0, l = $scope.items.length; i < l; i++) {
        if ($scope.items[i]._id === id) {
          return $scope.items[i];
        }
      }
      return null;
    };
  }
);