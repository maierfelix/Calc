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
   * NovaeCalc high level API
   *
   * @class SpreadSheet
   * @static
   */
  var SpreadSheet = function() {

    this.CurrentSheetName = null;

    this.Spreadsheet = null;

  };

  SpreadSheet.prototype = SpreadSheet;
  SpreadSheet.prototype.constructor = SpreadSheet;

  /**
   * Initialize API
   *
   * @method init
   * @static
   */
  SpreadSheet.prototype.init = function() {

    this.Spreadsheet = NOVAE;

  };

  /**
   * Pointer to the currently active sheet
   *
   * @method getActiveSheet
   * @static
   */
  SpreadSheet.prototype.getActiveSheet = function() {

    this.CurrentSheetName = this.Spreadsheet.CurrentSheet;

    this.CurrentSheet = this.Spreadsheet.Sheets[this.CurrentSheetName];

    return (this);

  };

  /**
   * Check if a sheet exists
   *
   * @method sheetExists
   * @return {boolean}
   * @static
   */
  SpreadSheet.prototype.sheetExists = function(name) {

    return (this.Spreadsheet.Sheets[name] ? true : false);

  };

  /**
   * Add a listener to the sheet
   *
   * @method addListener
   * @return {array} selected Cells
   * @static
   */
  SpreadSheet.prototype.addListener = function() {

    var type = arguments[0];

    var functionCall = arguments[1];

    console.log(type, functionCall);

  };

  /**
   * Repaint a sheet
   *
   * @method repaint
   * @static
   */
  SpreadSheet.prototype.redraw = function() {

    if (this.Spreadsheet.CurrentSheet === this.CurrentSheetName) {
      this.Spreadsheet.Sheets[this.CurrentSheetName].updateWidth("default");
      this.Spreadsheet.Sheets[this.CurrentSheetName].Selector.getSelection();
    }

  };

  /**
   * Resize a sheet
   *
   * @method resize
   * @static
   */
  SpreadSheet.prototype.resize = function() {

    if (NOVAE.CurrentSheet === this.CurrentSheetName) NOVAE.Event.redraw();

  };

  /**
   * Get the current view as a range
   *
   * @method getView
   * @static
   */
  SpreadSheet.prototype.getView = function() {

    /** Simulate view range */
    var first = {
      Letter: this.Spreadsheet.Sheets[this.CurrentSheetName].Settings.scrolledX || 1,
      Number: this.Spreadsheet.Sheets[this.CurrentSheetName].Settings.scrolledY || 1
    };
    var last = {
      Letter: this.Spreadsheet.Sheets[this.CurrentSheetName].Settings.scrolledX + this.Spreadsheet.Sheets[this.CurrentSheetName].Settings.x + 1,
      Number: this.Spreadsheet.Sheets[this.CurrentSheetName].Settings.scrolledY + this.Spreadsheet.Sheets[this.CurrentSheetName].Settings.y + 1
    };

    var range = NOVAE.$.numberToAlpha(first.Letter) + first.Number + ":" + NOVAE.$.numberToAlpha(last.Letter) + last.Number;

    return (range);

  };

  /**
   * Convert sheet columns and rows to a specific size
   *
   * @param {string} [x] Column size 
   * @param {string} [y] Row size 
   * @method resizeTo
   * @static
   */
  SpreadSheet.prototype.resizeTo = function(x, y) {

    console.log(x, y);

  };

  /**
   * Range Class
   *
   * @class Range
   * @param {string} [range] Range
   * @static
   */
  SpreadSheet.prototype.Range = function() {

    this.range = arguments[0].split(":");

    var first = this.range[0];

    var last = this.range[1];

    var firstCoordinates = {
      letter: NOVAE.$.alphaToNumber(first.match(NOVAE.REGEX.numbers).join("")),
      number: parseInt(first.match(NOVAE.REGEX.letters).join(""))
    };

    var lastCoordinates = {
      letter: NOVAE.$.alphaToNumber(last.match(NOVAE.REGEX.numbers).join("")),
      number: parseInt(last.match(NOVAE.REGEX.letters).join(""))
    };

    this.range = {first: firstCoordinates, last: lastCoordinates};

  };

  SpreadSheet.prototype.Range = SpreadSheet.Range;

  /**
   * Get values of a range
   *
   * @param {string} [property] Property to get
   * @method getValues
   * @static
   */
  SpreadSheet.prototype.Range.prototype.getValues = function(property) {

    var array = NOVAE.$.getSelectionCellProperty(NOVAE.$.coordToSelection(this.range.first, this.range.last), property, this.CurrentSheetName);

    return (array);

  };

  /**
   * Get length of a range
   *
   * @method getLength
   * @static
   */
  SpreadSheet.prototype.Range.prototype.getLength = function() {

    var array = NOVAE.$.coordToSelection(this.range.first, this.range.last);

    return (array.length);

  };

  /**
   * Update values of a range
   *
   * @param {string} [property] Property to update
   * @param {object} [data] New data
   * @method set
   * @static
   */
  SpreadSheet.prototype.Range.prototype.set = function(property, data) {

    var range = NOVAE.$.coordToSelection(this.range.first, this.range.last);

    for (var ii = 0; ii < range.length; ++ii) {
      var letter = NOVAE.$.numberToAlpha(range[ii].letter);
      var number = range[ii].number;
      NOVAE.Cells.Used.registerCell(letter + number, SpreadSheet.CurrentSheetName);
      NOVAE.Cells.Used.updateCell(letter + number, {property: property, value: data}, SpreadSheet.CurrentSheetName);
    }

  };

  /**
   * Update values of a range array
   *
   * @param {string} [property] Property to update
   * @param {object} [data] New data
   * @method setValues
   * @static
   */
  SpreadSheet.prototype.Range.prototype.setValues = function(property, array) {

    var range = NOVAE.$.coordToSelection(this.range.first, this.range.last);

    if (range.length !== array.length) return void 0;

    for (var ii = 0; ii < range.length; ++ii) {
      var letter = NOVAE.$.numberToAlpha(range[ii].letter);
      var number = range[ii].number;
      NOVAE.Cells.Used.registerCell(letter + number, SpreadSheet.CurrentSheetName);
      NOVAE.Cells.Used.updateCell(letter + number, {property: property, value: array[ii]}, SpreadSheet.CurrentSheetName);
    }

  };

  /**
   * Resize columns of a range
   *
   * @param {number} [property] New column width
   * @method resizeColumns
   * @static
   */
  SpreadSheet.prototype.Range.prototype.resizeColumns = function(amount) {

    var customColumns = NOVAE.Cells.Resized[SpreadSheet.CurrentSheetName].Columns;

    var columnArray = [];

    var firstColumn = this.range.first.letter;
    var lastColumn = this.range.last.letter;

    var length = lastColumn - firstColumn;

    for (var ii = 0; ii < length; ++ii) {

      var letter = NOVAE.$.numberToAlpha(firstColumn + ii);

      if (!customColumns[letter]) {
        customColumns[letter] = {
          Width: amount,
          Height: 0
        };
      } else {
        customColumns[letter].Width = amount;
      }

      NOVAE.Cells.Resized[SpreadSheet.CurrentSheetName].columnArray.push(NOVAE.$.alphaToNumber(letter));

      NOVAE.Sheets[SpreadSheet.CurrentSheetName].Settings.cellResizedX += amount;

    }

    NOVAE.Sheets[SpreadSheet.CurrentSheetName].Input.Mouse.CellResize = true;
    NOVAE.Sheets[SpreadSheet.CurrentSheetName].Input.lastAction.scrollY = false;

  };

  /**
   * Resize rows of a range
   *
   * @param {number} [property] New row width
   * @method resizeRows
   * @static
   */
  SpreadSheet.prototype.Range.prototype.resizeRows = function(amount) {

    var customRows = NOVAE.Cells.Resized[SpreadSheet.CurrentSheetName].Rows;

    var rowArray = [];

    var firstRow = this.range.first.number;
    var lastRow = this.range.last.number;

    var length = lastRow - firstRow;

    for (var ii = 0; ii < length; ++ii) {

      var number = firstRow + ii;

      if (!customRows[number]) {
        customRows[number] = {
          Width: 0,
          Height: amount
        };
        NOVAE.Sheets[SpreadSheet.CurrentSheetName].Settings.cellResizedY += amount;
      } else {
        customRows[number].Height = amount;
      }

      NOVAE.Cells.Resized[SpreadSheet.CurrentSheetName].rowArray.push(number);

    }

    NOVAE.Sheets[SpreadSheet.CurrentSheetName].Input.Mouse.CellResize = true;

  };

  SpreadSheet = new SpreadSheet();
  SpreadSheet.init();