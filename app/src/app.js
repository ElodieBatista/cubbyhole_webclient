'use strict';

angular.module('webApp', [
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngAnimate',
    'angularFileUpload'
  ])
  .constant('conf', {
    'epApi': 'http://localhost:3000'
  })
  .config(function($locationProvider, $httpProvider, $routeProvider) {
    $httpProvider.defaults.headers.common['X-Cub-AuthToken'] = localStorage.token;
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';

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
        return (url.indexOf(conf.epApi) !== -1);
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

    $routeProvider.otherwise({redirectTo: '/files'});
  })
  .run(function($rootScope, $location, $window) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      console.log('Route change start');

      if (next.authRequired === true && !$rootScope.getToken()) {
        $window.location.href = 'index.html';
      }
    });

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