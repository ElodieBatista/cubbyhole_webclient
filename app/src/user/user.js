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

    $scope.getColorClass = function(percent) {
      if (percent < 50) {
        return 'quaternary-btn';
      } else if (percent >= 50 && percent < 75) {
        return 'tertiary-btn';
      } else {
        return 'primary-btn';
      }
    };

    var User = $resource(conf.epApi + '/user/:id', {id:$rootScope.getProfile().id}, {
      'get': {
        method: 'GET'
      }
    });

    User.get(function(res) {
      $scope.user = res.data;

      // TEMP
      $scope.user.currentPlan = {};
      $scope.user.usedStorage = 600;
      $scope.user.currentPlan.storage = 1000;
      $scope.user.usedSharedQuota = 200;
      $scope.user.currentPlan.sharedQuota = 1000;
      $scope.user.usedBandwidth = 750;
      $scope.user.currentPlan.bandwidth = 1000;

      $scope.stats = {
        storage: ($scope.user.usedStorage * 100) / $scope.user.currentPlan.storage,
        //storage: 60,
        sharedQuota: ($scope.user.usedSharedQuota * 100) / $scope.user.currentPlan.sharedQuota,
        //sharedQuota: 20,
        bandwidth: ($scope.user.usedBandwidth * 100) / $scope.user.currentPlan.bandwidth
        //bandwidth: 75
      };

      $scope.statsStyles = {
        storage: $scope.getColorClass($scope.stats.storage),
        sharedQuota: $scope.getColorClass($scope.stats.sharedQuota),
        bandwidth: $scope.getColorClass($scope.stats.bandwidth)
      }
    }, function(err) {
      console.log('Can\'t get the user.');
    });
  }
);