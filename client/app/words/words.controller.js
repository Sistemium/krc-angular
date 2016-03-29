'use strict';
angular.module('stklcApp')
  .controller('WordsCtrl', ['$timeout', '$http', function ($timeout, $http) {
    // In this example, we set up our model using a plain object.
    // Using a class works too. All that matters is that we implement
    // getItemAtIndex and getLength.

    // In this example, we set up our model using a class.
    // Using a plain object works too. All that matters
    // is that we implement getItemAtIndex and getLength.
    var NotFoundWords = function () {
      /**
       * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
       */
      this.loadedPages = {};

      /** @type {number} Total number of items. */
      this.numItems = 0;

      /** @const {number} Number of items to fetch per request. */
      this.PAGE_SIZE = 10;

      this.fetchNumItems_();
    };

    // Required.
    NotFoundWords.prototype.getItemAtIndex = function (index) {
      var pageNumber = Math.floor(index / this.PAGE_SIZE);
      var page = this.loadedPages[pageNumber];

      if (page) {
        return page[index % this.PAGE_SIZE];
      } else if (page !== null) {
        this.fetchPage_(pageNumber);
      }
    };

    // Required.
    NotFoundWords.prototype.getLength = function () {
      return this.numItems;
    };

    NotFoundWords.prototype.fetchPage_ = function (pageNumber) {
      // Set the page to null so we know it is already being fetched.
      this.loadedPages[pageNumber] = null;

      // For demo purposes, we simulate loading more items with a timed
      // promise. In real code, this function would likely contain an
      // $http request.

      $http.get('https://api.sistemium.com/v4d/krc/notFoundWord?x-start-page:=' + (pageNumber + 1)).then(angular.bind(this, function (obj) {
        this.loadedPages[pageNumber] = [];

        for (var i in obj.data) {
          this.loadedPages[pageNumber].push(obj.data[i].word);
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
       */
      this.loadedPages = {};

      /** @type {number} Total number of items. */
      this.numItems = 0;

      /** @const {number} Number of items to fetch per request. */
      this.PAGE_SIZE = 10;

      this.fetchNumItems_();
    };

    // Required.
    FoundWords.prototype.getItemAtIndex = function (index) {

      var pageNumber = Math.floor(index / this.PAGE_SIZE);
      var page = this.loadedPages[pageNumber];

      if (page) {
        return page[index % this.PAGE_SIZE];
      } else if (page !== null) {
        this.fetchPage_(pageNumber);
      }
    };

    // Required.
    FoundWords.prototype.getLength = function () {
      return this.numItems;
    };

    FoundWords.prototype.fetchPage_ = function (pageNumber) {
      // Set the page to null so we know it is already being fetched.
      this.loadedPages[pageNumber] = null;

      $http.get('https://api.sistemium.com/v4d/krc/foundWord?x-start-page:=' + (pageNumber + 1)).then(angular.bind(this, function (obj) {
        this.loadedPages[pageNumber] = [];
        for (var i in obj.data) {
          this.loadedPages[pageNumber].push(obj.data[i].word);
        }
      }));
    };

    // Getting total number of elements to show in viewport

    FoundWords.prototype.fetchNumItems_ = function () {
      if (this.numItems == 0) {
        $http.get('https://api.sistemium.com/v4d/krc/foundWord?agg:=1').then(angular.bind(this, function (obj) {
          this.numItems = obj.headers('X-Aggregate-Count');
        }));
      }

    };

    this.foundWords = new FoundWords();


  }
  ]);


