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
   * Run the interpreter
   *
   * @method eval
   * @static
   */
  NOVAE.eval = function() {

    var cells = null;
    var usedCellSheet = null;

    if (arguments[0]) {
      cells = NOVAE.Cells.Used[arguments[0]];
      usedCellSheet = NOVAE.Cells.Used[arguments[0]];
    } else {
      cells = NOVAE.Cells.Used[NOVAE.CurrentSheet];
      usedCellSheet = NOVAE.Cells.Used[NOVAE.CurrentSheet];
    }

    var formulas = [];

    var result = 0;

    for (var ii in cells) {
      for (var kk in cells[ii]) {
        /** Cell has a formula */
        if (cells[ii][kk].Formula && cells[ii][kk].Formula.length) {
          /** The formula behind the variable assignment */
          formulas.push({
            name: kk,
            /** Validate formula, add the parent cell value before the formula to emulate a variable assignment */
            value: cells[ii][kk].Formula.substr(0, 0) + kk + cells[ii][kk].Formula.substr(0),
            variableReferences: NOVAE.$.getVariables(cells[ii][kk].Formula.substr(0))
          });
        }
      }
    }

    if (formulas && formulas.length) {
      /** Process all formulas found */
      for (var ii = 0; ii < formulas.length; ++ii) {

        if (formulas[ii].variableReferences && formulas[ii].variableReferences.length) {

          var variables = formulas[ii].variableReferences;

          /** TODO: Recursively pre-interpret variable references */

        }

        var letter = formulas[ii].name.match(NOVAE.REGEX.numbers).join("");

        /** Receive the result */
        result = ENGEL.interpret(formulas[ii].value).VAR[formulas[ii].name].value.value;
        /** Update used cell stack content */
        usedCellSheet[letter][formulas[ii].name].Content = result;

        var name = formulas[ii].name;
        var letter = NOVAE.$.alphaToNumber(name.match(NOVAE.REGEX.numbers).join(""));
        var number = ~~(name.match(NOVAE.REGEX.letters).join(""));

        /** Display the result, if cell is in view */
        var jumps = NOVAE.$.getCell({ letter: letter, number: number });
        if (jumps >= 0) NOVAE.DOM.Output.children[jumps].innerHTML = result;
      }
    }

  };

  /**
   * Register a new cell into the stack
   *
   * @method registerCellVariable
   * @static
   */
  NOVAE.registerCellVariable = function() {

    /** Cell is not registered yet */
    if (!ENGEL.STACK.get(arguments[0])) {
      /** Register the cell */
      ENGEL.STACK.createVariable(arguments[0]);
      /** Update cell stack name, check if it was successfully registered */
      if (ENGEL.STACK.VAR[arguments[0]]) {
        /** Update the name */
        ENGEL.STACK.VAR[arguments[0]].name = arguments[0];
      } else throw new Error("Fatal Error, failed to register " + arguments[0] + "!");
    }

  };

  /**
   * Check if a cell was successfully registered into the interpreter cell stack
   *
   * @method validCell
   * @static
   */
  NOVAE.validCell = function() {

    /** Cell is registered */
    if (ENGEL.STACK.get(arguments[0])) return (true);
    /** Cell is not registered */
    return (false);

  };

  /**
   * Update a cell in the stack
   *
   * @method updateCell
   * @static
   */
  NOVAE.updateCell = function(name) {

    /** Cell was registered successfully */
    if (ENGEL.STACK.get(name)) {

      /** Update the cell value */
      ENGEL.STACK.update(name, {
        raw: arguments[1],
        value: ENGEL.TypeMaster(arguments[1]).value,
        type: "number"
      });
    }

  };

  /**
   * Register a cell into the cell used stack
   *
   * @method registerCell
   * @static
   */
  NOVAE.registerCell = function() {

    var letter = arguments[0].match(NOVAE.REGEX.numbers).join("");
    var number = arguments[0].match(NOVAE.REGEX.letters).join("");

    NOVAE.$.registerCell({ letter: letter, number: number });

    /** Register the cell into the interpreter variable stack */
    NOVAE.registerCellVariable(arguments[0]);
  };

  /**
   * Register a live cell into the cell live stack
   *
   * @method registerLiveCell
   * @static
   */
  NOVAE.registerLiveCell = function() {
    NOVAE.Cells.Live[arguments[0]] = new NOVAE.Sheets[NOVAE.CurrentSheet].LiveCell();
  };