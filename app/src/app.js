'use strict';

var app = angular.module('webApp', ['ngResource', 'ngRoute', 'ngSanitize', 'ngAnimate', 'angularFileUpload']);

/**
 * App module's configuration
 */
app.config(function($locationProvider, $httpProvider, $routeProvider) {
    $httpProvider.defaults.headers.common['X-Cub-AuthToken'] = localStorage.sessionKey;

    var interceptorHttp = ['$q', '$injector', '$rootScope', function($q, $injector, $rootScope) {
        var $http;

        function success(response) {
            // Get $http via $injector to avoid circular dependency problem
            $http = $http || $injector.get('$http');

            if ($http.pendingRequests.length < 1) {
                $rootScope.displaySpinner = false;
            }
            return response;
        }

        function error(response) {
            // get $http via $injector to avoid circular dependency problem
            $http = $http || $injector.get('$http');

            if ($http.pendingRequests.length < 1) {
                $rootScope.displaySpinner = false;
            }
            return $q.reject(response);
        }

        return function (promise) {
            $rootScope.displaySpinner = true;
            return promise.then(success, error);
        };
    }];

    // Configure an interceptor to watch for unauthorized service calls
    var interceptor401 = ['$location', '$q', '$rootScope', function($location, $q, $rootScope) {
        function comesFromCubbyhole(url) {
            return (url.indexOf($rootScope.srvEndpoint) !== -1);
        }

        return {
            response: function (response) {
                return response;
            },
            responseError: function (response) {
                if (response.status === 401 && comesFromCubbyhole(response.config.url)) {
                    console.log('401 detected from the server, exiting local session.');
                    $location.path('/logout');
                    return $q.reject(response);
                } else {
                    return $q.reject(response);
                }
            }
        }
    }];

    $httpProvider.interceptors.push(interceptorHttp);
    $httpProvider.interceptors.push(interceptor401);

    // Set a default route
    $routeProvider.otherwise({redirectTo: '/files'});
});

/**
 * App Run block: get executed after the injector is created and are used to kickstart the application
 * Only instances and constants can be injected into run blocks. This is to prevent further system configuration during application run time
 */
app.run(function($rootScope, $location, $window, $anchorScroll) {
    $rootScope.srvEndpoint = '';

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        console.log('Route change start');

        if (next.authRequired === true && !$rootScope.getToken()) {
            $window.location.href = 'index.html';
        }
    });

    $rootScope.scrollTo = function(id) {
        $location.hash(id);
        $anchorScroll();
    };

    $rootScope.getToken = function() {
        if ($rootScope.token) {
            return $rootScope.token;
        } else if (localStorage.token) {
            $rootScope.token = localStorage.token;
            return $rootScope.token;
        } else {
            return null;
        }
    };

    $rootScope.getProfile = function() {
        if ($rootScope.profile) {
            return $rootScope.profile;
        } else if (localStorage.profile) {
            $rootScope.profile = JSON.parse(localStorage.profile);
            return $rootScope.profile;
        } else {
            return null;
        }
    };
});