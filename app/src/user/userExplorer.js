'use strict';

var module = angular.module('webApp');

module.directive('userExplorer', function() {
  return {
    restrict: 'A',
    scope: '{}',

    link: function (scope, element, attrs) {
      scope.ueOpenModalDeleteUser = function() {
        scope.modalOpts = {
          title: 'Delete my Account',
          submitBtnVal: 'Delete',
          submitFn: scope.deleteUser,
          templateUrl: 'src/user/tpls/deleteUser.tpl.html'
        };
        $('#appmodal').modal('show');
      };


      scope.ueOpenModalPaid = function(name) {
        scope.modalOpts = {
          title: 'Congratulations',
          submitBtnVal: 'OK',
          name: name,
          templateUrl: 'src/user/tpls/paid.tpl.html'
        };
        $('#appmodal').modal('show');
      }
    }
  };
});