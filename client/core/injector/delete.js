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
   * Delete a specific column
   *
   * @method deleteColumn
   * @static
   */
  CORE.Injector.prototype.deleteColumn = function() {

    var sheet = arguments[0] || CORE.CurrentSheet;

    /** Currently selected column */
    var selectedCell = arguments[1] || CORE.Sheets[sheet].Selector.Selected.First;

    var usedCells = CORE.Cells.Used[sheet];

    var masterCells = CORE.Sheets[sheet].Selector.masterSelected.Columns;

    /** Process master cells */
    var customArray = this.getAlphaMasterColumns("delete", sheet, selectedCell);

    /** Sort array alphabetically */
    customArray = customArray.sortOn("old");

    /** Not reversed! */
    for (var ii = 0; ii < customArray.length; ++ii) {
      var value = customArray[ii];
      /** Selection matches the master cell, simply delete it */
      if (CORE.$.alphaToNumber(value.new) < selectedCell.Letter) {
        delete masterCells[value.old];
      } else {
        masterCells[value.new] = masterCells[value.old];
        delete masterCells[value.old];
      }
    }

    /** Process master cells */
    customArray = this.getAlphaUsedCells("delete", sheet, selectedCell);

    /** Sort array alphabetically */
    customArray = customArray.sortOn("old");

    /** Not reversed! */
    for (var ii = 0; ii < customArray.length; ++ii) {
      var value = customArray[ii];
      /** Selection matches the cell, simply delete it */
      if (CORE.$.alphaToNumber(value.new) < selectedCell.Letter) {
        delete usedCells[value.old];
      } else {
        usedCells[value.new] = usedCells[value.old];
        delete usedCells[value.old];
      }
    }

    if (!arguments.length && CORE.Sheets[CORE.CurrentSheet].isMasterSheet()) {
      CORE.Styler.inheritInjection(CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First, "deleteColumn");
    }

    /** Refresh the grid */
    CORE.Sheets[sheet].updateWidth("default");

    /** Dont loose selection */
    CORE.Sheets[sheet].Selector.getSelection();

  };

  /**
   * Delete a specific row
   *
   * @method deleteRow
   * @static
   */
  CORE.Injector.prototype.deleteRow = function() {

    var sheet = arguments[0] || CORE.CurrentSheet;

    /** Currently selected row */
    var selectedCell = arguments[1] || CORE.Sheets[sheet].Selector.Selected.First;

    var usedCells = CORE.Cells.Used[sheet];

    var masterCells = CORE.Sheets[sheet].Selector.masterSelected.Rows;

    /** Process master cells */
    var customArray = this.getNumericMasterRows("delete", sheet, selectedCell);

    /** Sort array numeric ascending */
    customArray = customArray.sortOn("old");

    /** Not reversed! */
    for (var ii = 0; ii < customArray.length; ++ii) {
      var value = customArray[ii];
      /** Selection matches the master cell, simply delete it */
      if (value.new < selectedCell) {
        delete masterCells[value.old];
      } else {
        masterCells[value.new] = masterCells[value.old];
        delete masterCells[value.old];
      }
    }

    /** ## Cell Section ## */
    customArray = this.getNumericUsedCells("delete", sheet, selectedCell);

    /** Sort array numeric ascending */
    customArray = customArray.sortOn("old");

    /** Not reversed! */
    for (var ii = 0; ii < customArray.length; ++ii) {
      var value = customArray[ii];
      /** Selection matches the cell, simply delete it */
      if (value.new < selectedCell) {
        delete usedCells[value.letter][value.letter + value.old];
      } else {
        usedCells[value.letter][value.letter + value.new] = usedCells[value.letter][value.letter + value.old];
        delete usedCells[value.letter][value.letter + value.old];
      }
    }

    if (!arguments.length && CORE.Sheets[CORE.CurrentSheet].isMasterSheet()) {
      CORE.Styler.inheritInjection(CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First, "deleteRow");
    }

    /** Refresh the grid */
    CORE.Sheets[sheet].updateWidth("default");

    /** Dont loose selection */
    CORE.Sheets[sheet].Selector.getSelection();

  };