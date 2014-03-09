'use strict';

var module = angular.module('webApp');

/**
 * Defines the way to display a tree view
 */
module.directive('fileExplorer', function($location) {
  return {
    restrict: 'E',
    scope: '{}',
    templateUrl: '/src/files/fileExplorer.tpl.html',

    link: function (scope, element, attrs) {
      scope.token = localStorage.token;

      var $tree,
          $progressBar = $('#file-explorer-progress-bar');

      scope.$watch(attrs.items, function(newValue) {
        if (newValue !== undefined && newValue !== null) {
          scope.items = newValue;

          $tree = $('#tree-view');

          $tree.bind(
            'tree.select',
            function(event) {
              // Node selected
              if (event.node) {
                scope.selectedNode = event.node;
                scope.files = scope.selectedNode.children;

                scope.toggleItem(null);

                $location.path('/files').search({path: scope.selectedNode.getPath()});

                if (!scope.$$phase) { scope.$apply(); }
              }
            }
          );

          $tree.bind(
            'tree.init',
            function() {
              scope.feOpenRoot();
            }
          );

          $tree.tree({
            data: scope.items,
            onCanDisplayNode: function(node) {
              return node.type === 'folder';
            }
          });

          if (scope.path !== undefined && scope.path !== '') {
            // Unroll the tree & Select the last node of the url
            var node,
                nodesName = scope.path.split(',');

            for (var i = 0, l = nodesName.length; i < l; i++) {
              node = $tree.tree('getNodeBy', 'name', nodesName[i], node);

              // If path is incorrect
              if (node === null) {
                break;
              }

              if (node.children.length > 0) {
                $tree.tree('openNode', node);

                if (i === (l - 1)) {
                  $tree.tree('selectNode', node);
                }
              } else {
                if (node.type === 'folder') {
                  $tree.tree('selectNode', node);
                } else {
                  $tree.tree('selectNode', node.parent);
                }
              }
            }
          }
        }
      });


      scope.feOpenRoot = function() {
        var node = $tree.tree('getNodeBy', '_id', scope.rootItem._id);
        $tree.tree('openNode', node);
        scope.feSelectNode(node);
      };


      scope.feSelectNode = function(node) {
        if (node.type === 'folder') {
          $tree.tree('selectNode', node);
        }

        $location.path('/files').search({path: node.getPath()});

        if (!scope.$$phase) { scope.$apply(); }
      };


      scope.feAddNode = function(item, parentId) {
        var parent = $tree.tree('getNodeBy', '_id', parentId);
        $tree.tree('openNode', parent);

        var newPos = scope.getNodeNewPos(item, parent, item.name),
            action = 'addNode';

        if (newPos.pos === 'Here') {
          action = 'appendNode';
        } else {
          action += newPos.pos;
        }

        $tree.tree(
          action,
          item,
          newPos.sibling
        );
      };


      scope.feAddNodes = function(item, parentId) {
        scope.feAddNode(item, parentId);

        var feIterate = function(node, callback) {
          var child, _i, _len, _ref;
          if (node.children) {
            _ref = node.children;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              child = _ref[_i];
              callback(child, child.parent);
              if (child.children.length > 0) {
                feIterate(child, callback);
              }
            }
            return null;
          }
        };

        feIterate(item, scope.feAddNode);
      };


      scope.feAddFolder = function(folder, parentId) {
        scope.feAddNode(folder, parentId);
      };


      scope.feRenameItem = function(name, id, parentId) {
        var node = $tree.tree('getNodeBy', '_id', id);
        var parent = $tree.tree('getNodeBy', '_id', parentId);

        var newPos = scope.getNodeNewPos(node, parent, name);

        if (newPos.pos !== 'Here') {
          $tree.tree(
            'moveNode',
            node,
            newPos.sibling,
            newPos.pos.toLowerCase()
          );
        }

        $tree.tree(
          'updateNode',
          node,
          {
            name: name
          }
        );
      };


      scope.feDeleteItem = function(id) {
        var node = $tree.tree('getNodeBy', '_id', id);

        $tree.tree('removeNode', node);

        scope.toggleItem(null);
      };


      scope.feDownloadItem = function() {
        if (scope.itemActive.type === 'file' || scope.itemActive.children.length > 0) {
          $('#file-explorer-form-download').submit();
        }
      };


      scope.feShareItem = function(id) {
        if (scope.itemActive.type === 'file' || scope.itemActive.children.length > 0) {
          $('#file-explorer-form-download').submit();
        }
      };


      scope.feMoveItem = function(id, parentId, name) {
        var node = $tree.tree('getNodeBy', '_id', id),
            nodeParent = $tree.tree('getNodeBy', '_id', parentId),
            newPos = scope.getNodeNewPos(node, nodeParent, node.name);

        if (newPos.pos !== 'Here') {
          $tree.tree(
            'moveNode',
            node,
            newPos.sibling,
            newPos.pos.toLowerCase()
          );
        } else {
          $tree.tree(
            'moveNode',
            node,
            nodeParent,
            'inside'
          );
        }

        if (node.name !== name) {
          scope.feRenameItem(name, id, nodeParent._id);
        }
      };


      scope.feCopy = function(item) {
        scope.itemCopied = item;
      };


      scope.feOpenModalNewFolder = function() {
        scope.modalOpts = {
          title: 'Create a folder',
          iconClass: 'fa-folder',
          submitFn: scope.addFolder,
          placeholder: 'Folder name',
          submitFnExtraParam: scope.selectedNode._id,
          submitBtnVal: 'Add',
          dismiss: scope.dismissModal
        };

        $('#appmodal').modal('show');
      };


      scope.feOpenModalRenameItem = function(item) {
        scope.modalform = {};
        scope.modalform.name = item.name;

        scope.modalOpts = {
          title: 'Rename ' + item.name + ' ' + item.type,
          iconClass: 'fa-' + item.type,
          submitFn: scope.renameItem,
          placeholder: item.name,
          submitFnExtraParam: item._id,
          submitBtnVal: 'Rename',
          dismiss: scope.dismissModal,
          template:
            '<div class="modal-body">' +
              '<div class="input-prepend input-prepend-file" ng-class="{\'input-prepend-active\': focused}">' +
                '<i class="fa input-icon" ng-class="modalOpts.iconClass"></i>' +
                '<input class="input-text" type="text" ng-model="modalform.name" required />' +
              '</div>' +
            '</div>'
        };

        $('#appmodal').modal('show');
      };


      scope.feOpenModalDeleteItem = function(item) {
        scope.modalOpts = {
          title: 'Delete ' + item.name + ' ' + item.type,
          submitFn: scope.deleteItem,
          submitFnExtraParam: item._id,
          submitBtnVal: 'Delete',
          dismiss: scope.dismissModal,
          template:
            '<div class="modal-body">' +
              '<p>Are you sure you want to delete this ' + item.type + '?</p>' +
            '</div>'
        };

        $('#appmodal').modal('show');
      };


      scope.feOpenModalNewFiles = function() {
        scope.modalOpts = {
          title: 'Upload files',
          iconClass: 'fa-file',
          submitBtnVal: 'Add',
          submitFn: scope.onFileSelect,
          submitFnExtraParam: null,
          dismiss: scope.dismissModal,
          template:
            '<div class="modal-body">' +
              '<div class="input-prepend input-prepend-file" ng-class="{\'input-prepend-active\': focused}">' +
                '<input class="input-text" type="file" ng-file-select="modalOpts.submitFnExtraParam = $files;" multiple required />' +
              '</div>' +
            '</div>'
        };

        $('#appmodal').modal('show');
      };


      scope.feOpenModalShareItem = function(item) {
        scope.modalform = {};
        scope.modalform.member = {
          0: {
            email: '',
            permission: 0
          }
        };

        scope.modalOpts = {
          title: 'Share ' + item.name + ' with:',
          iconClass: 'fa-envelope',
          submitFn: scope.shareItem,
          placeholder: 'Invite People',
          submitFnExtraParam: item._id,
          submitBtnVal: 'Share',
          extraFn: scope.feModalShareItemAddFields,
          extraFn2: scope.feModalShareItemDeleteField,
          dismiss: scope.dismissModal,
          template:
            '<div class="modal-body" id="modal-body-share">' +
              '<div class="row">' +
                '<span class="col-md-2 col-md-offset-8">Read-Only</span>' +
                '<span class="col-md-2">Read-Write</span>' +
              '</div>' +

              '<div class="row" id="share-member0">' +
                '<div class="col-md-1">' +
                  '<button class="btn primary-btn" ng-click="modalOpts.extraFn()">+</button>' +
                '</div>' +
                '<div class="col-md-7">' +
                  '<div class="input-prepend" ng-class="{\'input-prepend-active\': focused0}">' +
                    '<i class="fa input-icon" ng-class="modalOpts.iconClass"></i>' +
                    '<input class="input-text" type="email" placeholder="{{modalOpts.placeholder}}" ng-model="modalform.member[0].email" required ng-init="focused0 = false" ng-focus="focused0 = true" ng-blur="focused0 = false" />' +
                  '</div>' +
                '</div>' +
                '<input class="col-md-2" type="radio" name="permission-0" ng-model="modalform.member[0].permission" value="0" required>' +
                '<input class="col-md-2" type="radio" name="permission-0" ng-model="modalform.member[0].permission" value="1">' +
                '<span class="hidden">end share-member0</span>' +
              '</div>' +
            '</div>'
        };

        $('#appmodal').modal('show');
      };


      scope.feModalShareItemAddFields = function() {
        var htmlId = $('#modal-body-share .row:last-child').attr('id');
        var prevIndex = parseInt(htmlId.substr(12));
        var index = prevIndex + 1;

        if ($('#share-member' + index).length === 0) {
          scope.modalform.member[index] = {
            email: '',
            permission: 0
          };

          scope.modalOpts.template = scope.modalOpts.template.substr(0, scope.modalOpts.template.length - 6) +
            '<div class="row" id="share-member' + index + '">' +
              '<div class="col-md-1">' +
                '<button class="close" ng-click="modalOpts.extraFn2(' + index + ')">&times;</button>' +
              '</div>' +
              '<div class="col-md-7">' +
                '<div class="input-prepend" ng-class="{\'input-prepend-active\': focused' + index + '}">' +
                  '<i class="fa input-icon" ng-class="modalOpts.iconClass"></i>' +
                  '<input class="input-text" type="email" placeholder="{{modalOpts.placeholder}}" ng-model="modalform.member[' + index + '].email" required ng-init="focused' + index + ' = false" ng-focus="focused' + index + ' = true" ng-blur="focused' + index + ' = false" />' +
                '</div>' +
              '</div>' +
              '<input class="col-md-2" type="radio" name="permission-' + index + '" ng-model="modalform.member[' + index + '].permission" value="0" required>' +
              '<input class="col-md-2" type="radio" name="permission-' + index + '" ng-model="modalform.member[' + index + '].permission" value="1">' +
              '<span class="hidden">end share-member' + index + '</span>' +
            '</div>' +
          '</div>'
          ;
        }
      };


      scope.feModalShareItemDeleteField = function(index) {
        var posStart = scope.modalOpts.template.indexOf('<div class="row" id="share-member' + index + '">');
        var posEnd = scope.modalOpts.template.indexOf('<span class="hidden">end share-member' + index + '</span>') + 37 + index.toString().length + 7 + 6;
        var templateSubStr = scope.modalOpts.template.substring(posStart, posEnd);
        scope.modalOpts.template = scope.modalOpts.template.replace(templateSubStr, '');

        delete scope.modalform.member[index];
      };


      scope.feAskDownloadConfirm = function(item) {
        scope.toggleItem(item, true);

        scope.modalOpts = {
          title: item.name,
          submitBtnVal: 'Download',
          submitFn: scope.feDownloadItem,
          submitFnExtraParam: null,
          dismiss: scope.dismissModal,
          template:
            '<div class="modal-body">' +
              '<p>Do you want to download this ' + item.type + '?</p>' +
            '</div>'
        };

        $('#appmodal').modal('show');
      };


      scope.getNodeNewPos = function(node, nodeParent, newName) {
        if (nodeParent.children.length === 0) {
          return {pos:'Here', sibling:nodeParent};
        }

        for (var i = 0; i < nodeParent.children.length; i++) {
          if (newName.toLowerCase() <= nodeParent.children[i].name.toLowerCase()) {
            if (i === 0) {
              return {pos:'Before', sibling:nodeParent.children[0]};
            } else if (node._id === nodeParent.children[i - 1]._id) {
                return {pos:'Here', sibling:null};
            } else {
              return {pos:'After', sibling:nodeParent.children[i - 1]};
            }
          }
        }
        if (node._id === nodeParent.children[nodeParent.children.length - 1]._id) {
          return {pos:'Here', sibling:null};
        } else {
          return {pos:'After', sibling:nodeParent.children[nodeParent.children.length - 1]};
        }
      };


      scope.feUpdateProgressBar = function(percent) {
        if (!$progressBar.hasClass('progress-bar-animate')) {
          $progressBar.addClass('progress-bar-animate');
        }

        $progressBar.css('transform', 'translate3d(' + (percent - 100) + '%,0,0)');

        if (percent === 100) {
          setTimeout(function() {
            $progressBar.css('transform', 'translate3d(-100%,0,0)');
            $progressBar.removeClass('progress-bar-animate');
          }, 500);
        }
      };


      scope.dismissModal = function() {
        $('.modal').modal('hide');
      };
    }
  };
});