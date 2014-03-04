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
        var node = $tree.tree('getNodeBy', '_id', '-1');
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
        scope.modalOpts = {
          title: 'Rename ' + item.name + ' ' + item.type,
          iconClass: 'fa-' + item.type,
          submitFn: scope.renameItem,
          placeholder: item.name,
          submitFnExtraParam: item._id,
          submitBtnVal: 'Rename',
          dismiss: scope.dismissModal
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


      scope.feAddFolder = function(folder) {
        scope.feAddNode(folder);
      };


      scope.feRenameItem = function(name, id) {
        var node = $tree.tree('getNodeBy', '_id', id);

        var newPos = scope.getNodeNewPos(name, scope.selectedNode);

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


      scope.feAddNode = function(item) {
        $tree.tree('openNode', scope.selectedNode);

        var newPos = scope.getNodeNewPos(item.name, scope.selectedNode),
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

      scope.getNodeNewPos = function(nodeName, nodeParent) {
        if (nodeParent.children.length === 0) {
          return {pos:'Here', sibling:nodeParent};
        }

        for (var i = 0; i < nodeParent.children.length; i++) {
          if (nodeName.toLowerCase() <= nodeParent.children[i].name.toLowerCase()) {
            if (i === 0) {
              return {pos:'Before', sibling:nodeParent.children[0]};
            } else {
              return {pos:'After', sibling:nodeParent.children[i - 1]};
            }
          }
        }
        return {pos:'After', sibling:nodeParent.children[nodeParent.children.length - 1]};
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



      scope.feOnDrop = function(itemId, itemContainerId) {
        /*ev.preventDefault();
        var data = ev.dataTransfer.getData("Text");
        ev.target.appendChild(document.getElementById(data));*/
        console.log('fe onDrop ' + itemId + ' in ' + itemContainerId);
      };



      $('.action-bar-item').mouseenter(function() {
        var img = $(this).find(':first-child');
        var src = img.attr('src');
        img.attr('src', function(i, e) {
          return e.replace('.svg', '_white.svg');
        });
      }).mouseleave(function() {
        var img = $(this).find(':first-child');
        var src = img.attr('src');
        img.attr('src', function(i, e) {
          return e.replace(src, src.substr(0, src.indexOf('_white.svg')) + '.svg');
        });
      });
    }
  };
});