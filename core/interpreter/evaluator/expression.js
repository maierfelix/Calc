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