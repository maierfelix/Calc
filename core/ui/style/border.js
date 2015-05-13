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

    /** Loop through all selected cells */
    for (var ii = 0; ii < CORE.Selector.SelectedCells.length; ++ii) {

      /** Cell uses custom border style */
      if (!CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.used) CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.used = true;

      /** Left border */
      if (id === "border_left") {
        /** Check if user wants to disable the border by applying it again */
        if (CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.left) {
          CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.left = null;
          jumps = CORE.$.getCell(CORE.Selector.SelectedCells[ii]);
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.borderLeft = "";
        } else {
          /** Update cell used stack */
          CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.left = true;
          /** Immediately update cells border */
          jumps = CORE.$.getCell(CORE.Selector.SelectedCells[ii]);
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.borderLeft = "2px solid black";
        }
      }

      /** Right border */
      if (id === "border_right") {
        /** Check if user wants to disable the border by applying it again */
        if (CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.right) {
          CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.right = null;
          jumps = CORE.$.getCell(CORE.Selector.SelectedCells[ii]);
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.borderRight = "";
        } else {
          /** Update cell used stack */
          CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.right = true;
          /** Immediately update cells border */
          jumps = CORE.$.getCell(CORE.Selector.SelectedCells[ii]);
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.borderRight = "2px solid black";
        }
      }

      /** Top border */
      if (id === "border_top") {
        /** Check if user wants to disable the border by applying it again */
        if (CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.top) {
          CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.top = null;
          jumps = CORE.$.getCell(CORE.Selector.SelectedCells[ii]);
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.borderTop = "";
        } else {
          /** Update cell used stack */
          CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.top = true;
          /** Immediately update cells border */
          jumps = CORE.$.getCell(CORE.Selector.SelectedCells[ii]);
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.borderTop = "2px solid black";
        }
      }

      /** Bottom border */
      if (id === "border_bottom") {
        /** Check if user wants to disable the border by applying it again */
        if (CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.bottom) {
          CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.bottom = null;
          jumps = CORE.$.getCell(CORE.Selector.SelectedCells[ii]);
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.borderBottom = "";
        } else {
          /** Update cell used stack */
          CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.bottom = true;
          /** Immediately update cells border */
          jumps = CORE.$.getCell(CORE.Selector.SelectedCells[ii]);
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.borderBottom = "2px solid black";
        }
      }

      /** Full border */
      if (id === "border_all") {
        /** Check if user wants to disable the border by applying it again */
        if (CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.full) {
          CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.full = null;
          jumps = CORE.$.getCell(CORE.Selector.SelectedCells[ii]);
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.border = "";
        } else {
          /** Update cell used stack */
          CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.full = true;

          /** Reset all other border settings to default */
          CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.left = null;
          CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.right = null;
          CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.top = null;
          CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].Border.bottom = null;

          /** Immediately update cells border */
          jumps = CORE.$.getCell(CORE.Selector.SelectedCells[ii]);
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.border = "2px solid black";
        }
      }

    }

  };

}).call(this);