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

  /** Initialize the font change menu */
  CORE_UI.initFontChangeMenu = function() {

    /** Initialize color picker */
    var pickers = document.querySelector("#font_colorpicker");

    var colorpicker = new EightBitColorPicker({ el: pickers });

    /** Initialize font change menu */
    CORE.DOM.ChangeFont.addEventListener('change', function(e) {

      var jumps = 0;

      /** Validate all selected cells */
      CORE.$.validateCells();

      /** Loop through all selected cells */
      for (var ii = 0; ii < CORE.Selector.SelectedCells.length; ++ii) {
        var cellName = CORE.$.numberToAlpha(CORE.Selector.SelectedCells[ii].letter) + CORE.Selector.SelectedCells[ii].number;
        /** Update the font */
        if (CORE.Cells.Used[cellName]) {
          CORE.Cells.Used[cellName].Font = e.target.value;
          /** Immediately update cells font */
          jumps = CORE.$.getCell({ letter: CORE.Selector.SelectedCells[ii].letter, number: CORE.Selector.SelectedCells[ii].number });
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.fontFamily = e.target.children[e.target.selectedIndex].getAttribute("value");
        }
      }

      /** Dont loose the selection */
      CORE.Selector.getSelection();

    });

    /** Fix selection loss on click */
    CORE.DOM.ChangeFont.addEventListener('click', function(e) {
      /** Dont loose the selection */
      CORE.Selector.getSelection();
    });

    /** Initialize font size menu */
    CORE.DOM.ChangeFontSize.addEventListener('change', function(e) {

      var jumps = 0;

      /** Validate all selected cells */
      CORE.$.validateCells();

      /** Loop through all selected cells */
      for (var ii = 0; ii < CORE.Selector.SelectedCells.length; ++ii) {
        var cellName = CORE.$.numberToAlpha(CORE.Selector.SelectedCells[ii].letter) + CORE.Selector.SelectedCells[ii].number;
        /** Update the font size */
        CORE.Cells.Used[cellName].FontSize = parseInt(e.target.value);
        /** Immediately update cells font size */
        jumps = CORE.$.getCell({ letter: CORE.Selector.SelectedCells[ii].letter, number: CORE.Selector.SelectedCells[ii].number });
        if (jumps >= 0) CORE.DOM.Output.children[jumps].style.fontSize = e.target.children[e.target.selectedIndex].getAttribute("value") + "px";
      }

      /** Dont loose the selection */
      CORE.Selector.getSelection();

    });

    /** Fix selection loss on click */
    CORE.DOM.ChangeFontSize.addEventListener('click', function(e) {
      /** Dont loose the selection */
      CORE.Selector.getSelection();
    });

    /** Initialize font bold menu item */
    CORE.DOM.ChangeFontBold.addEventListener('click', function(e) {

      var jumps = 0;

      /** Validate all selected cells */
      CORE.$.validateCells();

      /** Loop through all selected cells */
      for (var ii = 0; ii < CORE.Selector.SelectedCells.length; ++ii) {
        var cellName = CORE.$.numberToAlpha(CORE.Selector.SelectedCells[ii].letter) + CORE.Selector.SelectedCells[ii].number;
        /** User wants to disable bold property by executing again */
        if (CORE.Cells.Used[cellName].FontBold) {
          /** Update the font bold */
          CORE.Cells.Used[cellName].FontBold = false;
          /** Immediately update cells font bold */
          jumps = CORE.$.getCell({ letter: CORE.Selector.SelectedCells[ii].letter, number: CORE.Selector.SelectedCells[ii].number });
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.fontWeight = "normal";
        } else {
          /** Update the font bold */
          CORE.Cells.Used[cellName].FontBold = true;
          /** Immediately update cells font bold */
          jumps = CORE.$.getCell({ letter: CORE.Selector.SelectedCells[ii].letter, number: CORE.Selector.SelectedCells[ii].number });
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.fontWeight = "bold";
        }
      }

      /** Dont loose the selection */
      CORE.Selector.getSelection();

    });

    /** Initialize font italic menu item */
    CORE.DOM.ChangeFontItalic.addEventListener('click', function(e) {

      var jumps = 0;

      /** Validate all selected cells */
      CORE.$.validateCells();

      /** Loop through all selected cells */
      for (var ii = 0; ii < CORE.Selector.SelectedCells.length; ++ii) {
        var cellName = CORE.$.numberToAlpha(CORE.Selector.SelectedCells[ii].letter) + CORE.Selector.SelectedCells[ii].number;
        /** User wants to disable italic property by executing again */
        if (CORE.Cells.Used[cellName].FontItalic) {
          /** Update the font italic */
          CORE.Cells.Used[cellName].FontItalic = false;
          /** Immediately update cells font italic */
          jumps = CORE.$.getCell({ letter: CORE.Selector.SelectedCells[ii].letter, number: CORE.Selector.SelectedCells[ii].number });
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.fontStyle = "normal";
        } else {
          /** Update the font italic */
          CORE.Cells.Used[cellName].FontItalic = true;
          /** Immediately update cells font italic */
          jumps = CORE.$.getCell({ letter: CORE.Selector.SelectedCells[ii].letter, number: CORE.Selector.SelectedCells[ii].number });
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.fontStyle = "italic";
        }
      }

      /** Dont loose the selection */
      CORE.Selector.getSelection();

    });

    /** Initialize font color menu */
    CORE.DOM.ChangeFontColor.addEventListener('click', function(e) {

      var element = CORE.DOM.ChangeFontColor;
      var jumps = 0;

      /** Display menu switch */
      if (element.parentNode.children[1]) {

        if (element.parentNode.children[1].getAttribute("hide") === "true") {
          element.parentNode.children[1].setAttribute("hide", "false");
          colorpicker.show();
        }
        else if (element.parentNode.children[1].getAttribute("hide") === "false") {
          element.parentNode.children[1].setAttribute("hide", "true");
          colorpicker.hide();
        }

      }

      /** Validate all selected cells */
      CORE.$.validateCells();

      /** Loop through all selected cells */
      for (var ii = 0; ii < CORE.Selector.SelectedCells.length; ++ii) {
        var cellName = CORE.$.numberToAlpha(CORE.Selector.SelectedCells[ii].letter) + CORE.Selector.SelectedCells[ii].number;
        /** Update the font color */
        CORE.Cells.Used[cellName].Color = pickers.children[0].style.background;
        /** Immediately update cells font color */
        jumps = CORE.$.getCell({ letter: CORE.Selector.SelectedCells[ii].letter, number: CORE.Selector.SelectedCells[ii].number });
        if (jumps >= 0) CORE.DOM.Output.children[jumps].style.color = pickers.children[0].style.background;
      }

      /** Dont loose the selection */
      CORE.Selector.getSelection();

    });

  };

}).call(this);