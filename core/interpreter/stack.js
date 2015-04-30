(function() { "use strict"

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
    VAR: {},
    /**
     * Object which stores counts the execution time of the current code
     *
     * @property TIMER
     * @type Object
     */
    TIMER: {
      duration: null,
      start:    null,
      end:      null
    }
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
   * Get the execution time of the current code
   *
   * @method executionTime
   * @static
   */
  ENGEL.STACK.prototype.executionTime = function() {
    if (this.TIMER.start && this.TIMER.end) { return this.TIMER; }
    else return void 0;
  };

  /**
   * Get specific variable from the stack
   *
   * @method get
   * @return {Object}
   * @static
   */
  ENGEL.STACK.prototype.get = function(value) {
    if (this.VAR[value]) { return this.VAR[value]; }
    else return void 0;
  };

  /**
   * Get specific variable value from the stack
   *
   * @method getValue
   * @return {Object}
   * @static
   */
  ENGEL.STACK.prototype.getValue = function(value) {
    if (this.VAR[value]) { return this.VAR[value].value.value; }
    else return void 0;
  };

  /**
   * Update specific variable in the stack
   *
   * @method update
   * @return {Object}
   * @static
   */
  ENGEL.STACK.prototype.update = function(value, data) {
    if (this.VAR[value]) { return this.VAR[value].value = data; }
    else return void 0;
  };

  /**
   * Create a clean virgin variable in the stack
   *
   * @method createVariable
   * @return {Object}
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
    else return void 0;
  };

}).call(this);