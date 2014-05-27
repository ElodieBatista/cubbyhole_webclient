'use strict';

var module = angular.module('webApp');

module.factory('apiService', function(conf, $resource) {
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
    ItemError: {
      GET: {
        403: 'You are not allowed to access this item.',
        404: 'This item doesn\'t exist.'
      },
      POST: {
        403: 'You don\'t have permissions to create this item.',
        404: 'This item doesn\'t exist.',
        422: 'This item\'s parent doesn\'t exist.'
      },
      PUT: {
        404: 'This item doesn\'t exist.'
      },
      DELETE: {
        403: 'You are not allowed to delete this item.',
        404: 'This item doesn\'t exist.'
      }
    },


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
    ShareError: {
      POST: {
        403: 'You don\'t have permissions to access this item.',
        404: 'This item doesn\'t exist.',
        422: 'One or several of the members you entered are not Cubbyhole users.'
      },
      PUT: {
        404: 'This item doesn\'t exist.'
      },
      DELETE: {
        404: 'This item doesn\'t exist.'
      }
    },


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
    LinkError: {
      POST: {
        403: 'You don\'t have permissions to access this item.',
        404: 'This item doesn\'t exist.'
      },
      PUT: {
        404: 'This item doesn\'t exist.'
      },
      DELETE: {
        404: 'This item doesn\'t exist.'
      }
    },


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
    NotificationError: {
      DELETE: {
        403: 'You\'re not allowed to delete this notification.',
        404: 'This notification doesn\'t exist.'
      }
    },


    Users: $resource(conf.epApi + '/user/', {}, {
      'delete': {
        method: 'DELETE'
      }
    }),
    User: $resource(conf.epApi + '/user/:id', {id:'@id'}, {
      'get': {
        method: 'GET'
      }
    }),
    UserPassword: $resource(conf.epApi + '/user/password/:token', {token:'@token'}, {
      'put': {
        method: 'PUT',
        params: {
          pass:'@pass'
        }
      }
    }),
    UserError: {
      GET: {
        404: 'This user doesn\'t exist.'
      },
      PUT: {
        404: 'This user doesn\'t exist.'
      }
    },


    Plans: $resource(conf.epApi + '/plan', {}, {
      'get': {
        method: 'GET'
      }
    }),
    PlanError: {
      GET: {
        404: 'This plan doesn\'t exist.'
      },
      DELETE: {
        403: 'This plan can\'t be deleted.',
        404: 'This plan doesn\'t exist.'
      }
    }
  };
});