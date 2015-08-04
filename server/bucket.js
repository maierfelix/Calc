/**
 * This file is part of the NovaeCalc project.
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

  /**
   * Bucket class
   * Emulates a user bucket, which saves and handles users and rooms
   */
  function Bucket() {
    /**
     * Save all users
     *
     * @member {array}
     */
    this.users = [];
    /**
     * Save all rooms
     *
     * @member {array}
     */
    this.rooms = [];
  };

  /**
   * Check if user already exists in the user array or not
   * @param {string} username Username to be checked
   * @method userExists
   * @return {boolean}
   */
  Bucket.prototype.userExists = function(username) {

    for (var ii = 0; ii < this.users.length; ++ii) {
      if (this.users[ii] && this.users[ii].hasOwnProperty("username")) {
        if (this.users[ii].username === username) return (true);
      }
    }

    return (false);

  };

  /**
   * Update a single user
   * @param {string} username Username to be checked
   * @method updateUser
   * @return {object}
   */
  Bucket.prototype.updateUser = function(username, property, value) {

    for (var ii = 0; ii < this.users.length; ++ii) {
      if (property && this.users[ii] && this.users[ii].hasOwnProperty("username") && this.users[ii].hasOwnProperty(property)) {
        if (this.users[ii].username === username) {
          this.users[ii][property] = value;
        }
      }
    }

    return void 0;

  };

  /**
   * Update all users in this room
   * @param {string} username Username to be used
   * @method updateUsers
   * @return {object}
   */
  Bucket.prototype.updateUsers = function(property, value) {

    for (var ii = 0; ii < this.users.length; ++ii) {
      if (property && this.users[ii] && this.users[ii].hasOwnProperty(property)) {
        this.users[ii][property] = value;
      }
    }

    return void 0;

  };

  /**
   * Get a single user
   * @param {string} username Username
   * @method getUser
   * @return {object} User
   */
  Bucket.prototype.getUser = function(username) {

    for (var ii = 0; ii < this.users.length; ++ii) {
      if (this.users[ii].hasOwnProperty("username")) {
        if (this.users[ii].username === username) {
          return (this.users[ii]);
        }
      }
    }

    return void 0;

  };

  /**
   * Adds a new user to the user array
   * @param {object} user User to be added
   * @method addUser
   */
  Bucket.prototype.addUser = function(user) {

    /** Validate user object */
    if (!typeof user === "object") return void 0;
    if (!user.username) return void 0;

    /** Check if user already exists, continue if not */
    if (!this.userExists(user.username)) {
      this.users.push(user);
    }

    return void 0;

  };

  /**
   * Removes user from the user array
   * @param {string} username Username to remove
   * @method removeUser
   */
  Bucket.prototype.removeUser = function(username) {

    for (var ii = 0; ii < this.users.length; ++ii) {

      if (this.users[ii] && this.users[ii].hasOwnProperty("username")) {
        if (this.users[ii].username === username) {
          this.users.splice(ii, 1);
          break;
        }
      }

    }

    return void 0;

  };

  /**
   * Check if user from user array is admin
   * @param {string} username Username
   * @method userIsAdmin
   * @return {boolean}
   */
  Bucket.prototype.userIsAdmin = function(username) {

    for (var ii = 0; ii < this.users.length; ++ii) {

      if (this.users[ii] && this.users[ii].hasOwnProperty("username")) {
        if (this.users[ii].username === username) {
          if (this.users[ii].isAdmin()) return (true);
        }
      }

    }

    return (false);

  };

  /**
   * Check if a room exists
   * @param {string} name Name
   * @method roomExists
   * @return {boolean}
   */
  Bucket.prototype.roomExists = function(name) {

    for (var ii = 0; ii < this.rooms.length; ++ii) {
      if (this.rooms[ii].name === name) return (true);
    }

    return (false);

  };

  /**
   * Adds a new room to the rooms array
   * @param {object} room Room to be added
   * @method addRoom
   */
  Bucket.prototype.addRoom = function(room) {

    /** Validate user object */
    if (!typeof room === "object") return (false);
    if (!room.name) return (false);

    /** Check if room already exists, continue if not */
    if (!this.roomExists(room.name)) {
      this.rooms.push(room);
    }

    return void 0;

  };

  /**
   * Removes a room from the rooms array
   * @param {string} name Name to remove
   * @method removeRoom
   */
  Bucket.prototype.removeRoom = function(name) {

    for (var ii = 0; ii < this.rooms.length; ++ii) {
      if (this.rooms[ii] && this.rooms[ii].hasOwnProperty("name")) {
        if (this.rooms[ii].name === name) {
          this.rooms.splice(ii, 1);
        }
      }
    }

    return void 0;

  };

  /**
   * Check if a room is empty
   * @param {string} name Room name
   * @method isEmptyRoom
   * @return {boolean}
   */
  Bucket.prototype.isEmptyRoom = function(name) {

    for (var ii = 0; ii < this.rooms.length; ++ii) {
      if (this.rooms[ii] && this.rooms[ii].hasOwnProperty("name")) {
        if (this.rooms[ii].name === name) {
          if (this.rooms[ii].users.length <= 0) return (true);
        }
      }
    }

    return (false);

  };

  /**
   * Count users in a bucket room
   * @param {string} name Room name
   * @method countRoomUsers
   * @return {number} User count
   */
  Bucket.prototype.countRoomUsers = function(name) {

    for (var ii = 0; ii < this.rooms.length; ++ii) {
      if (this.rooms[ii] && this.rooms[ii].hasOwnProperty("name")) {
        if (this.rooms[ii].name === name) {
          if (this.rooms[ii].users.length) return (this.rooms[ii].users.length);
          return (0);
        }
      }
    }

    return (false);

  };

  /**
   * Get a specific room
   * @param {string} roomName
   * @method getRoom
   * @return {object} Room
   */
  Bucket.prototype.getRoom = function(name) {

    for (var ii = 0; ii < this.rooms.length; ++ii) {
      if (this.rooms[ii].name === name) return (this.rooms[ii]);
    }

    return void 0;

  };

  /**
   * Get the current room a user is in
   * @param {string} username Username
   * @method getCurrentUserRoom
   * @return {object} Room
   */
  Bucket.prototype.getCurrentUserRoom = function(username) {

    for (var ii = 0; ii < this.rooms.length; ++ii) {
      if (this.rooms[ii] && this.rooms[ii].users) {
        for (var kk = 0; kk < this.rooms[ii].users.length; ++kk) {
          if (this.rooms[ii].users[kk] === username) return (this.rooms[ii]);
        }
      }
    }

    return void 0;

  };

  /**
   * Save current bucket cells
   * @method saveBucketCells
   * @return {string} name
   */
  Bucket.prototype.saveBucketCells = function(name) {

    console.log("Save!");

  };

  /**
   * Validate user by check if he has admin rights and is in a room
   * @param {string} id Socket ID
   * @method isValidUser
   * @return {boolean}
   */
  Bucket.prototype.isValidUser = function(id) {

    var userRoom = this.getCurrentUserRoom(id);

    /** Does have user admin rights */
    if (this.userIsAdmin(id)) {
      /** User is in a room */
      if (userRoom && userRoom.id) {
        /** Seems like he's valid to here */
        return (true);
      }
    }

    return (false);

  };

  /**
   * Share data with all users in the room
   * Don't share with the sender
   * @param {object} data Data to share
   * @param {string} id Socket id
   * @param {string} action Action
   * @param {string} sheet Sheet strict
   * @method shareData
   * @return {object} data
   */
  Bucket.prototype.shareData = function(object, id, action, sheet) {

    var userRoom = this.getCurrentUserRoom(id);

    var user = null;

    /** Send update to all clients in the same room */
    for (var ii = 0; ii < userRoom.users.length; ++ii) {
      /** Dont send message to this myself */
      if (userRoom.users[ii] !== id) {
        /** Only share with users on the same sheet */
        if (sheet) {
          if (user = this.getUser(userRoom.users[ii])) {
            if (user.sheet === sheet) {
              /** Update data of all client in the same room */
              _io.to(userRoom.users[ii]).emit("message", {type: "global", action: action, data: object});
            }
          }
        /** Share with everyone in the room */
        } else {
          /** Update data of all client in the same room */
          _io.to(userRoom.users[ii]).emit("message", {type: "global", action: action, data: object});
        }
      }
    }

  };

  module.exports = Bucket;