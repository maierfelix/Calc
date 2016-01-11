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

  /** TODO: Save formulated cells in seperate object for max performance gain */

  /**
   * Run the interpreter
   *
   * @method eval
   * @static
   */
  NOVAE.eval = function(strict) {

    var cells = NOVAE.Cells.Used[NOVAE.CurrentSheet];
    var usedCellSheet = NOVAE.Cells.Used[NOVAE.CurrentSheet];

    var formulas = [];

    var result = 0;

    for (var ii in cells) {
      for (var kk in cells[ii]) {
        /** Cell has a formula */
        if (cells[ii][kk].Formula.Stream && cells[ii][kk].Formula.Stream.length) {

          var formulaObject = {
            name: kk,
            /** Validate formula, add the parent cell value before the formula to emulate a variable assignment */
            value: cells[ii][kk].Formula.Stream.substr(0, 0) + kk + cells[ii][kk].Formula.Stream.substr(0)
          };

          var tokens = ENGEL.Lexer.lex(formulaObject.value);

          formulaObject.lexed = tokens;

          cells[ii][kk].Formula.Lexed = tokens;

          /** The formula behind the variable assignment */
          formulas.push(formulaObject);

        }
      }
    }

    if (formulas && formulas.length) {

      ENGEL.CurrentSheet = NOVAE.CurrentSheet;

      /** Process all found formulas */
      for (var ii = 0; ii < formulas.length; ++ii) {

        /** Receive the result */
        var result = this.evaluateFormula(formulas[ii].lexed, void 0);

        var name = formulas[ii].name;
        var letter = NOVAE.$.getLetters(name);
        var number = NOVAE.$.getNumbers(name);

        /** Update used cell stack content */
        usedCellSheet[letter][formulas[ii].name].Content = result;

        /** Display the result, if cell is in view */
        if (!strict) {
          var jumps = NOVAE.$.getCell({ letter: NOVAE.$.alphaToNumber(letter), number: number });
          if (jumps >= 0) NOVAE.DOM.Cache[jumps].innerHTML = result;
        }

      }

    }

  };

  /**
   * Recursive evaluate a formula
   * Consider natural order recalculation, means recalculate each dependent cell
   * before calculate the real result
   *
   * @method evaluateFormula
   * @static
   */
  NOVAE.evaluateFormula = function(formula, index) {

    var interpret = ENGEL.interpretTokens(formula.tokens.slice(0));

    /** Validate all cell references, split ranges etc */
    formula.variables = NOVAE.$.validateCellReferences(formula.variables);

    var name = formula.variables.shift();

    if (index && index.length) {
      if (index[0] === name) {
        return ("CircularReference");
      }
    } else {
      index = [name];
    }

    /** Natural order recalculation */
    for (var ii = 0; ii < formula.variables.length; ++ii) {
      var letter = NOVAE.$.getLetters(formula.variables[ii]);
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter] &&
          NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][formula.variables[ii]] &&
          NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][formula.variables[ii]].Formula.Lexed &&
          NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][formula.variables[ii]].Formula.Lexed.tokens) {
          var result = NOVAE.evaluateFormula(NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][formula.variables[ii]].Formula.Lexed, index || formula.variables);
          /** Break calculation */
          if (result === "CircularReference") return ("CircularReference");
      }
    }

    name = formula.tokens[0].value;

    return (ENGEL.interpretTokens(formula.tokens.slice(0)).Stack.VAR[ENGEL.CurrentSheet][name].value.value);

  };

  /**
   * Register a new cell into the interpreter stack
   *
   * @method registerCellVariable
   * @static
   */
  NOVAE.registerCellVariable = function(name) {

    /** Register sheet if not existing yet */
    if (!ENGEL.STACK.VAR[NOVAE.CurrentSheet]) {
      ENGEL.STACK.VAR[NOVAE.CurrentSheet] = {};
      ENGEL.CurrentSheet = NOVAE.CurrentSheet;
    }

    /** Cell is not registered yet */
    if (!ENGEL.STACK.get(name)) {
      /** Register the cell */
      ENGEL.STACK.createVariable(name);
      /** Update cell stack name, check if it was successfully registered */
      if (ENGEL.STACK.VAR[ENGEL.CurrentSheet] && ENGEL.STACK.VAR[ENGEL.CurrentSheet][name]) {
        /** Update the name */
        ENGEL.STACK.VAR[ENGEL.CurrentSheet][name].name = name;
      } else throw new Error("Fatal Error, failed to register " + name + "!");
    }

  };

  /**
   * Check if a cell was successfully registered into the interpreter cell stack
   *
   * @method validCell
   * @static
   */
  NOVAE.validCell = function(name) {

    /** Cell is registered */
    if (ENGEL.STACK.get(name)) return (true);
    /** Cell is not registered */
    return (false);

  };

  /**
   * Update a cell in the stack
   *
   * @method updateCell
   * @static
   */
  NOVAE.updateCell = function(name, value) {

    /** Cell was registered successfully */
    if (ENGEL.STACK.get(name)) {

      var originalSheet = ENGEL.CurrentSheet;

      ENGEL.CurrentSheet = NOVAE.CurrentSheet;

      /** Update the cell value */
      ENGEL.STACK.update(name, {
        raw: value,
        value: ENGEL.TypeMaster(value).value,
        type: "number"
      });

      ENGEL.CurrentSheet = originalSheet;

    } else {
      NOVAE.registerCell(name);
      NOVAE.updateCell(name, value);
    }

  };

  /**
   * Register a cell into the cell used stack
   *
   * @method registerCell
   * @static
   */
  NOVAE.registerCell = function(name, sheet) {

    sheet = sheet || NOVAE.CurrentSheet;

    var letter = NOVAE.$.getLetters(name);
    var number = NOVAE.$.getNumbers(name);

    NOVAE.Cells.Used.registerCell(letter + number, sheet);

  };