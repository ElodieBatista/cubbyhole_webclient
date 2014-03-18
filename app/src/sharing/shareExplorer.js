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
      scope.canConfirm = function(id) {
          for (var i = 0, l = scope.itemActive.members.length; i < l; i++) {
            if (scope.itemActive.members[i]._id === id &&
              !scope.itemActive.members[i].accepted) {
              return true;
            }
          }
          return false;
      };


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


      scope.seOpenModalShareItem = function(item) {
        scope.modalform = {};
        scope.modalform.member = {
          0: {
            email: '',
            permissions: 0
          }
        };

        scope.modalOpts = {
          title: 'Share ' + item.name + ' with:',
          iconClass: 'fa-envelope',
          submitFn: scope.shareItem,
          placeholder: 'Invite People',
          submitFnExtraParam: item._id,
          submitBtnVal: 'Share',
          extraFn: scope.seModalShareItemAddFields,
          extraFn2: scope.seModalShareDeleteField,
          template:
            '<div class="modal-body" id="modal-body-share">' +
              '<div class="row">' +
              '<span class="col-md-2 col-md-offset-8 modal-mini-title">Read Only</span>' +
              '<span class="col-md-2 modal-mini-title">Read Write</span>' +
              '</div>' +

              '<div class="row" id="share-member0">' +
              '<div class="col-md-1">' +
              '<button class="btn btn-big" ng-class="submitBtnClass" ng-click="modalOpts.extraFn()">+</button>' +
              '</div>' +
              '<div class="col-md-7">' +
              '<div class="input-prepend" ng-class="{\'input-prepend-active\': focused0}">' +
              '<i class="fa input-icon" ng-class="modalOpts.iconClass"></i>' +
              '<input class="input-text" type="email" placeholder="{{modalOpts.placeholder}}" ng-model="modalform.member[\'0\'].email" required ng-init="focused0 = false" ng-focus="focused0 = true" ng-blur="focused0 = false" />' +
              '</div>' +
              '</div>' +
              '<input class="col-md-2" type="radio" name="permission-0" ng-model="modalform.member[\'0\'].permissions" value="0" required>' +
              '<input class="col-md-2" type="radio" name="permission-0" ng-model="modalform.member[\'0\'].permissions" value="1">' +
              '<span class="hidden">end share-member0</span>' +
              '</div>' +
              '</div>'
        };

        $('#appmodal').modal('show');
      };


      scope.seModalShareItemAddFields = function() {
        var htmlId = $('#modal-body-share .row:last-child').attr('id'),
          prevIndex = parseInt(htmlId.substr(12)),
          index = prevIndex + 1;

        if ($('#share-member' + index).length === 0) {
          scope.modalform.member[index] = {
            email: '',
            permissions: 0
          };

          scope.modalOpts.template = scope.modalOpts.template.substr(0, scope.modalOpts.template.length - 6) +
            '<div class="row" id="share-member' + index + '">' +
            '<div class="col-md-1">' +
            '<button class="close modal-mini-close" ng-click="modalOpts.extraFn2(' + index + ', \'share-member\')">&times;</button>' +
            '</div>' +
            '<div class="col-md-7">' +
            '<div class="input-prepend" ng-class="{\'input-prepend-active\': focused' + index + '}">' +
            '<i class="fa input-icon" ng-class="modalOpts.iconClass"></i>' +
            '<input class="input-text" type="email" placeholder="{{modalOpts.placeholder}}" ng-model="modalform.member[\'' + index + '\'].email" required ng-init="focused' + index + ' = false" ng-focus="focused' + index + ' = true" ng-blur="focused' + index + ' = false" />' +
            '</div>' +
            '</div>' +
            '<input class="col-md-2" type="radio" name="permission-' + index + '" ng-model="modalform.member[\'' + index + '\'].permissions" value="0" required>' +
            '<input class="col-md-2" type="radio" name="permission-' + index + '" ng-model="modalform.member[\'' + index + '\'].permissions" value="1">' +
            '<span class="hidden">end share-member' + index + '</span>' +
            '</div>' +
            '</div>'
          ;
        }
      };


      scope.seModalShareDeleteField = function(index, htmlId) {
        var posStart = scope.modalOpts.template.indexOf('<div class="row" id="' + htmlId + index + '">'),
          posEnd = scope.modalOpts.template.indexOf('<span class="hidden">end ' + htmlId + index + '</span>') + 25 + htmlId.toString().length + index.toString().length + 7 + 6,
          templateSubStr = scope.modalOpts.template.substring(posStart, posEnd);
        scope.modalOpts.template = scope.modalOpts.template.replace(templateSubStr, '');

        delete scope.modalform.member[index];
      };
    }
  };
});