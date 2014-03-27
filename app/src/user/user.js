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
  function UserCtrl(conf, $rootScope, $scope, apiService) {
    $scope.getColorClass = function(percent) {
      if (percent < 50) {
        return 'quaternary-btn';
      } else if (percent >= 50 && percent < 75) {
        return 'tertiary-btn';
      } else {
        return 'primary-btn';
      }
    };

    apiService.User.get({id:$rootScope.getProfile().id}, function(res) {
      $scope.user = res.data;

      $scope.stats = {
        storage: ($scope.user.currentPlan.usage.storage * 100) / $scope.user.currentPlan.plan.storage,
        sharedQuota: ($scope.user.currentPlan.usage.share * 100) / $scope.user.currentPlan.plan.sharedQuota
      };

      $scope.statsStyles = {
        storage: $scope.getColorClass($scope.stats.storage),
        sharedQuota: $scope.getColorClass($scope.stats.sharedQuota)
      };
    }, function(err) { $scope.errorShow(err); });


    apiService.Plans.get(function(res) {
      $scope.plans = res.data;
    }, function(err) { $scope.errorShow(err); });
  }
);