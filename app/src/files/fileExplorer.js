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

                if (scope.itemCopied) {
                  scope.canPaste = $tree.tree('getNodeBy', '_id', scope.selectedNode._id).isChildOf(scope.itemCopied);
                }

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


      scope.feIterate = function(node, callback) {
        var child, _i, _len, _ref;
        if (node.children) {
          _ref = node.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            callback(child, child.parent);
            if (child.children.length > 0) {
              scope.feIterate(child, callback);
            }
          }
          return null;
        }
      };


      scope.feAddNodes = function(item, parentId) {
        scope.feAddNode(item, parentId);

        scope.feIterate(item, scope.feAddNode);
      };


      scope.feAddFolder = function(folder, parentId) {
        scope.feAddNode(folder, parentId);
      };


      scope.feRenameItem = function(name, id, parentId) {
        var node = $tree.tree('getNodeBy', '_id', id),
          parent = $tree.tree('getNodeBy', '_id', parentId),
          newPos = scope.getNodeNewPos(node, parent, name);

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


      scope.feShareItems = function(id) {
        var node = $tree.tree('getNodeBy', '_id', id);
        scope.feShareItem(node);
        scope.feIterate(node, scope.feShareItem);
      };


      scope.feShareItem = function(node) {
        $tree.tree(
          'updateNode',
          node,
          {
            isShared: true
          }
        );
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
        scope.canPaste = $tree.tree('getNodeBy', '_id', scope.selectedNode._id).isChildOf(scope.itemCopied);
      };


      scope.feOpenModalNewFolder = function() {
        scope.modalOpts = {
          title: 'Create a folder',
          iconClass: 'fa-folder',
          submitFn: scope.addFolder,
          placeholder: 'Folder name',
          submitFnExtraParam: scope.selectedNode._id,
          submitBtnVal: 'Add'
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
          extraFn: scope.feModalShareItemAddFields,
          extraFn2: scope.feModalShareDeleteField,
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


      scope.feModalShareItemAddFields = function() {
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


      scope.feModalShareDeleteField = function(index, htmlId) {
        var posStart = scope.modalOpts.template.indexOf('<div class="row" id="' + htmlId + index + '">'),
          posEnd = scope.modalOpts.template.indexOf('<span class="hidden">end ' + htmlId + index + '</span>') + 25 + htmlId.toString().length + index.toString().length + 7 + 6,
          templateSubStr = scope.modalOpts.template.substring(posStart, posEnd);
        scope.modalOpts.template = scope.modalOpts.template.replace(templateSubStr, '');

        delete scope.modalform.member[index];
      };


      scope.feOpenModalShareLink = function(item) {
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
          extraFn: scope.feModalShareLinkAddFields,
          extraFn2: scope.feModalShareDeleteField,
          link: item.link,
          template:
            '<div class="modal-body" id="modal-body-share">' +
              '<div class="row">' +
              '<p class="col-md-12">' +
              'You just made this ' + item.type + ' public. People can now access it at: <a href="{{modalOpts.link}}" ng-bind="modalOpts.link"></a>' +
              '</p>' +
              '</div>' +

              '<div class="row">' +
              '<p class="col-md-12">' +
              'Notify your friends to send them the link:' +
              '</p>' +
              '</div>' +

              '<div class="row" id="share-link-member0">' +
              '<div class="col-md-1">' +
              '<button class="btn btn-big" ng-class="submitBtnClass" ng-click="modalOpts.extraFn()">+</button>' +
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


      scope.feModalShareLinkAddFields = function() {
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


      scope.feAskDownloadConfirm = function(item) {
        scope.toggleItem(item, true);

        scope.modalOpts = {
          title: item.name,
          submitBtnVal: 'Download',
          submitFn: scope.feDownloadItem,
          submitFnExtraParam: null,
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
    }
  };
});