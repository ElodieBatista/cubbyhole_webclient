'use strict';

var module = angular.module('webApp');

module.config(function config($routeProvider) {
  $routeProvider
    .when('/sh',
    {
      templateUrl: '/src/links/publicLinks.tpl.html',
      controller: 'PublicLinksCtrl'
    })
});

module.controller('PublicLinksCtrl',
  function PublicLinksCtrl(conf, $rootScope, $scope, $routeParams, $resource, $upload) {
    var color = 'primary';

    $scope.link = {
      from: 'User1',
      item: {
        name: 'ABC',
        type: 'folder'
      }
    }
  }
);