/**
 * This file is part of the Calc project.
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
   * All cell changes pass here
   *
   * @class Cells.Used
   * @static
   */
  NOVAE.Cells.Used = function() {};

  NOVAE.Cells.Used.prototype = NOVAE.Cells.Used;
  NOVAE.Cells.Used.prototype.constructor = NOVAE.Cells.Used;

  /**
   * Check if a cell is already registered
   *
   * @param {string} letter Dictionary letter
   * @param {string} name Full cell name
   * @param {string} sheet Sheet
   * @method cellExists
   * @static
   */
  NOVAE.Cells.Used.prototype.cellExists = function(name, sheet) {

    var letter = NOVAE.$.getLetters(name);

    if (this[sheet] &&
        this[sheet][letter] &&
        this[sheet][letter].hasOwnProperty(name)) {
      return (true);
    }

    return (false);

  };

  /**
   * Register a cell
   *
   * @param {string} letter Dictionary letter
   * @param {string} name Full cell name
   * @param {string} sheet Sheet
   * @method registerCell
   * @static
   */
  NOVAE.Cells.Used.prototype.registerCell = function(name, sheet) {

    var letter = NOVAE.$.getLetters(name);

    /** Register sheet */
    if (!this[sheet]) {
      this[sheet] = {};
    }

    /** Register dictionary */
    if (!this[sheet][letter]) {
      this[sheet][letter] = {};
    }

    /** Cell already exists, abort */
    if (!this[sheet][letter][name]) {
      /** Register the cell */
      this[sheet][letter][name] = new NOVAE.Grid.Cell(name);
      this[sheet][letter][name].inheritStyling(sheet);
    }

    /** Register sheet in the ENGEL stack */
    if (!ENGEL.STACK.VAR[sheet]) {
      ENGEL.STACK.VAR[sheet] = {};
    }

    /** Register cell in ENGEL stack */
    if (!ENGEL.STACK.VAR[sheet][name]) {
      ENGEL.STACK.VAR[sheet][name] = {
        name:  name,
        type:  "var",
          value: {
          value: null,
          type:  null,
          raw:   null
        }
      };
    }

  };

  /**
   * Update a cell
   *
   * @param {string} name Full cell name
   * @param {object} object Holds properties and values (length matching)
   * @param {string} targetSheet Sheet
   * @method updateCell
   * @static
   */
  NOVAE.Cells.Used.prototype.updateCell = function(name, object, targetSheet) {

    var multiple = false;

    if (object["properties"] && object["values"]) {
      multiple = true;
    } else if (object["property"] && object["value"]) {
      multiple = false;
    }

    targetSheet = targetSheet || NOVAE.CurrentSheet;

    var letter = NOVAE.$.getLetters(name);

    /** Make sure it's registered */
    this.registerCell(name, targetSheet);

    var cell = this[targetSheet][letter][name];

    var online = NOVAE.Connector.connected;

    switch (multiple) {

      /** TRUE */
      case true:

        var properties = object.properties;

        var values = object.values;

        for (var ii = 0; ii < properties.length; ++ii) {
          if (cell.hasOwnProperty(properties[ii])) {
            var value = values[ii];
            if (value) {
              /** Update ENGEL stack */
              if (properties[ii] === "Content") {
                var data = ENGEL.TypeMaster(value);
                ENGEL.STACK.VAR[targetSheet][name].value = data;
              }
              cell[properties[ii]] = value;
            }
          }
        }

      break;

      /** FALSE */
      case false:

        var property = object.property;

        var value = object.value;

        if (cell.hasOwnProperty(property)) {
          if (property === "Content") {
            var data = ENGEL.TypeMaster(value);
            ENGEL.STACK.VAR[targetSheet][name].value = data;
          }
          cell[property] = value;
        }

      break;

    }

  };

  /**
   * Update a master row or column
   *
   * @method updateMasterCell
   * @static
   */
  NOVAE.Cells.Used.prototype.updateMasterCell = function() {

    

  };