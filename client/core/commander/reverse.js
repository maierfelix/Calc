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
   * Reverse a selection
   *
   * @param {object} [data] Selection data
   * @method reverseSelection
   * @static
   */
  NOVAE.Commander.prototype.reverseSelection = function(data) {

    NOVAE.Sheets[NOVAE.CurrentSheet].Selector.select(data);

  };

  /**
   * Reverse a insertion
   *
   * @param {object} [data] Insertion data
   * @param {number} [mode] Reversed or not
   * @method reverseInsertion
   * @static
   */
  NOVAE.Commander.prototype.reverseInsertion = function(data, mode) {

    var sheet = data.data.sheet;

    var action = data.action;

    var selection = data.data.firstSelect;

    /** Reversed, set third argument to true to prevent circular reference */
    if (!mode) {
      switch (action) {
        case "insertColumn":
          NOVAE.Injector["deleteColumn"](sheet, selection, true);
          break;
        case "deleteColumn":
          NOVAE.Injector["insertColumn"](sheet, selection, true);
          break;
        case "insertRow":
          NOVAE.Injector["deleteRow"](sheet, selection, true);
          break;
        case "deleteRow":
          NOVAE.Injector["insertRow"](sheet, selection, true);
          break;
      }
    /** Not reversed */
    } else {
      if (NOVAE.Injector[action]) NOVAE.Injector[action](sheet, selection, true);
    }

  };

  /**
   * Reverse a resize
   *
   * @param {object} [data] Resize data
   * @method reverseResize
   * @static
   */
  NOVAE.Commander.prototype.reverseResize = function(data) {

    var cellSizes = NOVAE.Cells.Resized[NOVAE.CurrentSheet];

    var resizeType = isNaN(parseInt(data.name)) ? "Columns" : "Rows";

    if (cellSizes[resizeType][data.name]) {
      if (resizeType === "Columns") {
        cellSizes[resizeType][data.name].Width = data.width;
      } else if (resizeType === "Rows") {
        cellSizes[resizeType][data.name].Height = data.height;
      }
    }

    NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
    NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("default");

  };

  /**
   * Reverse a background styling
   *
   * @param {object} [data] Data
   * @param {number} [mode] Reversed or not
   * @method reverseBackgroundStyling
   * @static
   */
  NOVAE.Commander.prototype.reverseBackgroundStyling = function(data, mode) {

    var color = null;

    if (mode) color = data.newColor || null;
    else color = data.oldColor || null;

    var selectedCells = NOVAE.$.coordToSelection(data.range.first, data.range.last);

    NOVAE.Styler.appendBackgroundStyle(color, selectedCells);

    this.executeCommand(data, mode);

  };