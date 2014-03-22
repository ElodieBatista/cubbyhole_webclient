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
  function LinksCtrl($scope, apiService) {
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
      var members = [];
      for (var prop in form.member) {
        members.push(form.member[prop]);
      }

      apiService.Link.put({'id':id, 'with':members}, function(res) {
      }, function(err) { $scope.errorShow(err); });
    };
  }
);