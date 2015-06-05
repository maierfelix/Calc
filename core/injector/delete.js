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
   * Delete a specific column
   *
   * @method deleteColumn
   * @static
   */
  CORE.Injector.prototype.deleteColumn = function() {

    var usedCells = CORE.Cells.Used;

    var masterCells = CORE.Selector.masterSelected.Columns;

    /** Currently selected column */
    var selectedCell = CORE.Cells.Selected.First;

    /** Process master cells */
    var customArray = this.getMasterColumns("delete");

    /** Sort array alphabetically */
    customArray = customArray.sortOn("old");

    /** Not reversed! */
    for (var ii = 0; ii < customArray.length; ++ii) {
      var value = customArray[ii];
      masterCells[value.new] = masterCells[value.old];
      delete masterCells[value.old];
    }

    /** Process master cells */
    customArray = this.getUsedCells("delete");

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
    CORE.Grid.updateWidth("default");

    /** Dont loose selection */
    CORE.Selector.getSelection();

  };

  /**
   * Delete a specific row
   *
   * @method deleteRow
   * @static
   */
  CORE.Injector.prototype.deleteRow = function() {

    

  };