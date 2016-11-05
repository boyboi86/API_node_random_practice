'use strict';

const passport = require('passport');
const config = require('../config');
const FbStrategy = require('passport-facebook').Strategy;
const TwStrategy = require('passport-twitter').Strategy;
const helper = require('../helper');
const logger = require('../logger');

module.exports = () => {
  /*You can use serialization or jwt strategy but that will be another module by itself*/
  /*In this case we will use user.id */
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    // find user using the id
    helper.findById(id)
      .then(user => done(null, user))
      .catch(error => logger.log('error','Error when deserialize the user' + error));
  })

  let authProcess = (accessToken, refreshToken, profile, done) => {
    /* find user in local db using profile.id */
    /* If the user is found, return the user data */
    /* If the user is NOT found, create one in db and return the user data */
    helper.findOne(profile.id)
      .then(result => {
        if(result){
          done(null, result);
        } else {
          //create new user
          helper.createNewUser(profile)
            .then(newChatUser => done(null, newChatUser))
            .catch(error => logger.log('error', 'error in creating new user' + error))
        }
      })
  }
/*In order to use Strategy passport know*/
  passport.use(new FbStrategy(config.fb, authProcess))
  passport.use(new TwStrategy(config.twitter, authProcess))
}
