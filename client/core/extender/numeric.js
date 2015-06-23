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
   * Extend numbers
   *
   * @method extendNumbers
   * @static
   */
  NOVAE.Extender.prototype.extendNumbers = function(Cells, extendStack) {

    var iterationRate = 0;

    var copy = false;

    extendStack[0] = parseInt(extendStack[0]);
    extendStack[1] = parseInt(extendStack[1]);

    var validateIteration = extendStack[1] + extendStack[0];

    /** Calculate iteration rate */
    if (validateIteration !== undefined && validateIteration !== null && !isNaN(validateIteration)) {
      iterationRate = extendStack[1] - extendStack[0];
    /** User wants to copy 1 value */
    } else if (validateIteration === undefined || validateIteration === null || isNaN(validateIteration)) copy = true;

    /** Short syntax */
    var SelectedCells = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.SelectedCells;

    var startNumber = 0;

    /** Not necessary step if user wants to copy */
    if (!copy) {
      for (var ii = 0; ii < SelectedCells.length; ++ii) {
        if (extendStack[ii] !== undefined && extendStack[ii] !== null) startNumber = parseInt(extendStack[ii]);
        else if (extendStack[ii] === undefined || extendStack[ii] === null) {
          startNumber += iterationRate;
          extendStack[ii] = startNumber;
        }
      }
    }

    /** Copy */
    if (copy) {
      for (var ii = 0; ii < Cells.length; ++ii) {
        Cells[ii].value = extendStack[0];
      }
    /** Append iteration */
    } else {
      for (var ii = 0; ii < Cells.length; ++ii) {
        Cells[ii].value = parseInt(extendStack[ii]);
      }
    }

    this.updateCells(Cells);

  };