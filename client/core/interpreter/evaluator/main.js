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

    this.Functions = {
      LX_POW: function(c) {
        return Math.pow(self.interpretExpression(c.left), self.interpretExpression(c.right));
      },
      LX_UPLUS: function(c) {
        return +(self.interpretExpression(c));
      },
      LX_UMINUS: function(c) {
        return -(self.interpretExpression(c));
      },
      LX_PLUS: function(c) {
        return self[self.switcher](c.left, self.functionName) + self[self.switcher](c.right, self.functionName);
      },
      LX_MINUS: function(c) {
        return self[self.switcher](c.left, self.functionName) - self[self.switcher](c.right, self.functionName);
      },
      LX_MULT: function(c) {
        return self[self.switcher](c.left, self.functionName) * self[self.switcher](c.right, self.functionName);
      },
      LX_DIV: function(c) {
        return self[self.switcher](c.left, self.functionName) / self[self.switcher](c.right, self.functionName);
      },
      LX_EQ: function(c) { 
        return self[self.switcher](c.left, self.functionName) == self[self.switcher](c.right, self.functionName);
      },
      LX_NEQ: function(c) { 
        return self[self.switcher](c.left, self.functionName) != self[self.switcher](c.right, self.functionName);
      },
      LX_LW: function(c) { 
        return self[self.switcher](c.left, self.functionName) < self[self.switcher](c.right, self.functionName);
      },
      LX_GR: function(c) { 
        return self[self.switcher](c.left, self.functionName) > self[self.switcher](c.right, self.functionName);
      },
      LX_LWE: function(c) { 
        return self[self.switcher](c.left, self.functionName) <= self[self.switcher](c.right, self.functionName);
      },
      LX_GRE: function(c) { 
        return self[self.switcher](c.left, self.functionName) >= self[self.switcher](c.right, self.functionName);
      },
      LX_AND: function(c) {
        var result = self[self.switcher](c.left, self.functionName);
        if (!result) return result;
        return self[self.switcher](c.right, self.functionName);
      },
      LX_OR: function(c) {
        var result = self[self.switcher](c.left, self.functionName);
        if (result) return result;
        return self[self.switcher](c.right, self.functionName);
      }
    };

    /** Pre defined functions */
    this.preDefFunc = {
      display: ["log", "print"],
      /** Math api */
      math: ["asin", "sin", "acos", "cos", "atan", "atan2", "tan", "sqrt", "cbrt", "exp", "random", "min", "max", "round", "floor", "ceil", "roundTo"],
      json: ["JSON", "json"],
      ajax: ["CONNECT", "connect"]
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
      ENGEL.STACK.VAR[node.id.name] = {
        name: node.id.name,
        type: mode,
        value: {
          value: null,
          type: null,
          raw: null
        }
      };
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
      this.evalVariable(ast.AssignmentExpression);
    }

  };