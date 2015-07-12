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
   * Interpret IF Statement
   *
   * @method evalIfStatement
   * @static
   */
  ENGEL.EVAL.prototype.evalIfStatement = function(ast) {

    if (!isNaN(ast)) return ast;

    if (!ast) return void 0;

    this.switcher = "interpretExpression";

    if (ast.operator === "LX_IF") {

      /** Get if condition */
      var condition = ast.arguments[0] || void 0;

      if (condition && ast.arguments[1] && ast.arguments[2]) {

        /** Interpret condition */
        var result = this.interpretExpression(condition);

        /** TRUE */
        if (result) {
          return (this.interpretExpression(ast.arguments[1]));
        /** FALSE */
        } else {
          return (this.interpretExpression(ast.arguments[2]));
        }

      }

    }

    return void 0;

  };