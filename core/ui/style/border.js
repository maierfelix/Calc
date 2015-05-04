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

          /** Check if a cell is selected and in the cell used stack */
          if (CORE.$.validCell()) {
            CORE_UI.updateCellBorder(mode);
          }

          /** Dont loose the selection */
          CORE.Selector.getSelection();

        });
      }
    }

  };

  /** Update a cells border */
  CORE_UI.updateCellBorder = function(id) {

    var letter = CORE.Selector.Selected.First.Letter,
        number = CORE.Selector.Selected.First.Number;

    /** Cell uses custom border style */
    if (CORE.Cells.Used[letter + number]) {
      if (!CORE.Cells.Used[letter + number].Border.used) CORE.Cells.Used[letter + number].Border.used = true;
    }

    /** Left border */
    if (id === "border_left") {
      /** Cell already exists in cell stack */
      if (CORE.Cells.Used[letter + number]) {
        /** Check if user wants to disable the border by applying it again */
        if (CORE.Cells.Used[letter + number].Border.left) {
          CORE.Cells.Used[letter + number].Border.left = null;
          CORE.DOM.Output.children[(CORE.$.getCell(letter + number))].style.borderLeft = "";
        } else {
          /** Update cell used stack */
          CORE.Cells.Used[letter + number].Border.left = true;
          /** Immediately update cells border */
          CORE.DOM.Output.children[(CORE.$.getCell(letter + number))].style.borderLeft = "2px solid black";
        }
      }
    }

    /** Right border */
    if (id === "border_right") {
      /** Cell already exists in cell stack */
      if (CORE.Cells.Used[letter + number]) {
        /** Check if user wants to disable the border by applying it again */
        if (CORE.Cells.Used[letter + number].Border.right) {
          CORE.Cells.Used[letter + number].Border.right = null;
          CORE.DOM.Output.children[(CORE.$.getCell(letter + number))].style.borderRight = "";
        } else {
          /** Update cell used stack */
          CORE.Cells.Used[letter + number].Border.right = true;
          /** Immediately update cells border */
          CORE.DOM.Output.children[(CORE.$.getCell(letter + number))].style.borderRight = "2px solid black";
        }
      }
    }

    /** Top border */
    if (id === "border_top") {
      /** Cell already exists in cell stack */
      if (CORE.Cells.Used[letter + number]) {
        /** Check if user wants to disable the border by applying it again */
        if (CORE.Cells.Used[letter + number].Border.top) {
          CORE.Cells.Used[letter + number].Border.top = null;
          CORE.DOM.Output.children[(CORE.$.getCell(letter + number))].style.borderTop = "";
        } else {
          /** Update cell used stack */
          CORE.Cells.Used[letter + number].Border.top = true;
          /** Immediately update cells border */
          CORE.DOM.Output.children[(CORE.$.getCell(letter + number))].style.borderTop = "2px solid black";
        }
      }
    }

    /** Bottom border */
    if (id === "border_bottom") {
      /** Cell already exists in cell stack */
      if (CORE.Cells.Used[letter + number]) {
        /** Check if user wants to disable the border by applying it again */
        if (CORE.Cells.Used[letter + number].Border.bottom) {
          CORE.Cells.Used[letter + number].Border.bottom = null;
          CORE.DOM.Output.children[(CORE.$.getCell(letter + number))].style.borderBottom = "";
        } else {
          /** Update cell used stack */
          CORE.Cells.Used[letter + number].Border.bottom = true;
          /** Immediately update cells border */
          CORE.DOM.Output.children[(CORE.$.getCell(letter + number))].style.borderBottom = "2px solid black";
        }
      }
    }

    /** Full border */
    if (id === "border_all") {
      /** Cell already exists in cell stack */
      if (CORE.Cells.Used[letter + number]) {
        /** Check if user wants to disable the border by applying it again */
        if (CORE.Cells.Used[letter + number].Border.full) {
          CORE.Cells.Used[letter + number].Border.full = null;
          CORE.DOM.Output.children[(CORE.$.getCell(letter + number))].style.border = "";
        } else {
          /** Update cell used stack */
          CORE.Cells.Used[letter + number].Border.full = true;

          /** Reset all other border settings to default */
          CORE.Cells.Used[letter + number].Border.left = null;
          CORE.Cells.Used[letter + number].Border.right = null;
          CORE.Cells.Used[letter + number].Border.top = null;
          CORE.Cells.Used[letter + number].Border.bottom = null;

          /** Immediately update cells border */
          CORE.DOM.Output.children[(CORE.$.getCell(letter + number))].style.border = "2px solid black";
        }
      }
    }

  };

}).call(this);