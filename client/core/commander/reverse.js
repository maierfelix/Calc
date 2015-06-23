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
   * Reverse a selection
   *
   * @method reverseSelection
   * @static
   */
  CORE.Commander.prototype.reverseSelection = function(data) {

    CORE.Sheets[CORE.CurrentSheet].Selector.select(data);

  };

  /**
   * Reverse a background styling
   *
   * @param {object} [data] Data
   * @param {number} [mode] Reversed or not
   * @method reverseBackgroundStyling
   * @static
   */
  CORE.Commander.prototype.reverseBackgroundStyling = function(data, mode) {

    var color = null;

    if (mode) color = data.newColor || "rgb(255,255,255)";
    else color = data.oldColor || "rgb(255,255,255)";

    var selectedCells = CORE.$.coordToSelection(data.range.first, data.range.last);

    CORE.Styler.appendBackgroundStyle(color, selectedCells);

    this.executeCommand(data, mode);

  };