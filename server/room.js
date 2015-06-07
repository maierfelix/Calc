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
   * Room class
   * Represents a user room
   */
  function Room(name, owner, token, id) {
    /**
     * Mongo room id
     *
     * @member {string}
     */
    this.id = id;
    /**
     * Room name
     *
     * @member {string}
     */
    this.name = name;
    /**
     * Name of the owner
     *
     * @member {string}
     */
    this.owner = owner;
    /**
     * Users in this room
     *
     * @member {array}
     */
    this.users = [];
    /**
     * Max room user amount
     *
     * @member {number}
     * @default 12
     */
    this.userLimit = 12;
    /**
     * Security access token
     *
     * @member {string}
     */
    this.securityToken = token;
    /**
     * Cells
     *
     * @member {object}
     */
    this.cells = {};
  };

  /**
   * Check if a user is in this room
   * @param {string} username Username
   * @method userExists
   * @return {boolean}
   */
  Room.prototype.userExists = function(username) {

    for (var ii = 0; ii < this.users.length; ++ii) {
      if (this.users[ii].username === username) return (true);
    }

    return (false);

  };

  /**
   * Check if user is the room owner
   * @param {string} username Username
   * @method isOwner
   * @return {boolean}
   */
  Room.prototype.isOwner = function(username) {

    for (var ii = 0; ii < this.users.length; ++ii) {
      if (this.users[ii].owner >= 3) return (true);
    }

    return (false);

  };

  /**
   * Adds a new user to the room
   * @param {object} user User
   * @method addUser
   */
  Room.prototype.addUser = function(username) {

    /** Validate username */
    if (!username || !typeof username === "string") return (false);

    /** Check if user already exists in this room, continue if not */
    if (!this.userExists(username)) {
      this.users.push(username);
    }

    return void 0;

  };

  /**
   * Removes a user from the room
   * @param {string} username Username
   * @method removeUser
   */
  Room.prototype.removeUser = function(username) {

    for (var ii = 0; ii < this.users.length; ++ii) {

      if (this.users[ii] && this.users[ii].hasOwnProperty("username")) {
        if (this.users[ii].username === username) {
          this.users.splice(ii, 1);
        }
      }

    }

    return void 0;

  };

  /**
   * Check if room is empty
   * @param {string} name
   * @method isEmpty
   */
  Room.prototype.isEmpty = function(name) {

    if (this.users.length <= 0) return (true);

    return (false);

  };

  /**
   * Check if room is full
   * @param {string} name
   * @method isFull
   */
  Room.prototype.isFull = function(name) {

    if (this.users.length >= this.userLimit) return (true);

    return (false);

  };

  module.exports = Room;