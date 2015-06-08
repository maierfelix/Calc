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
   * The Injector
   *
   * @class Injector
   * @static
   */
  CORE.Injector = function() {};

  CORE.Injector.prototype = CORE.Injector;
  CORE.Injector.prototype.constructor = CORE.Injector;

  /**
   * Process used cells
   *
   * @method getUsedCells
   * @static
   */
  CORE.Injector.prototype.getUsedCells = function(mode) {

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
   * Process master cells
   *
   * @method getMasterColumns
   * @static
   */
  CORE.Injector.prototype.getMasterColumns = function(mode) {

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