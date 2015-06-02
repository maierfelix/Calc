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

  /**
   * Process used cells
   *
   * @method getUsedCells
   * @static
   */
  CORE.Injector.prototype.getUsedCells = function() {

    var selectedCell = CORE.Cells.Selected.First;

    var usedCells = CORE.Cells.Used;

    var cellLetter;
    var cellNumber;

    var customArray = [];

    /** Move everything behind this letter 1 right */
    for (var ii in usedCells) {

      /** Get each letter behind */
      if (usedCells[ii] && CORE.$.alphaToNumber(ii) >= selectedCell.Letter) {

        /** Go through each cell */
        for (var cell in usedCells[ii]) {
          cellLetter = CORE.$.numberToAlpha(CORE.$.alphaToNumber(cell.match(CORE.REGEX.numbers).join("")) + 1);
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
  CORE.Injector.prototype.getMasterColumns = function() {

    var selectedCell = CORE.Cells.Selected.First;

    var masterCells = CORE.Selector.masterSelected.Columns;

    var customArray = [];

    /** Move everything behind this letter 1 right */
    for (var ii in masterCells) {

      /** Get each letter behind */
      if (masterCells[ii] && CORE.$.alphaToNumber(ii) >= selectedCell.Letter) {
        customArray.push({ old: ii, new: (CORE.$.numberToAlpha(CORE.$.alphaToNumber(ii) + 1)) });
      }

    }

    return(customArray);

  };