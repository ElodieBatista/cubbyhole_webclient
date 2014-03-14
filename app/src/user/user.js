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

    var Plans = $resource(conf.epApi + '/plan', {}, {
      'get': {
        method: 'GET'
      }
    });

    User.get(function(res) {
      $scope.user = res.data;

      // TEMP
      $scope.user.currentPlan = {
        _id: $scope.user.currentPlan,
        name: 'Free'
      };
      $scope.user.usedStorage = 600;
      $scope.user.currentPlan.storage = 1000;
      $scope.user.usedSharedQuota = 200;
      $scope.user.currentPlan.sharedQuota = 1000;
      $scope.user.usedBandwidth = 750;
      $scope.user.currentPlan.bandwidth = 1000;

      $scope.stats = {
        storage: ($scope.user.usedStorage * 100) / $scope.user.currentPlan.storage,
        sharedQuota: ($scope.user.usedSharedQuota * 100) / $scope.user.currentPlan.sharedQuota,
        bandwidth: ($scope.user.usedBandwidth * 100) / $scope.user.currentPlan.bandwidth
      };

      $scope.statsStyles = {
        storage: $scope.getColorClass($scope.stats.storage),
        sharedQuota: $scope.getColorClass($scope.stats.sharedQuota),
        bandwidth: $scope.getColorClass($scope.stats.bandwidth)
      };

      $scope.plans = [
        {
          _id: $scope.user.currentPlan._id,
          name: 'free',
          duration: 0,
          storage: 100,
          sharedQuota: 100,
          bandwidth: 100,
          price: 0
        },
        {
          _id: 'abcdefghi123456',
          name: 'pro',
          duration: 90,
          storage: 300,
          sharedQuota: 300,
          bandwidth: 300,
          price: 14.99
        },
        {
          _id: 'aaabbbccc111222',
          name: 'business',
          duration: 365,
          storage: 1000,
          sharedQuota: 1000,
          bandwidth: 1000,
          price: 24.99
        }
      ];
    }, function(err) {
      console.log('Can\'t get the user.');
    });


    //Plans.get(function(res) {
      //$scope.plans = res.data;
    /*}, function(err) {
      console.log('Can\'t get the plans.');
    });*/
  }
);