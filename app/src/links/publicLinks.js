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
  function PublicLinksCtrl(conf, $rootScope, $scope, $routeParams, $resource) {
    var Item = $resource(conf.epApi + '/item/:id', {id:'@id'}, {
      'get': {
        method:'GET'
      }
    });


    Item.get({'id':$routeParams.id}, function(res) {
      $scope.item = res.data;
    }, function(err) { $scope.errorShow(err); });
  }
);