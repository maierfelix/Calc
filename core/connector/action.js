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
   * Process actions made by the user
   * Send them to the server to share them with other room mates
   *
   * @method action
   * @static
   */
  CORE.Connector.prototype.action = function(type, object) {

    switch (type) {
      case "updateCell":
        this.updateCell(object);
        break;
    }

  };

  /**
   * Update a cell on the server
   *
   * @method updateCell
   * @static
   */
  CORE.Connector.prototype.updateCell = function(object) {

    /** Validate data */
    if (object.cell && object.value && object.value.length) {
      this.socket.emit("updatecell", object);
    }

  };