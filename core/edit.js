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

    /** User edit something right now */
    CORE.Input.Mouse.Edit = true;

    newJumps = ( ( CORE.$.alphaToNumber(newLetter) - 1 ) * this.Settings.y ) + newNumber - 1;

    /** Clean old edited cell border */
    if (CORE.Cells.Edit) {

      oldLetter = CORE.Cells.Edit.match(CORE.REGEX.numbers).join("");
      oldNumber = parseInt(CORE.Cells.Edit.match(CORE.REGEX.letters).join(""));
      oldJumps = ( ( CORE.$.alphaToNumber(oldLetter) - 1 ) * this.Settings.y ) + oldNumber - 1;

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
        /** Cell has a formula */
        if (CORE.Cells.Used[newLetter + newNumber].Formula && 
            CORE.Cells.Used[newLetter + newNumber].Formula.length) {
          /** Cell formula doesnt match with its content (seems like we got a calculation result) */
          if (CORE.Cells.Used[newLetter + newNumber].Formula !== CORE.Cells.Used[newLetter + newNumber].Content) {
            /** Disgorge the formula, also trim it */
            CORE.DOM.Output.children[newJumps].innerHTML = (CORE.Cells.Used[newLetter + newNumber].Formula).trim();
          }
        }
      }

    }

    /** Update old edited cell */
    CORE.Cells.Edit = (newLetter + newNumber);

    /** Make sure all selections are deleted */
    CORE.Selector.deleteCellHoverEffect();

    /** Update selection menu */
    CORE.Selector.menuSelection((CORE.$.alphaToNumber(newLetter) - 1), (newNumber - 1));

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
          jumps = ( ( CORE.$.alphaToNumber(letter) - 1 ) * this.Settings.y ) + number - 1;

      if (CORE.DOM.Output.children[jumps]) {
        CORE.DOM.Output.children[jumps].classList.remove("cell_edit");
      }

      /** Cell was successfully registered */
      if (CORE.Cells.Used[letter + number]) {
        /** Cell has a formula */
        if (CORE.Cells.Used[letter + number].Formula && 
            CORE.Cells.Used[letter + number].Formula.length) {
          /** Cell formula doesnt match with its content (seems like we got a calculation result) */
          if (CORE.Cells.Used[letter + number].Formula !== CORE.Cells.Used[letter + number].Content) {
            /** Disgorge the formula */
            CORE.DOM.Output.children[jumps].innerHTML = CORE.Cells.Used[letter + number].Content;
          }
        }
      }

    }

    /** User does not edit anything anymore */
    CORE.Input.Mouse.Edit = false;

  };

}).call(this);