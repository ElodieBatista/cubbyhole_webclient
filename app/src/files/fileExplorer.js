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
      var $tree,
          $progressBar = $('#file-explorer-progress-bar');


      scope.toggleItem = function(item, forceSelect) {
        if (scope.itemActive === item && !forceSelect) {
          scope.itemActive = null;
        } else {
          scope.itemActive = item;
        }
      };


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
        var node = $tree.tree('getNodeBy', '_id', scope.items[0]._id);
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
        $('#file-explorer-form-download').submit();
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
          submitFn: scope.addFolder,
          submitFnExtraParam: scope.selectedNode._id,
          submitBtnVal: 'Add',
          templateUrl: 'src/files/tpls/newFolder.tpl.html'
        };
        $('#appmodal').modal('show');
      };


      scope.feOpenModalRenameItem = function(item) {
        scope.modalform = {
          name: item.name
        };

        scope.modalOpts = {
          title: 'Rename ' + item.name + ' ' + item.type,
          iconClass: 'fa-' + item.type,
          submitFn: scope.renameItem,
          submitFnExtraParam: item,
          submitBtnVal: 'Rename',
          templateUrl: 'src/files/tpls/renameItem.tpl.html'
        };
        $('#appmodal').modal('show');
      };


      scope.feOpenModalDeleteItem = function(item) {
        scope.modalOpts = {
          title: 'Delete ' + item.name + ' ' + item.type,
          submitFn: scope.deleteItem,
          submitFnExtraParam: item._id,
          submitBtnVal: 'Delete',
          obj: item,
          templateUrl: 'src/files/tpls/deleteItem.tpl.html'
        };
        $('#appmodal').modal('show');
      };


      scope.feOpenModalNewFiles = function() {
        scope.modalOpts = {
          title: 'Upload files',
          submitBtnVal: 'Add',
          submitFn: scope.onFileSelect,
          templateUrl: 'src/files/tpls/addFiles.tpl.html'
        };
        $('#appmodal').modal('show');
      };


      scope.feOpenModalShareItem = function(item) {
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
          templateUrl: 'src/files/tpls/shareItem.tpl.html'
        };
        $('#appmodal').modal('show');
      };


      scope.feOpenModalShareLink = function(item) {
        var node = $tree.tree('getNodeBy', '_id', item._id);
        $tree.tree(
          'updateNode',
          node,
          {
            lastModified: item.lastModified
          }
        );

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
          templateUrl: 'src/files/tpls/shareLink.tpl.html'
        };
        $('#appmodal').modal('show');
      };


      scope.feOpenModalDownloadItem = function(item) {
        scope.toggleItem(item, true);

        scope.modalOpts = {
          title: item.name,
          submitBtnVal: 'Download',
          submitFn: scope.feDownloadItem,
          obj: item,
          templateUrl: 'src/files/tpls/downloadItem.tpl.html'
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