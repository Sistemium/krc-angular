'use strict';

angular.module('stklcApp').controller('KrcCtrl', [
    'WordService', '$scope', '$mdToast', '$mdSidenav', '$window', '$uiViewScroll', '$document', '$filter',
    '$http', '$q',
    'DictionaryModel',
    function (WordService, $scope, $mdToast, $mdSidenav, $window, $uiViewScroll, $document, $filter, $http, $q, DictionaryModel) {

      var toastPosition = {
        bottom: false,
        top: true,
        left: false,
        right: true
      };

      var ua = new UAParser();
      $scope.deviceInfo = ua.getOS()['name'];
      console.log($scope.deviceInfo);

      var me = this;
      var localStorage = window.localStorage;
      var w = angular.element($window);

      var resizeBind = w.bind('resize', function () {
        if (me.isSideNavOpen) {
          me.closeSideNavForHistWord();
        }
      });

      me.dictPlain = DictionaryModel.dictPlain;


      if (DictionaryModel.errorStatus) {
        console.log ('DictionaryModel error:', DictionaryModel.errorStatus);
      }

      $scope.$on('$viewContentLoaded', function () {

        _.each($document.find('md-content'), function (el) {

          var elem = angular.element(el);

          if (elem.hasClass('scrollBind')) {
            me.scrollTopElement = elem;
            var scrollBind = elem.bind('scroll', function (ev) {
              $scope.$apply(me.scrollTop = ev.target.scrollTop);
            });
          }
        });

      });


      $scope.$watch('ctrl.isSideNavOpen', function (nv, ov) {
        $scope.disableScroll(nv && !ov);
      });


      $scope.$on('$destroy', function () {
        w.unbind('resize', resizeBind);
      });



      $scope.$watch('ctrl.wordInput', function (nv, ov) {
        if (nv && nv !== ov) {
          me.kirciuoti();
        }
      });


      angular.extend (me, {

        errors: {
          'md-maxlength': 'Žodžio ilgis per didelis',
          'md-required': 'Žodis neįvestas'
        },

        history: WordService.history,

        kirciuoti: function (word) {
          $document.find('input')[0].blur();
          var w = (word || me.wordInput || me.searchText);
          w = _.capitalize ((w || '').toLowerCase());
          w = w.trim();

          var errors = angular.copy($scope.wordInputForm.word.$error);

          if(errors.maxlength){
            me.clearInput();
            return me.showSimpleToast(me.errors['md-maxlength']);
          }


          if (!w) {

            if (!Object.keys(errors).length) {
              errors['md-required'] = true;
            }

            var msg = _.map(errors, function (val, key) {
              return me.errors[key];
            }).join(',');

            return me.showSimpleToast(msg);
          }

          WordService.getWordData(w).success(function (data) {
            me.data = data;
          }).error(function (data, res) {
            console.log(res);
            if (res == 404) {
              me.data = [];
              me.showSimpleToast('Žodis nerastas');
            }
            else if (res == 400) {
              me.data = [];
              me.showSimpleToast('Pasitikrintike įvestą žodį');
            }
            else if (res == 500) {
              me.data = [];
              me.showSimpleToast('Serverio klaida');
            }
          });

        },

        showSimpleToast: function (phrase) {
          $mdToast.show(
            $mdToast.simple()
              .content(phrase)
              .position(me.getToastPosition())
              .hideDelay(1700)
              .theme("")
          );
        },

        getToastPosition: function () {
          return Object.keys(toastPosition)
            .filter(function (pos) {
              return toastPosition[pos];
            })
            .join(' ');
        },

        toggleLeft: function () {
          $document.find('input')[0].blur();
          setTimeout(function(){
            $mdSidenav('left-nav').toggle()
          }, 350);
        },

        closeSideNav: function () {
          $mdSidenav('left-nav').close();
        },

        closeSideNavForHistWord: function () {
          $mdSidenav('left-nav').close();
        },

        deleteHistory: WordService.clearHistory,

        clearInput: function () {
          me.callCountWordChars('');
          setTimeout(function(){
            $document.find('input')[0].focus();
          }, 1);
        },

        callCountWordChars: function (word) {
          me.searchText = word;
          setTimeout(function () {
            _.each($scope.wordInputForm.word.$viewChangeListeners, _.attempt);
          }, 100);
        },

        historyClicked: function (word) {
          me.searchText = word;
          me.callCountWordChars(word);
          me.kirciuoti(word);
          me.closeSideNavForHistWord();
          $uiViewScroll($document.find('body'));
        },

        scrollTopClick: function () {
          me.scrollTopElement[0].scrollTop = 0;
        },


        unShortState: function (smth) {
          return _.get(me.dictPlain, smth);
        },

        getSuggestions: function (text) {

          if (!text) {
            me.suggestions = [];
            return [];
          }

          var q = $q.defer();

          $http.get('api/zodynas/'+text).success(function(res){
            q.resolve(res);
          });

          return q.promise;

        }

      });

      $scope.setSubNavs([{
        name: 'history', title: 'Istorija', clickFn: me.toggleLeft, class: 'hide-gt-sm'
      }]);

      $scope.setLeftPart({
        title: 'Istorija', class: 'hide-md hide-sm'
      });

    }
  ])

  .directive('resize', function ($window) {
    return function (scope, element) {
      var w = $window;
      scope.getWindowDimensions = function () {
        return {
          'h': w.innerHeight,
          'w': w.innerWidth
        };
      };
      scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
        scope.windowHeight = newValue.h;
        scope.windowWidth = newValue.w;
      }, true);

      angular.element($window).bind('resize', function () {
        scope.$apply();
      });
    }
  });



