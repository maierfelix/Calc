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
   * Add hover effect for all selected cells
   *
   * @method addCellHoverEffect
   * @static
   */
  CORE.Selector.prototype.addCellHoverEffect = function() {

    var letter = 0,
        number = 0,
        jumps = 0,
        style = this.SelectedCells.length <= 1 ? "single_row_hovered" : "row_hovered";

    /** Add hover effect for all selected cells */
    for (var ii = 0; ii < this.SelectedCells.length; ++ii) {

      letter = this.SelectedCells[ii].letter;
      number = this.SelectedCells[ii].number;

      /** Synchronize custom cells with the cell settings menu if 1 cell is selected */
      if (this.SelectedCells.length === 1) CORE_UI.updateCellStyleMenu(this.SelectedCells[ii]);

      jumps = CORE.$.getCell({ letter: letter, number: number });

      /** Test if selection is in view */
      if (jumps >= 0) {
        if (CORE.DOM.Output.children[jumps]) {
          CORE.DOM.Output.children[jumps].classList.add(style);
        }
      }

    }

  };

  /**
   * Delete hover effect for last selected cells
   *
   * TODO: Only delete hover effect of last seleected cells
   * But really necessary? Since seems like no performance loss on the current way
   *
   * @method deleteCellHoverEffect
   * @static
   */
  CORE.Selector.prototype.deleteCellHoverEffect = function() {

    /** No cells found */
    if (!this.SelectedCells.length) return void 0;

    var letter = 0,
        number = 0,
        jumps = 0,
        style = this.SelectedCells.length <= 1 ? "single_row_hovered" : "row_hovered";

    /** Delete hover effect for all selected cells */
    for (var ii = 0; ii < CORE.DOM.CacheArray.length; ++ii) {
      CORE.DOM.CacheArray[ii].classList.remove(style);
    }

  };