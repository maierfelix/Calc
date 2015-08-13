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
   * Change font family
   *
   * @method fontFamily
   * @static
   */
  NOVAE.Styler.prototype.fontFamily = function(font) {

    var jumps = 0;

    /** Shorter syntax */
    var masterCell = NOVAE.Cells.Master[NOVAE.CurrentSheet];
    var currentMaster = masterCell.Current;
    var selectSheet = NOVAE.Sheets[NOVAE.CurrentSheet].Selector;

    /** Active master selection */
    if (masterCell.Current && masterCell.Current !== null) {
      if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
        this.inheritSheetMasterStyling("Font", font, masterCell.Current);
      }
      masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
      /** Check if master cell exists */
      if (masterCell) masterCell.Font = font;
      /** Inherit italic to all cells in this row or column */
      this.inheritMasterStyling(currentMaster, "Font", masterCell.Font);
      return void 0;
    }

    /** Validate all selected cells */
    NOVAE.$.validateCells();

    /** Append all font family style */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.allSelected) {
      this.appendAllFontFamily(font);
    }

    /** Loop through all selected cells */
    for (var ii = 0; ii < selectSheet.SelectedCells.length; ++ii) {
      var letter = NOVAE.$.numberToAlpha(selectSheet.SelectedCells[ii].letter);
      var cellName = letter + selectSheet.SelectedCells[ii].number;
      /** Update the font family */
      NOVAE.Cells.Used.updateCell(cellName, {property: "Font", value: font}, NOVAE.CurrentSheet);
      /** Immediately update cells font family */
      jumps = NOVAE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
      if (jumps >= 0) NOVAE.DOM.Cache[jumps].style.fontFamily = font;
    }

    /** Inherit style changes to slave sheets */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
      this.inheritSheetStyling("Font", font);
    }

    /** Share font family styling */
    if (NOVAE.Connector.connected) {
      var range = NOVAE.$.selectionToRange(NOVAE.Sheets[NOVAE.CurrentSheet].Selector.SelectedCells);
      NOVAE.Connector.action("updateCell", { range: range, property: "Font", value: font });
    }

    /** Dont loose the selection */
    selectSheet.getSelection();

  };

  /**
   * Append all font family
   *
   * @method appendAllFontFamily
   * @static
   */
  NOVAE.Styler.prototype.appendAllFontFamily = function(font) {

    NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.Font = font;

    var usedCells = NOVAE.Cells.Used[NOVAE.CurrentSheet];

    var masterCells = NOVAE.Cells.Master[NOVAE.CurrentSheet];

    /** Overwrite all registered cells background style */
    for (var letter in usedCells) {
      for (var cell in usedCells[letter]) {
        NOVAE.Cells.Used.updateCell(cell, {property: "Font", value: font}, NOVAE.CurrentSheet);
      }
    }

    /** Overwrite all master columns background style */
    for (var cell in masterCells.Columns) {
      masterCells.Columns[cell].Font = font;
    }
    /** Overwrite all master rows background style */
    for (var cell in masterCells.Rows) {
      masterCells.Rows[cell].Font = font;
    }

    NOVAE.Event.redraw();

  };