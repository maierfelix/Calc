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
      case "scrolling":
        this.updateScrolling(object);
        break;
      case "changeSheet":
        this.changeSheet(object);
        break;
      case "deleteSheet":
        this.deleteSheet(object);
        break;
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
    if (object.range || object.cell && object.value && object.value.length) {
      if (!object.range) {
        object.letter = object.cell.match(NOVAE.REGEX.numbers).join("");
      }
      object.sheet = NOVAE.CurrentSheet;
      this.socket.emit("updatecell", object);
    }

  };

  /**
   * Process cell received from the server
   *
   * @method processServerCells
   * @static
   */
  NOVAE.Connector.prototype.processServerCells = function(object) {

    var sheets = [];

    for (var sheet in object) {
      sheets.push(sheet);
      /** Add new sheet if not existing yet */
      if (!NOVAE.Sheets[sheet]) {
        NOVAE.Sheets[sheet] = new NOVAE.Grid();
        NOVAE.Sheets.addSheet(sheet);
      }
      for (var letter in object[sheet].cells) {
        for (var cell in object[sheet].cells[letter]) {
          if (!NOVAE.Cells.Used[sheet]) NOVAE.Cells.Used[sheet] = {};
          if (!NOVAE.Cells.Used[sheet][letter]) NOVAE.Cells.Used[sheet][letter] = {};
          if (!NOVAE.Cells.Used[sheet][letter][cell]) NOVAE.Cells.Used[sheet][letter][cell] = new NOVAE.Grid.Cell();
          for (var property in object[sheet].cells[letter][cell]) {
            NOVAE.Cells.Used[sheet][letter][cell][property] = object[sheet].cells[letter][cell][property];
          }
        }
      }
    }

    /** Received new sheets from the server */
    if (sheets.length) {
      /** Synchronize server sheets with client sheets, delete sheets which doesn't exist on the server */
      for (var sheet in NOVAE.Sheets) {
        if (NOVAE.Sheets.hasOwnProperty(sheet)) {
          if (sheets.indexOf(sheet) >= 0) {
            //
          /** Delete non-server received sheets, and switch to another */
          } else {
            NOVAE.Sheets.killSwitchSheet(sheet);
          }
        }
      }
    }

    /** Refresh the grid */
    NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("default");
    NOVAE.eval();

  };

  /**
   * Process a single server cell
   *
   * @method processServerCell
   * @static
   */
  NOVAE.Connector.prototype.processServerCell = function(object) {

    if (!NOVAE.Cells.Used[object.sheet][object.letter]) NOVAE.Cells.Used[object.sheet][object.letter] = {};

    if (!NOVAE.Cells.Used[object.sheet][object.letter][object.cell]) {
      NOVAE.Cells.Used[object.sheet][object.letter][object.cell] = new NOVAE.Grid.Cell();
    }

    if (object.value[0] === "=") {
      /** Only attach cell if it ends with a semicolon */
      if (object.value[object.value.length - 1] === ";") {
        NOVAE.Cells.Used[object.sheet][object.letter][object.cell].Formula = object.value;
      }
    } else {
      NOVAE.Cells.Used[object.sheet][object.letter][object.cell].Content = object.value;
    }

    /** Refresh the grid */
    NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("default");
    NOVAE.eval();

  };

  /**
   * Process a cell range
   *
   * @method processCellRange
   * @static
   */
  NOVAE.Connector.prototype.processCellRange = function(object) {

    var selection = NOVAE.$.rangeToSelection(object.range);

    for (var ii = 0; ii < selection.length; ++ii) {
      var letter = NOVAE.$.numberToAlpha(selection[ii].letter);
      var cell = letter + selection[ii].number;
      /** Register dictionary */
      if (!NOVAE.Cells.Used[object.sheet][letter]) {
        NOVAE.Cells.Used[object.sheet][letter] = {};
      }
      /** Register cell */
      if (!NOVAE.Cells.Used[object.sheet][letter][cell]) {
        NOVAE.Cells.Used[object.sheet][letter][cell] = new NOVAE.Grid.Cell();
      }
      /** Update property */
      if (NOVAE.Cells.Used[object.sheet][letter][cell].hasOwnProperty(object.property)) {
        NOVAE.Cells.Used[object.sheet][letter][cell][object.property] = object.value;
      }
    }

    /** Refresh the grid */
    NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("default");
    NOVAE.eval();

  };

  /**
   * Process scrolling received from the server
   *
   * @method processServerCell
   * @static
   */
  NOVAE.Connector.prototype.processServerScrolling = function(object) {

    if (object && object.sheet === NOVAE.CurrentSheet) {
      if (object.direction && typeof object.direction === "string") {
        if (["up", "down", "left", "right"].indexOf(object.direction) >= 0) {
          if (object.amount && typeof object.amount === "number" && object.position && typeof object.position === "number") {
            /** UP or DOWN */
            if (["up", "down"].indexOf(object.direction) >= 0) {
              /** Up */
              if (object.direction === "up") {
                /** Dont overscroll top */
                if ((object.position - 1) - NOVAE.Settings.Scroll.Vertical <= 0) {
                  NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY = 0;
                  NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY = 0;
                  NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight("default", NOVAE.Settings.Scroll.Vertical);

                  /** Animate */
                  NOVAE.Event.animateMouseUpMaximum();

                /** Default up scroll */
                } else {
                  NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY = object.position;
                  NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY = object.amount;
                  NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight(object.direction, object.amount);

                  /** Animate */
                  NOVAE.Event.animateMouseUp();

                }
              }
              /** Down */
              else if (object.direction === "down") {

                NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY = object.position;
                NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY = object.amount;
                NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight(object.direction, object.amount);

                /** Animate */
                NOVAE.Event.animateMouseDown();

              }
              /** User scrolled up or down, dont redraw */
              NOVAE.Sheets[NOVAE.CurrentSheet].Input.lastAction.scrollY = true;
              /** Also update the menu and the selection */
              NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
              NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();
            }
          }
        }
      }
    }

  };

  /**
   * Process a new sheet
   * A user created a new sheet in the room
   *
   * @method processServerCell
   * @static
   */
  NOVAE.Connector.prototype.processNewSheet = function(object) {

    /** Validate object */
    if (object.sheet && typeof object.sheet === "string") {
      /** Sheet does not exist here yet */
      if (!NOVAE.Sheets[object.sheet]) {
        NOVAE.Sheets[object.sheet] = new NOVAE.Grid();
        /** Make addition real */
        NOVAE.Sheets.addSheet(object.sheet);
      }
      NOVAE.Sheets.changeSheet(object.sheet);
    }

  };

  /**
   * Process a sheet deletion
   * A user deleted a sheet from the room
   *
   * @method processSheetDeletion
   * @static
   */
  NOVAE.Connector.prototype.processSheetDeletion = function(object) {

    /** Validate object */
    if (object.sheet && typeof object.sheet === "string") {
      /** Sheet exists */
      if (NOVAE.Sheets[object.sheet]) {
        NOVAE.Sheets.killSwitchSheet(object.sheet);
      }
    }

  };