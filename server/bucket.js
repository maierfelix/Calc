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
          this.users = this.users.slice(ii);
        }
      }

    }

    return void 0;

  };

  /**
   * Check if a room exists
   * @param {string} id Id
   * @method roomExists
   * @return {boolean}
   */
  Bucket.prototype.roomExists = function(id) {

    for (var ii = 0; ii < this.rooms.length; ++ii) {
      if (this.rooms[ii].id === id) return (true);
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
    if (!room.id) return (false);

    /** Check if room already exists, continue if not */
    if (!this.roomExists(room.id)) {
      this.rooms.push(room);
    }

    return void 0;

  };

  /**
   * Removes a room from the rooms array
   * @param {String} id Id to remove
   * @method removeRoom
   */
  Bucket.prototype.removeRoom = function(id) {

    for (var ii = 0; ii < this.rooms.length; ++ii) {

      if (this.rooms[ii] && this.rooms[ii].hasOwnProperty("id")) {
        if (this.rooms[ii].id === id) {
          this.rooms = this.rooms.slice(ii);
        }
      }

    }

    return void 0;

  };

  module.exports = Bucket;