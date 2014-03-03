'use strict';

var module = angular.module('webApp');

module.config(function config($routeProvider) {
  $routeProvider
    .when('/logout',
    {
      template: '<div></div>',
      controller: 'LogoutCtrl'
    })
});

module.controller('LogoutCtrl',
  function LogoutCtrl($rootScope, $scope, $routeParams, $resource, $window, $http) {
    delete $http.defaults.headers.common['X-Cub-AuthToken'];
    localStorage.clear();
    $rootScope.profile = null;
    $window.location.href = 'index.html';
  }
);