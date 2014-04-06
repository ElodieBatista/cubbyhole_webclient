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
  function UserCtrl(conf, $rootScope, $scope, $routeParams, $location, apiService) {
    $scope.getColorClass = function(percent) {
      if (percent < 50) {
        return 'quaternary-btn';
      } else if (percent >= 50 && percent < 75) {
        return 'tertiary-btn';
      } else {
        return 'primary-btn';
      }
    };

    $scope.user = {
      avatar: ''
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

      $scope.user.avatar = 'http://www.gravatar.com/avatar/' + MD5($scope.user.email.replace(' ', '').toLowerCase()) + '?s=200&d=404';
    }, function(err) { $scope.errorShow(err); });


    apiService.Plans.get(function(res) {
      $scope.plans = res.data;
    }, function(err) { $scope.errorShow(err); });


    if ($routeParams.paid) {
      $scope.$watch('ueOpenModalPaid', function(newValue) {
        if (newValue !== undefined && newValue !== null) {
          $scope.ueOpenModalPaid($routeParams.paid);
        }
      });
    }


    $scope.deleteUser = function() {
      apiService.Users.delete(function(res) {
        $location.path('/logout');
      }, function(err) { $scope.errorShow(err); });
    };


    $scope.changePassword = function(form) {
      if (form.newpass !== form.newpass2) {
        var err = {
          custom: 1,
          param: ''
        };
        $scope.errorShow(err);
      }
      //apiService.Auth.put(function(res) {
        $scope.ueOpenModalChangePasswordSuccess();
      //}, function(err) { $scope.errorShow(err); });*/
    };
  }
);