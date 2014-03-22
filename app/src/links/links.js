'use strict';

var module = angular.module('webApp');

module.config(function config($routeProvider) {
  $routeProvider
    .when('/links',
    {
      templateUrl: '/src/links/links.tpl.html',
      controller: 'LinksCtrl',
      reloadOnSearch: false,
      authRequired: true
    })
});

module.controller('LinksCtrl',
  function LinksCtrl(conf, $rootScope, $scope, apiService) {
    // Highlight first btn in the nav bar
    $rootScope.navtop = 2;

    $scope.userId = $rootScope.getProfile().id;


    apiService.Links.get(function(res) {
      $scope.items = res.data;
    }, function(err) { $scope.errorShow(err); });


    $scope.deleteLink = function(form, id) {
      apiService.Link.delete({'id':id}, function(res) {
        for (var i = 0, l = $scope.items.length; i < l; i++) {
          if ($scope.items[i]._id === id) {
            $scope.items.splice(i, 1);
            $scope.toggleItem(null);
            break;
          }
        }
      }, function(err) { $scope.errorShow(err); });
    };


    $scope.shareLink = function(form, id) {
      if (form.member['0'].email.length > 0) {
        var members = [];

        for (var prop in form.member) {
          members.push(form.member[prop]);
        }

        apiService.Link.put({'id':id, 'with':members}, function(res) {
        }, function(err) { $scope.errorShow(err); });
      }
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