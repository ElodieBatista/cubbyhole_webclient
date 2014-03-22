'use strict';

var module = angular.module('webApp');

module.directive('notificationExplorer', function() {
  return {
    restrict: 'A',
    scope: '{}',

    link: function (scope, element, attrs) {
      scope.toggleItem = function(item, forceSelect) {
        if (scope.itemActive === item && !forceSelect) {
          scope.itemActive = null;
        } else {
          scope.itemActive = item;
        }
      };


      scope.neOpenModalDeleteNotification = function(item) {
        scope.modalOpts = {
          title: 'Delete notification',
          submitFn: scope.deleteNotification,
          submitFnExtraParam: item._id,
          submitBtnVal: 'Delete',
          templateUrl: 'src/notifications/tpls/deleteNotification.tpl.html'
        };
        $('#appmodal').modal('show');
      };
    }
  };
});