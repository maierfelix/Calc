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
   * Change font size
   *
   * @method fontSize
   * @static
   */
  NOVAE.Styler.prototype.fontSize = function(size) {

    var jumps = 0;

    /** Shorter syntax */
    var masterCell = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.masterSelected;
    var currentMaster = masterCell.Current;
    var selectSheet = NOVAE.Sheets[NOVAE.CurrentSheet].Selector;

    /** Active master selection */
    if (selectSheet.masterSelected.Current && selectSheet.masterSelected.Current !== null) {
      if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
        this.inheritSheetMasterStyling("FontSize", size, masterCell.Current);
      }
      masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
      /** Check if master cell exists */
      if (masterCell) masterCell.FontSize = size;
    }

    /** Validate all selected cells */
    NOVAE.$.validateCells();

    /** Overwrite used cells styling */
    if (NOVAE.Cells.Used[NOVAE.CurrentSheet][currentMaster]) {
      selectSheet.inheritMasterStyling(currentMaster, masterCell, "FontSize");
    }

    /** Append all font size style */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.allSelected) {
      this.appendAllFontSize(size);
    }

    /** Loop through all selected cells */
    for (var ii = 0; ii < selectSheet.SelectedCells.length; ++ii) {
      var letter = NOVAE.$.numberToAlpha(selectSheet.SelectedCells[ii].letter);
      var cellName = letter + selectSheet.SelectedCells[ii].number;
      /** Update the font size */
      NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].FontSize = size;
      /** Immediately update cells font size */
      jumps = NOVAE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
      if (jumps >= 0) NOVAE.DOM.Output.children[jumps].style.fontSize = size + "px";
    }

    /** Inherit style changes to slave sheets */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
      this.inheritSheetStyling("FontSize", size);
    }

    /** Share font size styling */
    if (NOVAE.Connector.connected) {
      var range = NOVAE.$.selectionToRange(NOVAE.Sheets[NOVAE.CurrentSheet].Selector.SelectedCells);
      NOVAE.Connector.action("updateCell", { range: range, property: "FontSize", value: size });
    }

    /** Dont loose the selection */
    selectSheet.getSelection();

  };

  /**
   * Append all font size
   *
   * @method appendAllFontSize
   * @static
   */
  NOVAE.Styler.prototype.appendAllFontSize = function(size) {

    NOVAE.Cells.All[NOVAE.CurrentSheet].Cell.FontSize = size;

    var usedCells = NOVAE.Cells.Used[NOVAE.CurrentSheet];

    var masterCells = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.masterSelected;

    /** Overwrite all registered cells background style */
    for (var letter in usedCells) {
      for (var cell in usedCells[letter]) {
        usedCells[letter][cell].FontSize = size;
      }
    }

    /** Overwrite all master columns background style */
    for (var cell in masterCells.Columns) {
      masterCells.Columns[cell].FontSize = size;
    }
    /** Overwrite all master rows background style */
    for (var cell in masterCells.Rows) {
      masterCells.Rows[cell].FontSize = size;
    }

    NOVAE.Event.redraw();

  };