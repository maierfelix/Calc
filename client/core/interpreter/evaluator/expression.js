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
      /** Return boolean to detect a undefined variable and the boolean =^ 0 */
      return (false);
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

      /** Sadly not working yet */
      return (0);

      var result;

      ENGEL.strict.push(ast.SheetReference.Sheet);

      /** Anti circular reference */
      if (ENGEL.strict.indexOf(ENGEL.CurrentSheet) >= 0 && ENGEL.strict.length >= Object.keys(NOVAE.Sheets).length) {
        var originalSheet = ENGEL.CurrentSheet;
        ENGEL.CurrentSheet = ast.SheetReference.Sheet;
        NOVAE.CurrentSheet = ast.SheetReference.Sheet;
        result = ENGEL.STACK.get(ast.SheetReference.value);
        ENGEL.CurrentSheet = originalSheet;
        NOVAE.CurrentSheet = originalSheet;
        if (result) {
          result = result.value.value;
        } else {
          result = 0;
        }
        return (result);
      }

      ENGEL.strict.push(ast.SheetReference.Sheet);

      var originalSheet = ENGEL.CurrentSheet;
      ENGEL.CurrentSheet = ast.SheetReference.Sheet;
      NOVAE.CurrentSheet = ast.SheetReference.Sheet;
      NOVAE.eval(true);
      result = ENGEL.STACK.get(ast.SheetReference.value);
      if (result) {
        result = result.value.value;
      } else {
        result = 0;
      }
      ENGEL.CurrentSheet = originalSheet;
      NOVAE.CurrentSheet = originalSheet;

      ENGEL.strict = [];

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