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
   * Change font italic
   *
   * @method fontItalic
   * @static
   */
  NOVAE.Styler.prototype.fontItalic = function() {

    var jumps = 0;

    /** Shorter syntax */
    var masterCell = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.masterSelected;
    var currentMaster = masterCell.Current;
    var selectSheet = NOVAE.Sheets[NOVAE.CurrentSheet].Selector;

    /** Active master selection */
    if (selectSheet.masterSelected.Current && selectSheet.masterSelected.Current !== null) {
      if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
        this.inheritSheetMasterStyling("FontItalic", true, masterCell.Current);
      }
      masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
      /** Check if master cell exists */
      if (masterCell) {
        if (masterCell.FontItalic) masterCell.FontItalic = false;
        else masterCell.FontItalic = true;
      }
    }

    /** Validate all selected cells */
    NOVAE.$.validateCells();

    /** Overwrite used cells styling, if active master selection */
    if (NOVAE.Cells.Used[NOVAE.CurrentSheet][currentMaster]) {
      selectSheet.inheritMasterStyling(currentMaster, masterCell, "FontItalic");
    }

    /** Loop through all selected cells */
    for (var ii = 0; ii < selectSheet.SelectedCells.length; ++ii) {
      var letter = NOVAE.$.numberToAlpha(selectSheet.SelectedCells[ii].letter);
      var cellName = letter + selectSheet.SelectedCells[ii].number;
      /** User wants to disable italic property by executing again */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].FontItalic) {
        /** Update the font italic */
        NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].FontItalic = false;
        /** Immediately update cells font italic */
        jumps = NOVAE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
        if (jumps >= 0) NOVAE.DOM.Output.children[jumps].style.fontStyle = "normal";
      } else {
        /** Update the font italic */
        NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].FontItalic = true;
        /** Immediately update cells font italic */
        jumps = NOVAE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
        if (jumps >= 0) NOVAE.DOM.Output.children[jumps].style.fontStyle = "italic";
      }
    }

    /** Inherit style changes to slave sheets */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
      this.inheritSheetStyling("FontItalic", true);
    }

    /** Dont loose the selection */
    selectSheet.getSelection();

  };