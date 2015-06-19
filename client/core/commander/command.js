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
   * Command Class
   *
   * @class Command
   * @static
   */
  CORE.Commander.prototype.Command = function(caller, action, data) {

    this.caller = caller;

    this.action = action;

    this.data = data;

  };

  CORE.Commander.prototype.Command = CORE.Commander.Command;