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
    function LogoutCtrl($rootScope, $scope, $routeParams, $location, $resource) {
        var Logout = $resource($rootScope.srvEndpoint + 'auth/?');
        Logout.delete();

        localStorage.clear();

        console.log('Logout complete.');

        $location.path('/');
    }
);