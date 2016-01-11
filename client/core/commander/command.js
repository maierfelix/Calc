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

  /**
   * Command Class
   *
   * @class Command
   * @param {string} [caller] Caller Class
   * @param {string} [action] Class action
   * @param {object} [data] Command data to process
   * @static
   */
  NOVAE.Commander.prototype.Command = function(caller, action, data) {

    this.caller = caller;

    this.action = action;

    this.data = data;

  };

  NOVAE.Commander.prototype.Command = NOVAE.Commander.Command;