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
   * Check if current selection is in view
   *
   * @method selectionInView
   * @static
   */
  NOVAE.Selector.prototype.selectionInView = function() {

    var first = this.Selected.First;

    var last = this.Selected.Last;

    if (NOVAE.$.getCell({ letter: first.Letter, number: first.Number }) >= 0 &&
        NOVAE.$.getCell({ letter: last.Letter, number: last.Number }) >= 0) return (true);

    return (false);

  };

  /**
   * Get the outer of a cell selection
   *
   * @method getOuterSelection
   * @static
   */
  NOVAE.Selector.prototype.getOuterSelection = function() {

    var first = arguments[0] || this.Selected.First;
    var last  = arguments[1] || this.Selected.Last;

    var object = {
      top: [],
      bottom: [],
      left: [],
      right: []
    };

    /** Simulate selected cells */
    if (arguments[0] && arguments[1]) {
      this.SelectedCells = [];
      for (var xx = arguments[0].Letter; xx < arguments[1].Letter; ++xx) {
        for (var yy = arguments[0].Number; yy < arguments[1].Number; ++yy) {
          this.SelectedCells.push({
            letter: xx,
            number: yy
          });
        }
      }
    }

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
  NOVAE.Selector.prototype.drawOuterBorder = function() {

    var object = this.getOuterSelection();

    var cacheTarget;

    var letter = "";

    /** Top */
    for (var ii = 0; ii < object.top.length; ++ii) {
      letter = NOVAE.$.numberToAlpha(object.top[ii].letter);
      cacheTarget = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + object.top[ii].number];
      cacheTarget.Border.used = true;
      cacheTarget.Border.top = true;
    }

    /** Bottom */
    for (var ii = 0; ii < object.bottom.length; ++ii) {
      letter = NOVAE.$.numberToAlpha(object.bottom[ii].letter);
      cacheTarget = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + object.bottom[ii].number];
      cacheTarget.Border.used = true;
      cacheTarget.Border.bottom = true;
    }

    /** Left */
    for (var ii = 0; ii < object.left.length; ++ii) {
      letter = NOVAE.$.numberToAlpha(object.left[ii].letter);
      cacheTarget = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + object.left[ii].number];
      cacheTarget.Border.used = true;
      cacheTarget.Border.left = true;
    }

    /** Right */
    for (var ii = 0; ii < object.right.length; ++ii) {
      letter = NOVAE.$.numberToAlpha(object.right[ii].letter);
      cacheTarget = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + object.right[ii].number];
      cacheTarget.Border.used = true;
      cacheTarget.Border.right = true;
    }

    NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("default");

  };

  /**
   * Draw a border around the current selection
   *
   * @method drawSelectionOuterBorder
   * @static
   */
  NOVAE.Selector.prototype.drawSelectionOuterBorder = function() {

    var object = arguments[0] || this.getOuterSelection();

    var jumps = 0;

    /** Top */
    for (var ii = 0; ii < object.top.length; ++ii) {
      jumps = NOVAE.$.getCell(object.top[ii]);
      if (jumps >= 0 && NOVAE.DOM.Cache[jumps]) {
        NOVAE.DOM.Cache[jumps].classList.add("border_top");
      }
    }

    /** Bottom */
    for (var ii = 0; ii < object.bottom.length; ++ii) {
      jumps = NOVAE.$.getCell(object.bottom[ii]);
      if (jumps >= 0 && NOVAE.DOM.Cache[jumps]) {
        NOVAE.DOM.Cache[jumps].classList.add("border_bottom");
      }
    }

    /** Left */
    for (var ii = 0; ii < object.left.length; ++ii) {
      jumps = NOVAE.$.getCell(object.left[ii]);
      if (jumps >= 0 && NOVAE.DOM.Cache[jumps]) {
        NOVAE.DOM.Cache[jumps].classList.add("border_left");
      }
    }

    /** Right */
    for (var ii = 0; ii < object.right.length; ++ii) {
      jumps = NOVAE.$.getCell(object.right[ii]);
      if (jumps >= 0 && NOVAE.DOM.Cache[jumps]) {
        NOVAE.DOM.Cache[jumps].classList.add("border_right");
      }
    }

  };

  /**
   * Jump a specific amount into a specific axis
   *
   * @method jump
   * @static
   */
  NOVAE.Selector.prototype.jump = function(direction, amount) {

    switch (direction) {
      case "up":
        NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY -= amount >= 0 ? (amount - 1) : 0;
        break;
      case "down":
        NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY += (amount - 1);
        break;
    }

    NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight(direction, amount);
    NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
    this.getSelection();
    this.selectCellByKeyPress();
    NOVAE.Sheets[NOVAE.CurrentSheet].Input.lastAction.scrollY = true;

  };

  /**
   * Remove selected cells
   *
   * @method deleteCellSelection
   * @static
   */
  NOVAE.Selector.prototype.deleteCellSelection = function() {

    /** Inherit deletion */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
      NOVAE.Styler.inheritDeleteCells(this.SelectedCells.slice(0));
    }

    /** User selected all cells, delete all content */
    if (this.allSelected) {
      this.deleteAllCellsContent();
    }
    /** A master cell selection is active */
    else if (NOVAE.Cells.Master[NOVAE.CurrentSheet].Current !== undefined && NOVAE.Cells.Master[NOVAE.CurrentSheet].Current !== null) {
      this.deleteMasterSelectionContent();
    }

    var selectedCells = this.SelectedCells;

    var cell = null;

    for (var ii = 0; ii < selectedCells.length; ++ii) {

      var letter = NOVAE.$.numberToAlpha(selectedCells[ii].letter);
      var number = selectedCells[ii].number;

      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter]) {
        if (cell = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number]) {
          cell.Content = null;
          cell.Formula = {
            Stream: null,
            Lexed: null
          };
          /** Remove from interpreter stack */
          if (ENGEL.STACK.VAR[NOVAE.CurrentSheet][letter + number]) delete ENGEL.STACK.VAR[NOVAE.CurrentSheet][letter + number];
        }
      }

    }

    /** Share cell deletion */
    if (NOVAE.Connector.connected) {
      var range = NOVAE.$.selectionToRange(selectedCells);
      NOVAE.Connector.action("deleteCells", {range: range, property: ["Content", "Formula"]});
    }

    NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("default");

  };

  /**
   * Delete content and formula of all cells
   *
   * @method deleteAllCellsContent
   * @static
   */
  NOVAE.Selector.prototype.deleteAllCellsContent = function() {

    /** Inherit deletion */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
      NOVAE.Styler.inheritDeleteAllCellsContent();
    }

    var cells = NOVAE.Cells.Used[NOVAE.CurrentSheet];

    for (var ii in cells) {
      for (var cell in cells[ii]) {
        cells[ii][cell].Content = null;
        cells[ii][cell].Formula.Stream = null;
        /** Remove from interpreter stack */
        if (ENGEL.STACK.VAR[NOVAE.CurrentSheet][cell]) delete ENGEL.STACK.VAR[cell];
      }
    }

  };

  /**
   * Delete content of all cells inside a master selection
   *
   * @method deleteMasterSelectionContent
   * @static
   */
  NOVAE.Selector.prototype.deleteMasterSelectionContent = function() {

    var masterSelected = NOVAE.Cells.Master[NOVAE.CurrentSheet].Current;

    /** Inherit deletion */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
      NOVAE.Styler.inheritDeleteMasterSelectionContent(masterSelected);
    }
    var cells = NOVAE.Cells.Used[NOVAE.CurrentSheet];

    if (cells[masterSelected]) {
      for (var cell in cells[masterSelected]) {
        cells[masterSelected][cell].Content = "";
      }
    }

  };

  /**
   * Draw outer border around the whole sheet
   *
   * @method allSelectOuterBorder
   * @static
   */
  NOVAE.Selector.prototype.allSelectOuterBorder = function() {

    /** Simulate selection */
    var first = {
      Letter: NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX || 1,
      Number: NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY || 1
    };
    var last = {
      Letter: NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.x + 1,
      Number: NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y + 1
    };

    var object = this.getOuterSelection(first, last);

    this.drawSelectionOuterBorder(object);

  };