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
   * User class
   * Represents a user
   */
  function User(name, level) {
    /**
     * Username
     *
     * @member {string}
     */
    this.username = name;
    /**
     * Admin level
     *
     * @member {number}
     */
    this.level = level;
  };

  /**
   * Check if user is admin
   * @param {string} username Username
   * @method isAdmin
   * @return {boolean}
   */
  User.prototype.isAdmin = function(username) {

    if (this.level >= 3) return (true);

    return (false);

  };

  module.exports = User;