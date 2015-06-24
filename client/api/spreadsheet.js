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

    this.modules = {};

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
      NOVAE.$.registerCell({letter: letter, number: number});
      NOVAE.Cells.Used[SpreadSheet.CurrentSheetName][letter][letter + number][property] = data;
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
      NOVAE.$.registerCell({letter: letter, number: number});
      NOVAE.Cells.Used[SpreadSheet.CurrentSheetName][letter][letter + number][property] = array[ii];
    }

  };

  SpreadSheet = new SpreadSheet();
  SpreadSheet.init();