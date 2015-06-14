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
   * Add hover effect for all selected cells
   *
   * @method addCellHoverEffect
   * @static
   */
  CORE.Selector.prototype.addCellHoverEffect = function() {

    var letter = 0,
        number = 0,
        jumps = 0,
        newLetter = "",
        style = this.SelectedCells.length <= 1 ? "single_row_hovered" : "row_hovered";

    /** Add hover effect for all selected cells */
    for (var ii = 0; ii < this.SelectedCells.length; ++ii) {

      letter = this.SelectedCells[ii].letter;
      number = this.SelectedCells[ii].number;
      newLetter = CORE.$.numberToAlpha(letter);

      /** Synchronize custom cells with the cell settings menu if 1 cell is selected */
      if (this.SelectedCells.length === 1) CORE_UI.updateCellStyleMenu(this.SelectedCells[ii]);

      jumps = CORE.$.getCell({ letter: letter, number: number });

      /** Test if selection is in view */
      if (jumps >= 0) {
        if (CORE.DOM.CacheArray[jumps]) {

          /** Priority 1: If cell has custom background, add transparence to it */
          if (CORE.Cells.Used[CORE.CurrentSheet][newLetter] &&
              CORE.Cells.Used[CORE.CurrentSheet][newLetter][newLetter + number] &&
              CORE.Cells.Used[CORE.CurrentSheet][newLetter][newLetter + number].BackgroundColor !== null) {
              /** Change background color and add transparency */
              CORE.DOM.CacheArray[jumps].style.background = CORE.Cells.Used[CORE.CurrentSheet][newLetter][newLetter + number].BackgroundColor.replace(')', ', 0.55)').replace('rgb', 'rgba');

          /** Priority 2: Column master selection */
          } else if (CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Columns[newLetter] &&
                     CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Columns[newLetter].BackgroundColor !== null) {
            /** Change background color and add transparency */
            CORE.DOM.CacheArray[jumps].style.background = CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Columns[newLetter].BackgroundColor.replace(')', ', 0.55)').replace('rgb', 'rgba');

          /** Priority 3: Row master selection */
          } else if (CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Rows[number] &&
                     CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Rows[number].BackgroundColor !== null) {
            /** Change background color and add transparency */
            CORE.DOM.CacheArray[jumps].style.background = CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Rows[number].BackgroundColor.replace(')', ', 0.55)').replace('rgb', 'rgba');

          } else {
            CORE.DOM.CacheArray[jumps].classList.add(style);
          }

        }
      }

    }

    /** Draw outer border around selection if selection area is above 1 */
    if (this.SelectedCells.length > 1) this.drawSelectionOuterBorder();

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

    var letter = 0,
        number = 0,
        jumps = 0,
        cellName = "",
        style = this.SelectedCells.length <= 1 ? "single_row_hovered" : "row_hovered";

    /** Delete hover effect for all selected cells */
    for (var ii = 0; ii < CORE.DOM.CacheArray.length; ++ii) {
      CORE.DOM.CacheArray[ii].classList.remove(style, "border_top", "border_bottom", "border_left", "border_right");
      /** Reset background color if customized cell was in selection */
      if (cellName = CORE.DOM.CacheArray[ii].getAttribute("name")) {
        var letter = cellName.match(CORE.REGEX.numbers).join("");
        var number = cellName.match(CORE.REGEX.letters).join("");

        /** Priority 1: Cells */
        if (CORE.Cells.Used[CORE.CurrentSheet][letter] &&
            CORE.Cells.Used[CORE.CurrentSheet][letter][letter + number]) {
          CORE.DOM.CacheArray[ii].style.background = CORE.Cells.Used[CORE.CurrentSheet][letter][letter + number].BackgroundColor;

        /** Priority 2: Columns */
        } else if (CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Columns[letter]) {
          CORE.DOM.CacheArray[ii].style.background = CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Columns[letter].BackgroundColor;

        /** Priority 3: Rows */
        } else if (CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Rows[number]) {
          CORE.DOM.CacheArray[ii].style.background = CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Rows[number].BackgroundColor;
        }

      }
    }

  };