'use strict';

var module = angular.module('webApp');

module.directive('shareExplorer', function($location) {
  return {
    restrict: 'A',
    scope: '{}',

    link: function (scope, element, attrs) {
      scope.toggleItem = function(item, forceSelect) {
        if (scope.itemActive === item && !forceSelect || item === null) {
          scope.itemActive = null;
          $location.search('id', null);
        } else {
          scope.itemActive = item;
          $location.path('/sharing').search({id: scope.itemActive._id});
          if (!scope.$$phase) { scope.$apply(); }
        }
      };


      scope.canConfirm = function(id) {
        for (var i = 0, l = scope.itemActive.members.length; i < l; i++) {
          if (scope.itemActive.members[i]._id === id &&
            !scope.itemActive.members[i].accepted) {
            return true;
          }
        }
        return false;
      };


      scope.seOpenModalUnshareItem = function(item) {
        scope.modalOpts = {
          title: item.name,
          submitBtnVal: 'Unshare',
          submitFn: scope.unshareItem,
          submitFnExtraParam: item._id,
          templateUrl: 'src/sharing/tpls/unshareItem.tpl.html'
        };
        $('#appmodal').modal('show');
      };


      scope.seOpenModalLeaveSharedItem = function(item) {
        scope.modalOpts = {
          title: item.name,
          submitBtnVal: 'Leave',
          submitFn: scope.leaveSharedItem,
          submitFnExtraParam: item._id,
          templateUrl: 'src/sharing/tpls/leaveSharedItem.tpl.html'
        };
        $('#appmodal').modal('show');
      };


      scope.seOpenModalRevokeSharePermission = function(item, member) {
        scope.modalOpts = {
          title: 'Revoke Permission for ' + member.email,
          submitBtnVal: 'Revoke',
          submitFn: scope.revokeSharePermission,
          submitFnExtraParam: {itemId:item._id, memberId:member._id},
          obj: {
            member: member,
            item: item
          },
          templateUrl: 'src/sharing/tpls/revokeSharePermission.tpl.html'
        };
        $('#appmodal').modal('show');
      };


      scope.seOpenModalShareItem = function(item) {
        scope.modalform = {
          member: {
            0: {
              email: '',
              permissions: 0
            }
          }
        };

        scope.modalOpts = {
          title: 'Share ' + item.name + ' with:',
          submitFn: scope.shareItem,
          submitFnExtraParam: item._id,
          submitBtnVal: 'Share',
          templateUrl: 'src/sharing/tpls/shareItem.tpl.html'
        };
        $('#appmodal').modal('show');
      };
    }
  };
});