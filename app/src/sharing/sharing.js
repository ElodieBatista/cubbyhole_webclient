'use strict';

var module = angular.module('webApp');

module.config(function config($routeProvider) {
  $routeProvider
    .when('/sharing',
    {
      templateUrl: '/src/sharing/sharing.tpl.html',
      controller: 'SharingCtrl',
      authRequired: true
    })
});

module.controller('SharingCtrl',
  function SharingCtrl(conf, $rootScope, $scope, $routeParams, $resource) {
    // Highlight first btn in the nav bar
    $rootScope.navtop = 1;
    var color = 'secondary';

    var Shares = $resource(conf.epApi + '/share', {}, {
      'get': {
        method:'GET'
      },
      'post': {
        method:'POST',
        params: {
          id:'@id',
          with:'@with'
        }
      }
    });

    var Share = $resource(conf.epApi + '/share/:id', {id:'@id'}, {
      'delete': {
        method:'DELETE'
      }
    });

    $scope.items = [];
    $scope.itemActive = null;

    $scope.userId = $rootScope.getProfile().id;

    Shares.get(function(res) {
      $scope.items = res.data;
    }, function(err) { $scope.errorShow(err, color); });


    $scope.inviteform = {
      email: '',
      permissions: 0
    };


    $scope.shareItem = function(form, id) {
      if (form.email && form.email.length > 0) {

        Shares.post({'id':id, 'with':[{ email:form.email, permissions:form.permissions}]}, function(res) {
          for (var i = 0, l = $scope.items.length; i < l; i++) {
            if ($scope.items[i]._id === id) {
              $scope.items[i].members = res.data.members;
              break;
            }
          }

          $scope.inviteform = {
            email: '',
            permissions: 0
          };
        }, function(err) { $scope.errorShow(err, color); });
      }
    };


    $scope.revokeSharePermission = function(form, ids) {
      //Share.post({'id':id, 'with':members}, function(res) {
        for (var i = 0, l = $scope.items.length; i < l; i++) {
          if ($scope.items[i]._id === ids.itemId) {
            for (var j = 0, le = $scope.items[i].members.length; j < le; j++) {
              if ($scope.items[i].members[j]._id === ids.memberId) {
                $scope.items[i].members.splice(j, 1);
                break;
              }
            }
          }
        }
      /*}, function(err) {
       console.log('Can\'t share the item.');
       });*/
    };


    $scope.leaveSharedItem = function(form, id) {
      //Share.post({'id':id, 'with':members}, function(res) {
        for (var i = 0, l = $scope.items.length; i < l; i++) {
          if ($scope.items[i]._id === id) {
            $scope.items.splice(i, 1);
            break;
          }
        }
      /*}, function(err) {
        console.log('Can\'t share the item.');
      });*/
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
        $scope.itemActiveId = -1;
        $scope.itemActive = null;
      } else {
        $scope.itemActiveId = (item === null ? -1 : item._id);
        $scope.itemActive = item;
      }
    };
  }
);