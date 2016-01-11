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
   * Change font italic
   *
   * @method fontItalic
   * @static
   */
  NOVAE.Styler.prototype.fontItalic = function() {

    var jumps = 0;

    /** Shorter syntax */
    var masterCell = NOVAE.Cells.Master[NOVAE.CurrentSheet];
    var currentMaster = masterCell.Current;
    var selectSheet = NOVAE.Sheets[NOVAE.CurrentSheet].Selector;

    /** Active master selection */
    if (masterCell.Current && masterCell.Current !== null) {
      if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
        this.inheritSheetMasterStyling("FontItalic", true, masterCell.Current);
      }
      masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
      /** Check if master cell exists */
      if (masterCell) {
        if (masterCell.FontItalic) masterCell.FontItalic = false;
        else masterCell.FontItalic = true;
      }
      /** Inherit italic to all cells in this row or column */
      this.inheritMasterStyling(currentMaster, "FontItalic", masterCell.FontItalic);
      return void 0;
    }

    /** Validate all selected cells */
    NOVAE.$.validateCells();

    /** Append all font italic style */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.allSelected) {
      this.appendAllFontItalic();
    }

    /** Loop through all selected cells */
    for (var ii = 0; ii < selectSheet.SelectedCells.length; ++ii) {
      var letter = NOVAE.$.numberToAlpha(selectSheet.SelectedCells[ii].letter);
      var cellName = letter + selectSheet.SelectedCells[ii].number;
      /** User wants to disable italic property by executing again */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].FontItalic) {
        /** Update the font italic */
        NOVAE.Cells.Used.updateCell(cellName, {property: "FontItalic", value: false}, NOVAE.CurrentSheet);
        /** Immediately update cells font italic */
        jumps = NOVAE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
        if (jumps >= 0) NOVAE.DOM.Cache[jumps].style.fontStyle = "normal";
      } else {
        /** Update the font italic */
        NOVAE.Cells.Used.updateCell(cellName, {property: "FontItalic", value: true}, NOVAE.CurrentSheet);
        /** Immediately update cells font italic */
        jumps = NOVAE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
        if (jumps >= 0) NOVAE.DOM.Cache[jumps].style.fontStyle = "italic";
      }
    }

    /** Inherit style changes to slave sheets */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
      this.inheritSheetStyling("FontItalic", true);
    }

    /** Share font italic styling */
    if (NOVAE.Connector.connected) {
      var range = NOVAE.$.selectionToRange(NOVAE.Sheets[NOVAE.CurrentSheet].Selector.SelectedCells);
      NOVAE.Connector.action("updateCell", { range: range, property: "FontItalic", value: "true" });
    }

    /** Dont loose the selection */
    selectSheet.getSelection();

  };

  /**
   * Append all font italic
   *
   * @method appendAllFontItalic
   * @static
   */
  NOVAE.Styler.prototype.appendAllFontItalic = function() {

    if (NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.FontItalic) {
      NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.FontItalic = false;
    } else {
      NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.FontItalic = true;
    }

    var usedCells = NOVAE.Cells.Used[NOVAE.CurrentSheet];

    var masterCells = NOVAE.Cells.Master[NOVAE.CurrentSheet];

    /** Overwrite all registered cells font bold */
    for (var letter in usedCells) {
      for (var cell in usedCells[letter]) {
        NOVAE.Cells.Used.updateCell(cellName, {property: "FontItalic", value: NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.FontItalic}, NOVAE.CurrentSheet);
      }
    }

    /** Overwrite all master columns font bold */
    for (var cell in masterCells.Columns) {
      masterCells.Columns[cell].FontItalic = NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.FontItalic;
    }
    /** Overwrite all master rows font bold */
    for (var cell in masterCells.Rows) {
      masterCells.Rows[cell].FontItalic = NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.FontItalic;
    }

    NOVAE.Event.redraw();

  };