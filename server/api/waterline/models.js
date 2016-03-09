//Define Waterline Models here

var Waterline = require('waterline');


module.exports = {


  BrowserCollection: Waterline.Collection.extend({
    identity: 'browserCount',
    connection: 'myLocalRedis',
    attributes: {
      browser:{
        type:'string',
        primaryKey: true
      },
      cnt: 'integer'
    }

  }),

  WordFoundCollection: Waterline.Collection.extend({
    identity: 'foundWordCount',
    connection: 'myLocalRedis',
    attributes: {
      date: {
        type: 'string',
        primaryKey: true
      },
      cnt: 'integer'
    }

  }),

  WordNotFoundCollection: Waterline.Collection.extend({
    identity: 'notFoundWordCount',
    connection: 'myLocalRedis',
    attributes: {
      date: {
        type: 'string',
        primaryKey: true
      },
      cnt: 'integer'
    }

  }),

  UserCollection: Waterline.Collection.extend({
    identity: 'userCount',
    connection: 'myLocalRedis',
    attributes: {
      date: {
        type: 'string',
        primaryKey: true
      },
      cnt: 'integer'
    }

  })

};





