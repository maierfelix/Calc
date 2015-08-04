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
   * Process actions made by the user
   * Send them to the server to share them with other room mates
   *
   * @method action
   * @static
   */
  NOVAE.Connector.prototype.action = function(type, object) {

    switch (type) {
      case "updateCell":
        this.updateCell(object);
        break;
      case "resize":
        this.resize(object);
        break;
      case "scrolling":
        this.updateScrolling(object);
        break;
      case "changeSheet":
        this.changeSheet(object);
        break;
      case "deleteSheet":
        this.deleteSheet(object);
        break;
      case "renameSheet":
        this.renameSheet(object);
        break;
      case "deleteCells":
        this.deleteCells(object);
        break;
      case "pasteCells":
        this.pasteCells(object);
        break;
    }

  };

  /**
   * Delete cell range on the server
   *
   * @method deleteCells
   * @static
   */
  NOVAE.Connector.prototype.deleteCells = function(object) {

    if (!object.sheet) {
      object.sheet = NOVAE.CurrentSheet;
    }

    if (object && object.sheet) {
      if (typeof object.sheet === "string" &&
          typeof object.property === "string" ||
          object.property instanceof Array) {
        this.socket.emit("deletecells", object);
      }
    }

  };

  /**
   * Paste cells on the server
   *
   * @method pasteCells
   * @static
   */
  NOVAE.Connector.prototype.pasteCells = function(object) {

    if (!object.sheet) {
      object.sheet = NOVAE.CurrentSheet;
    }

    if (object && object.sheet) {
      if (typeof object.sheet === "string") {
        this.socket.emit("pastecells", object);
      }
    }

  };

  /**
   * Change sheet on the server
   *
   * @method changeSheet
   * @static
   */
  NOVAE.Connector.prototype.changeSheet = function(object) {

    if (object && object.sheet) {
      if (typeof object.sheet === "string") {
        this.socket.emit("changesheet", {sheet: object.sheet});
      }
    }

  };

  /**
   * Delete the sheet on the server
   *
   * @method deleteSheet
   * @static
   */
  NOVAE.Connector.prototype.deleteSheet = function(object) {

    if (object && object.sheet) {
      if (typeof object.sheet === "string") {
        this.socket.emit("deletesheet", {sheet: object.sheet});
      }
    }

  };

  /**
   * Rename a sheet on the server
   *
   * @method renameSheet
   * @static
   */
  NOVAE.Connector.prototype.renameSheet = function(object) {

    if (!object.oldName ||
        typeof object.oldName !== "string" ||
        !object.newName ||
        typeof object.newName !== "string") { return void 0; }

    this.socket.emit("renamesheet", {data: object});

  };

  /**
   * Share scrolling to all clients
   *
   * @method updateCell
   * @static
   */
  NOVAE.Connector.prototype.updateScrolling = function(object) {

    /** Validate data */
    if (object.direction && object.amount && object.position >= 0) {
      if (typeof object.direction === "string" && typeof object.amount === "number" && typeof object.position === "number") {
        this.socket.emit("scrolling", {direction: object.direction, amount: object.amount, position: object.position});
      }
    }

  };

  /**
   * Update a cell on the server
   *
   * @method updateCell
   * @static
   */
  NOVAE.Connector.prototype.updateCell = function(object) {

    /** Validate data */
    if (object.range || object.cell) {
      if (!object.range) {
        object.letter = object.cell.match(NOVAE.REGEX.numbers).join("");
      }
      object.sheet = NOVAE.CurrentSheet;
      this.socket.emit("updatecell", object);
    }

  };

  /**
   * Update column or row on the server
   *
   * @method resize
   * @static
   */
  NOVAE.Connector.prototype.resize = function(object) {

    /** Validate data */
    if (object.type === "column" || object.type === "row" && object.name && object.name.length) {
      object.sheet = NOVAE.CurrentSheet;
      this.socket.emit("resize", object);
    }

  };