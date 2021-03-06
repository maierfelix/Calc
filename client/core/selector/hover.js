/**
 * This file is part of the Calc project.
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
  NOVAE.Selector.prototype.addCellHoverEffect = function() {

    var jumps = 0;
    var singleCell = this.SelectedCells.length === 1 ? true : false;
    var style = singleCell ? "single_row_hovered" : "row_hovered";

    /** Add hover effect for all selected cells */
    for (var ii = 0; ii < this.SelectedCells.length; ++ii) {

      var letter = this.SelectedCells[ii].letter;
      var number = this.SelectedCells[ii].number;
      var newLetter = NOVAE.$.numberToAlpha(letter);

      /** Synchronize custom cells with the cell settings menu if 1 cell is selected */
      if (this.SelectedCells.length === 1) NOVAE_UI.updateCellStyleMenu(this.SelectedCells[ii]);

      jumps = NOVAE.$.getCell({ letter: letter, number: number });

      /** Test if selection is in view */
      if (jumps >= 0) {
        if (NOVAE.DOM.Cache[jumps]) {

          this.appendSelectionStyling(newLetter, number, jumps, style);

          /** Add extender button to the single cell */
          if (singleCell) {
            NOVAE.DOM.Cache[jumps].appendChild(NOVAE.Extender.getExtendButton());
          } else {
            /** Add extender button to last selected cell */
            if (ii + 1 === this.SelectedCells.length) {
              NOVAE.DOM.Cache[jumps].appendChild(NOVAE.Extender.getExtendButton());
            }
          }

        }
      }

    }

    /** Draw outer border around selection if selection area is above 1 */
    if (this.SelectedCells.length > 1) this.drawSelectionOuterBorder();

  };

  /**
   * Append styling for a cell
   *
   * @method appendSelectionStyling
   * @static
   */
  NOVAE.Selector.prototype.appendSelectionStyling = function(letter, number, jumps, style) {

    /** ^= Invisible cell hover color */
    var white = "rgba(198, 198, 198, 0.5)";
    /** Contains various white types to be specific colored in the grid */
    var isWhite = ["255,255,255", "255,255,254", "255,255,253", "253,253,253"];

    /** Priority 1: If cell has custom background, add transparence to it */
    if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter] &&
        NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number] &&
        NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number].BackgroundColor !== null) {

      var color = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number].BackgroundColor;

      /** Make white visible */
      if (isWhite.indexOf(color.substring(4, 15)) >= 0) {
        NOVAE.DOM.Cache[jumps].style.background = white;
      } else {
        /** Change background color and add transparency */
        NOVAE.DOM.Cache[jumps].style.background = color.replace(')', ', 0.55)').replace('rgb', 'rgba');
      }

    if (this.SelectedCells.length === 1) NOVAE.DOM.Cache[jumps].classList.add(style);

    /** Priority 2: Column master selection */
    } else if (NOVAE.Cells.Master[NOVAE.CurrentSheet].Columns[letter] &&
               NOVAE.Cells.Master[NOVAE.CurrentSheet].Columns[letter].BackgroundColor !== null) {

      var color = NOVAE.Cells.Master[NOVAE.CurrentSheet].Columns[letter].BackgroundColor;

      /** Make white visible */
      if (isWhite.indexOf(color.substring(4, 15)) >= 0) {
        NOVAE.DOM.Cache[jumps].style.background = white;
      } else {
        /** Change background color and add transparency */
        NOVAE.DOM.Cache[jumps].style.background = color.replace(')', ', 0.55)').replace('rgb', 'rgba');
      }

    /** Priority 3: Row master selection */
    } else if (NOVAE.Cells.Master[NOVAE.CurrentSheet].Rows[number] &&
               NOVAE.Cells.Master[NOVAE.CurrentSheet].Rows[number].BackgroundColor !== null) {

      var color = NOVAE.Cells.Master[NOVAE.CurrentSheet].Rows[number].BackgroundColor;

      /** Make white visible */
      if (isWhite.indexOf(color.substring(4, 15)) >= 0) {
        NOVAE.DOM.Cache[jumps].style.background = white;
      } else {
        /** Change background color and add transparency */
        NOVAE.DOM.Cache[jumps].style.background = color.replace(')', ', 0.55)').replace('rgb', 'rgba');
      }

    /** All background styling */
    } else if (NOVAE.Cells.All[NOVAE.CurrentSheet] &&
               NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.BackgroundColor !== null) {

      var color = NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.BackgroundColor;

      /** Make white visible */
      if (isWhite.indexOf(color.substring(4, 15)) >= 0) {
        NOVAE.DOM.Cache[jumps].style.background = white;
      } else {
        /** Change background color and add transparency */
        NOVAE.DOM.Cache[jumps].style.background = color.replace(')', ', 0.55)').replace('rgb', 'rgba');
      }

    } else {
      NOVAE.DOM.Cache[jumps].classList.add(style);
    }

  };

  /**
   * Hover effect for all cells
   *
   * @method allCellHoverEffect
   * @static
   */
  NOVAE.Selector.prototype.allCellHoverEffect = function() {

    /** Draw outer border */
    this.allSelectOuterBorder();

    /** Add hover effect for all selected cells */
    for (var ii = 0; ii < this.SelectedCells.length; ++ii) {

      var letter = this.SelectedCells[ii].letter;
      var number = this.SelectedCells[ii].number;
      var newLetter = NOVAE.$.numberToAlpha(letter);

      var jumps = NOVAE.$.getCell({ letter: letter, number: number });

      /** Test if selection is in view */
      if (jumps >= 0) {
        if (NOVAE.DOM.Cache[jumps]) {
          this.appendSelectionStyling(newLetter, number, jumps, "row_hovered");
        }
      }

    }

    this.SelectedCells = [];

  };

  /**
   * Delete hover effect for last selected cells
   *
   * @method deleteCellHoverEffect
   * @static
   */
  NOVAE.Selector.prototype.deleteCellHoverEffect = function() {

    var letter = 0;
    var number = 0;
    var cellName = "";
    var singleCell = this.SelectedCells.length === 1 ? true : false;
    var style = singleCell ? "single_row_hovered" : "row_hovered";

    if (this.allSelected) style = "row_hovered";

    var length = NOVAE.DOM.Cache.length;

    for (var cell = 0; cell < length; ++cell) {

      /** Remove outer selection borders */
      NOVAE.DOM.Cache[cell].classList.remove(style, "border_top", "border_bottom", "border_left", "border_right");

      if (NOVAE.DOM.Cache[cell].children[0]) {
        NOVAE.DOM.Cache[cell].removeChild(NOVAE.DOM.Cache[cell].children[0]);
      }

      var column = NOVAE.$.getNameFromDOMCell(NOVAE.DOM.Cache[cell], false).number - 1 - NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX;
      var row = NOVAE.$.getNameFromDOMCell(NOVAE.DOM.Cache[cell].parentNode, false).number;

      var name = {letter: column, number: row};

      /** Reset background color if customized cell was in selection */
      if (name) {

        var letter = NOVAE.$.numberToAlpha(name.letter);
        var number = name.number;

        /** Priority 1: Cells */
        if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter] &&
            NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number] &&
            NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number].BackgroundColor !== null) {

          NOVAE.DOM.Cache[cell].style.background = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number].BackgroundColor;

        /** Priority 2: Columns */
        } else if (NOVAE.Cells.Master[NOVAE.CurrentSheet].Columns[letter] &&
                   NOVAE.Cells.Master[NOVAE.CurrentSheet].Columns[letter].BackgroundColor !== null) {

          NOVAE.DOM.Cache[cell].style.background = NOVAE.Cells.Master[NOVAE.CurrentSheet].Columns[letter].BackgroundColor;

        /** Priority 3: Rows */
        } else if (NOVAE.Cells.Master[NOVAE.CurrentSheet].Rows[number] &&
                   NOVAE.Cells.Master[NOVAE.CurrentSheet].Rows[number].BackgroundColor !== null) {

          NOVAE.DOM.Cache[cell].style.background = NOVAE.Cells.Master[NOVAE.CurrentSheet].Rows[number].BackgroundColor;

        /** Priority 4: All */
        } else if (NOVAE.Cells.All[NOVAE.CurrentSheet].Cell &&
                   NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.BackgroundColor !== null) {

          NOVAE.DOM.Cache[cell].style.background = NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.BackgroundColor;

        }

      }

    }

  };