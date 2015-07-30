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
   * Mark edited cell
   *
   * @method getEditSelection
   * @static
   */
  NOVAE.Grid.prototype.getEditSelection = function(object) {

    if (!object || object === undefined) return void 0;

    /** New edit selection position */
    var newLetter = NOVAE.$.numberToAlpha(object.Letter);
    var newNumber = object.Number;
    var jumps = 0;
    var element = null;

    /** User edits something right now */
    NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.Edit = true;

    jumps = NOVAE.$.getCell({ letter: object.Letter, number: object.Number });
    if (jumps >= 0) element = NOVAE.DOM.Cache[jumps];

    /** Clean old edited cell */
    if (element) element.classList.remove("cell_edit");

    /** Update current edited cell */
    if (element) {

      element.classList.add("cell_edit");

      /** Register new cell */
      if (!NOVAE.Cells.Used[NOVAE.CurrentSheet][newLetter]) {
        NOVAE.registerCell(newLetter + newNumber);
      } else if (!NOVAE.Cells.Used[NOVAE.CurrentSheet][newLetter][newLetter + newNumber]) NOVAE.registerCell(newLetter + newNumber);

      /** Cell was successfully registered */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][newLetter] && NOVAE.Cells.Used[NOVAE.CurrentSheet][newLetter][newLetter + newNumber]) {
        /** Cell was successfully registered into the interpreter cell stack */
        if (NOVAE.validCell(newLetter + newNumber)) {
          /** Cell has a formula */
          if (NOVAE.Cells.Used[NOVAE.CurrentSheet][newLetter][newLetter + newNumber].Formula && 
              NOVAE.Cells.Used[NOVAE.CurrentSheet][newLetter][newLetter + newNumber].Formula.length) {
            /** Cell formula doesnt match with its content (seems like we got a calculation result) */
            if (NOVAE.Cells.Used[NOVAE.CurrentSheet][newLetter][newLetter + newNumber].Formula !== NOVAE.Cells.Used[NOVAE.CurrentSheet][newLetter][newLetter + newNumber].Content) {
              /** Disgorge the formula */
              element.innerHTML = NOVAE.Cells.Used[NOVAE.CurrentSheet][newLetter][newLetter + newNumber].Formula;
              /** Move cursor to end of cell content text */
              this.goToEndOfCellText();
            }
          }
        /** Cell not registered yet */
        } else {
          /** Register the cell into the interpreter variable stack */
          NOVAE.registerCellVariable(newLetter + newNumber);
          /** Cell has a formula */
          if (NOVAE.Cells.Used[NOVAE.CurrentSheet][newLetter][newLetter + newNumber].Formula && 
              NOVAE.Cells.Used[NOVAE.CurrentSheet][newLetter][newLetter + newNumber].Formula.length) {
            /** Cell formula doesnt match with its content (seems like we got a calculation result) */
            if (NOVAE.Cells.Used[NOVAE.CurrentSheet][newLetter][newLetter + newNumber].Formula !== NOVAE.Cells.Used[NOVAE.CurrentSheet][newLetter][newLetter + newNumber].Content) {
              /** Disgorge the formula */
              element.innerHTML = NOVAE.Cells.Used[NOVAE.CurrentSheet][newLetter][newLetter + newNumber].Formula;
              /** Move cursor to end of cell content text */
              this.goToEndOfCellText();
            }
          }
        }
      }

    }

    /** Update old edited cell */
    NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Edit = (newLetter + newNumber);

    /** Update current selected cell */
    NOVAE.DOM.CurrentCell.innerHTML = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Edit;

    /** Make sure all selections are deleted */
    NOVAE.Sheets[NOVAE.CurrentSheet].Selector.deleteCellHoverEffect();

    /** Update selection menu */
    NOVAE.Sheets[NOVAE.CurrentSheet].Selector.menuSelection( (NOVAE.$.alphaToNumber(newLetter) - 1), (newNumber - 1));

  };

  /**
   * Clean edited cells
   *
   * @method cleanEditSelection
   * @static
   */
  NOVAE.Grid.prototype.cleanEditSelection = function() {

    if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Edit) {

      var letter = NOVAE.$.alphaToNumber(NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Edit.match(NOVAE.REGEX.numbers).join(""));
      var number = ~~(NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Edit.match(NOVAE.REGEX.letters).join(""));

      var jumps = NOVAE.$.getCell({letter: letter, number: number});

      if (NOVAE.DOM.Cache[jumps]) {
        NOVAE.DOM.Cache[jumps].classList.remove("cell_edit");
      }
      if (NOVAE.DOM.Cache[jumps + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY]) {
        NOVAE.DOM.Cache[jumps + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY].classList.remove("cell_edit");
      }
      if (NOVAE.DOM.Cache[jumps - NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY]) {
        NOVAE.DOM.Cache[jumps - NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY].classList.remove("cell_edit");
      }

      /** Cell was successfully registered */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter] && NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number]) {
        /** Cell has a formula */
        if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number].Formula && 
            NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number].Formula.length) {
          /** Cell formula doesnt match with its content (seems like we got a calculation result) */
          if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number].Formula !== NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number].Content) {
            /** Disgorge the formula */
            jumps = NOVAE.$.getCell({ letter: letter, number: number });
            if (jumps >= 0) NOVAE.DOM.Cache[jumps].innerHTML = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number].Content;
          }
        }
      }

    }

    /** User does not edit anything anymore */
    NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.Edit = false;

  };

  /**
   * Go to the end of a cell content text
   *
   * @method goToEndOfCellText
   * @static
   */
  NOVAE.Grid.prototype.goToEndOfCellText = function() {

    if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First.Letter && NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First.Number) {

      var jumps = NOVAE.$.getCell({ letter: NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First.Letter, number: NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First.Number });

      if (jumps >= 0) NOVAE.$.selectText(NOVAE.DOM.Cache[jumps]);

    }

  };