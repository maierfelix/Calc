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

  /** TODO: Save formulated cells in seperate object for max performance gain */

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
            value: cells[ii][kk].Formula.substr(0, 0) + kk + cells[ii][kk].Formula.substr(0)
          });
        }
      }
    }

    if (formulas && formulas.length) {

      ENGEL.CurrentSheet = NOVAE.CurrentSheet;

      /** Process all found formulas */
      for (var ii = 0; ii < formulas.length; ++ii) {

        /** Receive the result */
        var result = this.evaluateFormula(formulas[ii].value);

        var name = formulas[ii].name;
        var letter = name.match(NOVAE.REGEX.numbers).join("");
        var number = ~~(name.match(NOVAE.REGEX.letters).join(""));

        /** Update used cell stack content */
        usedCellSheet[letter][formulas[ii].name].Content = result;

        /** Display the result, if cell is in view */
        var jumps = NOVAE.$.getCell({ letter: NOVAE.$.alphaToNumber(letter), number: number });
        if (jumps >= 0) NOVAE.DOM.Cache[jumps].innerHTML = result;

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
  NOVAE.evaluateFormula = function(formula) {

    var index = arguments[1] || undefined;

    var interpret = ENGEL.interpret(formula);

    var name = interpret.Variables.shift();

    if (index && index.length) {
      if (index[0] === name) {

        var muiButton = "mui-btn mui-btn-primary mui-btn-lg alertButton";
        var title = "<h2>Circular Reference detected!</h2><h3>It seems like you have a circular reference in " + name + ".</h3>";
        var buttons = "<button class='"+muiButton+" alertOk' name='ok'>Ok</button>";
        NOVAE_UI.Modal(title, buttons, function(submit) {});
        return ("CircularReference");
      }
    } else {
      index = [name];
    }

    /** Natural order recalculation */
    for (var ii = 0; ii < interpret.Variables.length; ++ii) {
      var letter = interpret.Variables[ii].match(NOVAE.REGEX.numbers).join("");
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter] &&
          NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][interpret.Variables[ii]] &&
          NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][interpret.Variables[ii]].Formula) {
          var result = NOVAE.evaluateFormula(interpret.Variables[ii] + NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][interpret.Variables[ii]].Formula, index || interpret.Variables);
          /** Break calculation */
          if (result === "CircularReference") return ("CircularReference");
      }
    }

    return (ENGEL.interpret(formula).Stack.VAR[ENGEL.CurrentSheet][name].value.value);

  };

  /**
   * Register a new cell into the interpreter stack
   *
   * @method registerCellVariable
   * @static
   */
  NOVAE.registerCellVariable = function() {

    /** Register sheet if not existing yet */
    if (!ENGEL.STACK.VAR[NOVAE.CurrentSheet]) {
      ENGEL.STACK.VAR[NOVAE.CurrentSheet] = {};
      ENGEL.CurrentSheet = NOVAE.CurrentSheet;
    }

    /** Cell is not registered yet */
    if (!ENGEL.STACK.get(arguments[0])) {
      /** Register the cell */
      ENGEL.STACK.createVariable(arguments[0]);
      /** Update cell stack name, check if it was successfully registered */
      if (ENGEL.STACK.VAR[ENGEL.CurrentSheet] && ENGEL.STACK.VAR[ENGEL.CurrentSheet][arguments[0]]) {
        /** Update the name */
        ENGEL.STACK.VAR[ENGEL.CurrentSheet][arguments[0]].name = arguments[0];
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

      var originalSheet = ENGEL.CurrentSheet;

      ENGEL.CurrentSheet = NOVAE.CurrentSheet;

      /** Update the cell value */
      ENGEL.STACK.update(name, {
        raw: arguments[1],
        value: ENGEL.TypeMaster(arguments[1]).value,
        type: "number"
      });

      ENGEL.CurrentSheet = originalSheet;

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