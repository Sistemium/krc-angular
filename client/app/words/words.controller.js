'use strict';
angular.module('stklcApp')
  .controller('WordsCtrl', ['$timeout', '$http', function ($timeout, $http) {
    //
    //this.infiniteItems = {
    //  numLoaded_: 0,
    //  toLoad_: 0,
    //
    //  // Required.
    //  getItemAtIndex: function(index) {
    //    console.log('Are you first??, get item at index');
    //    if (index > this.numLoaded_) {
    //      this.fetchMoreItems_(index);
    //      return null;
    //    }
    //    console.log(index, 'index');
    //    console.log(this.numLoaded_, 'numLoaded');
    //
    //    return index;
    //  },
    //
    //  // Required.
    //  // For infinite scroll behavior, we always return a slightly higher
    //  // number than the previously loaded items.
    //  getLength: function() {
    //    console.log('Are you first??, getlength');
    //    return this.numLoaded_ + 5;
    //  },
    //
    //  fetchMoreItems_: function(index) {
    //
    //    console.log('Are you first??, fetchmoreitems');
    //    // For demo purposes, we simulate loading more items with a timed
    //    // promise. In real code, this function would likely contain an
    //    // $http request.
    //    //console.log(index, 'index');
    //    //console.log(this.toLoad_, 'toLoad');
    //
    //    if (this.toLoad_ < index) {
    //      this.toLoad_ += 20;
    //      $timeout(angular.noop, 3000).then(angular.bind(this, function() {
    //        this.numLoaded_ = this.toLoad_;
    //      }));
    //    }
    //  }
    //};

    //$http({
    //  method: 'GET',
    //  url: 'https://api.sistemium.com/v4d/krc/notFoundWord?agg:=1'
    //}).then(function successCallback(response) {
    //  var test = (response.headers());
    //  console.log(test['x-aggregate-count']);
    //
    //}, function errorCallback(response) {
    //  console.log(response);
    //});
    //
    //
    //$http({
    //  method: 'GET',
    //  url: 'https://api.sistemium.com/v4d/krc/notFoundWord?x-page-size:=200'
    //}).then(function successCallback(response) {
    //    var notFound =  response.data;
    //    console.log(notFound);
    //}, function errorCallback(response) {
    //  console.log(response);
    //});


  }]);

