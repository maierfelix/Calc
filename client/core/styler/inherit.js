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
   * Inherit a cells content to other sheets
   *
   * @method inheritCellValue
   * @static
   */
  CORE.Styler.prototype.inheritCellValue = function(object) {

    var currentSheet = CORE.Sheets[CORE.CurrentSheet];
    var selectedCells = currentSheet.Selector.SelectedCells;

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