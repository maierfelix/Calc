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
  NOVAE.Selector.prototype.addCellHoverEffect = function() {

    var letter = 0;
    var number = 0;
    var jumps = 0;
    var newLetter = "";
    var singleCell = this.SelectedCells.length === 1 ? true : false;
    var style = singleCell ? "single_row_hovered" : "row_hovered";

    /** Add hover effect for all selected cells */
    for (var ii = 0; ii < this.SelectedCells.length; ++ii) {

      letter = this.SelectedCells[ii].letter;
      number = this.SelectedCells[ii].number;
      newLetter = NOVAE.$.numberToAlpha(letter);

      /** Synchronize custom cells with the cell settings menu if 1 cell is selected */
      if (this.SelectedCells.length === 1) NOVAE_UI.updateCellStyleMenu(this.SelectedCells[ii]);

      jumps = NOVAE.$.getCell({ letter: letter, number: number });

      /** Test if selection is in view */
      if (jumps >= 0) {
        if (NOVAE.DOM.CacheArray[jumps]) {

          this.appendSelectionStyling(newLetter, number, jumps, style);

          if (singleCell) {
            NOVAE.DOM.CacheArray[jumps].appendChild(NOVAE.Extender.extendButton());
          } else {
            /** Add extender button to last selected cell */
            if (ii + 1 === this.SelectedCells.length) {
              NOVAE.DOM.CacheArray[jumps].appendChild(NOVAE.Extender.extendButton());
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
        NOVAE.DOM.CacheArray[jumps].style.background = white;
      } else {
        /** Change background color and add transparency */
        NOVAE.DOM.CacheArray[jumps].style.background = color.replace(')', ', 0.55)').replace('rgb', 'rgba');
      }

    if (this.SelectedCells.length === 1) NOVAE.DOM.CacheArray[jumps].classList.add(style);

    /** Priority 2: Column master selection */
    } else if (NOVAE.Cells.Master[NOVAE.CurrentSheet].Columns[letter] &&
               NOVAE.Cells.Master[NOVAE.CurrentSheet].Columns[letter].BackgroundColor !== null) {

      var color = NOVAE.Cells.Master[NOVAE.CurrentSheet].Columns[letter].BackgroundColor;

      /** Make white visible */
      if (isWhite.indexOf(color.substring(4, 15)) >= 0) {
        NOVAE.DOM.CacheArray[jumps].style.background = white;
      } else {
        /** Change background color and add transparency */
        NOVAE.DOM.CacheArray[jumps].style.background = color.replace(')', ', 0.55)').replace('rgb', 'rgba');
      }

    /** Priority 3: Row master selection */
    } else if (NOVAE.Cells.Master[NOVAE.CurrentSheet].Rows[number] &&
        NOVAE.Cells.Master[NOVAE.CurrentSheet].Rows[number].BackgroundColor !== null) {

      var color = NOVAE.Cells.Master[NOVAE.CurrentSheet].Rows[number].BackgroundColor;

      /** Make white visible */
      if (isWhite.indexOf(color.substring(4, 15)) >= 0) {
        NOVAE.DOM.CacheArray[jumps].style.background = white;
      } else {
        /** Change background color and add transparency */
        NOVAE.DOM.CacheArray[jumps].style.background = color.replace(')', ', 0.55)').replace('rgb', 'rgba');
      }

    /** All background styling */
    } else if (NOVAE.Cells.All[NOVAE.CurrentSheet] &&
        NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.BackgroundColor !== null) {

      var color = NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.BackgroundColor;

      /** Make white visible */
      if (isWhite.indexOf(color.substring(4, 15)) >= 0) {
        NOVAE.DOM.CacheArray[jumps].style.background = white;
      } else {
        /** Change background color and add transparency */
        NOVAE.DOM.CacheArray[jumps].style.background = color.replace(')', ', 0.55)').replace('rgb', 'rgba');
      }

    } else {
      NOVAE.DOM.CacheArray[jumps].classList.add(style);
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
        if (NOVAE.DOM.CacheArray[jumps]) {
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
    var jumps = 0;
    var cellName = "";
    var singleCell = this.SelectedCells.length === 1 ? true : false;
    var style = singleCell ? "single_row_hovered" : "row_hovered";

    if (this.allSelected) style = "row_hovered";

    /** Delete hover effect for all cells */
    for (var ii = 0; ii < this.SelectedCells.length; ++ii) {

      var cell = null;

      if (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY) {
        cell = NOVAE.$.getCell({letter: this.SelectedCells[ii].letter, number: this.SelectedCells[ii].number + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY });
      } else {
        cell = NOVAE.$.getCell({letter: this.SelectedCells[ii].letter, number: this.SelectedCells[ii].number });
      }

      if (cell >= 0 && NOVAE.DOM.CacheArray[cell]) {

        /** Remove outer selection borders */
        NOVAE.DOM.CacheArray[cell].classList.remove(style, "border_top", "border_bottom", "border_left", "border_right");

        if (singleCell) {
          if (NOVAE.DOM.CacheArray[cell].children[0]) {
            NOVAE.DOM.CacheArray[cell].removeChild(NOVAE.DOM.CacheArray[cell].children[0]);
          }
        }

        /** Remove extender button */
        if (NOVAE.DOM.CacheArray[cell].children[0]) {
          NOVAE.DOM.CacheArray[cell].removeChild(NOVAE.DOM.CacheArray[cell].children[0]);
        }

        /** Reset background color if customized cell was in selection */
        if (cellName = NOVAE.$.getNameFromDOMCell(cell, true)) {

          var letter = cellName.match(NOVAE.REGEX.numbers).join("");
          var number = cellName.match(NOVAE.REGEX.letters).join("");

          /** Priority 1: Cells */
          if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter] &&
              NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number]) {
            NOVAE.DOM.CacheArray[cell].style.background = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number].BackgroundColor;

          /** Priority 2: Columns */
          } else if (NOVAE.Cells.Master[NOVAE.CurrentSheet].Columns[letter]) {
            NOVAE.DOM.CacheArray[cell].style.background = NOVAE.Cells.Master[NOVAE.CurrentSheet].Columns[letter].BackgroundColor;

          /** Priority 3: Rows */
          } else if (NOVAE.Cells.Master[NOVAE.CurrentSheet].Rows[number]) {
            NOVAE.DOM.CacheArray[cell].style.background = NOVAE.Cells.Master[NOVAE.CurrentSheet].Rows[number].BackgroundColor;

          /** Priority 4: All */
          } else if (NOVAE.Cells.All[NOVAE.CurrentSheet].Cell) {
            NOVAE.DOM.CacheArray[cell].style.background = NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.BackgroundColor;
          }

        }

      }

    }

  };


  /**
   * Delete hover effect for all cells
   *
   * @method cleanHoverEffect
   * @static
   */
  NOVAE.Selector.prototype.cleanHoverEffect = function() {

    var letter = 0;
    var number = 0;
    var jumps = 0;
    var cellName = "";
    var singleCell = this.SelectedCells.length === 1 ? true : false;
    var style = singleCell ? "single_row_hovered" : "row_hovered";

    if (this.allSelected) style = "row_hovered";

    /** Delete hover effect for all cells */
    for (var ii = 0; ii < NOVAE.DOM.CacheArray.length; ++ii) {

      /** Remove outer selection borders */
      NOVAE.DOM.CacheArray[ii].classList.remove(style, "border_top", "border_bottom", "border_left", "border_right");

      if (singleCell) {
        if (NOVAE.DOM.CacheArray[ii].children[0]) {
          NOVAE.DOM.CacheArray[ii].removeChild(NOVAE.DOM.CacheArray[ii].children[0]);
        }
      }

      /** Remove extender button */
      if (NOVAE.DOM.CacheArray[ii].children[0]) {
        NOVAE.DOM.CacheArray[ii].removeChild(NOVAE.DOM.CacheArray[ii].children[0]);
      }

      /** Reset background color if customized cell was in selection */
      if (cellName = NOVAE.DOM.CacheArray[ii].getAttribute("name")) {
        var letter = cellName.match(NOVAE.REGEX.numbers).join("");
        var number = cellName.match(NOVAE.REGEX.letters).join("");

        /** Priority 1: Cells */
        if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter] &&
            NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number]) {
          NOVAE.DOM.CacheArray[ii].style.background = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number].BackgroundColor;

        /** Priority 2: Columns */
        } else if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.masterSelected.Columns[letter]) {
          NOVAE.DOM.CacheArray[ii].style.background = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.masterSelected.Columns[letter].BackgroundColor;

        /** Priority 3: Rows */
        } else if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.masterSelected.Rows[number]) {
          NOVAE.DOM.CacheArray[ii].style.background = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.masterSelected.Rows[number].BackgroundColor;

        /** Priority 4: All */
        } else if (NOVAE.Cells.All[NOVAE.CurrentSheet].Cell) {
          NOVAE.DOM.CacheArray[ii].style.background = NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.BackgroundColor;
        }

      }
    }

  };