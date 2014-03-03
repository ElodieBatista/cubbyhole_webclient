'use strict';

var module = angular.module('webApp');

module.config(function config($routeProvider) {
  $routeProvider
    .when('/login',
    {
      template: '<div></div>',
      controller: 'LoginCtrl'
    })
});

module.controller('LoginCtrl',
  function LoginCtrl($rootScope, $scope, $location, $http) {
    var profile = JSON.parse(localStorage.getItem('dataAuth'));
    localStorage.removeItem('dataAuth');

    localStorage.setItem('token', profile.token);
    localStorage.setItem('profile', JSON.stringify(profile));

    $http.defaults.headers.common['X-Cub-AuthToken'] = profile.token;

    $rootScope.profile = profile;

    console.log('Saving Auth info in the LocalStorage: ' + profile.token + ' ' + JSON.stringify(profile));

    $location.path('/files');
  }
);