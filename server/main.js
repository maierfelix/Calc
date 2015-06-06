/**
 * This file is part of the NovaeCalc project.
 *
 * It is permitted to use, redistribute and/or modify this software
 * under the terms of the MIT License
 *
 * @author Felix Maier <maier.felix96@gmail.com>
 * @copyright (c) 2015 Felix Maier, @felixmaier
 *
 * You may not change or remove these lines
 *
 */

"use strict";

  var config = require('./config.js');
  var port = config.port;

  var moment = require('moment');

  var crypto = require('crypto');

  var exec = require('child_process').exec;

  var io = require('socket.io')(port);
      io.set('log level', 1);

  var exec = require('child_process').exec;

  var Security = require('./security.js');
      Security = new Security();

  var Bucket = require('./bucket.js');
      Bucket = new Bucket();

  var User = require('./user.js');

  var testUser = new User("Felix", 3);

  var testUser2 = new User("Frank", 2);

  Bucket.addUser(testUser);
  Bucket.addUser(testUser2);

  if (Bucket.userExists(testUser.username)) {
    Bucket.removeUser(testUser.username);
  }

  console.log(Bucket);

  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  /** Listen for Server shutdown */
  process.on('SIGINT', function() {
    io.sockets.emit('annouce', {message : 'Server shutting down!'});
    process.exit();
  });

  /** User logic */
  io.on('connection', function(socket) {

    console.log('New socket connected: ' + socket.id + '');

    socket.on('login', function(username) {
      //userLogin(username);
    });

    socket.on('logoff', function(username) {
      //userLogout(username);
    });

    socket.on('data', function(data) {

      /** Valid data? */
      if (Security.isSecure(data)) {
        userData(socket, data);
      }

    });

    socket.on('disconnect', function(reason) {
     //userDisconnect(socket, reason);
    });

  });

  /** Console input */
  process.openStdin().addListener('data', function (data) {

    /** Input validation */
    data = data.toString().substring(0, data.length - 2);
    if (!data.length) return void 0;

    /** Exit */
    if (data[0] === '/exit') process.exit();

  });