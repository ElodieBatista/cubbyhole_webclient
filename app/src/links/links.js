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
  function LinksCtrl(conf, $rootScope, $scope, $routeParams, $resource) {
    // Highlight first btn in the nav bar
    $rootScope.navtop = 2;

    var Links = $resource(conf.epApi + '/link', {}, {
      'get': {
        method: 'GET'
      }
    });

    var Link = $resource(conf.epApi + '/link/:id', {id:'@id'}, {
      'put': {
        method:'PUT',
        params: {
          with:'@with'
        }
      },
      'delete': {
        method:'DELETE'
      }
    });


    Links.get(function(res) {
      $scope.items = res.data;
    }, function(err) { $scope.errorShow(err); });


    $scope.deleteLink = function(form, id) {
      Link.delete({'id':id}, function(res) {
        for (var i = 0, l = $scope.items.length; i < l; i++) {
          if ($scope.items[i]._id === id) {
            $scope.items.splice(i, 1);
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

        Link.put({'id':id, 'with':members}, function(res) {
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