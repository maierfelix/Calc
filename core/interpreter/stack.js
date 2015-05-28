/**
 * This file is part of the NovaeCalc project.
 *
 * It is permitted to use, redistribute and/or modify this software
 * under the terms of the MIT License
 *
 * @author Felix Maier <maier.felix96@gmail.com>
 * @copyright (c) 2015 Felix Maier, @felixmaier
 *
 * You may not change or remove these lines
 *
 */

"use strict"

  /**
   * Represents a virtual variable stack
   *
   * @class Stack
   * @static
   */
  ENGEL.STACK = {
    /**
     * An Object which stores variables
     *
     * @property VAR
     * @type Object
     */
    VAR: {}
  };

  ENGEL.STACK.prototype = ENGEL.STACK;

  /**
   * Erase everything in the stack
   *
   * @method dump
   * @static
   */
  ENGEL.STACK.prototype.dump = function() {
    this.VAR = {};
  };

  /**
   * Get specific variable from the stack
   *
   * @method get
   * @return {object}
   * @static
   */
  ENGEL.STACK.prototype.get = function(value) {
    if (this.VAR[value]) { return this.VAR[value]; }
    return void 0;
  };

  /**
   * Get specific variable value from the stack
   *
   * @method getValue
   * @return {object}
   * @static
   */
  ENGEL.STACK.prototype.getValue = function(value) {
    if (this.VAR[value]) { return this.VAR[value].value.value; }
    return void 0;
  };

  /**
   * Update specific variable in the stack
   *
   * @method update
   * @return {object}
   * @static
   */
  ENGEL.STACK.prototype.update = function(value, data) {
    if (this.VAR[value]) { return this.VAR[value].value = data; }
    return void 0;
  };

  /**
   * Create a clean virgin variable in the stack
   *
   * @method createVariable
   * @return {object}
   * @static
   */
  ENGEL.STACK.prototype.createVariable = function(value) {
    if (!this.VAR[value]) {
      this.VAR[value] = {
        name:  "undefined",
        type:  "var",
          value: {
          value: null,
          type:  null,
          raw:   null
        }
      };
      return this.VAR[value];
    }
    return void 0;
  };