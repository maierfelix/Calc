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
   * Change border
   *
   * @method updateCellBorder
   * @static
   */
  NOVAE.Styler.prototype.updateCellBorder = function(id) {

    /** Check if cell to update is in view */
    var jumps = null;

    /** Shorter syntax */
    var masterCell = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.masterSelected;

    var selectSheet = NOVAE.Sheets[NOVAE.CurrentSheet].Selector;

    /** Active master selection */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.masterSelected.Current && NOVAE.Sheets[NOVAE.CurrentSheet].Selector.masterSelected.Current !== null) {
      masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
    } else masterCell = null;

    /** Loop through all selected cells */
    for (var ii = 0; ii < selectSheet.SelectedCells.length; ++ii) {

      var letter = NOVAE.$.numberToAlpha(selectSheet.SelectedCells[ii].letter);
      var number = selectSheet.SelectedCells[ii].number;
      var cellName = (letter + number);

      jumps = NOVAE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });

      /** Cell uses custom border style */
      if (!NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.used) NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.used = true;

      /** Check if master cell exists */
      if (masterCell) masterCell.Border.used = true;

      /** Left border */
      if (id === "border_left") {
        /** Check if master cell exists */
        if (masterCell) {
          if (masterCell.Border.left) masterCell.Border.left = false;
          else masterCell.Border.left = true;
          NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("default");
          /** Dont loose the selection */
          selectSheet.getSelection();
          return void 0;
        }
        /** Check if user wants to disable the border by applying it again */
        if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.left) {
          NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.left = null;
          if (jumps >= 0) NOVAE.DOM.Output.children[jumps].style.borderLeft = "";
        } else {
          /** Update cell used stack */
          NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.left = true;
          /** Immediately update cells border */
          if (jumps >= 0) NOVAE.DOM.Output.children[jumps].style.borderLeft = "2px solid black";
        }
      }

      /** Right border */
      if (id === "border_right") {
        /** Check if master cell exists */
        if (masterCell) {
          if (masterCell.Border.right) masterCell.Border.right = false;
          else masterCell.Border.right = true;
          NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("default");
          /** Dont loose the selection */
          selectSheet.getSelection();
          return void 0;
        }
        /** Check if user wants to disable the border by applying it again */
        if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.right) {
          NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.right = null;
          if (jumps >= 0) NOVAE.DOM.Output.children[jumps].style.borderRight = "";
        } else {
          /** Update cell used stack */
          NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.right = true;
          /** Immediately update cells border */
          if (jumps >= 0) NOVAE.DOM.Output.children[jumps].style.borderRight = "2px solid black";
        }
      }

      /** Top border */
      if (id === "border_top") {
        /** Check if master cell exists */
        if (masterCell) {
          if (masterCell.Border.top) masterCell.Border.top = false;
          else masterCell.Border.top = true;
          NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("default");
          /** Dont loose the selection */
          selectSheet.getSelection();
          return void 0;
        }
        /** Check if user wants to disable the border by applying it again */
        if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.top) {
          NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.top = null;
          if (jumps >= 0) NOVAE.DOM.Output.children[jumps].style.borderTop = "";
        } else {
          /** Update cell used stack */
          NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.top = true;
          /** Immediately update cells border */
          if (jumps >= 0) NOVAE.DOM.Output.children[jumps].style.borderTop = "2px solid black";
        }
      }

      /** Bottom border */
      if (id === "border_bottom") {
        /** Check if master cell exists */
        if (masterCell) {
          if (masterCell.Border.bottom) masterCell.Border.bottom = false;
          else masterCell.Border.bottom = true;
          NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("default");
          /** Dont loose the selection */
          selectSheet.getSelection();
          return void 0;
        }
        /** Check if user wants to disable the border by applying it again */
        if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.bottom) {
          NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.bottom = null;
          if (jumps >= 0) NOVAE.DOM.Output.children[jumps].style.borderBottom = "";
        } else {
          /** Update cell used stack */
          NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.bottom = true;
          /** Immediately update cells border */
          if (jumps >= 0) NOVAE.DOM.Output.children[jumps].style.borderBottom = "2px solid black";
        }
      }

      /** Full border */
      if (id === "border_all") {
        /** Check if master cell exists */
        if (masterCell) {
          if (masterCell.Border.full) masterCell.Border.full = false;
          else {
            masterCell.Border.full = true;
            masterCell.Border.left = false;
            masterCell.Border.right = false;
            masterCell.Border.top = false;
            masterCell.Border.bottom = false;
          }
          NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("default");
          /** Dont loose the selection */
          selectSheet.getSelection();
          return void 0;
        }
        /** Check if user wants to disable the border by applying it again */
        if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.full) {
          NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.full = false;
          if (jumps >= 0) NOVAE.DOM.Output.children[jumps].style.border = "";
        } else {
          /** Update cell used stack */
          NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.full = true;

          /** Reset all other border settings to default */
          NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.left = false;
          NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.right = false;
          NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.top = false;
          NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].Border.bottom = false;

          /** Immediately update cells border */
          if (jumps >= 0) NOVAE.DOM.Output.children[jumps].style.border = "2px solid black";
        }
      }

      /** Outer border */
      if (id === "border_outer") {
        /** Check if master cell exists */
        if (masterCell) {
          if (masterCell.Border.left) masterCell.Border.left = false;
          else masterCell.Border.left = true;
          if (masterCell.Border.right) masterCell.Border.right = false;
          else masterCell.Border.right = true;
          if (jumps >= 0) {
            if (masterCell.Border.left) NOVAE.DOM.Output.children[jumps].style.borderLeft = "2px solid black";
            if (masterCell.Border.right) NOVAE.DOM.Output.children[jumps].style.borderRight = "2px solid black";
          }
          NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("default");
          /** Dont loose the selection */
          selectSheet.getSelection();
          return void 0;
        }
        selectSheet.drawOuterBorder();
        /** Skip everything else, since we apply outer border only 1 time */
        return void 0;
      }

    }

  };