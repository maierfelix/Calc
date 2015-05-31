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

"use strict";

  /**
   * Get the outer of a cell selection
   *
   * @method getOuterSelection
   * @static
   */
  CORE.Selector.prototype.getOuterSelection = function() {

    var first = this.Selected.First;
    var last = this.Selected.Last;

    var height = this.Selected.Last.Number - this.Selected.First.Number + 1;
    var width = this.Selected.Last.Letter - this.Selected.First.Letter + 1;

    var object = {
      top: [],
      bottom: [],
      left: [],
      right: []
    };

    var jumps = 0;

    var cacheTarget = "";

    /** Minimum field size: 2x2 */
    if (height >= 2 && width >= 2) {

      for (var ii = 0; ii < this.SelectedCells.length; ++ii) {
        /** Get outer left */
        if (first.Letter === this.SelectedCells[ii].letter) {
          object.left.push(this.SelectedCells[ii]);
        }
        /** Get outer right */
        if (last.Letter === this.SelectedCells[ii].letter) {
          object.right.push(this.SelectedCells[ii]);
        }
        /** Get outer top */
        if (first.Number === this.SelectedCells[ii].number) {
          object.top.push(this.SelectedCells[ii]);
        }
        /** Get outer bottom */
        if (last.Number === this.SelectedCells[ii].number) {
          object.bottom.push(this.SelectedCells[ii]);
        }
      }

      /** Top */
      for (var ii = 0; ii < object.top.length; ++ii) {
        cacheTarget = CORE.Cells.Used[CORE.$.numberToAlpha(object.top[ii].letter) + object.top[ii].number];
        cacheTarget.Border.used = true;
        cacheTarget.Border.top = true;
        jumps = CORE.$.getCell({ letter: object.top[ii].letter, number: object.top[ii].number });
        /** Update top border */
        if (jumps >= 0) {
          
        }
      }

      /** Bottom */
      for (var ii = 0; ii < object.bottom.length; ++ii) {
        cacheTarget = CORE.Cells.Used[CORE.$.numberToAlpha(object.bottom[ii].letter) + object.bottom[ii].number];
        cacheTarget.Border.used = true;
        cacheTarget.Border.bottom = true;
        jumps = CORE.$.getCell({ letter: object.bottom[ii].letter, number: object.bottom[ii].number });
        /** Update bottom border */
        if (jumps >= 0) {
          
        }
      }

      /** Left */
      for (var ii = 0; ii < object.left.length; ++ii) {
        cacheTarget = CORE.Cells.Used[CORE.$.numberToAlpha(object.left[ii].letter) + object.left[ii].number];
        cacheTarget.Border.used = true;
        cacheTarget.Border.left = true;
        jumps = CORE.$.getCell({ letter: object.left[ii].letter, number: object.left[ii].number });
        /** Update left border */
        if (jumps >= 0) {
          
        }
      }

      /** Right */
      for (var ii = 0; ii < object.right.length; ++ii) {
        cacheTarget = CORE.Cells.Used[CORE.$.numberToAlpha(object.right[ii].letter) + object.right[ii].number];
        cacheTarget.Border.used = true;
        cacheTarget.Border.right = true;
        jumps = CORE.$.getCell({ letter: object.right[ii].letter, number: object.right[ii].number });
        /** Update right border */
        if (jumps >= 0) {
          
        }
      }

    }

    CORE.Grid.updateWidth("default");

  };