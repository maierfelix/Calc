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

  /**
   * Round integer to its nearst X integer
   * @param  {number} a Number
   * @param  {number} b Round to
   * @return {number} rounded number
   */
  Math.roundTo = function(a, b) {
    b = 1 / (b);
    return (Math.round(a * b) / b);
  };

  /**
   * Calculate an average
   * @param  {array} array
   * @return {number} average
   */
  Math.average = function(array) {

    var sum = 0;

    var length = array.length;

    for (var ii = 0; ii < length; ii++) {
      sum += parseFloat(array[ii], 10);
    }

    return (sum / length);

  };

  /**
   * Sort an array holding objects alphabetically by a passed property
   * Syntax: array.sortOn(thisArg)
   */
  Array.prototype.sortOn = function(prop) {

    if (typeof prop !== 'string') {
      throw new TypeError(prop + " is not a string");
    }

    if (Object.prototype.toString.call(this) === '[object Array]'){
      return (this.sort (
        function (a, b) {
          if (a[prop] < b[prop]) {
            return (-1);
          }
          if (a[prop] > b[prop]) {
            return (1);
          }
          return (0);
        }
      ));
    } else {
      throw new TypeError(this + " is not an array");
    }

  };

  /**
   * Inject another array at specific position
   * 
   */
  Array.prototype.inject = function(pos, array) {

    return this.slice(0, pos).concat(array).concat(this.slice(pos));

  };

  /**
   * Remove duplicates from an array
   *
   */
  Array.prototype.removeDuplicates = function() {

    return this.reduce(function(a, b) { 
      if (a.indexOf(b) <= -1) a.push(b); 
      return (a);
    }, []);

  };