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

    var customArray = this.getUsedCells();

    /** Abort if empty */
    if (!customArray.length) {
      CORE.Grid.updateWidth("default");
      return void 0;
    }

    /** Sort array alphabetically */
    customArray = customArray.sortOn("old");

    var ii = customArray.length;

    /** Reversed */
    while (ii--) {
      var value = customArray[ii];
      usedCells[value.new] = usedCells[value.old];
      delete usedCells[value.old];
    }

    /** Process master cells */
    customArray = this.getMasterColumns();

    /** Sort array alphabetically */
    customArray = customArray.sortOn("old");

    /** Abort if empty */
    if (!customArray.length) {
      CORE.Grid.updateWidth("default");
      return void 0;
    }

    ii = customArray.length;

    /** Reversed */
    while (ii--) {
      var value = customArray[ii];
      masterCells[value.new] = masterCells[value.old];
      delete masterCells[value.old];
    }

    CORE.Grid.updateWidth("default");

  };

  /**
   * Insert a row before another
   *
   * @method insertRow
   * @static
   */
  CORE.Injector.prototype.insertRow = function() {

    

  };