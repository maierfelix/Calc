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

    /** Go a command before to get the selection */
    var selection = null;

    var counter = this.Stack.undoCommands.length;

    while (true) {
      if (this.Stack.undoCommands[counter] &&
          this.Stack.undoCommands[counter].caller === "Selector" &&
          this.Stack.undoCommands[counter].action === "select") {
        selection = this.Stack.undoCommands[counter];
        break;
      }
      if (counter < 0) break;
      counter--;
    }

    /** Check if before command was a selection */
    if (selection.caller === "Selector" && selection.action === "select") {

      var selectedCells = CORE.$.coordToSelection(selection.data.first, selection.data.last);

      for (var ii = 0; ii < selectedCells.length; ++ii) {
        var letter = CORE.$.numberToAlpha(selectedCells[ii].letter);
        var name = letter + selectedCells[ii].number;
        /** Update the cell background color */
        CORE.Cells.Used[CORE.CurrentSheet][letter][name].BackgroundColor = color;
        /** Immediately update cells background color */
        var jumps = CORE.$.getCell({ letter: selectedCells[ii].letter, number: selectedCells[ii].number });
        if (jumps >= 0) CORE.DOM.Output.children[jumps].style.background = color;
      }

      this.executeCommand(selection, mode);

    }

  };