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
  NOVAE.ClipBoard = function() {

    /** Save last copied text */
    this.copiedText = null;

    /** Save copied cells here */
    this.copiedCells = {};

  };

  NOVAE.ClipBoard.prototype = NOVAE.ClipBoard;
  NOVAE.ClipBoard.prototype.constructor = NOVAE.ClipBoard;

  /**
   * Insert text into virtual clipBoard
   *
   * @method copyTextToClipBoard
   * @static
   */
  NOVAE.ClipBoard.prototype.copyTextToClipBoard = function(data) {

    this.copiedText = data;

  };

  /**
   * Read text from virtual clipboard
   *
   * @method readTextFromClipBoard
   * @static
   */
  NOVAE.ClipBoard.prototype.readTextFromClipBoard = function() {

    return (this.copiedText);

  };

  /**
   * Insert cells into clipBoard
   *
   * @method copyCellsToClipBoard
   * @static
   */
  NOVAE.ClipBoard.prototype.copyCellsToClipBoard = function() {

    /** Sheet isnt registered in clipBoard yet */
    if (!this.copiedCells[NOVAE.CurrentSheet]) this.copiedCells[NOVAE.CurrentSheet] = {};

    /** Clean old copied cells */
    this.copiedCells[NOVAE.CurrentSheet] = [];

    /** Update clipBoard sheet cells */
    this.copiedCells[NOVAE.CurrentSheet] = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.SelectedCells;

    /** Check if copied cells contain content */
    this.validateCellContent();

  };

  /**
   * Check if copied cells contain content
   *
   * @method validateCellContent
   * @static
   */
  NOVAE.ClipBoard.prototype.validateCellContent = function() {

    var copiedCells = this.copiedCells[NOVAE.CurrentSheet];

    var content = null;

    var formula = null;

    for (var ii = 0; ii < copiedCells.length; ++ii) {
      var letter = NOVAE.$.numberToAlpha(copiedCells[ii].letter);
      var number = copiedCells[ii].number;
      /** Cell dictionary exists */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter]) {
        /** Check if cell exists */
        if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number]) {
          content = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number].Content;
          formula = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number].Formula.Stream;
          /** Valid content */
          if (content !== undefined && content !== null) {
            copiedCells[ii].value = content;
          }
          /** Valid formula */
          if (formula !== undefined && formula !== null) {
            copiedCells[ii].formula = formula;
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
  NOVAE.ClipBoard.prototype.pasteCellsIntoSheet = function(position) {

    var data = this.copiedCells[NOVAE.CurrentSheet];

    /** Abort if nothing to paste or no specific inject position */
    if (!data || !data.length || !position) return void 0;

    data = data.slice(0);

    /** Inherit paste */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
      NOVAE.Styler.inheritPasteCells(position, data);
    }

    var startColumn = position.Letter;
    var startNumber = position.Number;

    /** Start column to be inserted */
    var lastColumn = startColumn;
    /** Start row to be inserted */
    var lastRow = startNumber;

    var columnPadding = 0;
    var rowPadding = 0;

    /** Adjust copying to the new position */
    for (var ii = 0; ii < data.length; ++ii) {

      if (data[ii].number !== lastRow && ii) rowPadding++;

      if (data[ii].letter !== lastColumn && ii) {
        columnPadding++;
        rowPadding = 0;
      }

      lastColumn = data[ii].letter;
      lastRow = data[ii].number;
      data[ii].letter = data[ii].letter + startColumn - data[ii].letter + columnPadding;
      data[ii].number = data[ii].number + startNumber - data[ii].number + rowPadding;

      var letter = NOVAE.$.numberToAlpha(data[ii].letter);
      var number = data[ii].number;

      NOVAE.registerCell(letter + number);
      NOVAE.updateCell(letter + number, data[ii].value);
      NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number].Content = data[ii].value;
      NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number].Formula = {
        Stream: data[ii].formula,
        Lexed: null
      };

    }

    NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("default");

  };