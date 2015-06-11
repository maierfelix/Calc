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
   * Get the outer of a cell selection
   *
   * @method getOuterSelection
   * @static
   */
  CORE.Selector.prototype.getOuterSelection = function() {

    var first = this.Selected.First;
    var last = this.Selected.Last;

    var object = {
      top: [],
      bottom: [],
      left: [],
      right: []
    };

    /** Loop through selected cells */
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

    return (object);

  };

  /**
   * Draw a border of a object
   *
   * @method drawOuterBorder
   * @static
   */
  CORE.Selector.prototype.drawOuterBorder = function() {

    var object = this.getOuterSelection();

    var cacheTarget = "";

    var letter = "";

    /** Top */
    for (var ii = 0; ii < object.top.length; ++ii) {
      letter = CORE.$.numberToAlpha(object.top[ii].letter);
      cacheTarget = CORE.Cells.Used[CORE.CurrentSheet][letter][letter + object.top[ii].number];
      cacheTarget.Border.used = true;
      cacheTarget.Border.top = true;
    }

    /** Bottom */
    for (var ii = 0; ii < object.bottom.length; ++ii) {
      letter = CORE.$.numberToAlpha(object.bottom[ii].letter);
      cacheTarget = CORE.Cells.Used[CORE.CurrentSheet][letter][letter + object.bottom[ii].number];
      cacheTarget.Border.used = true;
      cacheTarget.Border.bottom = true;
    }

    /** Left */
    for (var ii = 0; ii < object.left.length; ++ii) {
      letter = CORE.$.numberToAlpha(object.left[ii].letter);
      cacheTarget = CORE.Cells.Used[CORE.CurrentSheet][letter][letter + object.left[ii].number];
      cacheTarget.Border.used = true;
      cacheTarget.Border.left = true;
    }

    /** Right */
    for (var ii = 0; ii < object.right.length; ++ii) {
      letter = CORE.$.numberToAlpha(object.right[ii].letter);
      cacheTarget = CORE.Cells.Used[CORE.CurrentSheet][letter][letter + object.right[ii].number];
      cacheTarget.Border.used = true;
      cacheTarget.Border.right = true;
    }

    CORE.Sheets[CORE.CurrentSheet].updateWidth("default");

  };

  /**
   * Draw a border around the current selection
   *
   * @method drawSelectionOuterBorder
   * @static
   */
  CORE.Selector.prototype.drawSelectionOuterBorder = function() {

    var object = this.getOuterSelection();

    var jumps = 0;

    /** Top */
    for (var ii = 0; ii < object.top.length; ++ii) {
      jumps = CORE.$.getCell(object.top[ii]);
      if (jumps) {
        CORE.DOM.CacheArray[jumps].classList.add("border_top");
      }
    }

    /** Bottom */
    for (var ii = 0; ii < object.bottom.length; ++ii) {
      jumps = CORE.$.getCell(object.bottom[ii]);
      if (jumps) {
        CORE.DOM.CacheArray[jumps].classList.add("border_bottom");
      }
    }

    /** Left */
    for (var ii = 0; ii < object.left.length; ++ii) {
      jumps = CORE.$.getCell(object.left[ii]);
      if (jumps) {
        CORE.DOM.CacheArray[jumps].classList.add("border_left");
      }
    }

    /** Right */
    for (var ii = 0; ii < object.right.length; ++ii) {
      jumps = CORE.$.getCell(object.right[ii]);
      if (jumps) {
        CORE.DOM.CacheArray[jumps].classList.add("border_right");
      }
    }

  };

  /**
   * Jump a specific amount into a specific axis
   *
   * @method jump
   * @static
   */
  CORE.Selector.prototype.jump = function(direction, amount) {

    switch (direction) {
      case "up":
        CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY -= amount >= 0 ? (amount - 1) : 0;
        break;
      case "down":
        CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY += (amount - 1);
        break;
    }

    CORE.Sheets[CORE.CurrentSheet].updateHeight(direction, amount);
    CORE.Sheets[CORE.CurrentSheet].updateMenu();
    this.getSelection();
    this.selectCellByKeyPress();
    CORE.Sheets[CORE.CurrentSheet].Input.lastAction.scrollY = true;

  };