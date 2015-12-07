'use strict';

angular.module('stklcApp')
  .controller('AboutCtrl',['$document', '$scope', function ($document, $scope) {

    var me = this;


    angular.extend(me,{
      buttonIsActive: false,
      gitClicked: function(){
        me.buttonIsActive = !me.buttonIsActive;
        $document.find('a').unbind("mouseenter mouseleave");
      }
    });

  }]);
