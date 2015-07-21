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
  NOVAE.Injector.prototype.insertColumn = function() {

    var sheet = arguments[0] || NOVAE.CurrentSheet;

    var firstSelectedCell = arguments[1] || NOVAE.Sheets[sheet].Selector.Selected.First;

    /** Process master columns */
    this.insertColumn_MasterColumns(sheet, firstSelectedCell);

    /** Process columns */
    this.insertColumn_Columns(sheet, firstSelectedCell);

    /** Process cells */
    this.insertColumn_Cells(sheet, firstSelectedCell);

    if (!arguments.length && NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
      NOVAE.Styler.inheritInjection(NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First, "insertColumn");
    }

    /** Push change into undo stack */
    var command = NOVAE.newCommand();
        command.caller = "Injector";
        command.action = "insertColumn";
        command.data = {
          firstSelect: firstSelectedCell,
          sheet: sheet
        };

    /** Push command into the commander stack only if arguments[2] isnt true */
    if (!arguments[2]) NOVAE.Sheets[sheet].Commander.pushUndoCommand(command, true);

    /** Refresh the grid */
    NOVAE.Event.redraw(sheet);

    /** Dont loose selection */
    NOVAE.Sheets[sheet].Selector.getSelection();

    /** Recalc everything */
    NOVAE.eval();

  };

  /**
   * Process master columns
   *
   * @method insertColumn_MasterColumns
   * @static
   */
  NOVAE.Injector.prototype.insertColumn_MasterColumns = function(sheet, firstSelected) {

    /** ### Master columns ### */
    var masterCells = NOVAE.Cells.Master[sheet].Columns;

    /** Process master cells */
    var customArray = this.getAlphaMasterColumns("insert", sheet, firstSelected);

    /** Sort array alphabetically */
    customArray = customArray.sortOn("old");

    var ii = customArray.length;

    /** Reversed */
    while (ii--) {
      var value = customArray[ii];
      masterCells[value.new] = masterCells[value.old];
      delete masterCells[value.old];
    }

  };

  /**
   * Process columns
   *
   * @method insertColumn_Columns
   * @static
   */
  NOVAE.Injector.prototype.insertColumn_Columns = function(sheet, firstSelected) {

    /** ### Resized Columns ### */
    var customizedCells = NOVAE.Cells.Resized[sheet].Columns;

    var customArray = this.getAlphaCustomizedCells("insert", sheet, firstSelected);

    /** Sort array alphabetically */
    customArray = customArray.sortOn("old");

    var ii = customArray.length;

    /** Reversed */
    while (ii--) {
      var value = customArray[ii];
      customizedCells[value.new] = customizedCells[value.old];
      delete customizedCells[value.old];
    }

  };

  /**
   * Process column cells
   *
   * @method insertColumn_Cells
   * @static
   */
  NOVAE.Injector.prototype.insertColumn_Cells = function(sheet, firstSelected) {

    var usedCells = NOVAE.Cells.Used[sheet];

    /** ### Cells ### */
    var customArray = this.getAlphaUsedCells("insert", sheet, firstSelected);

    /** Sort array alphabetically */
    customArray = customArray.sortOn("old");

    var ii = customArray.length;

    /** Reversed */
    while (ii--) {
      var value = customArray[ii];
      usedCells[value.new] = usedCells[value.old];
      delete usedCells[value.old];
    }

  };

  /**
   * Insert a row before another
   *
   * @method insertRow
   * @static
   */
  NOVAE.Injector.prototype.insertRow = function() {

    var sheet = arguments[0] || NOVAE.CurrentSheet;

    var firstSelectedCell = arguments[1] || NOVAE.Sheets[sheet].Selector.Selected.First;

    /** Process master rows */
    this.insertRow_MasterRows(sheet, firstSelectedCell);

    /** Process rows */
    this.insertRow_Rows(sheet, firstSelectedCell);

    /** Process cells */
    this.insertRow_Cells(sheet, firstSelectedCell);

    if (!arguments.length && NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
      NOVAE.Styler.inheritInjection(NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First, "insertRow");
    }

    /** Push change into undo stack */
    var command = NOVAE.newCommand();
        command.caller = "Injector";
        command.action = "insertRow";
        command.data = {
          firstSelect: firstSelectedCell,
          sheet: sheet
        };

    /** Push command into the commander stack only if arguments[2] isnt true */
    if (!arguments[2]) NOVAE.Sheets[sheet].Commander.pushUndoCommand(command, true);

    /** Refresh the grid */
    NOVAE.Event.redraw(sheet);

    /** Dont loose selection */
    NOVAE.Sheets[sheet].Selector.getSelection();

    /** Recalc everything */
    NOVAE.eval();

  };

  /**
   * Process master rows
   *
   * @method insertRow_MasterRows
   * @static
   */
  NOVAE.Injector.prototype.insertRow_MasterRows = function(sheet, firstSelected) {

    /** Process master cells */
    var customArray = this.getNumericMasterRows("insert", sheet, firstSelected);

    var masterCells = NOVAE.Cells.Master[sheet].Rows;

    /** Sort array by numbers ascending */
    customArray = customArray.sortOn("old");

    var ii = customArray.length;

    /** Reversed */
    while (ii--) {
      var value = customArray[ii];
      masterCells[value.new] = masterCells[value.old];
      delete masterCells[value.old];
    }

  };

  /**
   * Process rows
   *
   * @method insertRow_Rows
   * @static
   */
  NOVAE.Injector.prototype.insertRow_Rows = function(sheet, firstSelected) {

    var Cells = NOVAE.Cells.Resized[sheet].Rows;

    /** ## Cell Section ## */
    var customArray = this.getNumericCustomizedCells("insert", sheet, firstSelected);

    /** Sort array by numbers ascending */
    customArray = customArray.sortOn("old");

    var ii = customArray.length;

    /** Reversed */
    while (ii--) {
      var value = customArray[ii];
      Cells[value.new] = Cells[value.old];
      delete Cells[value.old];
    }

  };

  /**
   * Process row cells
   *
   * @method insertRow_Cells
   * @static
   */
  NOVAE.Injector.prototype.insertRow_Cells = function(sheet, firstSelected) {

    var usedCells = NOVAE.Cells.Used[sheet];

    /** ## Cell Section ## */
    var customArray = this.getNumericUsedCells("insert", sheet, firstSelected);

    /** Sort array by numbers ascending */
    customArray = customArray.sortOn("old");

    var ii = customArray.length;

    /** Reversed */
    while (ii--) {
      var value = customArray[ii];
      var oldCell = value.letter + value.old;
      usedCells[value.letter][value.letter + value.new] = usedCells[value.letter][oldCell];
      delete usedCells[value.letter][oldCell];
    }

  };