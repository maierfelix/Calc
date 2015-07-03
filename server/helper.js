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
   * Helper class
   * Provides helper functions
   */
  function Helper() {
    /**
     * Precompile regex operations
     *
     * @member {object}
     */
    this.RX = {
      letters: /[^a-zA-Z]/g,
      numbers: /[^0-9]/g
    };
  };

  /**
   * Convert range into selection array
   * @param {string} range Range to be processed
   * @method rangeToSelection
   * @return {array}
   */
  Helper.prototype.rangeToSelection = function(range) {

    if (!range.match(":")) return void 0;

    range = range.split(":");

    if (!range || !range[0] || !range[1]) return void 0;

    var first = range[0];
    var last = range[1];

    first = {
      letter: this.alphaToNumber(this.getLetters(first)),
      number: parseInt(this.getNumbers(first))
    };

    last = {
      letter: this.alphaToNumber(this.getLetters(last)),
      number: parseInt(this.getNumbers(last))
    };

    var selection = this.coordToSelection(first, last);

    return (selection || void 0);

  };

  /**
   * Number to alphabetical letter conversion
   *
   * @param {number} number Number
   * @method numberToAlpha
   * @return {string} Letter
   */
  Helper.prototype.numberToAlpha = function(number) {

    /** Charcode for a */
    var a = 65;

    /** Alphabet length */
    var length = 26;

    /** Final letter */
    var letter = 0;

    /** Calculation */
    var newNumber = 0;

    /** Get modulo */
    letter = (a + (number - 1) % length);

    /** Auto validation */
    letter = letter <= a ? String.fromCharCode(a) : String.fromCharCode(letter);

    /** Get letter length */
    newNumber = parseInt((number - 1) / length);

    /** Recurse to get the following letters */
    if (newNumber > 0) return (this.numberToAlpha(newNumber) + letter);

    return (letter);

  };

  /**
   * Alphabetical letter to number conversion
   *
   * TODO: Support > 702 =^ ZZ
   *
   * @param {string} letter Letter
   * @method alphaToNumber
   * @return {number} Number
   */
  Helper.prototype.alphaToNumber = function(letter) {

    if (!isNaN(letter)) return void 0;

    /** Charcode for a */
    var a = 65;

    /** Alphabet length */
    var length = 26;

    /** Calculation */
    var newNumber = 0;

    /** Convert letter into number */
    var number = letter.charCodeAt(0);

    /** Auto validation */
    number = number <= a ? 1 : (number % a + 1);

    /** Get number value */
    newNumber = parseInt((number - 1) * length);

    newNumber += (length);

    if (letter = letter.substr(1, letter.length)) return (this.alphaToNumber(letter) + newNumber);

    return (number);

  };

  /**
   * Get letters of a string
   *
   * @param {string} str
   * @method getLetters
   * @return {string} letters
   */
  Helper.prototype.getLetters = function(str) {
    return (str.match(this.RX.numbers).join(""));
  };

  /**
   * Get numbers of a string
   *
   * @param {string} str
   * @method getNumbers
   * @return {string} numbers
   */
  Helper.prototype.getNumbers = function(str) {
    return (str.match(this.RX.letters).join(""));
  };

  /**
   * Convert to coordinates into a selection array
   *
   * @param {object} first Coordinate object
   * @param {object} last Coordinate object
   * @method coordToSelection
   * @return {array} selection array
   * @static
   */
  Helper.prototype.coordToSelection = function(first, last) {

    var array = [];

    for (var xx = first.letter; xx <= last.letter; ++xx) {
      for (var yy = first.number; yy <= last.number; ++yy) {
        array.push({
          letter: xx,
          number: yy
        });
      }
    }

    return (array);

  };

  module.exports = Helper;