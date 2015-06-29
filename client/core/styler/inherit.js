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
   * Get all slave sheets
   *
   * @method getInheritSheets
   * @static
   */
  NOVAE.Styler.prototype.getSlaveSheets = function() {

    var inheritSheets = [];

    /** Collect all slave sheets */
    for (var sheet in NOVAE.Sheets) {
      if (NOVAE.Sheets.hasOwnProperty(sheet)) {
        if (!NOVAE.Sheets[sheet].isMasterSheet()) {
          inheritSheets.push(sheet);
        }
      }
    }

    return (inheritSheets);

  };

  /**
   * Inherit a styling to other sheets
   *
   * @method inheritSheetStyling
   * @static
   */
  NOVAE.Styler.prototype.inheritSheetStyling = function(type, data) {

    var dataType = typeof data;

    var selectedCells = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.SelectedCells;

    /** Sheets to inherit */
    var inheritSheets = this.getSlaveSheets();

    for (var ii = 0; ii < inheritSheets.length; ++ii) {
      if (!NOVAE.Cells.Used[inheritSheets[ii]]) {
        NOVAE.Cells.Used[inheritSheets[ii]] = {};
      }
      for (var kk = 0; kk < selectedCells.length; ++kk) {
        var letter = NOVAE.$.numberToAlpha(selectedCells[kk].letter);
        var number = selectedCells[kk].number;
        /** Register the styled cells from the master sheet to all slave sheets */
        NOVAE.$.registerCell({ letter: letter, number: number, sheet: inheritSheets[ii] });
        /** Reverse if data is a boolean */
        if (dataType === "boolean") {
          /** Reverse boolean */
          if (NOVAE.Cells.Used[inheritSheets[ii]][letter][letter + number][type]) {
            NOVAE.Cells.Used[inheritSheets[ii]][letter][letter + number][type] = false;
          } else {
            NOVAE.Cells.Used[inheritSheets[ii]][letter][letter + number][type] = true;
          }
        } else {
          /** Update slave sheets cells */
          NOVAE.Cells.Used[inheritSheets[ii]][letter][letter + number][type] = data;
        }
      }
    }

  };

  /**
   * Inherit a master styling to other sheets
   *
   * @method inheritSheetMasterStyling
   * @static
   */
  NOVAE.Styler.prototype.inheritSheetMasterStyling = function(type, data, current) {

    var dataType = typeof data;

    var selectedCells = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.SelectedCells;

    /** Sheets to inherit */
    var inheritSheets = this.getSlaveSheets();

    var masterStyleType = isNaN(parseInt(current)) ? "Columns" : "Rows";

    for (var ii = 0; ii < inheritSheets.length; ++ii) {

      /** Short syntax */
      var masterSelected = NOVAE.Sheets[inheritSheets[ii]].Selector.masterSelected;

      if (!masterSelected[masterStyleType][current]) {
        masterSelected[masterStyleType][current] = new NOVAE.Grid.Cell();
      }

      /** Reverse if data is a boolean */
      if (dataType === "boolean") {
        /** Reverse boolean */
        if (masterSelected[masterStyleType][current][type]) {
          masterSelected[masterStyleType][current][type] = false;
        } else {
          masterSelected[masterStyleType][current][type] = true;
        }
      } else {
        /** Update slave sheets cells */
        masterSelected[masterStyleType][current][type] = data;
      }
    }

  };

  /**
   * Inherit a cells content to other sheets
   *
   * @method inheritCellValue
   * @static
   */
  NOVAE.Styler.prototype.inheritCellValue = function(object) {

    /** Sheets to inherit */
    var inheritSheets = this.getSlaveSheets();

    var letter = object.letter;
    var number = object.number;
    var property = object.type;

    for (var ii = 0; ii < inheritSheets.length; ++ii) {
      if (!NOVAE.Cells.Used[inheritSheets[ii]]) {
        NOVAE.Cells.Used[inheritSheets[ii]] = {};
      }
      /** Register the styled cells from the master sheet to all slave sheets */
      NOVAE.$.registerCell({ letter: letter, number: number, sheet: inheritSheets[ii] });
      /** Update slave sheets cells */
      NOVAE.Cells.Used[inheritSheets[ii]][letter][letter + number][object.type] = object.value;
    }

  };

  /**
   * Inherit injections
   *
   * @method inheritInjection
   * @static
   */
  NOVAE.Styler.prototype.inheritInjection = function(select, type) {

    var currentSheet = NOVAE.Sheets[NOVAE.CurrentSheet];

    /** Sheets to inherit */
    var inheritSheets = this.getSlaveSheets();

    for (var ii = 0; ii < inheritSheets.length; ++ii) {
      NOVAE.Injector[type](inheritSheets[ii], currentSheet.Selector.Selected.First);
    }

  };

  /**
   * Inherit resizing
   *
   * @method inheritResize
   * @static
   */
  NOVAE.Styler.prototype.inheritResize = function(cell, amount) {

    var resizeType = isNaN(parseInt(cell)) ? "alphabetical" : "numeric";

    /** Sheets to inherit */
    var inheritSheets = this.getSlaveSheets();

    /** Column resize */
    if (resizeType === "alphabetical") {
      for (var ii = 0; ii < inheritSheets.length; ++ii) {
        if (!NOVAE.Sheets[inheritSheets[ii]].customCellSizes[resizeType][cell]) {
          NOVAE.Sheets[inheritSheets[ii]].customCellSizes[resizeType][cell] = {
            Width: 0,
            Height: 0
          };
        }
        NOVAE.Sheets[inheritSheets[ii]].customCellSizes[resizeType][cell].Width = amount;
        NOVAE.Sheets[inheritSheets[ii]].Settings.cellResizedX = amount;
        NOVAE.Sheets[inheritSheets[ii]].Input.lastAction.scrollY = false;
        NOVAE.Sheets[inheritSheets[ii]].Input.Mouse.CellResize = true;
      }
    /** Row resize */
    } else {
      for (var ii = 0; ii < inheritSheets.length; ++ii) {
        if (!NOVAE.Sheets[inheritSheets[ii]].customCellSizes[resizeType][cell]) {
          NOVAE.Sheets[inheritSheets[ii]].customCellSizes[resizeType][cell] = {
            Width: 0,
            Height: 0
          };
        }
        NOVAE.Sheets[inheritSheets[ii]].customCellSizes[resizeType][cell].Height = amount;
        NOVAE.Sheets[inheritSheets[ii]].Settings.cellResizedY = amount;
        NOVAE.Sheets[inheritSheets[ii]].customCellSizes.array.push(parseInt(cell));
        NOVAE.Sheets[inheritSheets[ii]].Input.Mouse.CellResize = true;
      }
    }

  };

  /**
   * Inherit cell deletion
   *
   * @method inheritDeleteCells
   * @static
   */
  NOVAE.Styler.prototype.inheritDeleteCells = function(cells) {

    /** Sheets to inherit */
    var inheritSheets = this.getSlaveSheets();

    for (var sheet = 0; sheet < inheritSheets.length; ++sheet) {
      for (var ii = 0; ii < cells.length; ++ii) {
        var letter = NOVAE.$.numberToAlpha(cells[ii].letter);
        var number = cells[ii].number;
        NOVAE.$.registerCell({letter: letter, number: number, sheet: inheritSheets[sheet]});
        NOVAE.Cells.Used[inheritSheets[sheet]][letter][letter + number].Content = "";
      }
    }

  };

  /**
   * Inherit cell paste
   *
   * @method inheritPasteCells
   * @static
   */
  NOVAE.Styler.prototype.inheritPasteCells = function(position, cells) {

    /** Sheets to inherit */
    var inheritSheets = this.getSlaveSheets();

    var startColumn = position.Letter;
    var startNumber = position.Number;

    for (var sheet = 0; sheet < inheritSheets.length; ++sheet) {

      var columnPadding = 0;
      var rowPadding = 0;

      var lastColumn = startColumn;
      var lastRow = startNumber;

      for (var ii = 0; ii < cells.length; ++ii) {

        if (cells[ii].number !== lastRow && ii) rowPadding++;
        if (cells[ii].letter !== lastColumn && ii) {
          columnPadding++;
          rowPadding = 0;
        }

        lastColumn = cells[ii].letter;
        lastRow = cells[ii].number;

        cells[ii].letter = cells[ii].letter + startColumn - cells[ii].letter + columnPadding;
        cells[ii].number = cells[ii].number + startNumber - cells[ii].number + rowPadding;

        var letter = NOVAE.$.numberToAlpha(cells[ii].letter);
        var number = cells[ii].number;

        NOVAE.$.registerCell({letter: letter, number: number, sheet: inheritSheets[sheet]});
        NOVAE.Cells.Used[inheritSheets[sheet]][letter][letter + number].Content = cells[ii].value;

      }

    }

  };

  /**
   * Inherit all cells content deletion
   *
   * @method inheritDeleteAllCellsContent
   * @static
   */
  NOVAE.Styler.prototype.inheritDeleteAllCellsContent = function() {

    /** Sheets to inherit */
    var inheritSheets = this.getSlaveSheets();

    for (var sheet = 0; sheet < inheritSheets.length; ++sheet) {

      var cells = NOVAE.Cells.Used[inheritSheets[sheet]];

      for (var ii in cells) {
        for (var cell in cells[ii]) {
          cells[ii][cell].Content = "";
        }
      }

    }

  };

  /**
   * Inherit content deletion of all cells inside a master selection
   *
   * @method inheritDeleteMasterSelectionContent
   * @static
   */
  NOVAE.Styler.prototype.inheritDeleteMasterSelectionContent = function(masterSelected) {

    /** Sheets to inherit */
    var inheritSheets = this.getSlaveSheets();

    for (var sheet = 0; sheet < inheritSheets.length; ++sheet) {

      var cells = NOVAE.Cells.Used[inheritSheets[sheet]];

      if (cells[masterSelected]) {
        for (var ii in cells) {
          for (var cell in cells[ii]) {
            cells[ii][cell].Content = "";
          }
        }
      }

    }

  };