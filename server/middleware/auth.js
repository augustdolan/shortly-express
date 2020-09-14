const models = require('../models');
const Promise = require('bluebird');
const db = require('../db');
// input: req, res, next

// key pieces: create hash, accesses hashed cookies, if userId, attach to req.session relevant user info. If cookie is invalid, create new session, send new cookie with id

let makeNewSession = (req, res, next) => {
  return new Promise((resolve, reject) => {
    models.Sessions.create()
      .then((results) => {
        console.log('PLEASE ONLY HAPPEN ONCE ... OR THREE TIMES IF IT HELPS RESOLVE');
        // query the database for the last created id
        let queryString = 'SELECT * FROM sessions ORDER BY id DESC LIMIT 1';
        let queryArgs = [];
        db.query(queryString, queryArgs, (err, sessions) => {
          req.session = sessions[0];
          resolve(req.session);
        });
      })
      .catch((err) => {
        if (err) {
          throw err;
          reject();
        }
      });
  });
};

// output: an newly created session
module.exports.createSession = (req, res, next) => {
  next();
  if (!req.cookies.shortlySession) {
    makeNewSession(req, res)
      .then((session) => {
        res.cookie('shortlySession', session.hash);
      });
  } else {
    models.Sessions.get({hash: req.cookies.shortlySession})
      .then((session) => {
        if (!session) {
          makeNewSession(req, res);
          res.cookie('I am a cookie');
        }
      // session is a complete session object ???? what do now???
      });
  }
};


// Lets name our cookie key name: shortlySession

// 1. relevant cookies for our request
// examine req.cookies[shortlySession]

// 1. is there a relevant req.cookies[shortlySession] value?
// 2. if it is undefined
// either cookie hash is returned or we find how to call last record in sql table
// a. assigned variable to the creation of new session
// b. res.cookie(shortlySession, variable from a)

// 3.if there is a shortlySession
// a. query our database via get call, object is {hash: the       shortlySession hash}
// b. in the event that there is not a match,
// i. generate a new hash, give it to them, and add to our database

// 4. req.session = session


// call a .then at end of create to see what the resultant arg is
/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
