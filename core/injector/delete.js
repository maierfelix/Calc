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

    var usedCells = CORE.Cells.Used[CORE.CurrentSheet];

    var masterCells = CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Columns;

    /** Currently selected column */
    var selectedCell = CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First;

    /** Process master cells */
    var customArray = this.getAlphaMasterColumns("delete");

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
    customArray = this.getAlphaUsedCells("delete");

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

    /** Refresh the grid */
    CORE.Sheets[CORE.CurrentSheet].updateWidth("default");

    /** Dont loose selection */
    CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();

  };

  /**
   * Delete a specific row
   *
   * @method deleteRow
   * @static
   */
  CORE.Injector.prototype.deleteRow = function() {

    var usedCells = CORE.Cells.Used[CORE.CurrentSheet];

    var masterCells = CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Rows;

    /** Currently selected row */
    var selectedCell = CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First.Number;

    /** Process master cells */
    var customArray = this.getNumericMasterRows("delete");

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
    customArray = this.getNumericUsedCells("delete");

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

    /** Refresh the grid */
    CORE.Sheets[CORE.CurrentSheet].updateWidth("default");

    /** Dont loose selection */
    CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();

  };