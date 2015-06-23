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
   * @class Spreadsheet
   * @static
   */
  var Spreadsheet = function() {

    this.CurrentSheetName = null;

    this.Spreadsheet = null;

  };

  Spreadsheet.prototype = Spreadsheet;
  Spreadsheet.prototype.constructor = Spreadsheet;

  /**
   * Initialize API
   *
   * @method init
   * @static
   */
  Spreadsheet.prototype.init = function() {

    /** Check if NovaeCalc exists */
    if (!window.NOVAE) throw new Error("NovaeCalc wasn't found!");

    this.Spreadsheet = NOVAE;

  };

  /**
   * Pointer to the currently active sheet
   *
   * @method getActiveSheet
   * @static
   */
  Spreadsheet.prototype.getActiveSheet = function() {

    this.CurrentSheetName = this.Spreadsheet.CurrentSheet;

    this.CurrentSheet = this.Spreadsheet.Sheets[this.CurrentSheetName];

  };

  /**
   * Check if a sheet exists
   *
   * @method sheetExists
   * @return {boolean}
   * @static
   */
  Spreadsheet.prototype.sheetExists = function(name) {

    return (this.Spreadsheet.Sheets[name] ? true : false);

  };

  /**
   * Get a range
   *
   * @method getRange
   * @return {object}
   * @static
   */
  Spreadsheet.prototype.getRange = function(range) {

    range = range.split(":");

    var first = range[0];

    var last = range[1];

    var firstCoordinates = {
      letter: NOVAE.$.alphaToNumber(first.match(NOVAE.REGEX.numbers).join("")),
      number: parseInt(first.match(NOVAE.REGEX.letters).join(""))
    };

    var lastCoordinates = {
      letter: NOVAE.$.alphaToNumber(last.match(NOVAE.REGEX.numbers).join("")),
      number: parseInt(last.match(NOVAE.REGEX.letters).join(""))
    };

    return (new Range({first: firstCoordinates, last: lastCoordinates}));

  };

  /**
   * Add a listener to the sheet
   *
   * @method addListener
   * @return {array} selected Cells
   * @static
   */
  Spreadsheet.prototype.addListener = function() {

    var type = arguments[0];

    var functionCall = arguments[1];

    console.log(type, functionCall);

  };

  /**
   * Range Class
   *
   * @class Range
   * @param {string} [range] Range
   * @static
   */
  Spreadsheet.prototype.Range = function(range) {

    this.range = range;

    this.selection = NOVAE.$.coordToSelection(this.range.first, this.range.last);

  };

  Spreadsheet.prototype.Range = Spreadsheet.Range;

  /**
   * Get values of a range
   *
   * @param {string} [property] Property to get
   * @method get
   * @static
   */
  Spreadsheet.prototype.get = function(property) {

    return(NOVAE.$.getSelectionCellProperty(selection, property, this.CurrentSheetName));

  };

  Spreadsheet = new Spreadsheet();

  Spreadsheet.init();