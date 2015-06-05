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
   * Insert a column before another
   *
   * @method insertColumn
   * @static
   */
  CORE.Injector.prototype.insertColumn = function() {

    var usedCells = CORE.Cells.Used;

    var masterCells = CORE.Selector.masterSelected.Columns;

    /** Process master cells */
    var customArray = this.getMasterColumns("insert");

    /** Sort array alphabetically */
    customArray = customArray.sortOn("old");

    var ii = customArray.length;

    /** Reversed */
    while (ii--) {
      var value = customArray[ii];
      masterCells[value.new] = masterCells[value.old];
      delete masterCells[value.old];
    }

    customArray = this.getUsedCells("insert");

    /** Sort array alphabetically */
    customArray = customArray.sortOn("old");

    ii = customArray.length;

    /** Reversed */
    while (ii--) {
      var value = customArray[ii];
      usedCells[value.new] = usedCells[value.old];
      delete usedCells[value.old];
    }

    /** Refresh the grid */
    CORE.Grid.updateWidth("default");

    /** Dont loose selection */
    CORE.Selector.getSelection();

  };

  /**
   * Insert a row before another
   *
   * @method insertRow
   * @static
   */
  CORE.Injector.prototype.insertRow = function() {

    

  };