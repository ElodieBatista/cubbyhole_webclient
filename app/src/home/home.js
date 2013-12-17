'use strict';

var module = angular.module('webApp');

module.config(function config($routeProvider) {
    $routeProvider
        .when('/home',
        {
            templateUrl: 'partials/home/home.html',
            controller: 'HomeCtrl'
        })
});

module.controller('HomeCtrl',
    function HomeCtrl($rootScope, $scope) {
        console.log('Home Controller');
        $scope.test = 'test';
    }
);