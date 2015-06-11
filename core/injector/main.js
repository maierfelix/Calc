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
  CORE.Injector = function() {};

  CORE.Injector.prototype = CORE.Injector;
  CORE.Injector.prototype.constructor = CORE.Injector;

  /**
   * Process used cells (alphabetical)
   *
   * @method getAlphaUsedCells
   * @static
   */
  CORE.Injector.prototype.getAlphaUsedCells = function(mode) {

    var selectedCell = CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First;

    var usedCells = CORE.Cells.Used[CORE.CurrentSheet];

    var cellLetter;
    var cellNumber;

    var customArray = [];

    /** Move everything behind this letter 1 right */
    for (var ii in usedCells) {

      /** Get each letter behind */
      if (usedCells[ii] && CORE.$.alphaToNumber(ii) >= selectedCell.Letter) {

        /** Go through each cell */
        for (var cell in usedCells[ii]) {

          switch (mode) {
            case "insert":
              cellLetter = CORE.$.numberToAlpha(CORE.$.alphaToNumber(cell.match(CORE.REGEX.numbers).join("")) + 1);
              break;
            case "delete":
              cellLetter = CORE.$.numberToAlpha(CORE.$.alphaToNumber(cell.match(CORE.REGEX.numbers).join("")) - 1);
              break;
          }

          cellNumber = ~~(cell.match(CORE.REGEX.letters).join(""));
          usedCells[ii][cellLetter + cellNumber] = usedCells[ii][cell];
          delete usedCells[ii][cell];
        }

        customArray.push({ old: ii, new: cellLetter });

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
  CORE.Injector.prototype.getNumericUsedCells = function(mode) {

    var selectedCell = CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First;

    var usedCells = CORE.Cells.Used[CORE.CurrentSheet];

    var cellLetter;
    var cellNumber;

    /** Regex helper */
    var match = null;

    var customArray = [];

    for (var ii in usedCells) {

      /** Go through each cell */
      for (var cell in usedCells[ii]) {

        match = parseInt(cell.match(CORE.REGEX.letters).join(""));
        cellLetter = cell.match(CORE.REGEX.numbers).join("");

        /** Get all cell rows behind */
        if (match >= selectedCell.Number) {

          switch (mode) {
            case "insert":
              cellNumber = match + 1;
              /** Move cells */
              usedCells[ii][cellLetter + cellNumber] = usedCells[ii][cell];
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
   * Process master cells (alphabetical)
   *
   * @method getAlphaMasterColumns
   * @static
   */
  CORE.Injector.prototype.getAlphaMasterColumns = function(mode) {

    var selectedCell = CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First;

    var masterCells = CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Columns;

    var customArray = [];

    /** Move everything behind this letter 1 right */
    for (var ii in masterCells) {

      /** Get each letter behind */
      if (masterCells[ii] && CORE.$.alphaToNumber(ii) >= selectedCell.Letter) {
        switch (mode) {
          case "insert":
            customArray.push({ old: ii, new: (CORE.$.numberToAlpha(CORE.$.alphaToNumber(ii) + 1)) });
            break;
          case "delete":
            customArray.push({ old: ii, new: (CORE.$.numberToAlpha(CORE.$.alphaToNumber(ii) - 1)) });
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
  CORE.Injector.prototype.getNumericMasterRows = function(mode) {

    var selectedCell = CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First;

    var masterCells = CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Rows;

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