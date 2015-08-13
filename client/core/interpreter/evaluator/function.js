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
   * Handle expressions
   *
   * @method evalExpression
   * @static
   */
  ENGEL.EVAL.prototype.evalExpression = function(node, name) {

    var self = this;

    var callee = node.callee;

    var args = node.arguments;

    callee.Identifier = callee.Identifier.toLowerCase();

    /** Built in functions */
    if (this.preDefFunc.func.indexOf(callee.Identifier) >= 0) {

      /** Final result */
      var result = null;

      /** Compiled arguments */
      var argumentArray = [];

      /** Compile arguments */
      for (var ii = 0; ii < args.length; ++ii) {
        if (!args[ii] || !args[ii].CallExpression) {
          argumentArray.push(this.interpretExpression(args[ii]));
        } else {
          /** Evaluate the function call, dont pass over a variable name to update! */
          argumentArray.push(this.evalExpression(args[ii].CallExpression));
        }
      }

      switch (callee.Identifier) {

        /** SUM */
        case "sum":
          for (var ii = 0; ii < argumentArray.length; ++ii) {
            if (argumentArray[ii] && argumentArray[ii].range) {
              result += argumentArray[ii].result;
            } else {
              /** Don't count booleans */
              if (typeof argumentArray[ii] !== "boolean") {
                result += argumentArray[ii];
              }
            }
          }
        break;

        /** COUNT */
        case "count":

          var length = 0;

          for (var ii = 0; ii < argumentArray.length; ++ii) {
            if (argumentArray[ii] && argumentArray[ii].range) {
              for (var kk = 0; kk < argumentArray[ii].length.length; ++kk) {
                var value = argumentArray[ii].length[kk];
                if (value !== "" && !isNaN(value)) {
                  length++;
                }
              }
            } else {
              /** Don't count booleans */
              if (typeof argumentArray[ii] !== "boolean") {
                length++;
              }
            }
          }

          result = length;

        break;

        /** BETWEEN */
        case "between":
          for (var ii = 0; ii < argumentArray.length; ++ii) {
            if (argumentArray[ii] && argumentArray[ii].range) {
              argumentArray[ii] = argumentArray[ii].result;
            }
          }
          var a = argumentArray[0];
          var b = argumentArray[2];
          var c = argumentArray[1];
          /** Empty cell */
          if (typeof a === "boolean") {
            a = a ? 1 : 0;
          }
          if (typeof a === "number") {
            if (a <= b && a >= c) {
              result = "TRUE";
            } else {
              result = "FALSE";
            }
          }
        break;

        /** AVERAGE */
        case "average":
          var calc = [];
          for (var ii = 0; ii < argumentArray.length; ++ii) {
            if (argumentArray[ii] && argumentArray[ii].range) {
              for (var kk = 0; kk < argumentArray[ii].length.length; ++kk) {
                var value = argumentArray[ii].length[kk];
                if (value !== "" && !isNaN(value)) {
                  calc.push(argumentArray[ii].length[kk]);
                }
              }
            } else {
              /** Don't count booleans */
              if (typeof argumentArray[ii] !== "boolean") {
                calc.push(argumentArray[ii]);
              }
            }
          }
          if (calc.length) {
            result = Math.average(calc);
          } else {
            result = 0;
          }
        break;

      }

      /** Update variable in the stack */
      if (name && ENGEL.STACK.get(name)) {
        ENGEL.STACK.update(name, {
          raw: result,
          value: self.TypeMaster(result).value,
          type: typeof result
        });
      }

      return (result);

    }

    /** Math api */
    if (this.preDefFunc.math.indexOf(callee.Identifier) >= 0) {

      /** Final result */
      var result = null;

      /** Math function doesn't exist */
      if (!window.Math[callee.Identifier]) {
        result = 0;
        /** Update variable in the stack */
        if (ENGEL.STACK.get(name)) {
          ENGEL.STACK.update(name, {
            raw: result,
            value: self.TypeMaster(result).value,
            type: typeof result
          });
        }
        /** Skip here */
        return void 0;
      }

      /** Compiled arguments */
      var argumentArray = [];

      /** Compile arguments */
      for (var ii = 0; ii < args.length; ++ii) {
        if (!args[ii] || !args[ii].CallExpression) {
          argumentArray.push(this.interpretExpression(args[ii]));
        } else {
          /** Evaluate the function call, dont pass over a variable name to update! */
          argumentArray.push(this.evalExpression(args[ii].CallExpression));
        }
      }

      /** Check if math api function exists */
      if (window.Math[callee.Identifier]) {

        if (argumentArray && argumentArray.length) {
          result = Math[callee.Identifier].apply(null, argumentArray);
        } else result = Math[callee.Identifier].apply(null, null);

      }

      /** Update variable in the stack */
      if (name && ENGEL.STACK.get(name)) {
        ENGEL.STACK.update(name, {
          raw: result,
          value: self.TypeMaster(result).value,
          type: typeof result
        });
      }

      return (result);

    }

  };

  /**
   * Recursively read a json tree
   *
   * @method readJSONTree
   * @static
   */
  ENGEL.EVAL.prototype.readJSONTree = function(data, index) {

    var value = null;

    /** Check if property exists */
    if (data[index[0]] !== undefined || data[index[0]] !== null) {
      value = index.shift();
      if (index.length >= 1) return (this.readJSONTree(data[value], index));
    }

    return (data[value]);

  };