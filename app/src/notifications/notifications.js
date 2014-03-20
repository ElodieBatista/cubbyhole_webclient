'use strict';

var module = angular.module('webApp');

module.config(function config($routeProvider) {
  $routeProvider
    .when('/notifications',
    {
      templateUrl: '/src/notifications/notifications.tpl.html',
      controller: 'NotificationsCtrl',
      authRequired: true
    })
});

module.controller('NotificationsCtrl',
  function NotificationsCtrl(conf, $rootScope, $scope, $routeParams, $resource) {
    // Highlight btn in the nav bar
    $rootScope.navtop = 3;

    var Notifications = $resource(conf.epApi + '/notification', {}, {
      'get': {
        method: 'GET'
      }
    });

    var Notification = $resource(conf.epApi + '/notification/:id', {}, {
      'delete': {
        method: 'DELETE'
      }
    });

    $scope.notifications = null;

    Notifications.get(function(res) {
      $scope.notifications = res.data;
    }, function(err) { $scope.errorShow(err); });

    $scope.deleteNotification = function(id) {
      Notification.delete({'id':id}, function(res) {
        for (var i = 0, l = $scope.notifications.length; i < l; i++) {
          if ($scope.notifications[i]._id === id) {
            $scope.notifications.splice(i, 1);
            break;
          }
        }
      }, function(err) { $scope.errorShow(err); });
    };

    $scope.toggleItem = function(item, forceSelect) {
      if ($scope.itemActive === item && !forceSelect) {
        $scope.itemActive = null;
      } else {
        $scope.itemActive = item;
      }
    };
  }
);