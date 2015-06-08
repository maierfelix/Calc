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
      object.letter = object.cell.match(CORE.REGEX.numbers).join("");
      this.socket.emit("updatecell", object);
    }

  };

  /**
   * Process cell received from the server
   *
   * @method processServerCells
   * @static
   */
  CORE.Connector.prototype.processServerCells = function(object) {

    for (var letter in object) {
      for (var cell in object[letter]) {
        if (!CORE.Cells.Used[CORE.CurrentSheet][letter]) CORE.Cells.Used[CORE.CurrentSheet][letter] = {};
        if (!CORE.Cells.Used[CORE.CurrentSheet][letter][cell]) CORE.Cells.Used[CORE.CurrentSheet][letter][cell] = CORE.Sheets[CORE.CurrentSheet].Cell();
        /** Formula? */
        if (object[letter][cell][0] === "=") {
          CORE.Cells.Used[CORE.CurrentSheet][letter][cell].Formula = object[letter][cell];
        /** Default content */
        } else {
          CORE.Cells.Used[CORE.CurrentSheet][letter][cell].Content = object[letter][cell];
        }
      }
    }

    /** Refresh the grid */
    CORE.Sheets[CORE.CurrentSheet].updateWidth("default");
    CORE.eval();

  };

  /**
   * Process a single server cell
   *
   * @method processServerCell
   * @static
   */
  CORE.Connector.prototype.processServerCell = function(object) {

    if (!CORE.Cells.Used[CORE.CurrentSheet][object.letter]) CORE.Cells.Used[CORE.CurrentSheet][object.letter] = {};

    if (!CORE.Cells.Used[CORE.CurrentSheet][object.letter][object.cell]) {
      CORE.Cells.Used[CORE.CurrentSheet][object.letter][object.cell] = new CORE.Sheets[CORE.CurrentSheet].Cell();
    }

    if (object.value[0] === "=") {
      /** Only attach cell if it ends with a semicolon */
      if (object.value[object.value.length - 1] === ";") {
        CORE.Cells.Used[CORE.CurrentSheet][object.letter][object.cell].Formula = object.value;
      }
    } else {
      CORE.Cells.Used[CORE.CurrentSheet][object.letter][object.cell].Content = object.value;
    }

    /** Refresh the grid */
    CORE.Sheets[CORE.CurrentSheet].updateWidth("default");
    CORE.eval();

  };