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

  /** Room class */
  var Room = require('./room.js');

  /** Initialize database */
  Database.init(server, function() {

    /** User logic */
    io.on('connection', function(socket) {

      //console.log('New socket connected: ' + socket.id + '');

      /** Register user into the bucket */
      if (!Bucket.userExists(socket.id)) Bucket.addUser(new User(socket.id, 1));

      /** Successfully connected back pong */
      socket.emit("connected");

      /** Create Room */
      socket.on('createroom', function(name) {

        var token = crypto.randomBytes(32).toString('hex');

        /** Validate data */
        if (Security.isSecure(name)) {
          /** Valid type */
          if (typeof name === "string") {
            Database.insertCollection("rooms", {name: name, token: token, owner: socket.id}, function(callback) {
              /** Successful insertion */
              if (callback) {
                /** Give room creator admin rights */
                if (Bucket.userExists(socket.id)) {
                  /** Create room in bucket */
                  if (!Bucket.roomExists(name)) {
                    /** Create room -> Room name, socket name, security token, callback = mongo id */
                    var room = new Room(name, socket.id, token, callback);
                    /** Add owner to the room */
                    room.addUser(socket.id);
                    /** Create room in bucket */
                    Bucket.addRoom(room);
                  }
                  /** Set user to admin */
                  Bucket.updateUser(socket.id, "level", 3);
                }
                socket.emit("message", {type: "room", value: "Room " + name + " was successfully created!", values: name, state: 1});
              /** Failed insertion */
              } else {
                socket.emit("message", {type: "room", value: "Room " + name + " already exists!", values: name, state: 0});
                if (Bucket.userExists(socket.id)) { console.log(name, Bucket.rooms);
                  if (Bucket.roomExists(name)) {
                    console.log(Bucket.rooms);
                  }
                }
              }
            });
          }
        }

      });

      /** Get Room */
      socket.on('getroom', function(data) {

        if (data) {
          if (Security.isSecure(data.room)) {
            if (typeof data.room === "string") {
              /** Get room data */
              Database.getCollection("rooms", {name: data.room}, function(callback) {
                /** Got a result */
                if (callback.data) {
                  socket.emit("message", {type: "roomdata", data: callback.data, state: 1});
                }
              });
            }
          }
        }

      });

       /** Update a Cell */
      socket.on('updatecell', function(data) {
        if (Bucket.userIsAdmin(socket.id)) {
          /** Validate cell object */
          if (Security.isSecure(data.cell) && Security.isSecure(data.value)) {
            /** Update room cell data */
            Database.updateCell("rooms", {cells: data}, Bucket.getCurrentUserRoom(socket.id).id, function(callback) {
              /** Got a result */
              if (callback) {
                console.log(callback);
              }
            });
          }
        }
      });

      /** Socket disconnected */
      socket.on('disconnect', function(reason) {
        /** Remove user from the bucket */
        if (Bucket.userExists(socket.id)) {
          Bucket.removeUser(socket.id);
        }
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
    if (data === '/exit') process.exit();

    /** Print Bucket */
    if (data === '/bucket') console.log(Bucket);
    if (data === '/bucketroomusers') console.log(Bucket.rooms);

  });

  /** Handle fatal errors */
  process.on('uncaughtException', function(err) {
    if (err.errno === "EADDRINUSE") console.log("Seems like port " + port + " is already in use, exit!");
    else console.log(err);
    process.exit(1);
  });