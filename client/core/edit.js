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
  CORE.Grid.prototype.getEditSelection = function(object) {

    if (!object || object === undefined) return void 0;

    /** New edit selection position */
    var newLetter = CORE.$.numberToAlpha(object.letter),
        newNumber = object.number,
        jumps = 0,
        element = null;

    /** User edits something right now */
    CORE.Sheets[CORE.CurrentSheet].Input.Mouse.Edit = true;

    jumps = CORE.$.getCell(object);
    if (jumps >= 0) element = CORE.DOM.Output.children[jumps];

    /** Clean old edited cell */
    if (element) element.classList.remove("cell_edit");

    /** Update current edited cell */
    if (element) {

      element.classList.add("cell_edit");

      /** Register new cell */
      if (!CORE.Cells.Used[CORE.CurrentSheet][newLetter]) {
        CORE.registerCell(newLetter + newNumber);
      } else if (!CORE.Cells.Used[CORE.CurrentSheet][newLetter][newLetter + newNumber]) CORE.registerCell(newLetter + newNumber);

      /** Cell was successfully registered */
      if (CORE.Cells.Used[CORE.CurrentSheet][newLetter] && CORE.Cells.Used[CORE.CurrentSheet][newLetter][newLetter + newNumber]) {
        /** Cell was successfully registered into the interpreter cell stack */
        if (CORE.validCell(newLetter + newNumber)) {
          /** Cell has a formula */
          if (CORE.Cells.Used[CORE.CurrentSheet][newLetter][newLetter + newNumber].Formula && 
              CORE.Cells.Used[CORE.CurrentSheet][newLetter][newLetter + newNumber].Formula.length) {
            /** Cell formula doesnt match with its content (seems like we got a calculation result) */
            if (CORE.Cells.Used[CORE.CurrentSheet][newLetter][newLetter + newNumber].Formula !== CORE.Cells.Used[CORE.CurrentSheet][newLetter][newLetter + newNumber].Content) {
              /** Disgorge the formula */
              element.innerHTML = CORE.Cells.Used[CORE.CurrentSheet][newLetter][newLetter + newNumber].Formula;
              /** Move cursor to end of cell content text */
              this.goToEndOfCellText();
            }
          }
        /** Cell not registered yet */
        } else {
          /** Register the cell into the interpreter variable stack */
          CORE.registerCellVariable(newLetter + newNumber);
          /** Cell has a formula */
          if (CORE.Cells.Used[CORE.CurrentSheet][newLetter][newLetter + newNumber].Formula && 
              CORE.Cells.Used[CORE.CurrentSheet][newLetter][newLetter + newNumber].Formula.length) {
            /** Cell formula doesnt match with its content (seems like we got a calculation result) */
            if (CORE.Cells.Used[CORE.CurrentSheet][newLetter][newLetter + newNumber].Formula !== CORE.Cells.Used[CORE.CurrentSheet][newLetter][newLetter + newNumber].Content) {
              /** Disgorge the formula */
              element.innerHTML = CORE.Cells.Used[CORE.CurrentSheet][newLetter][newLetter + newNumber].Formula;
              /** Move cursor to end of cell content text */
              this.goToEndOfCellText();
            }
          }
        }
      }

    }

    /** Update old edited cell */
    CORE.Sheets[CORE.CurrentSheet].Selector.Edit = (newLetter + newNumber);

    /** Update current selected cell */
    CORE.DOM.CurrentCell.innerHTML = CORE.Sheets[CORE.CurrentSheet].Selector.Edit;

    /** Make sure all selections are deleted */
    CORE.Sheets[CORE.CurrentSheet].Selector.deleteCellHoverEffect();

    /** Update selection menu */
    CORE.Sheets[CORE.CurrentSheet].Selector.menuSelection( (CORE.$.alphaToNumber(newLetter) - 1), (newNumber - 1));

  };

  /**
   * Clean edited cells
   *
   * @method cleanEditSelection
   * @static
   */
  CORE.Grid.prototype.cleanEditSelection = function() {

    if (CORE.Sheets[CORE.CurrentSheet].Selector.Edit) {

      var letter = CORE.Sheets[CORE.CurrentSheet].Selector.Edit.match(CORE.REGEX.numbers).join(""),
          number = ~~(CORE.Sheets[CORE.CurrentSheet].Selector.Edit.match(CORE.REGEX.letters).join("")),
          jumps = ((this.Settings.y * (CORE.$.alphaToNumber(letter) - 1) ) + number - 1 - this.Settings.scrolledY) - (this.Settings.y * this.Settings.scrolledX);

      if (CORE.DOM.Output.children[jumps]) {
        CORE.DOM.Output.children[jumps].classList.remove("cell_edit");
      }
      if (CORE.DOM.Output.children[jumps + CORE.Sheets[CORE.CurrentSheet].Settings.lastScrollY]) {
        CORE.DOM.Output.children[jumps + CORE.Sheets[CORE.CurrentSheet].Settings.lastScrollY].classList.remove("cell_edit");
      }
      if (CORE.DOM.Output.children[jumps - CORE.Sheets[CORE.CurrentSheet].Settings.lastScrollY]) {
        CORE.DOM.Output.children[jumps - CORE.Sheets[CORE.CurrentSheet].Settings.lastScrollY].classList.remove("cell_edit");
      }

      /** Cell was successfully registered */
      if (CORE.Cells.Used[CORE.CurrentSheet][letter] && CORE.Cells.Used[CORE.CurrentSheet][letter][letter + number]) {
        /** Cell has a formula */
        if (CORE.Cells.Used[CORE.CurrentSheet][letter][letter + number].Formula && 
            CORE.Cells.Used[CORE.CurrentSheet][letter][letter + number].Formula.length) {
          /** Cell formula doesnt match with its content (seems like we got a calculation result) */
          if (CORE.Cells.Used[CORE.CurrentSheet][letter][letter + number].Formula !== CORE.Cells.Used[CORE.CurrentSheet][letter][letter + number].Content) {
            /** Disgorge the formula */
            jumps = CORE.$.getCell({ letter: letter, number: number });
            if (jumps >= 0) CORE.DOM.Output.children[jumps].innerHTML = CORE.Cells.Used[CORE.CurrentSheet][letter][letter + number].Content;
          }
        }
      }

    }

    /** User does not edit anything anymore */
    CORE.Sheets[CORE.CurrentSheet].Input.Mouse.Edit = false;

  };

  /**
   * Go to the end of a cell content text
   *
   * @method goToEndOfCellText
   * @static
   */
  CORE.Grid.prototype.goToEndOfCellText = function() {

    if (CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First.Letter && CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First.Number) {

      var jumps = CORE.$.getCell({ letter: CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First.Letter, number: CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First.Number });

      if (jumps >= 0) CORE.$.selectText(CORE.DOM.Output.children[jumps]);

    }

  };