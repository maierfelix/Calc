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
(function() { "use strict"

  /**
   * Add hover effect for all selected cells
   *
   * @method addCellHoverEffect
   * @static
   */
  CORE.Selector.prototype.addCellHoverEffect = function() {

    var letters = null,
        numbers = 0,
        jumps = 0,
        style = this.SelectedCells.length <= 1 ? "single_row_hovered" : "row_hovered";

    /** Add hover effect for all selected cells */
    for (var ii = 0; ii < this.SelectedCells.length; ++ii) {

      /** Synchronize custom cells with the cell settings menu if 1 cell is selected */
      if (this.SelectedCells.length === 1) CORE_UI.updateCellStyleMenu(this.SelectedCells[ii]);

      letters = this.SelectedCells[ii].match(CORE.REGEX.numbers).join("");
      numbers = parseInt(this.SelectedCells[ii].match(CORE.REGEX.letters).join(""));

      if (numbers >= CORE.Grid.Settings.scrolledY) {

      jumps = ( ( CORE.$.alphaToNumber(letters) - 1 ) * CORE.Grid.Settings.y ) + numbers - 1;

      if (CORE.DOM.Output.children[jumps - CORE.Grid.Settings.scrolledY]) CORE.DOM.Output.children[jumps - CORE.Grid.Settings.scrolledY].classList.add(style);

      CORE.DOM.DebugContainer.innerHTML += this.SelectedCells[ii] + ", ";

      }

    }

  };

  /**
   * Delete hover effect for last selected cells
   *
   * @method deleteCellHoverEffect
   * @static
   */
  CORE.Selector.prototype.deleteCellHoverEffect = function() {

    /** No cells found */
    if (!this.SelectedCells.length) return void 0;

    var letters = null,
        numbers = 0,
        jumps = 0,
        style = this.SelectedCells.length <= 1 ? "single_row_hovered" : "row_hovered";

    /** Delete hover effect for all selected cells */
    for (var ii = 0; ii < this.SelectedCells.length; ++ii) {

      letters = this.SelectedCells[ii].match(CORE.REGEX.numbers).join("");
      numbers = parseInt(this.SelectedCells[ii].match(CORE.REGEX.letters).join(""));

      jumps = ( ( CORE.$.alphaToNumber(letters) - 1 ) * CORE.Grid.Settings.y ) + numbers - 1;

      CORE.DOM.Output.children[jumps - CORE.Grid.Settings.scrolledY].classList.remove(style);
      CORE.DOM.Output.children[jumps + CORE.Grid.Settings.scrolledY].classList.remove(style);

      CORE.DOM.Output.children[jumps - CORE.Grid.Settings.scrolledY + 1].classList.remove(style);
      CORE.DOM.Output.children[jumps + CORE.Grid.Settings.scrolledY + 1].classList.remove(style);

      CORE.DOM.Output.children[jumps - CORE.Grid.Settings.scrolledY - 1].classList.remove(style);
      CORE.DOM.Output.children[jumps + CORE.Grid.Settings.scrolledY - 1].classList.remove(style);

    }

  };

}).call(this);