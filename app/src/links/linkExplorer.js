'use strict';

var module = angular.module('webApp');

/**
 *
 */
module.directive('linkExplorer', function($location) {
  return {
    restrict: 'A',
    scope: '{}',
    template: '',

    link: function (scope, element, attrs) {
      scope.leOpenModalDeleteLink = function(item) {
        scope.modalOpts = {
          title: 'Delete ' + item.name + ' link',
          submitFn: scope.deleteLink,
          submitFnExtraParam: item._id,
          submitBtnVal: 'Delete',
          submitBtnClass: 'tertiary-btn',
          dismiss: scope.dismissModal,
          template:
            '<div class="modal-body">' +
              '<p>Are you sure you want to delete this link?</p>' +
            '</div>'
        };

        $('#appmodal').modal('show');
      };


      scope.leOpenModalShareLink = function(item) {
        scope.modalform = {};
        scope.modalform.member = {
          0: {
            email: ''
          }
        };

        scope.modalOpts = {
          title: 'Share link for ' + item.name + ' with:',
          iconClass: 'fa-envelope',
          submitFn: scope.shareLink,
          placeholder: 'Invite People',
          submitFnExtraParam: item._id,
          submitBtnVal: 'Share Link',
          submitBtnClass: 'tertiary-btn',
          extraFn: scope.leModalShareLinkAddFields,
          extraFn2: scope.leModalShareDeleteField,
          link: item.link.url,
          dismiss: scope.dismissModal,
          template:
            '<div class="modal-body" id="modal-body-share">' +
              '<div class="row">' +
              '<p class="col-md-12">' +
              'This ' + item.type + ' is public. People can access it at: <a href="{{modalOpts.link}}" ng-bind="modalOpts.link"></a>' +
              '</p>' +
              '</div>' +

              '<div class="row">' +
              '<p class="col-md-12">' +
              'Send the link to your friends:' +
              '</p>' +
              '</div>' +

              '<div class="row" id="share-link-member0">' +
              '<div class="col-md-1">' +
              '<button class="btn btn-big" ng-class="modalOpts.submitBtnClass" ng-click="modalOpts.extraFn()">+</button>' +
              '</div>' +
              '<div class="col-md-7">' +
              '<div class="input-prepend" ng-class="{\'input-prepend-active\': focused0}">' +
              '<i class="fa input-icon" ng-class="modalOpts.iconClass"></i>' +
              '<input class="input-text" type="email" placeholder="{{modalOpts.placeholder}}" ng-model="modalform.member[\'0\'].email" required ng-init="focused0 = false" ng-focus="focused0 = true" ng-blur="focused0 = false" />' +
              '</div>' +
              '</div>' +
              '<span class="hidden">end share-link-member0</span>' +
              '</div>' +
              '</div>'
        };

        $('#appmodal').modal('show');
      };


      scope.leModalShareLinkAddFields = function() {
        var htmlId = $('#modal-body-share .row:last-child').attr('id'),
          prevIndex = parseInt(htmlId.substr(17)),
          index = prevIndex + 1;

        if ($('#share-link-member' + index).length === 0) {
          scope.modalform.member[index] = {
            email: ''
          };

          scope.modalOpts.template = scope.modalOpts.template.substr(0, scope.modalOpts.template.length - 6) +
            '<div class="row" id="share-link-member' + index + '">' +
            '<div class="col-md-1">' +
            '<button class="close modal-mini-close" ng-click="modalOpts.extraFn2(' + index + ', \'share-link-member\')">&times;</button>' +
            '</div>' +
            '<div class="col-md-7">' +
            '<div class="input-prepend" ng-class="{\'input-prepend-active\': focused' + index + '}">' +
            '<i class="fa input-icon" ng-class="modalOpts.iconClass"></i>' +
            '<input class="input-text" type="email" placeholder="{{modalOpts.placeholder}}" ng-model="modalform.member[' + index + '].email" required ng-init="focused' + index + ' = false" ng-focus="focused' + index + ' = true" ng-blur="focused' + index + ' = false" />' +
            '</div>' +
            '</div>' +
            '<span class="hidden">end share-link-member' + index + '</span>' +
            '</div>' +
            '</div>'
          ;
        }
      };

      scope.leModalShareDeleteField = function(index, htmlId) {
        var posStart = scope.modalOpts.template.indexOf('<div class="row" id="' + htmlId + index + '">'),
            posEnd = scope.modalOpts.template.indexOf('<span class="hidden">end ' + htmlId + index + '</span>') + 25 + htmlId.toString().length + index.toString().length + 7 + 6,
            templateSubStr = scope.modalOpts.template.substring(posStart, posEnd);
        scope.modalOpts.template = scope.modalOpts.template.replace(templateSubStr, '');

        delete scope.modalform.member[index];
      };


      scope.dismissModal = function() {
        $('.modal').modal('hide');
      };
    }
  };
});