'use strict';

var module = angular.module('webApp');

module.config(function config($routeProvider) {
  $routeProvider
    .when('/link/:id',
    {
      templateUrl: '/src/link/link.tpl.html',
      controller: 'LinkCtrl',
      authRequired: false
    })
});

module.controller('LinkCtrl',
  function LinkCtrl(conf, $rootScope, $scope, $routeParams, $resource) {
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
          title: 'Notif 1',
          date: '2014-03-06T08:51:42.928Z'
        },
        {
          title: 'Notif 2',
          date: '2014-03-10T08:51:42.928Z'
        }
      ];
    }, function(error) {
      console.log('Can\'t get the notifications.');
    });
  }
);