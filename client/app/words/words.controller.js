'use strict';
angular.module('stklcApp')
  .controller('WordsCtrl', ['$scope', '$http', function ($scope, $http) {


    var me = this;

    angular.extend (me, {

      getWords: function () {
        me.foundWords.loadedPages = [];
        me.notFoundWords.loadedPages = [];
      }

    });

    $scope.setSubNavs([
      {name: 'krc', title: 'Refresh', clickFn: me.getWords}
    ]);


    var NotFoundWords = function () {
      /**
       * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
       * loading at the most 6 elems. All other elems are empty; 60 words * 40px = 2400px;
       */
      this.loadedPages = [];

      /** @type {number} Total number of items. */
      this.numItems = 0;

      /** @const {number} Number of items to fetch per request. */
      this.PAGE_SIZE = 10;

      /** Loaded pages status**/
      this.loadArr = [];
      this.keepItemsConst = 5;

      this.fetchNumItems_();

    };


    // Required.
    NotFoundWords.prototype.getItemAtIndex = function (index) {

      var pageNumber = Math.floor(index / this.PAGE_SIZE);
      var page = this.loadedPages[pageNumber];


      if ((page) && (this.loadArr[pageNumber] == 'loaded')) {

        return page[index % this.PAGE_SIZE];


      } else if (this.loadArr[pageNumber] == 'deleted') {

        this.fetchPage_(pageNumber);
        this.loadArr[pageNumber] = 'loaded';

      } else if (page !== null) {

        this.fetchPage_(pageNumber);

      }

    };

    // Required.
    NotFoundWords.prototype.getLength = function () {
      // Getting total number of elements to show in viewport
      return this.numItems;
    };


    NotFoundWords.prototype.fetchPage_ = function (pageNumber) {

      // Set the page to null so we know it is already being fetched.
      this.loadedPages[pageNumber] = null;

      $http.get('https://api.sistemium.com/v4d/krc/notFoundWord?x-start-page:=' + (pageNumber + 1)).then(angular.bind(this, function (obj) {
        this.loadedPages[pageNumber] = [];

        for (var i in obj.data) {
          var tempObj = {};
          if (obj.data[i].word.length > 26) {
            tempObj.word = ('NO OUTPUT');
            tempObj.ts = obj.data[i].ts.slice(0, -4);
            this.loadedPages[pageNumber].push(tempObj);
          }
          else {
            tempObj.word = obj.data[i].word;
            tempObj.ts = obj.data[i].ts.slice(0, -4);
            this.loadedPages[pageNumber].push(tempObj);
          }
        }

        console.log(this.loadedPages);

        this.loadArr[pageNumber] = 'loaded';

        // Counting how many pages are loaded
        if (this.loadArr) {
          var cnt = 0;
          this.loadArr.forEach(function (i) {
            if (i === 'loaded') {
              cnt++;
            }
          });
        }


        // If loaded pages count > 5, then delete arr elems by if statement;

        if (cnt > 5) {

          if ((this.loadArr[pageNumber] == 'loaded') && (this.loadArr[pageNumber - 1] == 'loaded')) {

            _.fill(this.loadArr, 'deleted', 0, ((pageNumber + 1) - this.keepItemsConst));
            _.fill(this.loadedPages, [], 0, ((pageNumber + 1) - this.keepItemsConst));

          }

          else if ((this.loadArr[pageNumber] == 'loaded') && (this.loadArr[pageNumber - 1] == 'deleted')) {

            _.fill(this.loadArr, 'deleted', (pageNumber + this.keepItemsConst), this.loadArr.length);
            _.fill(this.loadedPages, [], (pageNumber + this.keepItemsConst), this.loadedPages.length);

          }
        }

      }));

    };

    NotFoundWords.prototype.fetchNumItems_ = function () {

      if (this.numItems == 0) {

        $http.get('https://api.sistemium.com/v4d/krc/notFoundWord?agg:=1').then(angular.bind(this, function (obj) {
          this.numItems = obj.headers('X-Aggregate-Count');
        }));

      }
    };

    this.notFoundWords = new NotFoundWords();

    var FoundWords = function () {
      /**
       * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
       * loading at the most 6 elems. All other elems are empty; 60 words * 40px = 2400px;
       */
      this.loadedPages = [];

      /** @type {number} Total number of items. */
      this.numItems = 0;

      /** @const {number} Number of items to fetch per request. */
      this.PAGE_SIZE = 10;

      /** Loaded pages status**/
      this.loadArr = [];
      this.keepItemsConst = 5;

      this.fetchNumItems_();

    };


    // Required.
    FoundWords.prototype.getItemAtIndex = function (index) {

      var pageNumber = Math.floor(index / this.PAGE_SIZE);
      var page = this.loadedPages[pageNumber];


      if ((page) && (this.loadArr[pageNumber] == 'loaded')) {

        return page[index % this.PAGE_SIZE];


      } else if (this.loadArr[pageNumber] == 'deleted') {

        this.fetchPage_(pageNumber);
        this.loadArr[pageNumber] = 'loaded';

      } else if (page !== null) {

        this.fetchPage_(pageNumber);

      }

    };

    // Required.
    FoundWords.prototype.getLength = function () {
      // Getting total number of elements to show in viewport
      return this.numItems;
    };


    FoundWords.prototype.fetchPage_ = function (pageNumber) {

      // Set the page to null so we know it is already being fetched.
      this.loadedPages[pageNumber] = null;

      $http.get('https://api.sistemium.com/v4d/krc/foundWord?x-start-page:=' + (pageNumber + 1)).then(angular.bind(this, function (obj) {
        this.loadedPages[pageNumber] = [];

        for (var i in obj.data) {
          var tempObj = {};
          if (obj.data[i].word.length > 26) {
            tempObj.word = ('NO OUTPUT');
            tempObj.ts = obj.data[i].ts.slice(0, -4);
            this.loadedPages[pageNumber].push(tempObj);
          }
          else {
            tempObj.word = obj.data[i].word;
            tempObj.ts = obj.data[i].ts.slice(0, -4);
            this.loadedPages[pageNumber].push(tempObj);
          }
        }

        console.log(this.loadedPages.length, 'loadedPages');
        console.log(this.loadedPages, 'loadedPages');

        this.loadArr[pageNumber] = 'loaded';

        // Counting how many pages are loaded
        if (this.loadArr) {
          var cnt = 0;
          this.loadArr.forEach(function (i) {
            if (i === 'loaded') {
              cnt++;
            }
          });
        }


        // If loaded pages count > 5, then delete arr elems by if statement;

        if (cnt > 5) {

          if ((this.loadArr[pageNumber] == 'loaded') && (this.loadArr[pageNumber - 1] == 'loaded')) {

            _.fill(this.loadArr, 'deleted', 0, ((pageNumber + 1) - this.keepItemsConst));
            _.fill(this.loadedPages, [], 0, ((pageNumber + 1) - this.keepItemsConst));

          }

          else if ((this.loadArr[pageNumber] == 'loaded') && (this.loadArr[pageNumber - 1] == 'deleted')) {

            _.fill(this.loadArr, 'deleted', (pageNumber + this.keepItemsConst), this.loadArr.length);
            _.fill(this.loadedPages, [], (pageNumber + this.keepItemsConst), this.loadedPages.length);

          }
        }

      }));

    };

    FoundWords.prototype.fetchNumItems_ = function () {

      if (this.numItems == 0) {

        $http.get('https://api.sistemium.com/v4d/krc/foundWord?agg:=1').then(angular.bind(this, function (obj) {
          this.numItems = obj.headers('X-Aggregate-Count');
        }));

      }
    };

    this.foundWords = new FoundWords();

  }]);



