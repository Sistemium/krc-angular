'use strict';

angular.module('stklcApp')
  .controller('MainCtrl', function () {

    var me = this;

    angular.extend(me,{
      navs: [
        { name: 'krc', title: 'Kirčiavimas'},
        { name: 'about', title: 'Apie projektą'}
      ],

      
    });

  });
