'use strict';

var module = angular.module('webApp');

module.config(function config($routeProvider) {
  $routeProvider
    .when('/notifications',
    {
      templateUrl: '/src/notifications/notifications.tpl.html',
      controller: 'NotificationsCtrl',
      authRequired: true
    })
});

module.controller('NotificationsCtrl',
  function NotificationsCtrl(conf, $rootScope, $scope, $routeParams, $resource) {
    // Highlight first btn in the nav bar
    $rootScope.navtop = 3;

    var Notifications = $resource(conf.epApi + '/notification', {}, {
      'get': {
        method: 'GET'
      }
    });

    $scope.notifications = null;

    Notifications.get(function(res) {
      //$scope.notifications = res.data;
      $scope.notifications = [
        {
          type: 'S',
          date: '2014-03-06T08:51:42.928Z',
          text: 'user1 wants to share the folder abc with you.'
        },
        {
          type: 'D',
          date: '2014-03-10T08:51:42.928Z',
          text: 'user1 removed xyz in abc.'
        }
     ];
    }, function(error) {
      console.log('Can\'t get the notifications.');
    });
  }
);