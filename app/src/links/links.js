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
      'delete': {
        method:'DELETE'
      }
    });


    Links.get(function(res) {
      //$scope.links = res.data;
      $scope.items = [
        {
          name: 'A',
          type: 'folder',
          path: 'My Cubbyhole, A',
          owner: {
            email: 'elodie111@yopmail.com'
          },
          isShared: false,
          link: {
            url: '/webapp.html#/sh/aaabbbccc111222333',
            creationDate: '2014-03-17T20:08:00.928Z'
          }
        },
        {
          name: 'B',
          type: 'file',
          path: 'My Cubbyhole, A',
          owner: {
            email: 'elodie111@yopmail.com'
          },
          isShared: true,
          link: {
            url: '/webapp.html#/sh/aaabbbccc111222444',
            creationDate: '2014-03-17T20:08:00.928Z'
          }
        }
      ];
    }, function(err) { $scope.errorShow(err); });


    $scope.deleteLink = function(form, id) {
      //Link.delete({'id':id}, function(res) {
        for (var i = 0, l = $scope.items.length; i < l; i++) {
          if ($scope.items[i]._id === id) {
            $scope.items.splice(i, 1);
            break;
          }
        }
      //}, function(err) { $scope.errorShow(err, color); });
    };


    $scope.shareLink = function(form, id) {
      if (form.member['0'].email.length > 0) {
        var members = [];

        for (var prop in form.member) {
          members.push(form.member[prop]);
        }

        //Link.post({'id':id, 'with':members}, function(res) {

        /*}, function(err) {
         console.log('Can\'t share the item.');
         });*/
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