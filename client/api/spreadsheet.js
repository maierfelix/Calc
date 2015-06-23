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
   * Get the current selection of a sheet
   *
   * @method getSelectionRange
   * @return {string} selection range
   * @static
   */
  Spreadsheet.prototype.getSelectionRange = function() {

    var selector = this.CurrentSheet.Selector;

    var first = selector.Selected.First;

    var last = selector.Selected.Last;

    first = NOVAE.$.numberToAlpha(first.Letter) + first.Number;

    last = NOVAE.$.numberToAlpha(last.Letter) + last.Number;

    return (first + ":" + last);

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

  Spreadsheet = new Spreadsheet();

  Spreadsheet.init();