'use strict';

const router = require('express').Router();
const db = require('../db');
const crypto = require('crypto');

//iterate thru the above Objectify and perform a recursive method to call
let _registerRoutes = (routes, method) => {
  for (let key in routes){
    if(typeof routes[key] === 'object' && routes[key] !== null && !(routes[key] instanceof Array)) {
      //after fufilled criteria then go ahead and run
      _registerRoutes(routes[key], key);
    } else {
      //register routes
      if(method === 'get'){
        router.get(key, routes[key]);
      } else if(method === 'post'){
        router.post(key, routes[key]);
      } else {
        router.use(routes[key]);
      }
    }
  }
}

let route = routes => {
  _registerRoutes(routes);
  return router;
}

/*find a single user based on a key*/
let findOne = profileID => {
    return db.userModel.findOne({
     'profileId': profileID
  });
}

/*photo is array always return 0 which would most likely be profile picture, otherwise use blank*/
let createNewUser = profile => {
  return new Promise((resolve, reject) => {
    let newChatUser = new db.userModel({
      profileId: profile.id,
      fullName: profile.displayName,
      profilePic: profile.photos[0].value || ""
    });
    newChatUser.save(error => {
      if(error){
        console.error('error saving profile');
        reject(error);
      } else {
        resolve(newChatUser)
      }
    })
  })
}

let findById = id => {
  return new Promise((resolve, reject) => {
    db.userModel.findById(id, (error, user) => {
      if(error){
        reject(error);
      } else {
        resolve(user);
      }
    })
  })
}
/*req.isAuthenticated is a method provided by passport for session that returns boolean*/
/*This is to guard against trespassers, an in-build middleware*/
let isAuthenticated = (req, res, next) => {
  // console.log(req.isAuthenticated())
  // console.log(req);
  if(req.isAuthenticated()){
    next()
  } else {
    res.redirect('/');
  }
}

/* create a method to search through the entire list of roomNames in allrooms and see it exists */
let findRoomByName = (allrooms, rooms) => {
  let findRoom = allrooms.findIndex((element, index, array) => {
    if(element.room === room) {
      return true;
    } else {
      return false;
    }
    /*if it is greater than 0 it means room exists,
      this is a simple validator because if you use lowercase or trim validtion will still be false*/
    return findRoom > -1 ? true: false;
  })
}

/*generate a random roomID*/
let randomHex = () => {
  return crypto.randomBytes(24).toString('Hex');
}

module.exports = {
  route,
  findOne,
  createNewUser,
  findById,
  isAuthenticated,
  findRoomByName,
  randomHex
}
