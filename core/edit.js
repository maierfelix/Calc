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
(function() { "use strict"

  /**
   * Mark edited cell
   *
   * @method getEditSelection
   * @static
   */
  CORE.Grid.prototype.getEditSelection = function(id) {

    if (!id || id === undefined) return void 0;

    /** New edit selection position */
    var newLetter = id.match(CORE.REGEX.numbers).join(""),
        newNumber = parseInt(id.match(CORE.REGEX.letters).join("")),
        newJumps = 0,
        /** Old edit selection position */
        oldLetter = null,
        oldNumber = 0,
        oldJumps = 0;

    /** User edits something right now */
    CORE.Input.Mouse.Edit = true;

    newJumps = ((this.Settings.y * (CORE.$.alphaToNumber(newLetter) - 1) ) + newNumber - 1 - this.Settings.scrolledY) - (this.Settings.y * this.Settings.scrolledX);

    /** Clean old edited cell border */
    if (CORE.Cells.Edit) {

      oldLetter = CORE.Cells.Edit.match(CORE.REGEX.numbers).join("");
      oldNumber = parseInt(CORE.Cells.Edit.match(CORE.REGEX.letters).join(""));
      oldJumps = ((this.Settings.y * (CORE.$.alphaToNumber(oldLetter) - 1) ) + oldNumber - 1 - this.Settings.scrolledY) - (this.Settings.y * this.Settings.scrolledX);

      if (CORE.DOM.Output.children[oldJumps]) {
        CORE.DOM.Output.children[oldJumps].classList.remove("cell_edit");
      }
    }

    /** Update current edited cell border */
    if (CORE.DOM.Output.children[newJumps]) {

      CORE.DOM.Output.children[newJumps].classList.add("cell_edit");

      /** Register new cell */
      if (!CORE.Cells.Used[newLetter + newNumber]) {
        CORE.Cells.Used[newLetter + newNumber] = new CORE.Grid.Cell();
        /** Register the cell into the interpreter variable stack */
        CORE.registerCell(newLetter + newNumber);
      }

      /** Cell was successfully registered */
      if (CORE.Cells.Used[newLetter + newNumber]) {
        /** Cell was successfully registered into the interpreter cell stack */
        if (CORE.validCell(newLetter + newNumber)) {
          /** Cell has a formula */
          if (CORE.Cells.Used[newLetter + newNumber].Formula && 
              CORE.Cells.Used[newLetter + newNumber].Formula.length) {
            /** Cell formula doesnt match with its content (seems like we got a calculation result) */
            if (CORE.Cells.Used[newLetter + newNumber].Formula !== CORE.Cells.Used[newLetter + newNumber].Content) {
              /** Disgorge the formula */
              CORE.DOM.Output.children[newJumps].innerHTML = CORE.Cells.Used[newLetter + newNumber].Formula;
              /** Move cursor to end of cell content text */
              this.goToEndOfCellText();
            }
          }
        /** Register the cell into the interpreter cell stack */
        } else {
          /** Register the cell into the interpreter variable stack */
          CORE.registerCell(newLetter + newNumber);
          /** Cell has a formula */
          if (CORE.Cells.Used[newLetter + newNumber].Formula && 
              CORE.Cells.Used[newLetter + newNumber].Formula.length) {
            /** Cell formula doesnt match with its content (seems like we got a calculation result) */
            if (CORE.Cells.Used[newLetter + newNumber].Formula !== CORE.Cells.Used[newLetter + newNumber].Content) {
              /** Disgorge the formula */
              CORE.DOM.Output.children[newJumps].innerHTML = CORE.Cells.Used[newLetter + newNumber].Formula;
              /** Move cursor to end of cell content text */
              this.goToEndOfCellText();
            }
          }
        }
      }

    }

    /** Update old edited cell */
    CORE.Cells.Edit = (newLetter + newNumber);

    /** Make sure all selections are deleted */
    CORE.Selector.deleteCellHoverEffect();

    /** Update selection menu */
    CORE.Selector.menuSelection( (CORE.$.alphaToNumber(newLetter) - 1), (newNumber - 1));

  };

  /**
   * Clean edited cells
   *
   * @method cleanEditSelection
   * @static
   */
  CORE.Grid.prototype.cleanEditSelection = function() {

    if (CORE.Cells.Edit) {

      var letter = CORE.Cells.Edit.match(CORE.REGEX.numbers).join(""),
          number = parseInt(CORE.Cells.Edit.match(CORE.REGEX.letters).join("")),
          jumps = ((this.Settings.y * (CORE.$.alphaToNumber(letter) - 1) ) + number - 1 - this.Settings.scrolledY) - (this.Settings.y * this.Settings.scrolledX);

      if (CORE.DOM.Output.children[jumps]) {
        CORE.DOM.Output.children[jumps].classList.remove("cell_edit");
      }
      if (CORE.DOM.Output.children[jumps + CORE.Grid.Settings.lastScrollY]) {
        CORE.DOM.Output.children[jumps + CORE.Grid.Settings.lastScrollY].classList.remove("cell_edit");
      }
      if (CORE.DOM.Output.children[jumps - CORE.Grid.Settings.lastScrollY]) {
        CORE.DOM.Output.children[jumps - CORE.Grid.Settings.lastScrollY].classList.remove("cell_edit");
      }

      /** Cell was successfully registered */
      if (CORE.Cells.Used[letter + number]) {
        /** Cell has a formula */
        if (CORE.Cells.Used[letter + number].Formula && 
            CORE.Cells.Used[letter + number].Formula.length) {
          /** Cell formula doesnt match with its content (seems like we got a calculation result) */
          if (CORE.Cells.Used[letter + number].Formula !== CORE.Cells.Used[letter + number].Content) {
            /** Disgorge the formula */
            jumps = CORE.$.getCell(letter + number);
            if (jumps) CORE.DOM.Output.children[jumps].innerHTML = CORE.Cells.Used[letter + number].Content;
          }
        }
      }

    }

    /** User does not edit anything anymore */
    CORE.Input.Mouse.Edit = false;

  };

  /**
   * Go to the end of a cell content text
   *
   * @method goToEndOfCellText
   * @static
   */
  CORE.Grid.prototype.goToEndOfCellText = function() {

    if (CORE.Selector.Selected.First.Letter && CORE.Selector.Selected.First.Number) {

      var jumps = CORE.$.getCell(CORE.Selector.Selected.First.Letter + CORE.Selector.Selected.First.Number);

      if (jumps >= 0) CORE.$.selectText(CORE.DOM.Output.children[jumps]);

    }

  };

}).call(this);