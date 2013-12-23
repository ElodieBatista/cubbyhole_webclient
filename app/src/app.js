'use strict';

var app = angular.module('webApp', ['ngResource', 'ngRoute', 'ngSanitize', 'ngAnimate']);

/**
 * App module's configuration
 */
app.config(function($locationProvider, $httpProvider, $routeProvider, $sceDelegateProvider) {
    // Set a default route
    $routeProvider.otherwise({redirectTo: '/home'});
});

/**
 * App Run block: get executed after the injector is created and are used to kickstart the application
 * Only instances and constants can be injected into run blocks. This is to prevent further system configuration during application run time
 */
app.run(function($rootScope, $location, $anchorScroll) {
    $rootScope.srvEndpoint = '';

    $rootScope.$on('$routeChangeStart', function() {
        console.log('Route change start');
    });

    $rootScope.scrollTo = function(id) {
        $location.hash(id);
        $anchorScroll();
    }
});