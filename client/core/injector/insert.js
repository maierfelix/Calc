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

    var sheet = arguments[0] || CORE.CurrentSheet;

    var firstSelectedCell = arguments[1] || CORE.Sheets[sheet].Selector.Selected.First;

    var usedCells = CORE.Cells.Used[sheet];

    var masterCells = CORE.Sheets[sheet].Selector.masterSelected.Columns;

    /** Process master cells */
    var customArray = this.getAlphaMasterColumns("insert", sheet, firstSelectedCell);

    /** Sort array alphabetically */
    customArray = customArray.sortOn("old");

    var ii = customArray.length;

    /** Reversed */
    while (ii--) {
      var value = customArray[ii];
      masterCells[value.new] = masterCells[value.old];
      delete masterCells[value.old];
    }

    customArray = this.getAlphaUsedCells("insert", sheet, firstSelectedCell);

    /** Sort array alphabetically */
    customArray = customArray.sortOn("old");

    ii = customArray.length;

    /** Reversed */
    while (ii--) {
      var value = customArray[ii];
      usedCells[value.new] = usedCells[value.old];
      delete usedCells[value.old];
    }

    if (!arguments.length && CORE.Sheets[CORE.CurrentSheet].isMasterSheet()) {
      CORE.Styler.inheritInjection(CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First, "insertColumn");
    }

    /** Refresh the grid */
    CORE.Sheets[sheet].updateWidth("default");

    /** Dont loose selection */
    CORE.Sheets[sheet].Selector.getSelection();

  };

  /**
   * Insert a row before another
   *
   * @method insertRow
   * @static
   */
  CORE.Injector.prototype.insertRow = function() {

    var sheet = arguments[0] || CORE.CurrentSheet;

    var firstSelectedCell = arguments[1] || CORE.Sheets[sheet].Selector.Selected.First;

    var usedCells = CORE.Cells.Used[sheet];

    var masterCells = CORE.Sheets[sheet].Selector.masterSelected.Rows;

    var ii = 0;

    /** Process master cells */
    var customArray = this.getNumericMasterRows("insert", sheet, firstSelectedCell);

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
    customArray = this.getNumericUsedCells("insert", sheet, firstSelectedCell);

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

    if (!arguments.length && CORE.Sheets[CORE.CurrentSheet].isMasterSheet()) {
      CORE.Styler.inheritInjection(CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First, "insertRow");
    }

    /** Refresh the grid */
    CORE.Sheets[sheet].updateWidth("default");

    /** Dont loose selection */
    CORE.Sheets[sheet].Selector.getSelection();

  };