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
    var firstSelectedCell = arguments[1] || CORE.Sheets[sheet].Selector.Selected.First;

    /** Process master columns */
    this.deleteColumn_MasterColumns(sheet, firstSelectedCell);

    /** Process columns */
    this.deleteColumn_Columns(sheet, firstSelectedCell);

    /** Process cells */
    this.deleteColumn_Cells(sheet, firstSelectedCell);

    if (!arguments.length && CORE.Sheets[CORE.CurrentSheet].isMasterSheet()) {
      CORE.Styler.inheritInjection(CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First, "deleteColumn");
    }

    /** Push change into undo stack */
    var command = CORE.newCommand();
        command.caller = "Injector";
        command.action = "deleteColumn";
        command.data = {
          firstSelect: firstSelectedCell,
          sheet: sheet
        };

    /** Push command into the commander stack only if arguments[2] isnt true */
    if (!arguments[2]) CORE.Sheets[sheet].Commander.pushUndoCommand(command, true);

    /** Refresh the grid */
    CORE.Event.redraw(sheet);

    /** Dont loose selection */
    CORE.Sheets[sheet].Selector.getSelection();

  };

  /**
   * Process master columns
   *
   * @method deleteColumn_MasterColumns
   * @static
   */
  CORE.Injector.prototype.deleteColumn_MasterColumns = function(sheet, firstSelected) {

    var masterCells = CORE.Sheets[sheet].Selector.masterSelected.Columns;

    /** Process master cells */
    var customArray = this.getAlphaMasterColumns("delete", sheet, firstSelected);

    /** Sort array alphabetically */
    customArray = customArray.sortOn("old");

    /** Not reversed! */
    for (var ii = 0; ii < customArray.length; ++ii) {
      var value = customArray[ii];
      /** Selection matches the master cell, simply delete it */
      if (CORE.$.alphaToNumber(value.new) < firstSelected.Letter) {
        delete masterCells[value.old];
      } else {
        masterCells[value.new] = masterCells[value.old];
        delete masterCells[value.old];
      }
    }

  };

  /**
   * Process columns
   *
   * @method deleteColumn_Columns
   * @static
   */
  CORE.Injector.prototype.deleteColumn_Columns = function(sheet, firstSelected) {

    var customizedCells = CORE.Sheets[sheet].customCellSizes.alphabetical;

    /** Process master cells */
    var customArray = this.getAlphaCustomizedCells("delete", sheet, firstSelected);

    /** Sort array alphabetically */
    customArray = customArray.sortOn("old");

    /** Not reversed! */
    for (var ii = 0; ii < customArray.length; ++ii) {
      var value = customArray[ii];
      /** Selection matches the master cell, simply delete it */
      if (CORE.$.alphaToNumber(value.new) < firstSelected.Letter) {
        delete customizedCells[value.old];
      } else {
        customizedCells[value.new] = customizedCells[value.old];
        delete customizedCells[value.old];
      }
    }

  };

  /**
   * Process cells
   *
   * @method deleteColumn_Cells
   * @static
   */
  CORE.Injector.prototype.deleteColumn_Cells = function(sheet, firstSelected) {

    var usedCells = CORE.Cells.Used[sheet];

    /** Process master cells */
    var customArray = this.getAlphaUsedCells("delete", sheet, firstSelected);

    /** Sort array alphabetically */
    customArray = customArray.sortOn("old");

    /** Not reversed! */
    for (var ii = 0; ii < customArray.length; ++ii) {
      var value = customArray[ii];
      /** Selection matches the cell, simply delete it */
      if (CORE.$.alphaToNumber(value.new) < firstSelected.Letter) {
        delete usedCells[value.old];
      } else {
        usedCells[value.new] = usedCells[value.old];
        delete usedCells[value.old];
      }
    }

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
    var firstSelectedCell = arguments[1] || CORE.Sheets[sheet].Selector.Selected.First;

    /** Process master columns */
    this.deleteRow_MasterRows(sheet, firstSelectedCell);

    /** Process rows */
    this.deleteRow_Rows(sheet, firstSelectedCell);

    /** Process cells */
    this.deleteRow_Cells(sheet, firstSelectedCell);

    if (!arguments.length && CORE.Sheets[CORE.CurrentSheet].isMasterSheet()) {
      CORE.Styler.inheritInjection(CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First, "deleteRow");
    }

    /** Push change into undo stack */
    var command = CORE.newCommand();
        command.caller = "Injector";
        command.action = "deleteRow";
        command.data = {
          firstSelect: firstSelectedCell,
          sheet: sheet
        };

    /** Push command into the commander stack only if arguments[2] isnt true */
    if (!arguments[2]) CORE.Sheets[sheet].Commander.pushUndoCommand(command, true);

    /** Refresh the grid */
    CORE.Event.redraw(sheet);

    /** Dont loose selection */
    CORE.Sheets[sheet].Selector.getSelection();

  };

  /**
   * Process master rows
   *
   * @method deleteRow_MasterRows
   * @static
   */
  CORE.Injector.prototype.deleteRow_MasterRows = function(sheet, firstSelected) {

    var masterCells = CORE.Sheets[sheet].Selector.masterSelected.Rows;

    /** Process master cells */
    var customArray = this.getNumericMasterRows("delete", sheet, firstSelected);

    /** Sort array numeric ascending */
    customArray = customArray.sortOn("old");

    /** Not reversed! */
    for (var ii = 0; ii < customArray.length; ++ii) {
      var value = customArray[ii];
      /** Selection matches the master cell, simply delete it */
      if (value.new < firstSelected) {
        delete masterCells[value.old];
      } else {
        masterCells[value.new] = masterCells[value.old];
        delete masterCells[value.old];
      }
    }

  };

  /**
   * Process rows
   *
   * @method deleteRow_Rows
   * @static
   */
  CORE.Injector.prototype.deleteRow_Rows = function(sheet, firstSelected) {

    var customizedCells = CORE.Sheets[sheet].customCellSizes.numeric;

    /** Process master cells */
    var customArray = this.getNumericCustomizedCells("delete", sheet, firstSelected);

    /** Sort array numeric ascending */
    customArray = customArray.sortOn("old");

    /** Not reversed! */
    for (var ii = 0; ii < customArray.length; ++ii) {
      var value = customArray[ii];
      /** Selection matches the master cell, simply delete it */
      if (value.new < firstSelected) {
        delete customizedCells[value.old];
      } else {
        customizedCells[value.new] = customizedCells[value.old];
        delete customizedCells[value.old];
      }
    }

  };

  /**
   * Process cells
   *
   * @method deleteRow_Cells
   * @static
   */
  CORE.Injector.prototype.deleteRow_Cells = function(sheet, firstSelected) {

    var usedCells = CORE.Cells.Used[sheet];

    /** ## Cell Section ## */
    var customArray = this.getNumericUsedCells("delete", sheet, firstSelected);

    /** Sort array numeric ascending */
    customArray = customArray.sortOn("old");

    /** Not reversed! */
    for (var ii = 0; ii < customArray.length; ++ii) {
      var value = customArray[ii];
      /** Selection matches the cell, simply delete it */
      if (value.new < firstSelected) {
        delete usedCells[value.letter][value.letter + value.old];
      } else {
        usedCells[value.letter][value.letter + value.new] = usedCells[value.letter][value.letter + value.old];
        delete usedCells[value.letter][value.letter + value.old];
      }
    }

  };