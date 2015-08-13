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
   * Change font bold
   *
   * @method fontBold
   * @static
   */
  NOVAE.Styler.prototype.fontBold = function() {

    var jumps = 0;

    /** Shorter syntax */
    var masterCell = NOVAE.Cells.Master[NOVAE.CurrentSheet];
    var currentMaster = masterCell.Current;
    var selectSheet = NOVAE.Sheets[NOVAE.CurrentSheet].Selector;

    /** Active master selection */
    if (masterCell.Current && masterCell.Current !== null) {
      if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
        this.inheritSheetMasterStyling("FontBold", true, masterCell.Current);
      }
      masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
      /** Check if master cell exists */
      if (masterCell) {
        if (masterCell.FontBold) masterCell.FontBold = false;
        else masterCell.FontBold = true;
      }
    }

    /** Validate all selected cells */
    NOVAE.$.validateCells();

    /** Overwrite used cells styling, if active master selection */
    if (NOVAE.Cells.Used[NOVAE.CurrentSheet][currentMaster]) {
      selectSheet.inheritMasterStyling(currentMaster, masterCell, "FontBold");
    }

    /** Append all font bold style */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.allSelected) {
      this.appendAllFontBold();
    }

    /** Loop through all selected cells */
    for (var ii = 0; ii < selectSheet.SelectedCells.length; ++ii) {
      var letter = NOVAE.$.numberToAlpha(selectSheet.SelectedCells[ii].letter);
      var cellName = letter + selectSheet.SelectedCells[ii].number;
      /** User wants to disable bold property by executing again */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].FontBold) {
        /** Update the font bold */
        NOVAE.Cells.Used.updateCell(cellName, {property: "FontBold", value: false}, NOVAE.CurrentSheet);
        /** Immediately update cells font bold */
        jumps = NOVAE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
        if (jumps >= 0) NOVAE.DOM.Cache[jumps].style.fontWeight = "normal";
      } else {
        /** Update the font bold */
        NOVAE.Cells.Used.updateCell(cellName, {property: "FontBold", value: true}, NOVAE.CurrentSheet);
        /** Immediately update cells font bold */
        jumps = NOVAE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
        if (jumps >= 0) NOVAE.DOM.Cache[jumps].style.fontWeight = "bold";
      }
    }

    /** Inherit style changes to slave sheets */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
      this.inheritSheetStyling("FontBold", true);
    }

    /** Share font bold styling */
    if (NOVAE.Connector.connected) {
      var range = NOVAE.$.selectionToRange(NOVAE.Sheets[NOVAE.CurrentSheet].Selector.SelectedCells);
      NOVAE.Connector.action("updateCell", { range: range, property: "FontBold", value: "true" });
    }

    /** Dont loose the selection */
    selectSheet.getSelection();

  };

  /**
   * Append all font bold
   *
   * @method appendAllFontBold
   * @static
   */
  NOVAE.Styler.prototype.appendAllFontBold = function() {

    if (NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.FontBold) {
      NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.FontBold = false;
    } else {
      NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.FontBold = true;
    }

    var usedCells = NOVAE.Cells.Used[NOVAE.CurrentSheet];

    var masterCells = NOVAE.Cells.Master[NOVAE.CurrentSheet];

    /** Overwrite all registered cells font bold */
    for (var letter in usedCells) {
      for (var cell in usedCells[letter]) {
        NOVAE.Cells.Used.updateCell(cell, {property: "FontBold", value: NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.FontBold}, NOVAE.CurrentSheet);
      }
    }

    /** Overwrite all master columns font bold */
    for (var cell in masterCells.Columns) {
      masterCells.Columns[cell].FontBold = NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.FontBold;
    }
    /** Overwrite all master rows font bold */
    for (var cell in masterCells.Rows) {
      masterCells.Rows[cell].FontBold = NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.FontBold;
    }

    NOVAE.Event.redraw();

  };