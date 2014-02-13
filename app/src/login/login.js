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
        var data = JSON.parse(localStorage.getItem('dataAuth'));
        localStorage.removeItem('dataAuth');

        localStorage.setItem('sessionKey', data.sessionKey);
        localStorage.setItem('profile', JSON.stringify(data.profile));

        $http.defaults.headers.common['X-Cub-AuthToken'] = data.sessionKey;

        $rootScope.profile = data.profile;

        console.log('Saving Auth info in the LocalStorage: ' + data.sessionKey + ' ' + JSON.stringify(data.profile));

        $location.path('/files');
    }
);