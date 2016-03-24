'use strict';

(function () {

    angular.module('stklcApp').service('Device', function () {

      var deviceUUID = localStorage.getItem('deviceUUID');

      if (!deviceUUID) {
        deviceUUID = uuid.v4();
        localStorage.setItem('deviceUUID', deviceUUID);
      }

      return {

        uuid: function () {
          return deviceUUID;
        }

      };


    });

})();
