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

      console.log('New socket connected: ' + socket.id + '');

      /** Register user into the bucket */
      if (!Bucket.userExists(socket.id)) Bucket.addUser(new User(socket.id, 1));

      /** Successfully connected back pong */
      socket.emit("connected");

      /** Create Room */
      socket.on('createroom', function(name, resolve) {

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
                /** New room created */
                resolve(token);
              /** Failed insertion */
              } else {
                socket.emit("message", {type: "room", value: "Room " + name + " already exists!", values: name, state: 0});
                if (Bucket.userExists(socket.id)) {
                  if (Bucket.roomExists(name)) {
                    /** TODO: What to do if password is wrong? */
                  }
                }
                /** Room already exists */
                resolve(0);
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
                  /** Dont pass over private data */
                  delete callback.data._id;
                  delete callback.data.token;
                  socket.emit("message", {type: "roomdata", data: callback.data, state: 1});
                }
              });
            }
          }
        }

      });

       /** Update a Cell */
      socket.on('updatecell', function(data) {

        var userRoom = Bucket.getCurrentUserRoom(socket.id);
        /** Only users with admin rights can change cells */
        if (Bucket.userIsAdmin(socket.id)) {
          /** Validate cell object */
          if (Security.isSecure(data.cell) && data.value.length && Security.isSecure(data.letter) && data.letter.length && (typeof data.value === "string")) {
            /** User is in a room */
            if (userRoom && userRoom.id) {
              /** Dictionary lookup style */
              if (!userRoom.cells[data.letter]) {
                userRoom.cells[data.letter] = {};
              }
              /** Update cell */
              if (userRoom.cells[data.letter]) {
                userRoom.cells[data.letter][data.cell] = data.value;
              }
              /** Send cell update to all clients in the same room */
              for (var ii = 0; ii < userRoom.users.length; ++ii) {
                /** Dont send message to this myself */
                if (userRoom.users[ii] !== socket.id) {
                  /** Update cells of all client in the same room */
                  io.to(userRoom.users[ii]).emit("message", {type: "global", action: "cellchange", data: {letter: data.letter, cell: data.cell, value: data.value}});
                }
              }
            /** User isn't in a room */
            } else {
              console.log("!!!!!!!!!!!!!!!!!!!!!!!!!");
              console.log(Bucket.users, Bucket.rooms);
            }
          }
        }

      });

      /** Socket disconnected */
      socket.on('securitypassword', function(password, room, callback) {

        var getRoom = null;
        /** Validate received data */
        if (Security.isSecure(password) && Security.isSecure(room)) {
          /** Check if user exists in the bucket */
          if (Bucket.userExists(socket.id)) {
            /** Check if room exists in the bucket */
            if (Bucket.roomExists(room)) {
              getRoom = Bucket.getRoom(room);
              /** Check if tokens matches */
              if (getRoom.securityToken === password) {
                /** Add user to the room */
                getRoom.addUser(socket.id);
                /** Give user admin rights */
                Bucket.updateUser(socket.id, "level", 3);
                callback(1);
              }
              /** Wrong security token */
              else callback(0);
            /** Move database room into bucket room array */
            } else {
              /** Get room data */
              Database.getCollection("rooms", {name: room}, function(data) {
                /** Got a result */
                if (data) {
                  data = data.data;
                  /** Create room -> Room name, socket name, security token, callback = mongo id */
                  var room = new Room(data.name, socket.id, data.token, data._id);
                  /** Add user to the room */
                  room.addUser(socket.id);
                  /** Make this user to the owner, since he awake this room */
                  room.owner = socket.id;
                  /** Create room in bucket */
                  Bucket.addRoom(room);
                  /** Check if room exists */
                  if (Bucket.roomExists(data.name)) {
                    /** Check if security password is correct */
                    if (Bucket.getRoom(data.name).securityToken === password) {
                      /** Give user admin rights */
                      Bucket.updateUser(socket.id, "level", 3);
                      callback(1);
                    }
                  }
                }
              });
            }
          }
        }

      });

      /** Socket disconnected */
      socket.on('disconnect', function(reason) {

        var userRoom = Bucket.getCurrentUserRoom(socket.id);
        /** User was in a room */
        if (userRoom && userRoom.id) {
          /** User had admin rights, seems like he made edits */
          if (Bucket.userIsAdmin(socket.id)) {
            /** Save the bucket cells into the database */
            Database.updateCell("rooms", {cells: userRoom.cells}, userRoom.id, function(callback) {
              /** Remove user from the bucket */
              if (Bucket.userExists(socket.id)) {
                Bucket.removeUser(socket.id);
              }
            });
          }
        /** Fake user or spectator .. */
        } else {
          /** Remove user from the bucket */
          if (Bucket.userExists(socket.id)) {
            Bucket.removeUser(socket.id);
          }
        }

      });

    });

    /** Everything went fine until here */
    console.log('\x1b[32;1mStarting new server...\x1b[0m');

    /** Save bucket into database every 150s */
    setInterval(function() {
      /** Save each room */
      for (var ii = 0; ii < Bucket.rooms.length; ++ii) {
        Database.updateCell("rooms", {cells: Bucket.rooms[ii].cells}, Bucket.rooms[ii].id, function() {});
      }
    }, 150000);

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
    if (data === '/bucketroomcells') console.log(Bucket.rooms[0].cells);

  });

  /** Handle fatal errors */
  process.on('uncaughtException', function(err) {
    if (err.errno === "EADDRINUSE") console.log("Seems like port " + port + " is already in use, exit!");
    else console.log(err);
    process.exit(1);
  });