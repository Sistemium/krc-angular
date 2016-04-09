'use strict';

describe('Controller: WordsCtrl', function () {

  // load the controller's module
  beforeEach(module('stklcApp'));

  var WordsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WordsCtrl = $controller('WordsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
