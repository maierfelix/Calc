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
  CORE.Commander.prototype.reverseSelection = function(data) {

    CORE.Sheets[CORE.CurrentSheet].Selector.select(data);

  };

  /**
   * Reverse a insertion
   *
   * @param {object} [data] Insertion data
   * @param {number} [mode] Reversed or not
   * @method reverseInsertion
   * @static
   */
  CORE.Commander.prototype.reverseInsertion = function(data, mode) {

    var sheet = data.data.sheet;

    var action = data.action;

    var selection = data.data.firstSelect;

    /** Reversed, set third argument to true to prevent circular reference */
    if (!mode) {
      switch (action) {
        case "insertColumn":
          CORE.Injector["deleteColumn"](sheet, selection, true);
          break;
        case "deleteColumn":
          CORE.Injector["insertColumn"](sheet, selection, true);
          break;
        case "insertRow":
          CORE.Injector["deleteRow"](sheet, selection, true);
          break;
        case "deleteRow":
          CORE.Injector["insertRow"](sheet, selection, true);
          break;
      }
    /** Not reversed */
    } else {
      if (CORE.Injector[action]) CORE.Injector[action](sheet, selection, true);
    }

  };

  /**
   * Reverse a resize
   *
   * @param {object} [data] Resize data
   * @method reverseResize
   * @static
   */
  CORE.Commander.prototype.reverseResize = function(data) {

    var cellSizes = CORE.Sheets[CORE.CurrentSheet].customCellSizes;

    var resizeType = isNaN(parseInt(data.name)) ? "alphabetical" : "numeric";

    if (cellSizes[resizeType][data.name]) {
      if (resizeType === "alphabetical") {
        cellSizes[resizeType][data.name].Width = data.width; 
      } else if (resizeType === "numeric") {
        cellSizes[resizeType][data.name].Height = data.height; 
      }
    }

    CORE.Sheets[CORE.CurrentSheet].updateMenu();
    CORE.Sheets[CORE.CurrentSheet].updateWidth("default");

  };

  /**
   * Reverse a background styling
   *
   * @param {object} [data] Data
   * @param {number} [mode] Reversed or not
   * @method reverseBackgroundStyling
   * @static
   */
  CORE.Commander.prototype.reverseBackgroundStyling = function(data, mode) {

    var color = null;

    if (mode) color = data.newColor || null;
    else color = data.oldColor || null;

    var selectedCells = CORE.$.coordToSelection(data.range.first, data.range.last);

    CORE.Styler.appendBackgroundStyle(color, selectedCells);

    this.executeCommand(data, mode);

  };