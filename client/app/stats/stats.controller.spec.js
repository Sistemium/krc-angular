'use strict';

describe('Controller: StatsCtrl', function () {

  // load the controller's module
  beforeEach(module('stklcApp'));

  var StatsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StatsCtrl = $controller('StatsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
