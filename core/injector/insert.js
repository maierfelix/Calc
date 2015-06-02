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

    var selectedCell = CORE.Cells.Selected.First;

    var usedCells = CORE.Cells.Used;

    var letter = CORE.$.numberToAlpha(selectedCell.Letter);
    var number = selectedCell.Number;

    var cellLetter;
    var cellNumber;

    var customArray = [];

    /** Move everything behind this letter 1 right */
    for (var ii in usedCells) {

      /** Get each letter behind */
      if (usedCells[ii] && CORE.$.alphaToNumber(ii) > selectedCell.Letter) {

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

    /** Sort array alphabetically */
    customArray = customArray.sortOn("old");

    var ii = customArray.length;

    /** Reversed */
    while (ii--) {
      var value = customArray[ii];
      usedCells[value.new] = usedCells[value.old];
      delete usedCells[value.old];
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