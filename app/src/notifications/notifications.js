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
      $scope.notifications = res.data;
    }, function(err) { $scope.errorShow(err); });
  }
);