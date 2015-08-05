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

    if (!isNaN(ast)) return (ast);

    if (!ast) return void 0;

    this.switcher = "interpretExpression";

    /** Got something special */
    if (ast.init) {
      return (this.Functions[ast.operator](ast.init));
    }

    /** Function call */
    if (ast.CallExpression) {
      return (this.evalExpression(ast.CallExpression));
    }

    /** If statement */
    if (ast.IfStatement) {
      return (this.evalIfStatement(ast.IfStatement));
    }

    /** Got a variable */
    if (ast.Identifier) {
      var value = ENGEL.STACK.getValue(ast.Identifier.value);
      /** Handle boolean types */
      if (["TRUE", "FALSE"].indexOf(value) >= 0) {
        return (value === "TRUE" || false);
      }
      if (value || value === "" || value === 0) return value;
      return (true);
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
      var rangeResult = this.getCellContent(range.range);
      range.length = rangeResult.length;
      range.result = rangeResult.result;
      return (range);
    }

    /** Got a sheet variable reference */
    if (ast.SheetReference) {
      var sheet = ast.SheetReference.Sheet;
      var value = ast.SheetReference.value;
      var result = "ReferenceError";
      if (ENGEL.STACK.VAR[sheet]) {
        if (ENGEL.STACK.VAR[sheet][value]) {
          var letter = value.match(NOVAE.REGEX.numbers).join("");
          if (NOVAE.Cells.Used[sheet][letter][value].Formula.Stream) {
            result = ENGEL.interpret(value + NOVAE.Cells.Used[sheet][letter][value].Formula.Stream).Stack.VAR[sheet][value].value.value;
          } else {
            result = NOVAE.Cells.Used[sheet][letter][value].Content;
          }
          if (!isNaN(result)) result = parseFloat(result);
          NOVAE.updateCell(value, result);
        } else {
          result = 0;
        }
      } else {
        result = 0;
      }
      return (result);
    }

    /** Got a number or string */
    if (ast.Literal) {
      /** Only let strings pass */
      if (isNaN(ast.Literal.value)) {
        var value = ast.Literal.value.toLowerCase();
        /** Got a fake boolean */
        if (["true", "false"].indexOf(value) >= 0) {
          /** Fake bool conversion */
          return (value === "true" ? true : false);
        }
      }
      /** Got a string or number */
      return (ast.Literal.value);
    }

    /** Got an operator */
    if (this.Functions[ast.operator]) {
      return (this.Functions[ast.operator](ast));
    }

    return void 0;

  };

  /**
   * Get cell content of a range
   *
   * @method getCellContent
   * @static
   */
  ENGEL.EVAL.prototype.getCellContent = function(array) {

    var result = 0;

    var resultArray = [];

    var length = array.length;

    for (var ii = 0; ii < length; ++ii) {
      var letter = NOVAE.$.numberToAlpha(array[ii].letter);
      var number = array[ii].number;
      var name = letter + number;
      var value = ENGEL.STACK.getValue(name);
      if (value !== null && value !== void 0) {
        if (["TRUE", "FALSE"].indexOf(value) <= -1) {
          if (!isNaN(value)) {
            result += value;
          }
          resultArray.push(value);
        }
      }
    }

    return ({
      length: resultArray,
      result: result
    });

  };