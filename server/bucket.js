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
   * @param {String} username Username to be checked
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
   * Get a single user
   * @param {String} username Username to be checked
   * @method getUser
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
   * Adds a new user to the user array
   * @param {Object} user User to be added
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
   * @param {String} username Username to remove
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
   * @param {Object} room Room to be added
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
   * @param {String} name Name to remove
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
   * Get a specific room
   * @param {String} roomName
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
   * @param {String} username Username
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

  module.exports = Bucket;