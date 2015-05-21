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
(function() { "use strict"

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
      math: ["asin", "sin", "acos", "cos", "atan", "atan2", "tan", "sqrt", "cbrt", "exp", "random", "min", "max", "round", "floor", "ceil"],
      json: ["JSON", "json"],
      ajax: ["CONNECT", "connect"]
    };

  };

  ENGEL.EVAL.prototype = ENGEL;

  /**
   * Interpret Expression
   *
   * @method interpretExpression
   * @static
   */
  ENGEL.EVAL.prototype.interpretExpression = function(ast) {

    if (!isNaN(ast)) return ast;

    if (!ast) return void 0;

    this.switcher = "interpretExpression";

    /** Got a variable */
    if (ast.Identifier) {
      var value = ENGEL.STACK.getValue(ast.Identifier.value);
      if (value || value === "" || value === 0) return value;
      return 0;
    }

    /** Got a number or string */
    if (ast.Literal) {
      return ast.Literal.value;
    }

    /** Got an operator */
    if (this.Functions[ast.operator]) {
      return this.Functions[ast.operator](ast);
    }

    return void 0;

  };

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

      if (node.init.ExpressionStatement) {
        rawValue = this.interpretExpression(node.init.ExpressionStatement);
        ENGEL.STACK.update(node.id.name, {
          raw: rawValue,
          value: this.TypeMaster(rawValue).value,
          type: typeof rawValue
        });
        declared = node.id.name;
      } else if (node.init.SingleCallExpression) {
        rawValue = this.evalExpression(node.init.SingleCallExpression);
        declared = node.id.name;
      }

    }

  };

  /**
   * Handle expressions
   *
   * @method evalDirectiveExpression
   * @static
   */
  ENGEL.EVAL.prototype.evalDirectiveExpression = function(node) {

    ENGEL.STACK.createVariable("undefined");

    var rawValue = this.interpretExpression(node.init);

    ENGEL.STACK.update("undefined", {
      raw: rawValue,
      value: this.TypeMaster(rawValue).value,
      type: typeof rawValue
    });

  };

  /**
   * Evaluate AST
   *
   * @method evaluate
   * @static
   */
  ENGEL.EVAL.prototype.evaluate = function(ast) {

    /** Directive binary expression without any assignment */
    if (ast.DirectiveBinaryExpression) {
      this.evalDirectiveExpression(ast.DirectiveBinaryExpression);
    /** Variable value assignment */
    } else if (ast.AssignmentExpression) {
      this.evalVariable(ast.AssignmentExpression);
    }

  };

}).call(this);