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
   * The Injector
   *
   * @class Injector
   * @static
   */
  NOVAE.Injector = function() {};

  NOVAE.Injector.prototype = NOVAE.Injector;
  NOVAE.Injector.prototype.constructor = NOVAE.Injector;

  /**
   * Process used cells (alphabetical)
   *
   * @method getAlphaUsedCells
   * @static
   */
  NOVAE.Injector.prototype.getAlphaUsedCells = function(mode, sheet, selected) {

    var selectedCell = null;

    if (selected && typeof selected === "object") {
      selectedCell = selected;
    } else selectedCell = NOVAE.Sheets[sheet].Selector.Selected.First;

    var usedCells = NOVAE.Cells.Used[sheet];

    var cellLetter;
    var cellNumber;

    var customArray = [];

    /** Move everything behind this letter 1 right */
    for (var ii in usedCells) {

      /** Get each letter behind */
      if (usedCells[ii] && NOVAE.$.alphaToNumber(ii) >= selectedCell.Letter) {

        /** Go through each cell */
        for (var cell in usedCells[ii]) {

          switch (mode) {
            case "insert":
              cellLetter = NOVAE.$.numberToAlpha(NOVAE.$.alphaToNumber(cell.match(NOVAE.REGEX.numbers).join("")) + 1);
              break;
            case "delete":
              cellLetter = NOVAE.$.numberToAlpha(NOVAE.$.alphaToNumber(cell.match(NOVAE.REGEX.numbers).join("")) - 1);
              break;
          }

          cellNumber = ~~(cell.match(NOVAE.REGEX.letters).join(""));
          usedCells[ii][cellLetter + cellNumber] = usedCells[ii][cell];
          delete usedCells[ii][cell];
        }

        customArray.push({ old: ii, new: cellLetter });

      }

    }

    return(customArray);

  };

  /**
   * Process master cells (alphabetical)
   *
   * @method getAlphaMasterColumns
   * @static
   */
  NOVAE.Injector.prototype.getAlphaMasterColumns = function(mode, sheet, selected) {

    var selectedCell = null;

    if (selected && typeof selected === "object") {
      selectedCell = selected;
    } else selectedCell = NOVAE.Sheets[sheet].Selector.Selected.First;

    var masterCells = NOVAE.Sheets[sheet].Selector.masterSelected.Columns;

    var customArray = [];

    /** Move everything behind this letter 1 right */
    for (var ii in masterCells) {

      /** Get each letter behind */
      if (masterCells[ii] && NOVAE.$.alphaToNumber(ii) >= selectedCell.Letter) {
        switch (mode) {
          case "insert":
            customArray.push({ old: ii, new: (NOVAE.$.numberToAlpha(NOVAE.$.alphaToNumber(ii) + 1)) });
            break;
          case "delete":
            customArray.push({ old: ii, new: (NOVAE.$.numberToAlpha(NOVAE.$.alphaToNumber(ii) - 1)) });
            break;
        }
      }

    }

    return(customArray);

  };

  /**
   * Process customized cells (alphabetical)
   *
   * @method getAlphaCustomizedCells
   * @static
   */
  NOVAE.Injector.prototype.getAlphaCustomizedCells = function(mode, sheet, selected) {

    var selectedCell = null;

    if (selected && typeof selected === "object") {
      selectedCell = selected;
    } else selectedCell = NOVAE.Sheets[sheet].Selector.Selected.First;

    var Cells = NOVAE.Cells.Resized[sheet].Columns;

    var customArray = [];

    /** Move everything behind this letter 1 right */
    for (var ii in Cells) {

      /** Get each letter behind */
      if (Cells[ii] && NOVAE.$.alphaToNumber(ii) >= selectedCell.Letter) {
        switch (mode) {
          case "insert":
            customArray.push({ old: ii, new: (NOVAE.$.numberToAlpha(NOVAE.$.alphaToNumber(ii) + 1)) });
            break;
          case "delete":
            customArray.push({ old: ii, new: (NOVAE.$.numberToAlpha(NOVAE.$.alphaToNumber(ii) - 1)) });
            break;
        }
      }

    }

    return(customArray);

  };

  /**
   * Process used cells (numeric)
   *
   * @method getNumericUsedCells
   * @static
   */
  NOVAE.Injector.prototype.getNumericUsedCells = function(mode, sheet, selected) {

    var selectedCell = null;

    if (selected && typeof selected === "object") {
      selectedCell = selected;
    } else selectedCell = NOVAE.Sheets[sheet].Selector.Selected.First;

    var usedCells = NOVAE.Cells.Used[sheet];

    var cellLetter;
    var cellNumber;

    /** Regex helper */
    var match = null;

    var customArray = [];

    for (var ii in usedCells) {

      /** Go through each cell */
      for (var cell in usedCells[ii]) {

        match = parseInt(cell.match(NOVAE.REGEX.letters).join(""));
        cellLetter = cell.match(NOVAE.REGEX.numbers).join("");

        /** Get all cell rows behind */
        if (match >= selectedCell.Number) {

          switch (mode) {
            case "insert":
              cellNumber = match + 1;
              break;
            case "delete":
              cellNumber = match - 1;
              break;
          }

          customArray.push({ old: match, new: cellNumber, letter: cellLetter });

        }

      }

    }

    return(customArray);

  };

  /**
   * Process customized cells (numeric)
   *
   * @method getNumericCustomizedCells
   * @static
   */
  NOVAE.Injector.prototype.getNumericCustomizedCells = function(mode, sheet, selected) {

    var selectedCell = null;

    if (selected && typeof selected === "object") {
      selectedCell = selected;
    } else selectedCell = NOVAE.Sheets[sheet].Selector.Selected.First;

    var customCells = NOVAE.Cells.Resized[sheet].Rows;

    var customArray = [];

    var cellLetter = null;

    var match = 0;

    for (var ii in customCells) {

      match = parseInt(ii);

      /** Get everything behind */
      if (match >= selectedCell.Number) {
        switch (mode) {
         case "insert":
            customArray.push({ old: match, new: match + 1 });
            break;
          case "delete":
            customArray.push({ old: match, new: match - 1 });
            break;
        }
      }

    }

    return(customArray);

  };

  /**
   * Process master cells (numeric)
   *
   * @method getNumericMasterRows
   * @static
   */
  NOVAE.Injector.prototype.getNumericMasterRows = function(mode, sheet, selected) {

    var selectedCell = null;

    if (selected && typeof selected === "object") {
      selectedCell = selected;
    } else selectedCell = NOVAE.Sheets[sheet].Selector.Selected.First;

    var masterCells = NOVAE.Sheets[sheet].Selector.masterSelected.Rows;

    var customArray = [];

    var cellLetter = null;

    var match = 0;

    for (var ii in masterCells) {

      match = parseInt(ii);

      /** Get everything behind */
      if (match >= selectedCell.Number) {
        switch (mode) {
         case "insert":
            customArray.push({ old: match, new: match + 1 });
            break;
          case "delete":
            customArray.push({ old: match, new: match - 1 });
            break;
        }
      }

    }

    return(customArray);

  };