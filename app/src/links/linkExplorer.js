'use strict';

var module = angular.module('webApp');

/**
 *
 */
module.directive('linkExplorer', function() {
  return {
    restrict: 'A',
    scope: '{}',

    link: function (scope, element, attrs) {
      scope.leOpenModalDeleteLink = function(item) {
        scope.modalOpts = {
          title: 'Delete ' + item.name + ' link',
          submitFn: scope.deleteLink,
          submitFnExtraParam: item._id,
          submitBtnVal: 'Delete',
          templateUrl: 'src/links/tpls/deleteLink.tpl.html'
        };

        $('#appmodal').modal('show');
      };


      scope.leOpenModalShareLink = function(item) {
        scope.modalform = {
          member: {
            0: {
              email: ''
            }
          }
        };

        scope.modalOpts = {
          title: 'Share link for ' + item.name + ' with:',
          submitFn: scope.shareLink,
          submitFnExtraParam: item._id,
          submitBtnVal: 'Share Link',
          obj: item,
          templateUrl: 'src/links/tpls/shareLink.tpl.html'
        };

        $('#appmodal').modal('show');
      };
    }
  };
});