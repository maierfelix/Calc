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
  var exec = require('child_process').exec;
  var mongodb = require('mongodb');
  var server = new mongodb.Server("127.0.0.1", 27017, {});

  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  /** Database module */
  var Database = require('./database.js');
      Database = new Database(mongodb);

  /** Security module */
  var Security = require('./security.js');
      Security = new Security();

  /** Bucket module */
  var Bucket = require('./bucket.js');
      Bucket = new Bucket();

  /** User class */
  var User = require('./user.js');

  /** Initialize database */
  Database.init(server, function() {

    /** User logic */
    io.on('connection', function(socket) {

      console.log('New socket connected: ' + socket.id + '');

      /** Successfully connected back pong */
      socket.emit("connected");

      socket.on('createroom', function(name) {

        /** Validate data */
        if (Security.isSecure(name)) {
          /** Valid type */
          if (typeof name === "string") {
            Database.insert("rooms", {name: name}, function(callback) {
              /** Successful insertion */
              if (callback) {
                socket.emit("message", "Room " + name + " was successfully created!");
              /** Failed insertion */
              } else {
                socket.emit("message", "Room " + name + " already exists!");
              }
            });
          }
        }

      });

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

		/** Everything went fine until here */
		console.log('\x1b[32;1mStarting new server...\x1b[0m');

  });

  /** Listen for Server shutdown */
  process.on('SIGINT', function() {
    io.sockets.emit('annouce', {message : 'Server shutting down!'});
    process.exit();
  });

  /** Console input */
  process.openStdin().addListener('data', function (data) {

    /** Input validation */
    data = data.toString().substring(0, data.length - 2);
    if (!data.length) return void 0;

    /** Exit */
    if (data[0] === '/exit') process.exit();

  });

  /** Handle fatal errors */
  process.on('uncaughtException', function(err) {
    if (err.errno === "EADDRINUSE") console.log("Seems like port " + port + " is already in use, exit!");
    else console.log(err);
    process.exit(1);
  });