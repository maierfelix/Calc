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
   * A virtual clipBoard
   *
   * @class ClipBoard
   * @static
   */
  CORE.ClipBoard = function() {

    /** Save last copied text */
    this.copiedText = null;

    /** Save copied cells here */
    this.copiedCells = {};

  };

  CORE.ClipBoard.prototype = CORE.ClipBoard;

  /**
   * Insert text into virtual clipBoard
   *
   * @method copyTextToClipBoard
   * @static
   */
  CORE.ClipBoard.prototype.copyTextToClipBoard = function(data) {

    this.copiedText = data;

  };

  /**
   * Read text from virtual clipboard
   *
   * @method readTextFromClipBoard
   * @static
   */
  CORE.ClipBoard.prototype.readTextFromClipBoard = function() {

    return (this.copiedText);

  };

  /**
   * Insert cells into clipBoard
   *
   * @method copyCellsToClipBoard
   * @static
   */
  CORE.ClipBoard.prototype.copyCellsToClipBoard = function() {

    /** Sheet isnt registered in clipBoard yet */
    if (!this.copiedCells[CORE.CurrentSheet]) this.copiedCells[CORE.CurrentSheet] = {};

    /** Update clipBoard sheet cells */
    this.copiedCells[CORE.CurrentSheet] = CORE.Sheets[CORE.CurrentSheet].Selector.SelectedCells;

    /** Check if copied cells contain content */
    this.validateCellContent();

  };

  /**
   * Check if copied cells contain content
   *
   * @method validateCellContent
   * @static
   */
  CORE.ClipBoard.prototype.validateCellContent = function() {

    var copiedCells = this.copiedCells[CORE.CurrentSheet];

    var content = null;

    for (var ii = 0; ii < copiedCells.length; ++ii) {
      var letter = CORE.$.numberToAlpha(copiedCells[ii].letter);
      var number = copiedCells[ii].number;
      /** Cell dictionary exists */
      if (CORE.Cells.Used[CORE.CurrentSheet][letter]) {
        /** Check if cell exists */
        if (CORE.Cells.Used[CORE.CurrentSheet][letter][letter + number]) {
          content = CORE.Cells.Used[CORE.CurrentSheet][letter][letter + number].Content;
          /** Valid content */
          if (content !== undefined && content !== null) {
            copiedCells[ii].value = content;
          }
        }
      }
    }

  };

  /**
   * Update the sheet with copied cells starting on the left top selected cell
   *
   * @method pasteCellsIntoSheet
   * @static
   */
  CORE.ClipBoard.prototype.pasteCellsIntoSheet = function(position) {

    var data = this.copiedCells[CORE.CurrentSheet].slice(0);

    /** Abort if nothing to paste or no specific inject position */
    if (!data || !data.length || !position) return void 0;

    var startColumn = position.Letter;
    var startNumber = position.Number;

    var lastColumn = startColumn;
    var lastRow = startNumber;

    var letterPadding = 0;
    var numberPadding = 0;

    for (var ii = 0; ii < data.length; ++ii) {
      if (data[ii].number !== lastRow) numberPadding++;
      if (data[ii].letter !== lastColumn) {
        letterPadding++;
        numberPadding = 0;
      }
      lastColumn = data[ii].letter;
      lastRow = data[ii].number;
      data[ii].letter = data[ii].letter + startColumn - data[ii].letter + letterPadding;
      data[ii].number = data[ii].number + startNumber - data[ii].number + numberPadding;
      var letter = CORE.$.numberToAlpha(data[ii].letter);
      var number = data[ii].number;
      CORE.$.registerCell({letter: letter, number: number});
      CORE.Cells.Used[CORE.CurrentSheet][letter][letter + number].Content = data[ii].value;
    }

    CORE.Sheets[CORE.CurrentSheet].updateWidth("default");

  };

  /**
   * Remove selected cells
   *
   * @method deleteCellSelection
   * @static
   */
  CORE.ClipBoard.prototype.deleteCellSelection = function() {

    var selectedCells = CORE.Sheets[CORE.CurrentSheet].Selector.SelectedCells;

    var cell = null;

    for (var ii = 0; ii < selectedCells.length; ++ii) {

      var letter = CORE.$.numberToAlpha(selectedCells[ii].letter);
      var number = selectedCells[ii].number;

      if (CORE.Cells.Used[CORE.CurrentSheet][letter]) {
        if (cell = CORE.Cells.Used[CORE.CurrentSheet][letter][letter + number]) {
          CORE.Cells.Used[CORE.CurrentSheet][letter][letter + number].Content = "";
        }
      }

    }

    CORE.Sheets[CORE.CurrentSheet].updateWidth("default");

  };