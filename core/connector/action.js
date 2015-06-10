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
  CORE.Connector.prototype.action = function(type, object) {

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
    }

  };

  /**
   * Change sheet on the server
   *
   * @method changeSheet
   * @static
   */
  CORE.Connector.prototype.changeSheet = function(object) {

    if (object && object.sheet) {
      if (typeof object.sheet === "string") {
        this.socket.emit("changesheet", {sheet: object.sheet});
      }
    }

  };

  /**
   * Share scrolling to all clients
   *
   * @method updateCell
   * @static
   */
  CORE.Connector.prototype.updateScrolling = function(object) {

    /** Validate data */
    if (object.direction && object.amount) {
      if (typeof object.direction === "string" && typeof object.amount === "number") {
        this.socket.emit("scrolling", {direction: object.direction, amount: object.amount});
      }
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
      object.sheet = CORE.CurrentSheet;
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

    for (var sheet in object) {
      /** Add new sheet if not existing yet */
      if (!CORE.Sheets[sheet]) {
        CORE.Sheets[sheet] = new CORE.Grid();
        CORE.Sheets.addSheet(sheet);
      }
      for (var letter in object[sheet].cells) {
        for (var cell in object[sheet].cells[letter]) {
          if (!CORE.Cells.Used[sheet]) CORE.Cells.Used[sheet] = {};
          if (!CORE.Cells.Used[sheet][letter]) CORE.Cells.Used[sheet][letter] = {};
          if (!CORE.Cells.Used[sheet][letter][cell]) CORE.Cells.Used[sheet][letter][cell] = new CORE.Grid.Cell();
          /** Formula? */
          if (object[sheet].cells[letter][cell][0] === "=") {
            CORE.Cells.Used[sheet][letter][cell].Formula = object[sheet].cells[letter][cell];
          /** Default content */
          } else {
            CORE.Cells.Used[sheet][letter][cell].Content = object[sheet].cells[letter][cell];
          }
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

    if (!CORE.Cells.Used[object.sheet][object.letter]) CORE.Cells.Used[object.sheet][object.letter] = {};

    if (!CORE.Cells.Used[object.sheet][object.letter][object.cell]) {
      CORE.Cells.Used[object.sheet][object.letter][object.cell] = new CORE.Grid.Cell();
    }

    if (object.value[0] === "=") {
      /** Only attach cell if it ends with a semicolon */
      if (object.value[object.value.length - 1] === ";") {
        CORE.Cells.Used[object.sheet][object.letter][object.cell].Formula = object.value;
      }
    } else {
      CORE.Cells.Used[object.sheet][object.letter][object.cell].Content = object.value;
    }

    /** Refresh the grid */
    CORE.Sheets[CORE.CurrentSheet].updateWidth("default");
    CORE.eval();

  };

  /**
   * Process scrolling received from the server
   *
   * @method processServerCell
   * @static
   */
  CORE.Connector.prototype.processServerScrolling = function(object) {

    if (object && object.sheet === CORE.CurrentSheet) {
      if (object.direction && typeof object.direction === "string") {
        if (["up", "down", "left", "right"].indexOf(object.direction) >= 0) {
          if (object.amount && typeof object.amount === "number") {
            /** UP or DOWN */
            if (["up", "down"].indexOf(object.direction) >= 0) {
              /** Up */
              if (object.direction === "up") {
                /** Dont overscroll top */
                if (CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY - CORE.Settings.Scroll.Vertical <= 0) {
                  CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY = 0;
                  CORE.Sheets[CORE.CurrentSheet].Settings.lastScrollY = 0;
                  CORE.Sheets[CORE.CurrentSheet].updateHeight("default", CORE.Settings.Scroll.Vertical);

                  /** Animate */
                  CORE.Event.animateMouseUpMaximum();

                /** Default up scroll */
                } else {
                  CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY -= object.amount;
                  CORE.Sheets[CORE.CurrentSheet].Settings.lastScrollY = object.amount;
                  CORE.Sheets[CORE.CurrentSheet].updateHeight(object.direction, object.amount);

                  /** Animate */
                  CORE.Event.animateMouseUp();

                }
              }
              /** Down */
              else if (object.direction === "down") {
                CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY += object.amount;
                CORE.Sheets[CORE.CurrentSheet].Settings.lastScrollY = object.amount;
                CORE.Sheets[CORE.CurrentSheet].updateHeight(object.direction, object.amount);

                /** Animate */
                CORE.Event.animateMouseDown();

              }
              /** User scrolled up or down, dont redraw */
              CORE.Sheets[CORE.CurrentSheet].Input.lastAction.scrollY = true;
              /** Also update the menu and the selection */
              CORE.Sheets[CORE.CurrentSheet].updateMenu();
              CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();
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
  CORE.Connector.prototype.processNewSheet = function(object) {

    /** Validate object */
    if (object.sheet && typeof object.sheet === "string" && object.sheet.length) {
      /** Sheet does not exist here yet */
      if (!CORE.Sheets[object.sheet]) {
        CORE.Sheets[object.sheet] = new CORE.Grid();
        /** Make addition real */
        CORE.Sheets.addSheet(object.sheet);
      }
    }

  };