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

    var Share = $resource(conf.epApi + '/share', {}, {
      'post': {
        method:'POST',
        params: {
          id:'@id',
          with:'@with'
        }
      }
    });

    $scope.items = [];
    $scope.itemActive = null;

    $scope.userId = $rootScope.getProfile().id;

    $scope.items = [
      {
        _id: '0',
        name: 'All Projects M1',
        size: 225923,
        lastModified: '2014-03-06T08:57:04.103Z',
        path: 'My Cubbyhole,A',
        owner: {
          _id: '40',
          email:'gaetan@sup.com'
        },
        members: [
          {
            _id: '10',
            email: 'maxime@sup.com',
            status: 'joined',
            permission: 1
          },
          {
            _id: '20',
            email: 'kevin@sup.com',
            status: 'joined',
            permission: 1
          },
          {
            _id: '531832618e4278e018000001',
            email: 'elodie@sup.com',
            status: 'still waiting',
            permission: 0
          }
        ]
      },
      {
        _id: '1',
        name: 'Test',
        size: 1225923,
        lastModified: '2014-03-08T08:57:04.103Z',
        path: 'My Cubbyhole',
        owner: {
          _id: '531832618e4278e018000001',
          email:'elodie@sup.com'
        },
        members: [
          {
            _id: '20',
            email: 'kevin@sup.com',
            status: 'joined',
            permission: 1
          },
          {
            _id: '531832618e4278e018000001',
            email: 'elodie@sup.com',
            status: 'still waiting',
            permission: 0
          }
        ]
      }
    ];


    $scope.inviteform = {
      email: '',
      permission: 0
    };


    $scope.shareItem = function(form, id) {
      if (form.email && form.email.length > 0) {

        //Share.post({'id':id, 'with':[{ email:form.email, permission:form.permission}]}, function(res) {
          for (var i = 0, l = $scope.items.length; i < l; i++) {
            if ($scope.items[i]._id === id) {
              $scope.items[i].members.push({
                email: form.email,
                permission: form.permission,
                status: 'still waiting'
              });
              break;
            }
          }

          $scope.inviteform = {
            email: '',
            permission: 0
          };
        /*}, function(err) {
          console.log('Can\'t share the item.');
        });*/
      }
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