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
        // TODO: Send request to API to logout
        /*var Logout = $resource($rootScope.srvEndpoint + 'auth/?');
        Logout.delete();*/

        delete $http.defaults.headers.common['X-Cub-AuthToken'];

        localStorage.clear();

        $rootScope.profile = null;

        console.log('Logout complete.');

        $window.location.href = 'index.html';
    }
);