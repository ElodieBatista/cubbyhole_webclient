'use strict';

var module = angular.module('webApp');

/**
 * Get size from bytes
 */
module.filter('size', function() {
  return function(bytes) {
  	if      (bytes>=1000000000) {bytes=(bytes/1000000000).toFixed(2)+' GB';}
  	else if (bytes>=1000000)    {bytes=(bytes/1000000).toFixed(2)+' MB';}
  	else if (bytes>=1000)       {bytes=(bytes/1000).toFixed(2)+' KB';}
  	else if (bytes>1)           {bytes=bytes+' bytes';}
  	else if (bytes==1)          {bytes=bytes+' byte';}
  	else                        {bytes='0 byte';}
  	return bytes;
  };
});