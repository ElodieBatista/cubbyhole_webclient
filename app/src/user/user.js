'use strict';

var module = angular.module('webApp');

module.config(function config($routeProvider) {
  $routeProvider
    .when('/user',
    {
      templateUrl: '/src/user/user.tpl.html',
      controller: 'UserCtrl',
      authRequired: true
    })
});

module.controller('UserCtrl',
  function SharingCtrl(conf, $rootScope, $scope, $routeParams, $resource) {
    // Highlight first btn in the nav bar
    $rootScope.navtop = 4;

    var User = $resource(conf.epApi + '/user/:id', {id:$rootScope.getProfile().id}, {
      'get': {
        method: 'GET'
      }
    });

    User.get(function(res) {
      console.log(res);
      $scope.user = res.data;
      /*$scope.user = {
        email: $rootScope.getProfile().email,
        registrationDate: '2014-03-06T08:51:42.928Z',
        currentPlan: 'Free'
      };*/
    }, function(error) {
      console.log('Can\'t get the notifications.');
    });
  }
);