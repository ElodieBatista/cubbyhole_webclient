'use strict';

var module = angular.module('webApp');

module.config(function config($routeProvider) {
  $routeProvider
    .when('/links',
    {
      templateUrl: '/src/links/links.tpl.html',
      controller: 'LinksCtrl',
      reloadOnSearch: false,
      authRequired: true
    })
});

module.controller('LinksCtrl',
  function LinksCtrl(conf, $rootScope, $scope, $routeParams, $resource, $upload) {
    // Highlight first btn in the nav bar
    $rootScope.navtop = 3;
    var color = 'tertiary';

  }
);