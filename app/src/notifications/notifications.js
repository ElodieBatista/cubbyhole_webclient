'use strict';

var module = angular.module('webApp');

module.config(function config($routeProvider) {
  $routeProvider
    .when('/notifications',
    {
      templateUrl: '/src/notifications/notifications.tpl.html',
      controller: 'NotificationsCtrl',
      reloadOnSearch: false,
      authRequired: true
    })
});

module.controller('NotificationsCtrl',
  function NotificationsCtrl(conf, $rootScope, $scope, $routeParams, $resource, $upload) {
    // Highlight first btn in the nav bar
    $rootScope.navtop = 3;


  }
);