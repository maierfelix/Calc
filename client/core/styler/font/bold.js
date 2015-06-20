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
  CORE.Styler.prototype.fontBold = function() {

    var jumps = 0;

    /** Shorter syntax */
    var masterCell = CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected;
    var currentMaster = masterCell.Current;
    var selectSheet = CORE.Sheets[CORE.CurrentSheet].Selector;

    /** Active master selection */
    if (selectSheet.masterSelected.Current && selectSheet.masterSelected.Current !== null) {
      if (CORE.Sheets[CORE.CurrentSheet].isMasterSheet()) {
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
    CORE.$.validateCells();

    /** Overwrite used cells styling, if active master selection */
    if (CORE.Cells.Used[CORE.CurrentSheet][currentMaster]) {
      selectSheet.inheritMasterStyling(currentMaster, masterCell, "FontBold");
    }

    /** Loop through all selected cells */
    for (var ii = 0; ii < selectSheet.SelectedCells.length; ++ii) {
      var letter = CORE.$.numberToAlpha(selectSheet.SelectedCells[ii].letter);
      var cellName = letter + selectSheet.SelectedCells[ii].number;
      /** User wants to disable bold property by executing again */
      if (CORE.Cells.Used[CORE.CurrentSheet][letter][cellName].FontBold) {
        /** Update the font bold */
        CORE.Cells.Used[CORE.CurrentSheet][letter][cellName].FontBold = false;
        /** Immediately update cells font bold */
        jumps = CORE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
        if (jumps >= 0) CORE.DOM.Output.children[jumps].style.fontWeight = "normal";
      } else {
        /** Update the font bold */
        CORE.Cells.Used[CORE.CurrentSheet][letter][cellName].FontBold = true;
        /** Immediately update cells font bold */
        jumps = CORE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
        if (jumps >= 0) CORE.DOM.Output.children[jumps].style.fontWeight = "bold";
      }
    }

    /** Inherit style changes to slave sheets */
    if (CORE.Sheets[CORE.CurrentSheet].isMasterSheet()) {
      this.inheritSheetStyling("FontBold", true);
    }

    /** Dont loose the selection */
    selectSheet.getSelection();

  };