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
   * The Extender
   *
   * @class Extender
   * @static
   */
  CORE.Extender = function() {};

  CORE.Extender.prototype = CORE.Extender;
  CORE.Extender.prototype.constructor = CORE.Extender;

  /**
   * Extend selected cells
   *
   * @method extend
   * @static
   */
  CORE.Extender.prototype.extend = function() {

    /** User started to extend */
    CORE.Sheets[CORE.CurrentSheet].Input.Mouse.Extend = true;

    /** Short syntax */
    var SelectedCells = CORE.Sheets[CORE.CurrentSheet].Selector.SelectedCells;

    var Cells = [];

    /** Save values of cells here */
    var extendStack = {};

    /** Extend mode */
    var mode = null;

    var Columns = {};

    /** Go through all selected cells */
    for (var ii = 0; ii < SelectedCells.length; ++ii) {

      var letter = CORE.$.numberToAlpha(SelectedCells[ii].letter);
      var number = SelectedCells[ii].number;

      /** Direct cell pointer */
      var cell = CORE.Cells.Used[CORE.CurrentSheet][letter];

      /** Column doesnt exist yet */
      if (!Columns[letter]) Columns[letter] = {
        array: [],
        mode: null
      };

      /** Extend stack column doesnt exist yet */
      if (!extendStack[letter]) extendStack[letter] = [];

      /** Cell has content */
      if (cell && cell[letter + number]) {
        cell = cell[letter + number];
        if (cell.Content !== undefined && cell.Content !== null) {
          if (Columns[letter].mode === null) {
            /** Its a number */
            if (!isNaN(cell.Content)) Columns[letter].mode = "numeric";
            else Columns[letter].mode = "string";
          }
          /** Only push 2 values */
          if (extendStack[letter].length < 2) {
            extendStack[letter].push(cell.Content);
          }
        }
        /** Get the cells content */
        Columns[letter].array.push({
          letter: SelectedCells[ii].letter,
          number: SelectedCells[ii].number,
          value: cell.Content
        });
      /** Empty cell */
      } else {
        Columns[letter].array.push({
          letter: SelectedCells[ii].letter,
          number: SelectedCells[ii].number,
          value: null
        });
      }
    }

    /** Abort if nothing to extend */
    if (!Object.keys(Columns).length) return void 0;

    /** Extend numbers */
    for (var ii in Columns) {
      if (extendStack[ii]) {
        if (Columns[ii].mode === "numeric") {
          this.extendNumbers(Columns[ii].array, extendStack[ii]);
        }
      }
    }

  };

  /**
   * Create an extend button and return it
   *
   * @method extendButton
   * @static
   */
  CORE.Extender.prototype.extendButton = function() {

    var self = this;

    var extendButton = document.createElement("button");
      extendButton.className = "extendButton";
      extendButton.addEventListener('mousedown', function() {
        self.extend();
      });
      extendButton.addEventListener('mousemove', function(e) {
        e.target.style.cursor = "crosshair";
      });

    return (extendButton);

  };

  /**
   * Update processed cells
   *
   * @method updateCells
   * @static
   */
  CORE.Extender.prototype.updateCells = function(Cells) {

    for (var ii = 0; ii < Cells.length; ++ii) {
      var letter = CORE.$.numberToAlpha(Cells[ii].letter);
      var number = Cells[ii].number;
      if (CORE.Cells.Used[CORE.CurrentSheet][letter]) {
        if (!CORE.Cells.Used[CORE.CurrentSheet][letter][letter + number]) {
          CORE.$.registerCell({letter: letter, number: number});
        }
        CORE.Cells.Used[CORE.CurrentSheet][letter][letter + number].Content = Cells[ii].value;
      }
    }

  };
