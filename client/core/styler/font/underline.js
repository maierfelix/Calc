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
   * Change font underline
   *
   * @method fontUnderline
   * @static
   */
  NOVAE.Styler.prototype.fontUnderline = function() {

    var jumps = 0;

    /** Shorter syntax */
    var masterCell = NOVAE.Cells.Master[NOVAE.CurrentSheet];
    var currentMaster = masterCell.Current;
    var selectSheet = NOVAE.Sheets[NOVAE.CurrentSheet].Selector;

    /** Active master selection */
    if (masterCell.Current && masterCell.Current !== null) {
      if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
        this.inheritSheetMasterStyling("FontUnderlined", true, masterCell.Current);
      }
      masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
      /** Check if master cell exists */
      if (masterCell) {
        if (masterCell.FontUnderlined) masterCell.FontUnderlined = false;
        else masterCell.FontUnderlined = true;
      }
      /** Inherit underline to all cells in this row or column */
      this.inheritMasterStyling(currentMaster, "FontUnderlined", masterCell.FontUnderlined);
      return void 0;
    }

    /** Validate all selected cells */
    NOVAE.$.validateCells();

    /** Append all font underline style */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.allSelected) {
      this.appendAllFontUnderline();
    }

    /** Loop through all selected cells */
    for (var ii = 0; ii < selectSheet.SelectedCells.length; ++ii) {
      var letter = NOVAE.$.numberToAlpha(selectSheet.SelectedCells[ii].letter);
      var cellName = letter + selectSheet.SelectedCells[ii].number;
      /** User wants to disable underlined property by executing again */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].FontUnderlined) {
        /** Update the font underlined */
        NOVAE.Cells.Used.updateCell(cellName, {property: "FontUnderlined", value: false}, NOVAE.CurrentSheet);
        /** Immediately update cells font underlined */
        jumps = NOVAE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
        if (jumps >= 0) NOVAE.DOM.Cache[jumps].style.textDecoration = "none";
      } else {
        /** Update the font underlined */
        NOVAE.Cells.Used.updateCell(cellName, {property: "FontUnderlined", value: true}, NOVAE.CurrentSheet);
        /** Immediately update cells font underlined */
        jumps = NOVAE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
        if (jumps >= 0) NOVAE.DOM.Cache[jumps].style.textDecoration = "underline";
      }
    }

    /** Inherit style changes to slave sheets */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
      this.inheritSheetStyling("FontUnderlined", true);
    }

    /** Share font underline styling */
    if (NOVAE.Connector.connected) {
      var range = NOVAE.$.selectionToRange(NOVAE.Sheets[NOVAE.CurrentSheet].Selector.SelectedCells);
      NOVAE.Connector.action("updateCell", { range: range, property: "FontUnderlined", value: "true" });
    }

    /** Dont loose the selection */
    selectSheet.getSelection();

  };

  /**
   * Append all font underline
   *
   * @method appendAllFontUnderline
   * @static
   */
  NOVAE.Styler.prototype.appendAllFontUnderline = function() {

    if (NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.FontUnderlined) {
      NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.FontUnderlined = false;
    } else {
      NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.FontUnderlined = true;
    }

    var usedCells = NOVAE.Cells.Used[NOVAE.CurrentSheet];

    var masterCells = NOVAE.Cells.Master[NOVAE.CurrentSheet];

    /** Overwrite all registered cells font bold */
    for (var letter in usedCells) {
      for (var cell in usedCells[letter]) {
        usedCells[letter][cell].FontUnderlined = NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.FontUnderlined;
      }
    }

    /** Overwrite all master columns font bold */
    for (var cell in masterCells.Columns) {
      masterCells.Columns[cell].FontUnderlined = NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.FontUnderlined;
    }
    /** Overwrite all master rows font bold */
    for (var cell in masterCells.Rows) {
      masterCells.Rows[cell].FontUnderlined = NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.FontUnderlined;
    }

    NOVAE.Event.redraw();

  };