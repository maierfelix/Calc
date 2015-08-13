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
   * Cell Class
   *
   * @class Cell
   * @static
   */
  NOVAE.Grid.prototype.Cell = function() {

    /**
     * Cell has a custom font color
     *
     * @property Color
     * @type String
     */
     this.name = arguments[0] || null;

    /**
     * Cell has a custom font color
     *
     * @property Color
     * @type String
     */
    this.Color = null;

    /**
     * Cell has a custom background color
     *
     * @property BackgroundColor
     * @type String
     */
    this.BackgroundColor = null;

    /**
     * Cell contains a formula
     *
     * @property Formula
     * @type String
     */
    this.Formula = {
      /** Plain formula string */
      Stream: null,
      /** Lexical analyzed stream */
      Lexed: null
    };

    /**
     * Cell has content
     *
     * @property Content
     * @type String
     */
    this.Content = null;

    /**
     * Cell is a number or not
     *
     * @property isNumeric
     * @type Boolean
     */
    this.isNumeric = false;

    /**
     * Cell has a custom font family
     *
     * @property Font
     * @type String
     */
    this.Font = null;

    /**
     * Cell has a custom font size
     *
     * @property FontSize
     * @type String
     */
    this.FontSize = null;

    /**
     * Cell font is bold
     *
     * @property FontBold
     * @type Boolean
     */
    this.FontBold = false;

    /**
     * Cell font is italic
     *
     * @property FontItalic
     * @type Boolean
     */
    this.FontItalic = false;

    /**
     * Cell font is underlined
     *
     * @property FontUnderlined
     * @type Boolean
     */
    this.FontUnderlined = false;

    /**
     * Cell has custom borders
     *
     * @property Border
     * @type Object
     */
    this.Border = {
      /** Top border */
      top: false,
      /** Bottom border */
      bottom: false,
      /** Left border */
      left: false,
      /** Right border */
      right: false,
      /** Full bordered */
      full: false,
      /** Border style */
      style: false,
      /** Border color */
      color: null,
      /** Cell uses a custom border ? */
      used: false
    };

  };

  NOVAE.Grid.prototype.Cell = NOVAE.Grid.Cell;

  /**
   * Inherit styling of parent cells
   *
   * @method inheritStyling
   * @static
   */
  NOVAE.Grid.prototype.Cell.prototype.inheritStyling = function(sheet) {

    var allCell = NOVAE.Cells.All[sheet].Cell;

    if (!this.name || !allCell) return void 0;

    /** Get letter of cell name for dictionary lookup */
    var letter = this.name.match(NOVAE.REGEX.numbers).join("");
    var number = this.name.match(NOVAE.REGEX.letters).join("");

    var Cells = NOVAE.Cells.Used[sheet];

    this.inheritProperties(this, allCell, sheet);

    var masterCells = NOVAE.Cells.Master[sheet];

    /** Inherit master column properties */
    if (masterCells.Columns[letter]) {
      this.inheritProperties(this, masterCells.Columns[letter], sheet);
    }

    /** Inherit master row properties */
    if (masterCells.Rows[number]) {
      this.inheritProperties(this, masterCells.Rows[number], sheet);
    }

  };

  /**
   * Inherit all properties
   *
   * @method inheritProperties
   * @static
   */
  NOVAE.Grid.prototype.Cell.prototype.inheritProperties = function(a, b, sheet) {

    for (var property in b) {
      if (b.hasOwnProperty(property)) {
        if (typeof b[property] === "object") {
          this.inheritProperties(this[property], b[property]);
        } else {
          if (b[property] !== null) {
            if (a.hasOwnProperty("name") && b.hasOwnProperty("name")) {
              NOVAE.Cells.Used.updateCell(a.name, {property: property, value: b[property]}, sheet);
            }
            a[property] = b[property];
          }
        }
      }
    }

  };