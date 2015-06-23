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
   * Extend a string
   *
   * @method extendStrings
   * @static
   */
  NOVAE.Extender.prototype.extendStrings = function(Cells, extendStack) {

    var iterationRate = 0;

    var copy = false;

    /** Short syntax */
    var SelectedCells = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.SelectedCells;

    var startNumber = 0;

    var validateIteration = 0;

    validateIteration = extendStack[1] + extendStack[0];

    /** The original (main) first cell to extend */
    var string = extendStack[0];

    /** Helper to prevent unnecessary re-calculations */
    var letters = null;

    if (letters = extendStack[0].match(NOVAE.REGEX.letters)) {
      extendStack[0] = parseInt(letters.join(""));
    }

    if (extendStack[1]) {
      if (letters = extendStack[1].match(NOVAE.REGEX.letters)) {
        extendStack[1] = parseInt(letters.join(""));
      } else {
        extendStack[1] = undefined;
      }
    } else {
      extendStack[1] = undefined;
    }

    validateIteration = extendStack[1] + extendStack[0];

    /** Calculate iteration rate */
    if (validateIteration !== undefined && validateIteration !== null && !isNaN(validateIteration)) {
      iterationRate = extendStack[1] - extendStack[0];
    /** User wants to copy 1 value */
    } else if (validateIteration === undefined || validateIteration === null || isNaN(validateIteration)) copy = true;

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
        Cells[ii].value = string;
      }
    /** Append iteration */
    } else {
      for (var ii = 0; ii < Cells.length; ++ii) {
        Cells[ii].value = NOVAE.$.replaceNumbers(string, String(extendStack[ii]));
      }
    }

    this.updateCells(Cells);

  };