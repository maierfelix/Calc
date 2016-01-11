/**
 * This file is part of the Calc project.
 *
 * It is permitted to use, redistribute and/or modify this software
 * under the terms of the BSD License
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

  /** Helper module */
  var Helper = require('./helper.js');
      Helper = new Helper();

  /** Bucket module */
  var Bucket = require('./bucket.js');
      Bucket = new Bucket();

  /** User class */
  var User = require('./user.js');

  /** Room class */
  var Room = require('./room.js');

  /** Cell class */
  var Cell = require('./cell.js');

  /** Security module */
  var Security = require('./security.js');
      Security = new Security(new Cell());

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
        if (Security.isSecure(data.name)  &&
            Security.isSecure(data.sheet) &&
            typeof data.name === "string" &&
            typeof data.sheet === "string") {

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
                  /** No sheets yet, create one first */
                  if (!Object.keys(callback.data.sheets).length) {
                    callback.data.sheets["Sheet1"] = {};
                  }
                  socket.emit("message", {type: "roomdata", data: callback.data, state: 1});
                }
              });
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
                    callback(1);
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
                  if (result.token === data.password) {
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
                        /** Make this user to the owner, since he woke this room */
                        room.owner = socket.id;
                        /** Give user admin rights */
                        Bucket.updateUser(socket.id, "level", 3);
                        /** Update sheet where user currently is */
                        Bucket.updateUser(socket.id, "sheet", data.sheet);
                        callback(1);
                      /** Wrong security token */
                      } else callback(0);
                    }
                  /** Wrong security token */
                  } else callback(0);
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

        /** Abort if user is not in a room */
        if (!userRoom) return void 0;

        /** Check user for admin rights and valid room */
        if (!Bucket.isValidUser(socket.id)) return void 0;

        /** Validate data */
        if (!data.hasOwnProperty("range")) {
          if (!Security.isSecure(data.sheet)    || /** Sheet  */
              !Security.isSecure(data.cell)     || /** Cell   */
              typeof data.value !== "string"    || /** Value  */
              !Security.isSecure(data.letter)   || /** Letter */
              !Security.isSecure(data.property) || /** Property */
              !Security.isValidCellProperty(data.property)) return void 0;
        } else {
          /** Validate range data */
          if (!Security.isSecure(data.sheet)                  || /** Sheet  */
              typeof data.value !== "string"                  || /** Range  */
              !Security.isSecure(data.property)               || /** Property */
              !Security.isValidCellProperty(data.property)) return void 0;
        }

        /** Check if sheet is already registered */
        if (!userRoom.sheetExists(data.sheet)) {
          /** Create the sheet */
          userRoom.createSheet(data.sheet);
        }

        /** Boolean conversion */
        if (["FontBold", "FontItalic", "FontUnderlined"].indexOf(data.property) >= 0) {
          if (data.value === "true" ||
              data.value === "false") {
            data.value = data.value === "true" ? true : false;
          }
        }

        /** Process range */
        if (data.hasOwnProperty("range")) {
          var bool = null;
          var selection = Helper.rangeToSelection(data.range);
          for (var ii = 0; ii < selection.length; ++ii) {
            var letter = Helper.numberToAlpha(selection[ii].letter);
            var cell = letter + selection[ii].number;
            /** Register dictionary */
            if (!userRoom.sheets[data.sheet].cells[letter]) {
              userRoom.sheets[data.sheet].cells[letter] = {};
            }
            /** Register cell */
            if (!userRoom.sheets[data.sheet].cells[letter][cell]) {
              userRoom.sheets[data.sheet].cells[letter][cell] = new Cell();
            }
            if (userRoom.sheets[data.sheet].cells[letter][cell].hasOwnProperty(data.property)) {
              /** Update property as boolean */
              if (typeof data.value === "boolean") {
                if (userRoom.sheets[data.sheet].cells[letter][cell][data.property]) {
                  bool = false;
                  userRoom.sheets[data.sheet].cells[letter][cell][data.property] = false;
                } else {
                  bool = true;
                  userRoom.sheets[data.sheet].cells[letter][cell][data.property] = true;
                }
              /** Update property */
              } else {
                userRoom.sheets[data.sheet].cells[letter][cell][data.property] = data.value;
              }
            }
          }
          /** Send cell update to all clients in the same room */
          Bucket.shareData({sheet: data.sheet, range: data.range, value: bool !== null ? bool : data.value, property: data.property}, socket.id, "cellrangechange", false);
          return void 0;
        }

        /** Dictionary lookup style */
        if (!userRoom.sheets[data.sheet].cells[data.letter]) {
          /** Register cell dictionary */
          userRoom.sheets[data.sheet].cells[data.letter] = {};
        }

        /** Update cell */
        if (userRoom.sheets[data.sheet].cells[data.letter]) {
          /** Cell does not exist yet */
          if (!userRoom.sheets[data.sheet].cells[data.letter][data.cell]) {
            userRoom.sheets[data.sheet].cells[data.letter][data.cell] = new Cell();
          }
          /** If received content, check if its a formula */
          if (data.property === "Content") {
            /** Received formula */
            if (data.value[0] === "=" && data.value[1]) {
              /** Update cell */
              userRoom.sheets[data.sheet].cells[data.letter][data.cell]["Formula"] = data.value;
              userRoom.sheets[data.sheet].cells[data.letter][data.cell]["Content"] = null;
            /** Received Content */
            } else {
              userRoom.sheets[data.sheet].cells[data.letter][data.cell]["Formula"] = null;
              userRoom.sheets[data.sheet].cells[data.letter][data.cell]["Content"] = data.value;
            }
          } else {
            /** Update cell */
            userRoom.sheets[data.sheet].cells[data.letter][data.cell][data.property] = data.value;
          }
        }

        /** Send cell update to all clients in the same room */
        Bucket.shareData({sheet: data.sheet, letter: data.letter, cell: data.cell, value: data.value}, socket.id, "cellchange", false);

      });

      /** Resize a row or column */
      socket.on('resize', function(data) {

        /** Abort if no data was received */
        if (!data) return void 0;

        var userRoom = Bucket.getCurrentUserRoom(socket.id);

        /** Abort if user is not in a room */
        if (!userRoom) return void 0;

        /** Check user for admin rights and valid room */
        if (!Bucket.isValidUser(socket.id)) return void 0;

        /** Validate received data */
        if (!Security.isSecure(data.sheet) || /** Sheet  */
            !Security.isSecure(data.type)  || /** Type */
            !Security.isSecure(data.name)  || /** Name */
            !Security.isSecure(data.size)) return void 0;

        /** Check if sheet is already registered */
        if (!userRoom.sheetExists(data.sheet)) {
          /** Create the sheet */
          userRoom.createSheet(data.sheet);
        }

        /** Column resize */
        if (data.type === "column" && isNaN(data.name) && userRoom.sheets[data.sheet]) {
          /** Already exists */
          if (userRoom.sheets[data.sheet].resize.columns[data.name]) {
            userRoom.sheets[data.sheet].resize.columns[data.name].Width = data.size;
          /** Register new column */
          } else {
            userRoom.sheets[data.sheet].resize.columns[data.name] = {
              Height: 0,
              Width: data.size
            };
          }
        }
        /** Row resize */
        else if (data.type === "row" && !isNaN(data.name) && userRoom.sheets[data.sheet]) {
          /** Already exists */
          if (userRoom.sheets[data.sheet].resize.rows[data.name]) {
            userRoom.sheets[data.sheet].resize.rows[data.name].Height = data.size;
          /** Register new row */
          } else {
            userRoom.sheets[data.sheet].resize.rows[data.name] = {
              Height: data.size,
              Width: 0
            };
          }
        /** Something happened wrong */
        } else {
          return void 0;
        }

        /** Share resize with everyone in the room */
        Bucket.shareData({sheet: data.sheet, type: data.type, name: data.name, size: data.size}, socket.id, "resize", false);

      });

      /** Master style a column or row */
      socket.on('masterstyle', function(data) {

        console.log(data);

      });

      /** Cell paste */
      socket.on('pastecells', function(data) {

        /** Abort if no data was received */
        if (!data) return void 0;

        /** Validate user */
        if (!Bucket.isValidUser(socket.id)) return void 0;

        var userSheet = Bucket.getUser(socket.id).sheet;

        /** Validate data */
        if (!Security.isSecure(data.sheet) ||
            !data.data ||
            !data.data.start ||
            !data.data.end ||
            !Security.isValidCellProperty(data.property)) return void 0;

        var userRoom = Bucket.getCurrentUserRoom(socket.id);

        /** Process start range */
        var cells = Helper.rangeToSelection(data.data.start);

        var position = Helper.rangeToSelection(data.data.end);

        var startColumn = position[0].letter;
        var startNumber = position[0].number;

        /** Start column to be inserted */
        var lastColumn = startColumn;
        /** Start row to be inserted */
        var lastRow = startNumber;

        var columnPadding = 0;
        var rowPadding = 0;

        var sheet = userRoom.sheets[data.sheet].cells;

        /** Fill cells with data */
        for (var ii = 0; ii < cells.length; ++ii) {
          var letter = Helper.numberToAlpha(cells[ii].letter);
          var number = cells[ii].number;
          var name = letter + number;
          for (var prop = 0; prop < data.property.length; ++prop) {
            if (sheet[letter] &&
                sheet[letter][name] &&
                sheet[letter][name].hasOwnProperty(data.property[prop])) {
              cells[ii][data.property[prop]] = sheet[letter][name][data.property[prop]];
            }
          }
        }

        /** Adjust copying to the new position */
        for (var ii = 0; ii < cells.length; ++ii) {

          if (cells[ii].number !== lastRow && ii) rowPadding++;

          if (cells[ii].letter !== lastColumn && ii) {
            columnPadding++;
            rowPadding = 0;
          }

          lastColumn = cells[ii].letter;
          lastRow = cells[ii].number;
          cells[ii].letter = cells[ii].letter + startColumn - cells[ii].letter + columnPadding;
          cells[ii].number = cells[ii].number + startNumber - cells[ii].number + rowPadding;

          var letter = Helper.numberToAlpha(cells[ii].letter);
          var number = cells[ii].number;
          var name = letter + number;

          /** Update cells */
          for (var prop = 0; prop < data.property.length; ++prop) {
            if (!sheet[letter]) {
              sheet[letter] = {};
            }
            if (!sheet[letter][name]) {
              sheet[letter][name] = new Cell();
            }
            if (sheet[letter][name].hasOwnProperty(data.property[prop])) {
              sheet[letter][name][data.property[prop]] = cells[ii][data.property[prop]];
            }
          }

        }

        Bucket.shareData({sheet: data.sheet, range: {start: data.data.start, end: data.data.end}, property: data.property}, socket.id, "pastecells", false);

      });

      /** Cell deletion */
      socket.on('deletecells', function(data) {

        /** Abort if no data was received */
        if (!data) return void 0;

        /** Validate user */
        if (!Bucket.isValidUser(socket.id)) return void 0;

        var userSheet = Bucket.getUser(socket.id).sheet;

        /** Make sure we received a range */
        if (!data.hasOwnProperty("range")) return void 0;

        /** Validate range data */
        if (!Security.isSecure(data.sheet)                  || /** Sheet  */
            !Security.isValidCellProperty(data.property)) return void 0;

        var userRoom = Bucket.getCurrentUserRoom(socket.id);

        var selection = Helper.rangeToSelection(data.range);

        for (var ii = 0; ii < selection.length; ++ii) {
          var letter = Helper.numberToAlpha(selection[ii].letter);
          var cell = letter + selection[ii].number;
          for (var kk = 0; kk < data.property.length; ++kk) {
            /** Check if cell exists */
            if (userRoom.sheets[data.sheet] && 
                userRoom.sheets[data.sheet].cells[letter] &&
                userRoom.sheets[data.sheet].cells[letter][cell]) {

              /** Delete cells property */
              if (userRoom.sheets[data.sheet].cells[letter][cell].hasOwnProperty(data.property[kk])) {
                userRoom.sheets[data.sheet].cells[letter][cell][data.property[kk]] = null;
              }

            }
          }
        }

        Bucket.shareData({sheet: data.sheet, range: data.range, property: data.property}, socket.id, "deletecells", false);

      });

      /** Share scrolling to room clients */
      socket.on('scrolling', function(data) {

        /** Abort if no data was received */
        if (!data) return void 0;

        var userSheet = null;

        /** Check user for admin rights and valid room */
        if (Bucket.isValidUser(socket.id)) {
          /** Validate received data object */
          if (Security.isSecure(data.direction) && Security.isSecure(data.amount) && Security.isSecure(data.position)) {
            if (typeof data.direction === "string" && typeof data.amount === "number" && typeof data.position === "number") {

              userSheet = Bucket.getUser(socket.id).sheet;

              /** Check if sheet exists in the room */
              if (Bucket.getCurrentUserRoom(socket.id).sheets[userSheet]) {
                /** Share scrolling with all clients in the room and on the same sheet */
                Bucket.shareData({direction: data.direction, amount: data.amount, position: data.position, sheet: userSheet}, socket.id, "scrolling", userSheet);
              /** Create sheet*/
              } else {
                Bucket.getCurrentUserRoom(socket.id).sheets[userSheet] = {};
                /** Share scrolling with all clients in the room and on the same sheet */
                Bucket.shareData({direction: data.direction, amount: data.amount, position: data.position, sheet: userSheet}, socket.id, "scrolling", userSheet);
              }

            }
          }
        }

      });

      /** Socket changed sheet */
      socket.on('changesheet', function(data) {

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
              if (!userRoom.sheetExists(data.sheet)) {
                /** Create the sheet */
                userRoom.createSheet(data.sheet);
                /** Save new sheet in the database */
                Database.updateSheet("rooms", {sheets: userRoom.sheets}, userRoom.id, function(finished) {
                  /** Share the new sheet update to all clients in the room */
                  Bucket.shareData({sheet: data.sheet}, socket.id, "newsheet");
                });
              }
              /** Update users current sheet */
              Bucket.updateUser(socket.id, "sheet", data.sheet);
            }
          }
        }

      });

      /** Socket deleted a sheet */
      socket.on('deletesheet', function(data) {

        /** Abort if no data was received */
        if (!data) return void 0;

        var userRoom = null;

        /** Validate received data */
        if (Security.isSecure(data.sheet)) {
          if (typeof data.sheet === "string") {
            /** Check user for admin rights and valid room */
            if (Bucket.isValidUser(socket.id)) {
              userRoom = Bucket.getCurrentUserRoom(socket.id);
              /** Check if sheet exists in the room, if yes continue */
              if (userRoom.sheets[data.sheet]) {
                /** Clear the sheet in the bucket room sheets */
                delete userRoom.sheets[data.sheet];
                /** Save new sheet in the database */
                Database.updateSheet("rooms", {sheets: userRoom.sheets}, userRoom.id, function(finished) {
                  /** Share the new sheet update to all clients in the room */
                  Bucket.shareData({sheet: data.sheet}, socket.id, "deletesheet");
                });
              }
            }
          }
        }

      });

      /** Socket renamed a sheet */
      socket.on('renamesheet', function(data) {

        /** Abort if no data was received */
        if (!data) return void 0;

        data = data.data;

        var userRoom = null;

        /** Validate received data */
        if (typeof data.oldName === "string" &&
            typeof data.newName === "string") {

          /** Check user for admin rights and valid room */
          if (!Bucket.isValidUser(socket.id)) return void 0;

          userRoom = Bucket.getCurrentUserRoom(socket.id);

          /** Check if sheet exists in the room, if not create it */
          if (!userRoom.sheetExists(data.newName) && userRoom.sheetExists(data.oldName)) {
            /** Create the sheet */
            userRoom.createSheet(data.newName);
            /** Move sheet data */
            userRoom.sheets[data.newName].cells = userRoom.sheets[data.oldName].cells;
            userRoom.sheets[data.newName].resize.rows = userRoom.sheets[data.oldName].resize.rows;
            userRoom.sheets[data.newName].resize.columns = userRoom.sheets[data.oldName].resize.columns;
            delete userRoom.sheets[data.oldName].cells;
            delete userRoom.sheets[data.oldName].resize.rows;
            delete userRoom.sheets[data.oldName].resize.columns;
            delete userRoom.sheets[data.oldName];
            /** Save new sheet in the database */
            Database.updateSheet("rooms", {sheets: userRoom.sheets}, userRoom.id, function(finished) {
              /** Share the new sheet update to all clients in the room */
              Bucket.shareData({oldSheet: data.oldName, newSheet: data.newName}, socket.id, "renamesheet");
            });

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
              /** If user room is empty, remove it from the bucket */
              if (userRoom.isEmpty()) {
                Bucket.removeRoom(userRoom.name);
              }
            });
          } else {
            /** Remove user from the bucket */
            if (Bucket.userExists(socket.id)) {
              Bucket.removeUser(socket.id);
            }
            /** Remove user from room */
            userRoom.removeUser(socket.id);
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
    if (data === '/bucketroomsheetcells') console.log(Bucket.rooms[0].sheets.Sheet1.cells["A"]);

  });

  /** Handle fatal errors */
  process.on('uncaughtException', function(err) {
    if (err.errno === "EADDRINUSE") console.log("Seems like port " + port + " is already in use, exit!");
    else console.log(err);
    process.exit(1);
  });