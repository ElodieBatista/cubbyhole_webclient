'use strict';

var module = angular.module('webApp');

module.config(function config($routeProvider) {
  $routeProvider
    .when('/sh/:id',
    {
      templateUrl: '/src/links/publicLinks.tpl.html',
      controller: 'PublicLinksCtrl'
    })
});

module.controller('PublicLinksCtrl',
  function PublicLinksCtrl($scope, $routeParams, apiService) {
    apiService.Item.get({'id':$routeParams.id}, function(res) {
      $scope.item = res.data;
    }, function(err) { $scope.errorShow(err); });
  }
);