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
   * Insert a column before another
   *
   * @method insertColumn
   * @static
   */
  CORE.Injector.prototype.insertColumn = function() {

    var usedCells = CORE.Cells.Used[CORE.CurrentSheet];

    var masterCells = CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Columns;

    /** Process master cells */
    var customArray = this.getAlphaMasterColumns("insert");

    /** Sort array alphabetically */
    customArray = customArray.sortOn("old");

    var ii = customArray.length;

    /** Reversed */
    while (ii--) {
      var value = customArray[ii];
      masterCells[value.new] = masterCells[value.old];
      delete masterCells[value.old];
    }

    customArray = this.getAlphaUsedCells("insert");

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
    CORE.Sheets[CORE.CurrentSheet].updateWidth("default");

    /** Dont loose selection */
    CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();

  };

  /**
   * Insert a row before another
   *
   * @method insertRow
   * @static
   */
  CORE.Injector.prototype.insertRow = function() {

    var usedCells = CORE.Cells.Used[CORE.CurrentSheet];

    var masterCells = CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Rows;

    var ii = 0;

    /** Process master cells */
    var customArray = this.getNumericMasterRows("insert");

    /** Sort array by numbers ascending */
    customArray = customArray.sortOn("old");

    ii = customArray.length;

    /** Reversed */
    while (ii--) {
      var value = customArray[ii];
      masterCells[value.new] = masterCells[value.old];
      delete masterCells[value.old];
    }

    /** ## Cell Section ## */
    customArray = this.getNumericUsedCells("insert");

    /** Sort array by numbers ascending */
    customArray = customArray.sortOn("old");

    ii = customArray.length;

    /** Reversed */
    while (ii--) {
      var value = customArray[ii];
      var oldCell = value.letter + value.old;
      usedCells[value.letter][value.letter + value.new] = usedCells[value.letter][oldCell];
      delete usedCells[value.letter][oldCell];
    }

    /** Refresh the grid */
    CORE.Sheets[CORE.CurrentSheet].updateWidth("default");

    /** Dont loose selection */
    CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();

  };