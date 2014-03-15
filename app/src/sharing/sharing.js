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
  function SharingCtrl(conf, $rootScope, $scope, $routeParams, $resource, $location) {
    // Highlight first btn in the nav bar
    $rootScope.navtop = 1;
    var color = 'secondary';

    var Shares = $resource(conf.epApi + '/share', {}, {
      'get': {
        method:'GET'
      }
    });

    var Share = $resource(conf.epApi + '/share/:id', {id:'@id'}, {
      'post': {
        method:'POST',
        params: {
          with:'@with'
        }
      },
      'put': {
        method:'PUT',
        params: {
          member:'@member',
          permissions:'@permissions'
        }
      },
      'delete': { // Stop sharing if owner/ Leave shared folder if member
        method:'DELETE',
        params: {
          member:'@member' // If member, revoke permission
        }
      }
    });

    var ShareRevoke = $resource(conf.epApi + '/share/:id/:member', {id:'@id', member:'@member'}, {
      'delete': { // If member, revoke permission
        method:'DELETE'
      }
    });

    $scope.items = [];

    $scope.path = $routeParams.id;
    $scope.itemActive = null;

    $scope.userId = $rootScope.getProfile().id;

    Shares.get(function(res) {
      $scope.items = res.data;

      if ($scope.path !== undefined) {
        $scope.itemActive = $scope.getItem($scope.path);
      }
    }, function(err) { $scope.errorShow(err, color); });


    $scope.inviteform = {
      email: '',
      permissions: 0
    };


    $scope.shareItem = function(form, id) {
      if (form.email && form.email.length > 0) {

        Share.post({'id':id, 'with':[{ email:form.email, permissions:form.permissions}]}, function(res) {
          $scope.getItem(id).members = res.data.members;

          $scope.inviteform = {
            email: '',
            permissions: 0
          };
        }, function(err) { $scope.errorShow(err, color); });
      }
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
      Share.put({'id':itemId, 'member':memberId, 'permissions':permissions}, function(res) {
      }, function(err) { $scope.errorShow(err, color); });
    };


    $scope.revokeSharePermission = function(form, ids) {
      ShareRevoke.delete({'id':ids.itemId, 'member':ids.memberId}, function(res) {
        var item = $scope.getItem(ids.itemId);
        for (var j = 0, le = item.members.length; j < le; j++) {
          if (item.members[j]._id === ids.memberId) {
            item.members.splice(j, 1);
            break;
          }
        }
      }, function(err) { $scope.errorShow(err, color); });
    };


    $scope.leaveSharedItem = function(form, id) {
      Share.delete({'id':id}, function(res) {
        for (var i = 0, l = $scope.items.length; i < l; i++) {
          if ($scope.items[i]._id === id) {
            $scope.items.splice(i, 1);
            break;
          }
        }
      }, function(err) { $scope.errorShow(err, color); });
    };


    $scope.unshareItem = function(form, id) {
      Share.delete({'id':id}, function(res) {
        for (var i = 0, l = $scope.items.length; i < l; i++) {
          if ($scope.items[i]._id === id) {
            $scope.items.splice(i, 1);
            break;
          }
        }
      }, function(err) { $scope.errorShow(err, color); });
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