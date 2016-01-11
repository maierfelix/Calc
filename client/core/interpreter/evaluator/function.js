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

          result = this.count(argumentArray);

        break;

        /** COUNT IF */
        case "countif":

          var a = argumentArray[0];
          var condition = argumentArray[1];

          /** Make sure we have a maximum of 2 arguments */
          argumentArray.length = 1;

          if (a.range) {

            var range = a.range[0].letter + a.range[0].number;
                range += ":" + a.range[a.range.length - 1].letter + a.range[a.range.length - 1].number;

            var string = "_PLACEHOLDER = " + range + condition;

            var lex = ENGEL.Lexer.lex(string);
            var ast = ENGEL.Parser.parse(lex.tokens);

            /** Condition met */
            if (this.evaluate(ast)) {
              result = this.count(argumentArray[0]);
            }

          } else {
            result = 0;
          }

        /** Clean placeholder */
        if (ENGEL.STACK.VAR[ENGEL.CurrentSheet]) {
          if (ENGEL.STACK.VAR[ENGEL.CurrentSheet]["_PLACEHOLDER"]) {
            delete ENGEL.STACK.VAR[ENGEL.CurrentSheet]["_PLACEHOLDER"];
          }
         }

        break;

        /** COUNT IFS */
        case "countifs":

          result = 0;

          for (var ii = 0, jumper = 1; ii < argumentArray.length; ++ii) {
            /** Range or cell */
            if (jumper >= 1) {
              jumper = 0;
            /** Condition */
            } else {
              jumper++;

              var a = argumentArray[ii - 1];
              var condition = argumentArray[ii];

              var range = a.range[0].letter + a.range[0].number;
                  range += ":" + a.range[a.range.length - 1].letter + a.range[a.range.length - 1].number;

              var string = "_PLACEHOLDER = " + range + condition;

              var lex = ENGEL.Lexer.lex(string);
              var ast = ENGEL.Parser.parse(lex.tokens);

              /** Condition met */
              if (this.evaluate(ast)) {
                result += this.count(argumentArray[ii - 1]);
              } else {
                result = 0;
                break;
              }

            }
          }

          /** Clean placeholder */
          if (ENGEL.STACK.VAR[ENGEL.CurrentSheet]) {
            if (ENGEL.STACK.VAR[ENGEL.CurrentSheet]["_PLACEHOLDER"]) {
              delete ENGEL.STACK.VAR[ENGEL.CurrentSheet]["_PLACEHOLDER"];
            }
          }

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

        /** NOT */
        case "not":
          result = ENGEL.TypeMaster.parseBoolean(argumentArray[0]) ? "FALSE" : "TRUE";
        break;

        /** IS NUMBER */
        case "isnumber":
          var strictConditon = true;
          for (var ii = 0; ii < argumentArray.length; ++ii) {
            if (typeof argumentArray[ii] !== "number" || isNaN(argumentArray[ii]) || argumentArray[ii] === Infinity) {
              strictConditon = false;
              break;
            }
          }
          result = strictConditon ? "TRUE" : "FALSE";
        break;

        /** IS TEXT */
        case "istext":
          var strictConditon = true;
          for (var ii = 0; ii < argumentArray.length; ++ii) {
            if (typeof argumentArray[ii] !== "string" || !argumentArray[ii].length) {
              strictConditon = false;
              break;
            }
          }
          result = strictConditon ? "TRUE" : "FALSE";
        break;

        /** IS LOGICAL */
        case "islogical":
          var strictConditon = true;
          for (var ii = 0; ii < argumentArray.length; ++ii) {
            if (["TRUE", "FALSE", true, false].indexOf(argumentArray[ii]) <= -1) {
              strictConditon = false;
              break;
            }
          }
          result = strictConditon ? "TRUE" : "FALSE";
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

  /**
   * Count function
   *
   * @method count
   * @static
   */
  ENGEL.EVAL.prototype.count = function(args) {

    var length = 0;

    if (args instanceof Array) {

      for (var ii = 0; ii < args.length; ++ii) {
        /** Range */
        if (args[ii] && args[ii].range) {
          for (var kk = 0; kk < args[ii].length.length; ++kk) {
            var value = args[ii].length[kk];
            if (value !== "" && !isNaN(value)) {
              length++;
            }
          }
        /** Identifier */
        } else {
          /** Don't count booleans */
          if (typeof args[ii] !== "boolean") {
            length++;
          }
        }
      }

      return (length);

    }

    /** Range */
    if (args && args.range) {
      for (var ii = 0; ii < args.length.length; ++ii) {
        var value = args.length[ii];
        if (value !== "" && !isNaN(value)) {
          length++;
        }
      }
    /** Identifier */
    } else {
      /** Don't count booleans */
      if (typeof args !== "boolean") {
        length++;
      }
    }

    return (length);

  };