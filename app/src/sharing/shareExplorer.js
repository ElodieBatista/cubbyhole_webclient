'use strict';

var module = angular.module('webApp');

/**
 *
 */
module.directive('shareExplorer', function() {
  return {
    restrict: 'A',
    scope: '{}',
    template: '',

    link: function (scope, element, attrs) {
      scope.seAskUnshareConfirm = function(item) {
        scope.modalOpts = {
          title: item.name,
          submitBtnVal: 'Unshare',
          submitFn: scope.unshareItem,
          submitFnExtraParam: item._id,
          template:
            '<div class="modal-body">' +
              '<p>Are you sure you want to unshare this folder?</p>' +
            '</div>'
        };

        $('#appmodal').modal('show');
      };


      scope.seAskLeaveSharedItemConfirm = function(item) {
        scope.modalOpts = {
          title: item.name,
          submitBtnVal: 'Leave',
          submitFn: scope.leaveSharedItem,
          submitFnExtraParam: item._id,
          template:
            '<div class="modal-body">' +
              '<p>Are you sure you want to leave this folder?</p>' +
            '</div>'
        };

        $('#appmodal').modal('show');
      };


      scope.seAskRevokeSharePermissionConfirm = function(item, member) {
        scope.modalOpts = {
          title: 'Revoke Permission for ' + member.email,
          submitBtnVal: 'Revoke',
          submitFn: scope.revokeSharePermission,
          submitFnExtraParam: {itemId:item._id, memberId:member._id},
          template:
            '<div class="modal-body">' +
              '<p>Are you sure you want to revoke sharing permissions for ' + member.email + ' on ' + item.name + '?</p>' +
            '</div>'
        };

        $('#appmodal').modal('show');
      };
    }
  };
});