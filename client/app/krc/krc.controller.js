'use strict';

angular.module('stklcApp').controller('KrcCtrl', [
    '$http', '$scope', '$mdToast', '$mdSidenav', '$window', '$uiViewScroll', '$document',
    function ($http, $scope, $mdToast, $mdSidenav, $window, $uiViewScroll, $document) {

      var toastPosition = {
        bottom: false,
        top: true,
        left: false,
        right: true
      };

      var me = this;
      var localStorage = window.localStorage;
      var w = angular.element($window);


      var resizeBind = w.bind('resize', function () {
        if (me.isSideNavOpen) {
          me.closeSideNavForHistWord();
        }
      });


      // getting strp vocabulary, geting plain voc.

      $http.get('/api/strp/').success(function (data) {
        me.strp = data;
        me.formPlainDict();
      }).error(function (data, res) {
        console.log(res, 'Not found path');
      });


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

      $scope.$watchCollection('ctrl.history', function (newHistory) {
        newHistory && newHistory.length && localStorage.setItem('history', JSON.stringify(newHistory));
      });

      $scope.$watch('ctrl.isSideNavOpen', function (nv, ov) {
        $scope.disableScroll(nv && !ov);
      });

      $scope.$on('$destroy', function () {
        w.unbind('resize', resizeBind);
      });

      $scope.$watch("orientationchange", function () {
        console.log("The orientation of the screen is: " + screen.orientation.type);
      });


      angular.extend (me, {

        errors: {
          'md-maxlength': 'Žodžio ilgis per didelis',
          'md-required': 'Žodis neįvestas'
        },

        history: JSON.parse(localStorage.getItem('history')) || [],

        kirciuoti: function (word) {
          $document.find('input')[0].blur();
          var w = (word || me.wordInput);
          w = _.capitalize ((w || '').toLowerCase());
          w = w.trim();
          var errors = angular.copy($scope.wordInputForm.word.$error);
          if (!w) {

            if (!Object.keys(errors).length) {
              errors['md-required'] = true;
            }

            var msg = _.map(errors, function (val, key) {
              return me.errors[key];
            }).join(',');

            return me.showSimpleToast(msg);
          }

          $http.get('/api/krc/' + w).success(function (data) {
            me.writeSearchedWords(w);
            me.data = data;
          }).error(function (data, res) {
            if (res == 404) {
              me.data = [];
              me.showSimpleToast('Žodis nerastas');
            }
            else if (res == 400) {
              me.showSimpleToast('Pasitikrintike įvestą žodį');
            }
            else if (res == 500) {
              me.showSimpleToast('Serverio klaida');
            }
          });

        },

        writeSearchedWords: function (searchedWord) {
          me.duplicationRemover(searchedWord);
          me.history.unshift(searchedWord);
          me.history = _.take(me.history, 20);
        },

        duplicationRemover: function (wordToCheck) {
          me.history.forEach(function (item, idx) {
            if (wordToCheck == item) {
              me.history.splice(idx, 1);
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

        deleteHistory: function () {
          localStorage.removeItem('history');
          me.history = [];
        },

        clearInput: function () {
          me.setWord('');
          setTimeout(function(){
            $document.find('input')[0].focus();
          }, 1000);
        },

        setWord: function (word) {
          me.wordInput = word;
          setTimeout(function () {
            _.each($scope.wordInputForm.word.$viewChangeListeners, _.attempt);
          }, 100);
        },

        historyClicked: function (word) {
          me.setWord(word);
          me.kirciuoti(word);
          me.closeSideNavForHistWord();
          $uiViewScroll($document.find('body'));
        },

        scrollTopClick: function () {
          me.scrollTopElement[0].scrollTop = 0;
        }

      });

      $scope.setSubNavs([{
        name: 'history', title: 'Istorija', clickFn: me.toggleLeft, class: 'hide-gt-md'
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
  })



