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
   * The Evaluator
   *
   * @class EVAL
   * @static
   */
  ENGEL.EVAL = function() {

    var self = this;

    /** Switch between variable and function expressions */
    this.switcher = null;

    /** Function names globally visible */
    this.functionName = null;

    this.executeFunction = function(operator, ast) {

      var a = self[self.switcher](ast.left, self.functionName);

      var b = self[self.switcher](ast.right, self.functionName);

      if (a.range) {
        a = a.result;
      }

      if (b.range) {
        b = b.range;
      }

      var result = null;

      switch (operator) {
        case "LX_POW":
          result = (Math.pow(a, b));
        break;
        case "LX_PLUS":
          result = (a + b);
        break;
        case "LX_MINUS":
          result = (a - b);
        break;
        case "LX_MULT":
          result = (a * b);
        break;
        case "LX_DIV":
          result = (a / b);
        break;
        case "LX_EQ":
          result = (a == b);
        break;
        case "LX_NEQ":
          result = (a != b);
        break;
        case "LX_GR":
          result = (a > b);
        break;
        case "LX_GRE":
          result = (a >= b);
        break;
        case "LX_LW":
          result = (a < b);
        break;
        case "LX_LWE":
          result = (a <= b);
        break;
        case "LX_AND":
          result = (!a ? a : b);
        break;
        case "LX_OR":
          result = (a ? a : b);
        break;
      }

      return (result);

    };

    this.UnaryFunction = {
      LX_UPLUS: function(c) {
        return +(self.interpretExpression(c));
      },
      LX_UMINUS: function(c) {
        return -(self.interpretExpression(c));
      },
    };

    /** Pre defined functions */
    this.preDefFunc = {
      /** Math api */
      math: ["asin", "sin", "acos", "cos", "atan", "atan2", "tan", "sqrt", "cbrt", "exp", "random", "min", "max", "round", "floor", "ceil", "roundTo"],
      json: ["json"],
      ajax: ["connect"],
      /** Functions */
      func: ["sum", "count", "countif", "countifs", "between", "average", "not", "isnumber", "istext", "islogical"]
    };

  };

  ENGEL.EVAL.prototype = ENGEL;

  /**
   * Handle Variables
   *
   * @method evalVariable
   * @static
   */
  ENGEL.EVAL.prototype.evalVariable = function(node) {

    var mode = node.kind;

    var nodes = node.declarations || node.expressions;

    var declared = null;

    /** Push Variable into Stack */
    if (node.id.type === "Identifier") {
      /** Initialise empty var stack variable */
      ENGEL.STACK.createVariable(node.id.name);
    }

    /** Assign expression to variable */
    if (node.init) {

      var rawValue;

      /** Simple value assignment */
      if (node.init.ExpressionStatement) {
        rawValue = this.interpretExpression(node.init.ExpressionStatement);
        ENGEL.STACK.update(node.id.name, {
          raw: rawValue,
          value: this.TypeMaster(rawValue).value,
          type: typeof rawValue
        });
        declared = node.id.name;
      /** Function call */
      } else if (node.init.CallExpression) {
        rawValue = this.evalExpression(node.init.CallExpression, node.id.name);
        declared = node.id.name;
      }

      return (rawValue);

    }

  };

  /**
   * Evaluate AST
   *
   * @method evaluate
   * @static
   */
  ENGEL.EVAL.prototype.evaluate = function(ast) {

    /** Variable value assignment */
    if (ast.AssignmentExpression) {
      return (this.evalVariable(ast.AssignmentExpression));
    }

  };