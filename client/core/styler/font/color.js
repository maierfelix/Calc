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
  NOVAE.Styler.prototype.fontColor = function(color) {

    var element = NOVAE.DOM.ChangeFontColor;
    var jumps = 0;
    var selectSheet = NOVAE.Sheets[NOVAE.CurrentSheet].Selector;

    /** Shorter syntax */
    var masterCell = selectSheet.masterSelected;
    var currentMaster = masterCell.Current;

    /** Active master selection */
    if (selectSheet.masterSelected.Current && selectSheet.masterSelected.Current !== null) {
      if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
        this.inheritSheetMasterStyling("Color", color, masterCell.Current);
      }
      masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
      /** Check if master cell exists */
      if (masterCell) masterCell.Color = color;
    }

    /** Validate all selected cells */
    NOVAE.$.validateCells();

    /** Overwrite used cells styling */
    if (NOVAE.Cells.Used[NOVAE.CurrentSheet][currentMaster]) {
      selectSheet.inheritMasterStyling(currentMaster, masterCell, "Color");
    }

    /** Append all font color style */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.allSelected) {
      this.appendAllFontColor(color);
    }

    /** Loop through all selected cells */
    for (var ii = 0; ii < selectSheet.SelectedCells.length; ++ii) {
      var letter = NOVAE.$.numberToAlpha(selectSheet.SelectedCells[ii].letter);
      var cellName = letter + selectSheet.SelectedCells[ii].number;
      /** Update the font color */
      NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Color = color;
      /** Immediately update cells font color */
      jumps = NOVAE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
      if (jumps >= 0) NOVAE.DOM.Output.children[jumps].style.color = color;
    }

    /** Inherit style changes to slave sheets */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
      this.inheritSheetStyling("Color", color);
    }

    /** Share font color styling */
    if (NOVAE.Connector.connected) {
      var range = NOVAE.$.selectionToRange(NOVAE.Sheets[NOVAE.CurrentSheet].Selector.SelectedCells);
      NOVAE.Connector.action("updateCell", { range: range, property: "Color", value: color });
    }

    /** Dont loose the selection */
    selectSheet.getSelection();

  };

  /**
   * Append all font color
   *
   * @method appendAllFontColor
   * @static
   */
  NOVAE.Styler.prototype.appendAllFontColor = function(color) {

    NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.Color = color;

    var usedCells = NOVAE.Cells.Used[NOVAE.CurrentSheet];

    var masterCells = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.masterSelected;

    /** Overwrite all registered cells background style */
    for (var letter in usedCells) {
      for (var cell in usedCells[letter]) {
        usedCells[letter][cell].Color = color;
      }
    }

    /** Overwrite all master columns background style */
    for (var cell in masterCells.Columns) {
      masterCells.Columns[cell].Color = color;
    }
    /** Overwrite all master rows background style */
    for (var cell in masterCells.Rows) {
      masterCells.Rows[cell].Color = color;
    }

    NOVAE.Event.redraw();

  };