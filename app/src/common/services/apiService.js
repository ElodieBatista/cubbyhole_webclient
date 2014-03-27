'use strict';

var module = angular.module('webApp');

module.factory('apiService', function(conf, $resource, $rootScope) {
  return {
    Items: $resource(conf.epApi + '/item', {}, {
      'get': {
        method: 'GET'
      },
      'post': {
        method:'POST',
        params: {
          type:'@type',
          name:'@name',
          parent:'@parent'
        }
      }
    }),

    Item: $resource(conf.epApi + '/item/:id', {id:'@id'}, {
      'get': {
        method:'GET'
      },
      'post': {
        method:'POST',
        params: {
          parent:'@parent'
        }
      },
      'put': {
        method:'PUT',
        params: {
          name:'@name',
          parent:'@parent'
        }
      },
      'delete': {
        method:'DELETE'
      }
    }),


    Shares: $resource(conf.epApi + '/share', {}, {
      'get': {
        method:'GET'
      }
    }),

    Share: $resource(conf.epApi + '/share/:id', {id:'@id'}, {
      'post': {
        method:'POST',
        params: {
          with:'@with'
        }
      },
      'put': {
        method:'PUT',
        params: {
          member:'@member',
          permissions:'@permissions'
        }
      },
      'delete': { // Stop sharing if owner/ Leave shared folder if member
        method:'DELETE'
      }
    }),

    ShareRevoke: $resource(conf.epApi + '/share/:id/:member', {id:'@id', member:'@member'}, {
      'delete': { // If member, revoke permission
        method:'DELETE'
      }
    }),


    Links: $resource(conf.epApi + '/link', {}, {
      'get': {
        method: 'GET'
      }
    }),

    Link: $resource(conf.epApi + '/link/:id', {id:'@id'}, {
      'post': {
        method:'POST'
      },
      'put': {
        method:'PUT',
        params: {
          with:'@with'
        }
      },
      'delete': {
        method:'DELETE'
      }
    }),


    Notifications: $resource(conf.epApi + '/notification', {}, {
      'get': {
        method: 'GET'
      }
    }),

    Notification: $resource(conf.epApi + '/notification/:id', {}, {
      'delete': {
        method: 'DELETE'
      }
    }),


    User: $resource(conf.epApi + '/user/:id', {id:'@id'}, {
      'get': {
        method: 'GET'
      }
    }),


    Plans: $resource(conf.epApi + '/plan', {}, {
      'get': {
        method: 'GET'
      }
    })
  };
});