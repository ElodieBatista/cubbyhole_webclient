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
  .config(function(conf, $locationProvider, $httpProvider, $routeProvider, $sceDelegateProvider, $provide) {
    $httpProvider.defaults.headers.common['X-Cub-AuthToken'] = localStorage.token;
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';

    function comesFromCubbyhole(url) {
      return (url.indexOf(conf.epApi) !== -1);
    }

    $provide.factory('httpInterceptor', function($q, $rootScope, $location) {
      return {
        'request': function(config) {
          if (config.url.indexOf(conf.epApi) !== -1) {
            $rootScope.displaySpinner = true;
          }
          return config || $q.when(config);
        },

        'response': function(response) {
          if (response.config.url.indexOf(conf.epApi) !== -1) {
            $rootScope.displaySpinner = false;
          }
          return response || $q.when(response);
        },

        'responseError': function (response) {
          if (response.status === 401 && comesFromCubbyhole(response.config.url)) {
            console.log('401 detected from the server, exiting local session.');
            $location.path('/logout');
            return $q.reject(response);
          } else {
            return $q.reject(response);
          }
        }
      };
    });

    $httpProvider.interceptors.push('httpInterceptor');

    $routeProvider.otherwise({redirectTo: '/files'});

    $sceDelegateProvider.resourceUrlWhitelist([conf.epApi + '**', 'self'])
  })
  .run(function($rootScope, $location, $window) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
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