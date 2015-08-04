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
        NOVAE.CurrentSheet = sheet;
        NOVAE.Sheets.addSheet(sheet);
      }
      /** Process Cells */
      for (var letter in object[sheet].cells) {
        for (var cell in object[sheet].cells[letter]) {
          if (!NOVAE.Cells.Used[sheet]) NOVAE.Cells.Used[sheet] = {};
          if (!NOVAE.Cells.Used[sheet][letter]) NOVAE.Cells.Used[sheet][letter] = {};
          if (!NOVAE.Cells.Used[sheet][letter][cell]) NOVAE.Cells.Used[sheet][letter][cell] = new NOVAE.Grid.Cell(cell);
          for (var property in object[sheet].cells[letter][cell]) {
            if (property === "Formula") {
              NOVAE.Cells.Used[sheet][letter][cell][property].Stream = object[sheet].cells[letter][cell][property];
            } else if (property === "Content") {
              NOVAE.registerCell(cell);
              NOVAE.updateCell(cell, object[sheet].cells[letter][cell][property]);
              NOVAE.Cells.Used[sheet][letter][cell][property] = object[sheet].cells[letter][cell][property];
            } else {
              NOVAE.Cells.Used[sheet][letter][cell][property] = object[sheet].cells[letter][cell][property];
            }
          }
        }
      }
      /** Process resized columns and rows */
      if (object[sheet].resize) {
        /** Columns */
        for (var letter in object[sheet].resize.columns) {
          /** Already existing */
          if (NOVAE.Cells.Resized[sheet].Columns[letter]) {
            NOVAE.Cells.Resized[sheet].Columns[letter].Width = object[sheet].resize.columns[letter].Width;
          /** Not existing yet */
          } else {
            NOVAE.Cells.Resized[sheet].Columns[letter] = {
              Width: object[sheet].resize.columns[letter].Width,
              Height: 0
            };
          }
        }
        /** Rows */
        for (var number in object[sheet].resize.rows) {
          /** Already existing */
          if (NOVAE.Cells.Resized[sheet].Rows[number]) {
            NOVAE.Cells.Resized[sheet].Rows[number].Height = object[sheet].resize.rows[number].Height;
          /** Not existing yet */
          } else {
            NOVAE.Cells.Resized[sheet].Rows[number] = {
              Width: 0,
              Height: object[sheet].resize.rows[number].Height
            };
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

    NOVAE.eval();
    NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();

    /** Refresh the grid */
    setTimeout(function() {
      NOVAE.Event.redraw();
    }, 250);

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
      NOVAE.Cells.Used[object.sheet][object.letter][object.cell] = new NOVAE.Grid.Cell(object.cell);
    }

    /** Received formula */
    if (object.value[0] === "=" && object.value[1]) {
      /** Only attach cell if it ends with a semicolon */
      if (object.value[object.value.length - 1] === ";") {
        NOVAE.Cells.Used[object.sheet][object.letter][object.cell].Formula.Stream = object.value;
        NOVAE.Cells.Used[object.sheet][object.letter][object.cell].Content = null;
      }
    /** Received content */
    } else {
      NOVAE.registerCell(object.cell);
      NOVAE.updateCell(object.cell, object.value);
      NOVAE.Cells.Used[object.sheet][object.letter][object.cell].Content = object.value;
      NOVAE.Cells.Used[object.sheet][object.letter][object.cell].Formula.Stream = null;
    }

    /** Refresh the grid */
    NOVAE.eval();
    NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight("default", 0);
    NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
    NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();

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
        NOVAE.Cells.Used[object.sheet][letter][cell] = new NOVAE.Grid.Cell(cell);
      }
      /** Update property */
      if (NOVAE.Cells.Used[object.sheet][letter][cell].hasOwnProperty(object.property)) {
        NOVAE.Cells.Used[object.sheet][letter][cell][object.property] = object.value;
      }
    }

    /** Refresh the grid */
    NOVAE.eval();
    NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight("default", 0);
    NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
    NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();

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
                  NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight("down", NOVAE.Settings.Scroll.Vertical);

                /** Default up scroll */
                } else {
                  NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY = object.position;
                  NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY = object.amount;
                  NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight(object.direction, object.amount);

                }
              }
              /** Down */
              else if (object.direction === "down") {

                NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY = object.position;
                NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY = object.amount;
                NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight(object.direction, object.amount);

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

  /**
   * Process a sheet rename
   *
   * @method processRenameSheet
   * @static
   */
  NOVAE.Connector.prototype.processRenameSheet = function(object) {

    if (!object.oldSheet ||
        typeof object.oldSheet !== "string" ||
        !object.newSheet ||
        typeof object.newSheet !== "string") { return void 0; }

    var originalSheet = NOVAE.CurrentSheet;

    if (NOVAE.Sheets[object.oldSheet] && !NOVAE.Sheets[object.newSheet]) {
      var e = {
        target: null
      };
      for (var ii = 0; ii < NOVAE.DOM.Sheets.children.length; ++ii) {
        if (NOVAE.DOM.Sheets.children[ii].getAttribute("name") === object.oldSheet) {
          var node = NOVAE.DOM.Sheets.children[ii];
          var text = document.createTextNode(object.newSheet);
          node.innerHTML = node.innerHTML.replace(object.oldSheet, "");
          node.appendChild(text);
          e.target = NOVAE.DOM.Sheets.children[ii];
          NOVAE.Sheets.renameSheet(e);
          NOVAE.CurrentSheet = originalSheet;
          return void 0;
        }
      }
    }

  };

  /**
   * Process a column or row resize
   *
   * @method processResize
   * @static
   */
  NOVAE.Connector.prototype.processResize = function(object) {

    /** Validate object */
    if (!object.sheet ||
        typeof object.sheet !== "string" ||
        !object.type ||
        typeof object.type !== "string" ||
        !object.name ||
        typeof object.name !== "string" ||
        typeof object.size !== "number") { return void 0; }

    if (!NOVAE.Sheets[object.sheet]) return void 0;

    if (!NOVAE.Cells.Resized[object.sheet]) return void 0;

    var sheet = object.sheet;
    var name = object.name;
    var type = object.type;

    if (type === "column") {
      /** Columns */
      if (NOVAE.Cells.Resized[sheet].Columns[name]) {
        NOVAE.Cells.Resized[sheet].Columns[name].Width = object.size;
      } else {
        NOVAE.Cells.Resized[sheet].Columns[name] = {
          Width: object.size,
          Height: 0
        };
      }
    }
    else if (type === "row") {
      /** Rows */
      if (NOVAE.Cells.Resized[sheet].Rows[name]) {
        NOVAE.Cells.Resized[sheet].Rows[name].Height = object.size;
      } else {
        NOVAE.Cells.Resized[sheet].Rows[name] = {
          Width: 0,
          Height: object.size
        };
      }
    }

    NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();

    /** Refresh the grid */
    setTimeout(function() {
      NOVAE.Event.redraw();
    }, 250);

  };

  /**
   * Process a cell range deletion
   *
   * @method processDeleteCells
   * @static
   */
  NOVAE.Connector.prototype.processDeleteCells = function(object) {

    if (!object.sheet ||
        typeof object.sheet !== "string" ||
        !object.range ||
        typeof object.range !== "string" ||
        !object.property) { return void 0; }

    var selection = NOVAE.$.rangeToSelection(object.range);

    for (var ii = 0; ii < selection.length; ++ii) {
      var letter = NOVAE.$.numberToAlpha(selection[ii].letter);
      var name = letter + selection[ii].number;
      if (NOVAE.Cells.Used[object.sheet] &&
          NOVAE.Cells.Used[object.sheet][letter] &&
          NOVAE.Cells.Used[object.sheet][letter][name]) {
        for (var prop = 0; prop < object.property.length; ++prop) {
          if (NOVAE.Cells.Used[object.sheet][letter][name].hasOwnProperty(object.property[prop])) {
            if (object.property[prop] === "Formula") {
              NOVAE.Cells.Used[object.sheet][letter][name].Formula = {
                Stream: null,
                Lexed: null
              };
            } else {
              NOVAE.Cells.Used[object.sheet][letter][name][object.property[prop]] = null;
            }
            if (["Content", "Formula"].indexOf(object.property[prop]) >= 0) {
              if (ENGEL.STACK.VAR[object.sheet] &&
                  ENGEL.STACK.VAR[object.sheet][name]) {
                delete ENGEL.STACK.VAR[object.sheet][name];
              }
            }
          }
        }
      }
    }

    /** Refresh the grid */
    NOVAE.eval();
    NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight("default", 0);
    NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
    NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();

  };

  /**
   * Process a cell paste
   *
   * @method processPasteCells
   * @static
   */
  NOVAE.Connector.prototype.processPasteCells = function(object) {

    if (!object.sheet ||
        typeof object.sheet !== "string" ||
        !object.range ||
        !object.property ||
        typeof object.range.end !== "string" ||
        typeof object.range.start !== "string") { return void 0; }

    var selection = NOVAE.$.rangeToSelection(object.range.start);

    NOVAE.ClipBoard.copyCellsToClipBoard(selection, object.sheet);

    var position = object.range.end.split(":")[0];

    position = {
      Letter: NOVAE.$.alphaToNumber(position.match(NOVAE.REGEX.numbers).join("")),
      Number: parseInt(position.match(NOVAE.REGEX.letters).join(""))
    };

    NOVAE.ClipBoard.pasteCellsIntoSheet(position, true, object.sheet);

  };