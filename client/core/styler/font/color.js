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
   * Change font color
   *
   * @method fontColor
   * @static
   */
  CORE.Styler.prototype.fontColor = function(color) {

    var element = CORE.DOM.ChangeFontColor;
    var jumps = 0;
    var selectSheet = CORE.Sheets[CORE.CurrentSheet].Selector;

    /** Shorter syntax */
    var masterCell = selectSheet.masterSelected;
    var currentMaster = masterCell.Current;

    /** Active master selection */
    if (selectSheet.masterSelected.Current && selectSheet.masterSelected.Current !== null) {
      if (CORE.Sheets[CORE.CurrentSheet].isMasterSheet()) {
        this.inheritSheetMasterStyling("Color", color, masterCell.Current);
      }
      masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
      /** Check if master cell exists */
      if (masterCell) masterCell.Color = color;
    }

    /** Validate all selected cells */
    CORE.$.validateCells();

    /** Overwrite used cells styling */
    if (CORE.Cells.Used[CORE.CurrentSheet][currentMaster]) {
      selectSheet.inheritMasterStyling(currentMaster, masterCell, "Color");
    }

    /** Loop through all selected cells */
    for (var ii = 0; ii < selectSheet.SelectedCells.length; ++ii) {
      var letter = CORE.$.numberToAlpha(selectSheet.SelectedCells[ii].letter);
      var cellName = letter + selectSheet.SelectedCells[ii].number;
      /** Update the font color */
      CORE.Cells.Used[CORE.CurrentSheet][letter][cellName].Color = color;
      /** Immediately update cells font color */
      jumps = CORE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
      if (jumps >= 0) CORE.DOM.Output.children[jumps].style.color = color;
    }

    /** Inherit style changes to slave sheets */
    if (CORE.Sheets[CORE.CurrentSheet].isMasterSheet()) {
      this.inheritSheetStyling("Color", color);
    }

    /** Dont loose the selection */
    selectSheet.getSelection();

  };