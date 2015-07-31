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
   * Interpret Expression
   *
   * @method interpretExpression
   * @static
   */
  ENGEL.EVAL.prototype.interpretExpression = function(ast) {

    if (!isNaN(ast)) return ast;

    if (!ast) return void 0;

    this.switcher = "interpretExpression";

    /** Got something special */
    if (ast.init) {
      return this.Functions[ast.operator](ast.init);
    }

    /** Function call */
    if (ast.CallExpression) {
      return this.evalExpression(ast.CallExpression);
    }

    /** If statement */
    if (ast.IfStatement) {
      return this.evalIfStatement(ast.IfStatement);
    }

    /** Got a variable */
    if (ast.Identifier) {
      var value = ENGEL.STACK.getValue(ast.Identifier.value);
      if (value || value === "" || value === 0) return value;
      return void 0;
    }

    /** Got a range */
    if (ast.Range) {
      /** Return range array */
      var range = {
        length: 0,
        result: 0,
        range: null
      };
      range.range = NOVAE.$.rangeToSelection(ast.Range.value);
      range.length = NOVAE.$.getSelectionCellProperty(range.range, "Content").length;
      range.result = NOVAE.$.getValueFromCoordinates(range.range);
      return (range);
    }

    /** Got a sheet variable reference */
    if (ast.SheetReference) {
      var sheet = ast.SheetReference.Sheet;
      var value = ast.SheetReference.value;
      var result = "ReferenceError";
      var originalSheet = ENGEL.CurrentSheet;
      var originalNovaeSheet = NOVAE.CurrentSheet;
      if (ENGEL.STACK.VAR[sheet]) {
        if (ENGEL.STACK.VAR[sheet][value]) {
          result = ENGEL.STACK.VAR[sheet][value].value.value;
        } else {
          result = 0;
        }
      }
      return result;
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