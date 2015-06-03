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

  /** Initialize the font change menu */
  CORE_UI.initFontChangeMenu = function() {

    /** Initialize color picker */
    var pickers = document.querySelector("#font_colorpicker");

    var colorpicker = new EightBitColorPicker({ el: pickers });

    /** Initialize font change menu */
    CORE.DOM.ChangeFont.addEventListener('change', function(e) {

      var jumps = 0;

      /** Shorter syntax */
      var masterCell = CORE.Selector.masterSelected;
      var currentMaster = masterCell.Current;

      /** Active master selection */
      if (CORE.Selector.masterSelected.Current && CORE.Selector.masterSelected.Current !== null) {
        masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
        /** Check if master cell exists */
        if (masterCell) masterCell.Font = e.target.value;
      }

      /** Validate all selected cells */
      CORE.$.validateCells();

      /** Overwrite used cells styling */
      if (CORE.Cells.Used[currentMaster]) {
        CORE.Selector.inheritMasterStyling(currentMaster, masterCell, "Font");
      }

      /** Loop through all selected cells */
      for (var ii = 0; ii < CORE.Selector.SelectedCells.length; ++ii) {
        var letter = CORE.$.numberToAlpha(CORE.Selector.SelectedCells[ii].letter);
        var cellName = letter + CORE.Selector.SelectedCells[ii].number;
        /** Update the font */
        if (CORE.Cells.Used[letter][cellName]) {
          CORE.Cells.Used[letter][cellName].Font = e.target.value;
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

      /** Shorter syntax */
      var masterCell = CORE.Selector.masterSelected;
      var currentMaster = masterCell.Current;

      /** Active master selection */
      if (CORE.Selector.masterSelected.Current && CORE.Selector.masterSelected.Current !== null) {
        masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
        /** Check if master cell exists */
        if (masterCell) masterCell.FontSize = ~~(e.target.value);
      }

      /** Validate all selected cells */
      CORE.$.validateCells();

      /** Overwrite used cells styling */
      if (CORE.Cells.Used[currentMaster]) {
        CORE.Selector.inheritMasterStyling(currentMaster, masterCell, "FontSize");
      }

      /** Loop through all selected cells */
      for (var ii = 0; ii < CORE.Selector.SelectedCells.length; ++ii) {
        var letter = CORE.$.numberToAlpha(CORE.Selector.SelectedCells[ii].letter);
        var cellName = letter + CORE.Selector.SelectedCells[ii].number;
        /** Update the font size */
        CORE.Cells.Used[letter][cellName].FontSize = ~~(e.target.value);
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

      /** Shorter syntax */
      var masterCell = CORE.Selector.masterSelected;
      var currentMaster = masterCell.Current;

      /** Active master selection */
      if (CORE.Selector.masterSelected.Current && CORE.Selector.masterSelected.Current !== null) {
        masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
        /** Check if master cell exists */
        if (masterCell) {
          if (masterCell.FontBold) masterCell.FontBold = false;
          else masterCell.FontBold = true;
        }
      }

      /** Validate all selected cells */
      CORE.$.validateCells();

      /** Overwrite used cells styling */
      if (CORE.Cells.Used[currentMaster]) {
        CORE.Selector.inheritMasterStyling(currentMaster, masterCell, "FontBold");
      }

      /** Loop through all selected cells */
      for (var ii = 0; ii < CORE.Selector.SelectedCells.length; ++ii) {
        var letter = CORE.$.numberToAlpha(CORE.Selector.SelectedCells[ii].letter);
        var cellName = letter + CORE.Selector.SelectedCells[ii].number;
        /** User wants to disable bold property by executing again */
        if (CORE.Cells.Used[letter][cellName].FontBold) {
          /** Update the font bold */
          CORE.Cells.Used[letter][cellName].FontBold = false;
          /** Immediately update cells font bold */
          jumps = CORE.$.getCell({ letter: CORE.Selector.SelectedCells[ii].letter, number: CORE.Selector.SelectedCells[ii].number });
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.fontWeight = "normal";
        } else {
          /** Update the font bold */
          CORE.Cells.Used[letter][cellName].FontBold = true;
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

      /** Shorter syntax */
      var masterCell = CORE.Selector.masterSelected;
      var currentMaster = masterCell.Current;

      /** Active master selection */
      if (CORE.Selector.masterSelected.Current && CORE.Selector.masterSelected.Current !== null) {
        masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
        /** Check if master cell exists */
        if (masterCell) {
          if (masterCell.FontItalic) masterCell.FontItalic = false;
          else masterCell.FontItalic = true;
        }
      }

      /** Validate all selected cells */
      CORE.$.validateCells();

      /** Overwrite used cells styling */
      if (CORE.Cells.Used[currentMaster]) {
        CORE.Selector.inheritMasterStyling(currentMaster, masterCell, "FontItalic");
      }

      /** Loop through all selected cells */
      for (var ii = 0; ii < CORE.Selector.SelectedCells.length; ++ii) {
        var letter = CORE.$.numberToAlpha(CORE.Selector.SelectedCells[ii].letter);
        var cellName = letter + CORE.Selector.SelectedCells[ii].number;
        /** User wants to disable italic property by executing again */
        if (CORE.Cells.Used[letter][cellName].FontItalic) {
          /** Update the font italic */
          CORE.Cells.Used[letter][cellName].FontItalic = false;
          /** Immediately update cells font italic */
          jumps = CORE.$.getCell({ letter: CORE.Selector.SelectedCells[ii].letter, number: CORE.Selector.SelectedCells[ii].number });
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.fontStyle = "normal";
        } else {
          /** Update the font italic */
          CORE.Cells.Used[letter][cellName].FontItalic = true;
          /** Immediately update cells font italic */
          jumps = CORE.$.getCell({ letter: CORE.Selector.SelectedCells[ii].letter, number: CORE.Selector.SelectedCells[ii].number });
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.fontStyle = "italic";
        }
      }

      /** Dont loose the selection */
      CORE.Selector.getSelection();

    });

    /** Initialize font underline menu item */
    CORE.DOM.ChangeFontUnderline.addEventListener('click', function(e) {

      var jumps = 0;

      /** Shorter syntax */
      var masterCell = CORE.Selector.masterSelected;
      var currentMaster = masterCell.Current;

      /** Active master selection */
      if (CORE.Selector.masterSelected.Current && CORE.Selector.masterSelected.Current !== null) {
        masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
        /** Check if master cell exists */
        if (masterCell) {
          if (masterCell.FontUnderlined) masterCell.FontUnderlined = false;
          else masterCell.FontUnderlined = true;
        }
      }

      /** Validate all selected cells */
      CORE.$.validateCells();

      /** Overwrite used cells styling */
      if (CORE.Cells.Used[currentMaster]) {
        CORE.Selector.inheritMasterStyling(currentMaster, masterCell, "FontUnderlined");
      }

      /** Loop through all selected cells */
      for (var ii = 0; ii < CORE.Selector.SelectedCells.length; ++ii) {
        var letter = CORE.$.numberToAlpha(CORE.Selector.SelectedCells[ii].letter);
        var cellName = letter + CORE.Selector.SelectedCells[ii].number;
        /** User wants to disable underlined property by executing again */
        if (CORE.Cells.Used[letter][cellName].FontUnderlined) {
          /** Update the font underlined */
          CORE.Cells.Used[letter][cellName].FontUnderlined = false;
          /** Immediately update cells font underlined */
          jumps = CORE.$.getCell({ letter: CORE.Selector.SelectedCells[ii].letter, number: CORE.Selector.SelectedCells[ii].number });
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.textDecoration = "none";
        } else {
          /** Update the font underlined */
          CORE.Cells.Used[letter][cellName].FontUnderlined = true;
          /** Immediately update cells font underlined */
          jumps = CORE.$.getCell({ letter: CORE.Selector.SelectedCells[ii].letter, number: CORE.Selector.SelectedCells[ii].number });
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.textDecoration = "underline";
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

      /** Shorter syntax */
      var masterCell = CORE.Selector.masterSelected;
      var currentMaster = masterCell.Current;

      /** Active master selection */
      if (CORE.Selector.masterSelected.Current && CORE.Selector.masterSelected.Current !== null) {
        masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
        /** Check if master cell exists */
        if (masterCell) masterCell.Color = pickers.children[0].style.background;
      }

      /** Validate all selected cells */
      CORE.$.validateCells();

      /** Overwrite used cells styling */
      if (CORE.Cells.Used[currentMaster]) {
        CORE.Selector.inheritMasterStyling(currentMaster, masterCell, "Color");
      }

      /** Loop through all selected cells */
      for (var ii = 0; ii < CORE.Selector.SelectedCells.length; ++ii) {
        var letter = CORE.$.numberToAlpha(CORE.Selector.SelectedCells[ii].letter);
        var cellName = letter + CORE.Selector.SelectedCells[ii].number;
        /** Update the font color */
        CORE.Cells.Used[letter][cellName].Color = pickers.children[0].style.background;
        /** Immediately update cells font color */
        jumps = CORE.$.getCell({ letter: CORE.Selector.SelectedCells[ii].letter, number: CORE.Selector.SelectedCells[ii].number });
        if (jumps >= 0) CORE.DOM.Output.children[jumps].style.color = pickers.children[0].style.background;
      }

      /** Dont loose the selection */
      CORE.Selector.getSelection();

    });

  };