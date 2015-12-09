'use strict';

angular.module('stklcApp')
  .controller('AboutCtrl', function () {

    var me = this;

    angular.extend(me,{

      login_reverse: '@bau',
      name_reverse: '.muimetsis',
      domain_reverse: 'moc',

      sendEmail:  function() {

        var link = "mailto:"+ me.reverse(me.domain_reverse + me.name_reverse + me.login_reverse )
        + "?subject= " + encodeURI('Dėl kirtis.info programos');

        window.location.href = link;

      },

      reverse: function(s) {

        for (var i = s.length - 1, o = ''; i >= 0; o += s[i--]) { }
        return o;

      },

    });

  });
