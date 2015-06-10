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

  /** Global so we have access in sub files */
  GLOBAL._io = require('socket.io')(port);

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
    _io.on('connection', function(socket) {

      console.log('Socket: ' + socket.id + '\x1b[32;1m connected\x1b[0m!');

      /** Register user into the bucket */
      if (!Bucket.userExists(socket.id)) Bucket.addUser(new User(socket.id, 1));

      /** Successfully connected back pong */
      socket.emit("connected");

      /** Create Room */
      socket.on('createroom', function(data, resolve) {

        /** Abort if no data was received */
        if (!data) return void 0;

        var token = crypto.randomBytes(32).toString('hex');

        /** Validate data */
        if (Security.isSecure(data.name) && Security.isSecure(data.sheet) && typeof data.name === "string" && typeof data.sheet === "string") {
          /** Valid type */
          if (typeof data.name === "string") {
            Database.insertCollection("rooms", {name: data.name, token: token, owner: socket.id, sheets: data.sheet}, function(callback) {
              /** Successful insertion */
              if (callback) {
                /** Give room creator admin rights */
                if (Bucket.userExists(socket.id)) {
                  /** Create room in bucket */
                  if (!Bucket.roomExists(data.name)) {
                    /** Create room -> Room name, socket name, security token, callback = mongo id */
                    var room = new Room(data.name, socket.id, token, callback);
                    /** Add owner to the room */
                    room.addUser(socket.id);
                    /** Create room in bucket */
                    Bucket.addRoom(room);
                  }
                  /** Set user to admin */
                  Bucket.updateUser(socket.id, "level", 3);
                  /** Update rooms user sheet */
                  Bucket.updateUser(socket.id, "sheet", data.sheet);
                }
                socket.emit("message", {type: "room", value: "Room " + data.name + " was successfully created!", values: data.name, state: 1});
                /** New room created */
                resolve(token);
              /** Failed insertion */
              } else {
                socket.emit("message", {type: "room", value: "Room " + data.name + " already exists!", values: data.name, state: 0});
                if (Bucket.userExists(socket.id)) {
                  if (Bucket.roomExists(data.name)) {
                    /** Wrong password ? */
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

        /** Abort if no data was received */
        if (!data) return void 0;

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

        /** Abort if no data was received */
        if (!data) return void 0;

        var userRoom = Bucket.getCurrentUserRoom(socket.id);
        /** Check user for admin rights and valid room */
        if (Bucket.isValidUser(socket.id)) {
          /** Validate cell object */
          if (Security.isSecure(data.sheet) && data.sheet.length &&   /** Sheet  */
              Security.isSecure(data.cell) && data.value.length &&    /** Cell   */
              Security.isSecure(data.letter) && data.letter.length && /** Letter */
              (typeof data.value === "string")) {                     /** Value  */
                /** Check if sheet is already registered */
                if (!userRoom.sheets[data.sheet] || !userRoom.sheets[data.sheet].cells) {
                  /** Register new sheet */
                  userRoom.sheets[data.sheet] = {
                    cells: {}
                  };
                }
                /** Dictionary lookup style */
                if (!userRoom.sheets[data.sheet].cells[data.letter]) {
                  /** Register cell dictionary */
                  userRoom.sheets[data.sheet].cells[data.letter] = {};
                }
                /** Update cell */
                if (userRoom.sheets[data.sheet].cells[data.letter]) {
                  /** Update cell */
                  userRoom.sheets[data.sheet].cells[data.letter][data.cell] = data.value;
                }
                /** Send cell update to all clients in the same room */
                Bucket.shareData({sheet: data.sheet, letter: data.letter, cell: data.cell, value: data.value}, socket.id, "cellchange", false);
              }
        /** User isn't in a room or entered wrong password */
        } else {

        }

      });

      /** Share scrolling to room clients */
      socket.on('scrolling', function(data) {

        /** Abort if no data was received */
        if (!data) return void 0;

        var userSheet = null;

        /** Check user for admin rights and valid room */
        if (Bucket.isValidUser(socket.id)) {
          /** Validate received data object */
          if (Security.isSecure(data.direction) && Security.isSecure(data.amount)) {
            if (typeof data.direction === "string" && typeof data.amount === "number") {

              userSheet = Bucket.getUser(socket.id).sheet;

              /** Check if sheet exists in the room */
              if (Bucket.getCurrentUserRoom(socket.id).sheets[userSheet]) {
                /** Share scrolling with all clients in the room and on the same sheet */
                Bucket.shareData({direction: data.direction, amount: data.amount, sheet: userSheet}, socket.id, "scrolling", userSheet);
              /** Create sheet*/
              } else {
                Bucket.getCurrentUserRoom(socket.id).sheets[userSheet] = {};
                /** Share scrolling with all clients in the room and on the same sheet */
                Bucket.shareData({direction: data.direction, amount: data.amount, sheet: userSheet}, socket.id, "scrolling", userSheet);
              }

            }
          }
        }

      });
      
      /** Socket changed sheet */
      socket.on('changesheet', function(data, callback) {

        /** Abort if no data was received */
        if (!data) return void 0;

        var userRoom = null;

        /** Validate received data */
        if (Security.isSecure(data.sheet)) {
          if (typeof data.sheet === "string") {
            /** Check user for admin rights and valid room */
            if (Bucket.isValidUser(socket.id)) {
              userRoom = Bucket.getCurrentUserRoom(socket.id);
              /** Check if sheet exists in the room, if not create it */
              if (!userRoom.sheets[data.sheet]) {
                /** Create the sheet in the bucket room sheets */
                userRoom.sheets[data.sheet] = {};
                /** Save new sheet in the database */
                Database.updateSheet("rooms", {sheets: userRoom.sheets}, userRoom.id, function(finished) {
                  /** Share the new sheet update to all clients in the room */
                  Bucket.shareData({direction: data.direction, amount: data.amount, sheet: data.sheet}, socket.id, "newsheet");
                });
              }
              /** Update users current sheet */
              Bucket.updateUser(socket.id, "sheet", data.sheet);
            }
          }
        }

      });

      /** Socket tries to login */
      socket.on('securitypassword', function(data, callback) {

        /** Abort if no data was received */
        if (!data) return void 0;

        var getRoom = null;
        var currentUserRoom = null;

        /** Validate received data */
        if (Security.isSecure(data.password) && Security.isSecure(data.room) && Security.isSecure(data.sheet)) {
          /** Check if user exists in the bucket */
          if (Bucket.userExists(socket.id)) {
            /** Check if room exists in the bucket */
            if (Bucket.roomExists(data.room)) {
              getRoom = Bucket.getRoom(data.room);
              /** If room isnt empty, update database, so new clients get latest sheet data */
              if (!getRoom.isEmpty()) {
                Database.updateSheet("rooms", {sheets: getRoom.sheets}, getRoom.id, function(result) {
                  /** Check if tokens matches */
                  if (getRoom.securityToken === data.password) {
                    /** Add user to the room */
                    getRoom.addUser(socket.id);
                    /** Give user admin rights */
                    Bucket.updateUser(socket.id, "level", 3);
                    /** Update sheet where user currently is */
                    Bucket.updateUser(socket.id, "sheet", data.sheet);
                    callback(result);
                    /** Wrong security token */
                  } else callback(0);
                });
              } else {
                /** Check if tokens matches */
                if (getRoom.securityToken === data.password) {
                  /** Add user to the room */
                  getRoom.addUser(socket.id);
                  /** Give user admin rights */
                  Bucket.updateUser(socket.id, "level", 3);
                  /** Update sheet where user currently is */
                  Bucket.updateUser(socket.id, "sheet", data.sheet);
                  callback(1);
                /** Wrong security token */
                } else callback(0);
              }
            /** Move database room into bucket room array */
            } else {
              /** Get room data */
              Database.getCollection("rooms", {name: data.room}, function(result) {
                /** Got a result */
                if (result) {
                  result = result.data;
                  /** Create room -> Room name, socket name, security token, callback = mongo id */
                  var room = new Room(result.name, result.owner, result.token, result._id);
                  /** Add user to the room */
                  room.addUser(socket.id);
                  /** Add sheets to the room */
                  room.sheets = result.sheets;
                  /** Create room in bucket */
                  Bucket.addRoom(room);
                  /** Check if room exists */
                  if (Bucket.roomExists(result.name)) {
                    getRoom = Bucket.getRoom(result.name);
                    /** Check if security password is correct */
                    if (getRoom.securityToken === data.password) {
                      /** Make this user to the owner, since he awake this room */
                      room.owner = socket.id;
                      /** Give user admin rights */
                      Bucket.updateUser(socket.id, "level", 3);
                      /** Update sheet where user currently is */
                      Bucket.updateUser(socket.id, "sheet", data.sheet);
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

        console.log('Socket: ' + socket.id + '\x1b[33;31m disconnected\x1b[0m!');

        var userRoom = Bucket.getCurrentUserRoom(socket.id);
        /** User was in a room */
        if (userRoom && userRoom.id) {
          /** User had admin rights, seems like he made edits */
          if (Bucket.userIsAdmin(socket.id)) {
            /** Save the bucket sheets and cells into the database */
            Database.updateSheet("rooms", {sheets: userRoom.sheets}, userRoom.id, function(callback) {
              /** Remove user from the bucket */
              if (Bucket.userExists(socket.id)) {
                Bucket.removeUser(socket.id);
              }
              /** Remove user from room */
              userRoom.removeUser(socket.id);
            });
          } else {
            /** Remove user from the bucket */
            if (Bucket.userExists(socket.id)) {
              Bucket.removeUser(socket.id);
            }
            /** Remove user from room */
            userRoom.removeUser(socket.id);
          }
          /** If user room is empty, remove it from the bucket */
          if (userRoom.isEmpty()) {
            Bucket.removeRoom(userRoom.name);
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
        Database.updateSheet("rooms", {sheets: Bucket.rooms[ii].sheets}, Bucket.rooms[ii].id, function() {});
      }
    }, 150000);

  });

  /** Listen for Server shutdown */
  process.on('SIGINT', function() {
    _io.sockets.emit('annouce', {message : 'Server shutting down!'});
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
    if (data === '/bucketroomusers') console.log(Bucket.rooms[0].users);
    if (data === '/bucketroomsheets') console.log(Bucket.rooms[0].sheets);

  });

  /** Handle fatal errors */
  process.on('uncaughtException', function(err) {
    if (err.errno === "EADDRINUSE") console.log("Seems like port " + port + " is already in use, exit!");
    else console.log(err);
    process.exit(1);
  });