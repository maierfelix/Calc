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

  /** Initialize the border settings menu */
  CORE_UI.initBorderChangeMenu = function() {

    /** Initialize border menu */
    CORE.DOM.ChangeCellBorder.addEventListener('click', function(e) {

      var element = CORE.DOM.ChangeCellBorder;

      /** Display menu switch */
      if (element.parentNode) {

        if (element.parentNode.getAttribute("hide") === "true") {
          CORE.DOM.ChangeCellBorderMenu.style.display = "block";
          element.parentNode.setAttribute("hide", "false");
        }
        else if (element.parentNode.getAttribute("hide") === "false") {
          CORE.DOM.ChangeCellBorderMenu.style.display = "none";
          element.parentNode.setAttribute("hide", "true");
        }

      }

      /** Dont loose the selection */
      CORE.Selector.getSelection();

    });

    /** Click listeners for all border settings menu items */
    for (var ii = 0; ii < CORE.DOM.ChangeCellBorderMenuItems.children.length; ++ii) {
      if (CORE.DOM.ChangeCellBorderMenuItems.children[ii].id) {
        CORE.DOM.ChangeCellBorderMenuItems.children[ii].addEventListener('click', function(e) {

          var mode = null;

          if (e.target.id) mode = e.target.id;
          else if (e.target.parentNode.id) mode = e.target.parentNode.id;

          /** Validate all selected cells */
          CORE.$.validateCells();

          /** Update the cells border */
          CORE_UI.updateCellBorder(mode);

          /** Dont loose the selection */
          CORE.Selector.getSelection();

        });
      }
    }

  };

  /** Update a cells border */
  CORE_UI.updateCellBorder = function(id) {

    /** Check if cell to update is in view */
    var jumps = null;

    /** Shorter syntax */
    var masterCell = CORE.Selector.masterSelected;

    /** Active master selection */
    if (CORE.Selector.masterSelected.Current && CORE.Selector.masterSelected.Current !== null) {
      masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
    } else masterCell = null;

    /** Loop through all selected cells */
    for (var ii = 0; ii < CORE.Selector.SelectedCells.length; ++ii) {

      var letter = CORE.$.numberToAlpha(CORE.Selector.SelectedCells[ii].letter);
      var number = CORE.Selector.SelectedCells[ii].number;
      var cellName = (letter + number);

      jumps = CORE.$.getCell({ letter: CORE.Selector.SelectedCells[ii].letter, number: CORE.Selector.SelectedCells[ii].number });

      /** Cell uses custom border style */
      if (!CORE.Cells.Used[letter][cellName].Border.used) CORE.Cells.Used[letter][cellName].Border.used = true;

      /** Check if master cell exists */
      if (masterCell) masterCell.Border.used = true;

      /** Left border */
      if (id === "border_left") {
        /** Check if master cell exists */
        if (masterCell) {
          if (masterCell.Border.left) masterCell.Border.left = false;
          else masterCell.Border.left = true;
        }
        /** Check if user wants to disable the border by applying it again */
        if (CORE.Cells.Used[letter][cellName].Border.left) {
          CORE.Cells.Used[letter][cellName].Border.left = null;
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.borderLeft = "";
        } else {
          /** Update cell used stack */
          CORE.Cells.Used[letter][cellName].Border.left = true;
          /** Immediately update cells border */
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.borderLeft = "2px solid black";
        }
      }

      /** Right border */
      if (id === "border_right") {
        /** Check if master cell exists */
        if (masterCell) {
          if (masterCell.Border.right) masterCell.Border.right = false;
          else masterCell.Border.right = true;
        }
        /** Check if user wants to disable the border by applying it again */
        if (CORE.Cells.Used[letter][cellName].Border.right) {
          CORE.Cells.Used[letter][cellName].Border.right = null;
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.borderRight = "";
        } else {
          /** Update cell used stack */
          CORE.Cells.Used[letter][cellName].Border.right = true;
          /** Immediately update cells border */
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.borderRight = "2px solid black";
        }
      }

      /** Top border */
      if (id === "border_top") {
        /** Check if master cell exists */
        if (masterCell) {
          if (masterCell.Border.top) masterCell.Border.top = false;
          else masterCell.Border.top = true;
        }
        /** Check if user wants to disable the border by applying it again */
        if (CORE.Cells.Used[letter][cellName].Border.top) {
          CORE.Cells.Used[letter][cellName].Border.top = null;
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.borderTop = "";
        } else {
          /** Update cell used stack */
          CORE.Cells.Used[letter][cellName].Border.top = true;
          /** Immediately update cells border */
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.borderTop = "2px solid black";
        }
      }

      /** Bottom border */
      if (id === "border_bottom") {
        /** Check if master cell exists */
        if (masterCell) {
          if (masterCell.Border.bottom) masterCell.Border.bottom = false;
          else masterCell.Border.bottom = true;
        }
        /** Check if user wants to disable the border by applying it again */
        if (CORE.Cells.Used[letter][cellName].Border.bottom) {
          CORE.Cells.Used[letter][cellName].Border.bottom = null;
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.borderBottom = "";
        } else {
          /** Update cell used stack */
          CORE.Cells.Used[letter][cellName].Border.bottom = true;
          /** Immediately update cells border */
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.borderBottom = "2px solid black";
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
        }
        /** Check if user wants to disable the border by applying it again */
        if (CORE.Cells.Used[letter][cellName].Border.full) {
          CORE.Cells.Used[letter][cellName].Border.full = false;
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.border = "";
        } else {
          /** Update cell used stack */
          CORE.Cells.Used[letter][cellName].Border.full = true;

          /** Reset all other border settings to default */
          CORE.Cells.Used[letter][cellName].Border.left = false;
          CORE.Cells.Used[letter][cellName].Border.right = false;
          CORE.Cells.Used[letter][cellName].Border.top = false;
          CORE.Cells.Used[letter][cellName].Border.bottom = false;

          /** Immediately update cells border */
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.border = "2px solid black";
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
            if (masterCell.Border.left) CORE.DOM.Output.children[jumps].style.borderLeft = "2px solid black";
            if (masterCell.Border.right) CORE.DOM.Output.children[jumps].style.borderRight = "2px solid black";
          }
        }
        CORE.Selector.drawOuterBorder();
        /** Skip everything else, since we apply outer border only 1 time */
        return void 0;
      }

    }

  };