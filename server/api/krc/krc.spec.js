'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var test404 = ['Mazas', 'Moi', 'Metelica', 'Metallic', 'Mosin'];
var test200 = [
  {word: 'Mama', len: 3},
  {word: 'Mažas', len: 4},
  {word: 'Mėta', len: 3},
  {word: 'Medus', len: 3}
];


test404.forEach(function (item) {

  describe('Test for some wrong words from \'test404\' array \n GET /api/krc/' + item, function () {
    it('Should return status 404', function (done) {
      request(app)
        .get('/api/krc/' + encodeURIComponent(item))
        .expect(404, done)
    });
  });

});

test200.forEach(function (item) {

  describe('Test for some proper words from \'test200\' array \n GET /api/krc/' + item.word, function () {
    it('Should return status 200', function (done) {
      request(app)
        .get('/api/krc/' + encodeURIComponent(item.word))
        .expect(200)
        .end(function (err, res) {
          if (err)
            return done(err);
          res.body.should.be.instanceof(Array);
          if (res.body.length == item.len)
            console.log('Object length is OK');
          else
            console.log('Object length should be ' + item.len + ' instead of ' + res.body.length);
          done();
        });
    });
  });

});


describe('Test for no words from GET /api/krc', function () {
  it('Should return status 400', function (done) {
    request(app)
      .get('/api/krc/')
      .expect(400, done)
  });
});

