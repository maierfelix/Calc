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
   * Inherit a styling to other sheets
   *
   * @method inheritSheetStyling
   * @static
   */
  CORE.Styler.prototype.inheritSheetStyling = function(type, data) {

    var dataType = typeof data;

    var selectedCells = CORE.Sheets[CORE.CurrentSheet].Selector.SelectedCells;

    /** Sheets to inherit */
    var inheritSheets = [];

    /** Collect all slave sheets */
    for (var sheet in CORE.Sheets) {
      if (CORE.Sheets.hasOwnProperty(sheet)) {
        if (!CORE.Sheets[sheet].isMasterSheet()) {
          inheritSheets.push(sheet);
        }
      }
    }

    for (var ii = 0; ii < inheritSheets.length; ++ii) {
      if (!CORE.Cells.Used[inheritSheets[ii]]) {
        CORE.Cells.Used[inheritSheets[ii]] = {};
      }
      for (var kk = 0; kk < selectedCells.length; ++kk) {
        var letter = CORE.$.numberToAlpha(selectedCells[kk].letter);
        var number = selectedCells[kk].number;
        /** Register the styled cells from the master sheet to all slave sheets */
        CORE.$.registerCell({ letter: letter, number: number, sheet: inheritSheets[ii] });
        /** Reverse if data is a boolean */
        if (dataType === "boolean") {
          /** Reverse boolean */
          if (CORE.Cells.Used[inheritSheets[ii]][letter][letter + number][type]) {
            CORE.Cells.Used[inheritSheets[ii]][letter][letter + number][type] = false;
          } else {
            CORE.Cells.Used[inheritSheets[ii]][letter][letter + number][type] = true;
          }
        } else {
          /** Update slave sheets cells */
          CORE.Cells.Used[inheritSheets[ii]][letter][letter + number][type] = data;
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
  CORE.Styler.prototype.inheritSheetMasterStyling = function(type, data, current) {

    var dataType = typeof data;

    var selectedCells = CORE.Sheets[CORE.CurrentSheet].Selector.SelectedCells;

    /** Sheets to inherit */
    var inheritSheets = [];

    /** Collect all slave sheets */
    for (var sheet in CORE.Sheets) {
      if (CORE.Sheets.hasOwnProperty(sheet)) {
        if (!CORE.Sheets[sheet].isMasterSheet()) {
          inheritSheets.push(sheet);
        }
      }
    }

    var masterStyleType = isNaN(parseInt(current)) ? "Columns" : "Rows";

    for (var ii = 0; ii < inheritSheets.length; ++ii) {

      /** Short syntax */
      var masterSelected = CORE.Sheets[inheritSheets[ii]].Selector.masterSelected;

      if (!masterSelected[masterStyleType][current]) {
        masterSelected[masterStyleType][current] = new CORE.Grid.Cell();
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
  CORE.Styler.prototype.inheritCellValue = function(object) {

    /** Sheets to inherit */
    var inheritSheets = [];

    /** Collect all slave sheets */
    for (var sheet in CORE.Sheets) {
      if (CORE.Sheets.hasOwnProperty(sheet)) {
        if (!CORE.Sheets[sheet].isMasterSheet()) {
          inheritSheets.push(sheet);
        }
      }
    }

    var letter = object.letter;
    var number = object.number;
    var property = object.type;

    for (var ii = 0; ii < inheritSheets.length; ++ii) {
      if (!CORE.Cells.Used[inheritSheets[ii]]) {
        CORE.Cells.Used[inheritSheets[ii]] = {};
      }
      /** Register the styled cells from the master sheet to all slave sheets */
      CORE.$.registerCell({ letter: letter, number: number, sheet: inheritSheets[ii] });
      /** Update slave sheets cells */
      CORE.Cells.Used[inheritSheets[ii]][letter][letter + number][object.type] = object.value;
    }

  };

  /**
   * Inherit injections
   *
   * @method inheritInjection
   * @static
   */
  CORE.Styler.prototype.inheritInjection = function(select, type) {

    var currentSheet = CORE.Sheets[CORE.CurrentSheet];

    /** Sheets to inherit */
    var inheritSheets = [];

    /** Collect all slave sheets */
    for (var sheet in CORE.Sheets) {
      if (CORE.Sheets.hasOwnProperty(sheet)) {
        if (!CORE.Sheets[sheet].isMasterSheet()) {
          inheritSheets.push(sheet);
        }
      }
    }

    for (var ii = 0; ii < inheritSheets.length; ++ii) {
      CORE.Injector[type](inheritSheets[ii], currentSheet.Selector.Selected.First);
    }

  };

  /**
   * Inherit resizing
   *
   * @method inheritResize
   * @static
   */
  CORE.Styler.prototype.inheritResize = function(cell, amount) {

    var resizeType = isNaN(parseInt(cell)) ? "alphabetical" : "numeric";

    var currentSheet = CORE.Sheets[CORE.CurrentSheet];

    /** Sheets to inherit */
    var inheritSheets = [];

    /** Collect all slave sheets */
    for (var sheet in CORE.Sheets) {
      if (CORE.Sheets.hasOwnProperty(sheet)) {
        if (!CORE.Sheets[sheet].isMasterSheet()) {
          inheritSheets.push(sheet);
        }
      }
    }

    /** Column resize */
    if (resizeType === "alphabetical") {
      for (var ii = 0; ii < inheritSheets.length; ++ii) {
        if (!CORE.Sheets[inheritSheets[ii]].customCellSizes[resizeType][cell]) {
          CORE.Sheets[inheritSheets[ii]].customCellSizes[resizeType][cell] = {
            Width: 0,
            Height: 0
          };
        }
        CORE.Sheets[inheritSheets[ii]].customCellSizes[resizeType][cell].Width = amount;
        CORE.Sheets[inheritSheets[ii]].Settings.cellResizedX = amount;
        CORE.Sheets[inheritSheets[ii]].Input.lastAction.scrollY = false;
        CORE.Sheets[inheritSheets[ii]].Input.Mouse.CellResize = true;
      }
    /** Row resize */
    } else {
      for (var ii = 0; ii < inheritSheets.length; ++ii) {
        if (!CORE.Sheets[inheritSheets[ii]].customCellSizes[resizeType][cell]) {
          CORE.Sheets[inheritSheets[ii]].customCellSizes[resizeType][cell] = {
            Width: 0,
            Height: 0
          };
        }
        CORE.Sheets[inheritSheets[ii]].customCellSizes[resizeType][cell].Height = amount;
        CORE.Sheets[inheritSheets[ii]].Settings.cellResizedY = amount;
        CORE.Sheets[inheritSheets[ii]].customCellSizes.array.push(parseInt(cell));
        CORE.Sheets[inheritSheets[ii]].Input.Mouse.CellResize = true;
      }
    }

  };