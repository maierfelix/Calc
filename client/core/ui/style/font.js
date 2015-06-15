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

  /** Initialize the font change menu */
  CORE_UI.initFontChangeMenu = function() {

    /** Initialize color picker */
    var pickers = document.querySelector("#font_colorpicker");

    var picker = new EightBitColorPicker({ el: pickers });

    /** Apply color change */
    picker.addEventListener('colorChange', function(e) {
      _changeFontColor(CORE.$.hexToRgba(e.detail.picker.getHexColor()));
    });

    /** Initialize font change menu */
    CORE.DOM.ChangeFont.addEventListener('change', function(e) {

      var jumps = 0;

      /** Shorter syntax */
      var masterCell = CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected;
      var currentMaster = masterCell.Current;
      var selectSheet = CORE.Sheets[CORE.CurrentSheet].Selector;

      /** Active master selection */
      if (CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Current && CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Current !== null) {
        masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
        /** Check if master cell exists */
        if (masterCell) masterCell.Font = e.target.value;
      }

      /** Validate all selected cells */
      CORE.$.validateCells();

      /** Overwrite used cells styling */
      if (CORE.Cells.Used[CORE.CurrentSheet][currentMaster]) {
        CORE.Sheets[CORE.CurrentSheet].Selector.inheritMasterStyling(currentMaster, masterCell, "Font");
      }

      /** Loop through all selected cells */
      for (var ii = 0; ii < selectSheet.SelectedCells.length; ++ii) {
        var letter = CORE.$.numberToAlpha(selectSheet.SelectedCells[ii].letter);
        var cellName = letter + selectSheet.SelectedCells[ii].number;
        /** Update the font */
        if (CORE.Cells.Used[CORE.CurrentSheet][letter][cellName]) {
          CORE.Cells.Used[CORE.CurrentSheet][letter][cellName].Font = e.target.value;
          /** Immediately update cells font */
          jumps = CORE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.fontFamily = e.target.children[e.target.selectedIndex].getAttribute("value");
        }
      }

      /** Dont loose the selection */
      selectSheet.getSelection();

    });

    /** Fix selection loss on click */
    CORE.DOM.ChangeFont.addEventListener('click', function(e) {
      /** Dont loose the selection */
      CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();
    });

    /** Initialize font size menu */
    CORE.DOM.ChangeFontSize.addEventListener('change', function(e) {

      var jumps = 0;

      /** Shorter syntax */
      var masterCell = CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected;
      var currentMaster = masterCell.Current;
      var selectSheet = CORE.Sheets[CORE.CurrentSheet].Selector;

      /** Active master selection */
      if (selectSheet.masterSelected.Current && selectSheet.masterSelected.Current !== null) {
        masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
        /** Check if master cell exists */
        if (masterCell) masterCell.FontSize = ~~(e.target.value);
      }

      /** Validate all selected cells */
      CORE.$.validateCells();

      /** Overwrite used cells styling */
      if (CORE.Cells.Used[CORE.CurrentSheet][currentMaster]) {
        selectSheet.inheritMasterStyling(currentMaster, masterCell, "FontSize");
      }

      /** Loop through all selected cells */
      for (var ii = 0; ii < selectSheet.SelectedCells.length; ++ii) {
        var letter = CORE.$.numberToAlpha(selectSheet.SelectedCells[ii].letter);
        var cellName = letter + selectSheet.SelectedCells[ii].number;
        /** Update the font size */
        CORE.Cells.Used[CORE.CurrentSheet][letter][cellName].FontSize = ~~(e.target.value);
        /** Immediately update cells font size */
        jumps = CORE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
        if (jumps >= 0) CORE.DOM.Output.children[jumps].style.fontSize = e.target.children[e.target.selectedIndex].getAttribute("value") + "px";
      }

      /** Dont loose the selection */
      selectSheet.getSelection();

    });

    /** Fix selection loss on click */
    CORE.DOM.ChangeFontSize.addEventListener('click', function(e) {
      /** Dont loose the selection */
      CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();
    });

    /** Initialize font bold menu item */
    CORE.DOM.ChangeFontBold.addEventListener('click', function(e) {

      var jumps = 0;

      /** Shorter syntax */
      var masterCell = CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected;
      var currentMaster = masterCell.Current;
      var selectSheet = CORE.Sheets[CORE.CurrentSheet].Selector;

      /** Active master selection */
      if (selectSheet.masterSelected.Current && selectSheet.masterSelected.Current !== null) {
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
      if (CORE.Cells.Used[CORE.CurrentSheet][currentMaster]) {
        selectSheet.inheritMasterStyling(currentMaster, masterCell, "FontBold");
      }

      /** Loop through all selected cells */
      for (var ii = 0; ii < selectSheet.SelectedCells.length; ++ii) {
        var letter = CORE.$.numberToAlpha(selectSheet.SelectedCells[ii].letter);
        var cellName = letter + selectSheet.SelectedCells[ii].number;
        /** User wants to disable bold property by executing again */
        if (CORE.Cells.Used[CORE.CurrentSheet][letter][cellName].FontBold) {
          /** Update the font bold */
          CORE.Cells.Used[CORE.CurrentSheet][letter][cellName].FontBold = false;
          /** Immediately update cells font bold */
          jumps = CORE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.fontWeight = "normal";
        } else {
          /** Update the font bold */
          CORE.Cells.Used[CORE.CurrentSheet][letter][cellName].FontBold = true;
          /** Immediately update cells font bold */
          jumps = CORE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.fontWeight = "bold";
        }
      }

      /** Dont loose the selection */
      selectSheet.getSelection();

    });

    /** Initialize font italic menu item */
    CORE.DOM.ChangeFontItalic.addEventListener('click', function(e) {

      var jumps = 0;

      /** Shorter syntax */
      var masterCell = CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected;
      var currentMaster = masterCell.Current;
      var selectSheet = CORE.Sheets[CORE.CurrentSheet].Selector;

      /** Active master selection */
      if (selectSheet.masterSelected.Current && selectSheet.masterSelected.Current !== null) {
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
      if (CORE.Cells.Used[CORE.CurrentSheet][currentMaster]) {
        selectSheet.inheritMasterStyling(currentMaster, masterCell, "FontItalic");
      }

      /** Loop through all selected cells */
      for (var ii = 0; ii < selectSheet.SelectedCells.length; ++ii) {
        var letter = CORE.$.numberToAlpha(selectSheet.SelectedCells[ii].letter);
        var cellName = letter + selectSheet.SelectedCells[ii].number;
        /** User wants to disable italic property by executing again */
        if (CORE.Cells.Used[CORE.CurrentSheet][letter][cellName].FontItalic) {
          /** Update the font italic */
          CORE.Cells.Used[CORE.CurrentSheet][letter][cellName].FontItalic = false;
          /** Immediately update cells font italic */
          jumps = CORE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.fontStyle = "normal";
        } else {
          /** Update the font italic */
          CORE.Cells.Used[CORE.CurrentSheet][letter][cellName].FontItalic = true;
          /** Immediately update cells font italic */
          jumps = CORE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.fontStyle = "italic";
        }
      }

      /** Dont loose the selection */
      selectSheet.getSelection();

    });

    /** Initialize font underline menu item */
    CORE.DOM.ChangeFontUnderline.addEventListener('click', function(e) {

      var jumps = 0;

      /** Shorter syntax */
      var masterCell = CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected;
      var currentMaster = masterCell.Current;
      var selectSheet = CORE.Sheets[CORE.CurrentSheet].Selector;

      /** Active master selection */
      if (selectSheet.masterSelected.Current && selectSheet.masterSelected.Current !== null) {
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
      if (CORE.Cells.Used[CORE.CurrentSheet][currentMaster]) {
        selectSheet.inheritMasterStyling(currentMaster, masterCell, "FontUnderlined");
      }

      /** Loop through all selected cells */
      for (var ii = 0; ii < selectSheet.SelectedCells.length; ++ii) {
        var letter = CORE.$.numberToAlpha(selectSheet.SelectedCells[ii].letter);
        var cellName = letter + selectSheet.SelectedCells[ii].number;
        /** User wants to disable underlined property by executing again */
        if (CORE.Cells.Used[CORE.CurrentSheet][letter][cellName].FontUnderlined) {
          /** Update the font underlined */
          CORE.Cells.Used[CORE.CurrentSheet][letter][cellName].FontUnderlined = false;
          /** Immediately update cells font underlined */
          jumps = CORE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.textDecoration = "none";
        } else {
          /** Update the font underlined */
          CORE.Cells.Used[CORE.CurrentSheet][letter][cellName].FontUnderlined = true;
          /** Immediately update cells font underlined */
          jumps = CORE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
          if (jumps >= 0) CORE.DOM.Output.children[jumps].style.textDecoration = "underline";
        }
      }

      /** Dont loose the selection */
      selectSheet.getSelection();

    });

    var _changeFontColor = function(color) {

      var element = CORE.DOM.ChangeFontColor;
      var jumps = 0;
      var selectSheet = CORE.Sheets[CORE.CurrentSheet].Selector;

      pickers.style.display = "block";
      picker.show();

      /** Shorter syntax */
      var masterCell = selectSheet.masterSelected;
      var currentMaster = masterCell.Current;

      /** Active master selection */
      if (selectSheet.masterSelected.Current && selectSheet.masterSelected.Current !== null) {
        masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
        /** Check if master cell exists */
        if (masterCell) masterCell.Color = pickers.children[0].style.background;
      }

      /** Validate all selected cells */
      CORE.$.validateCells();

      /** Overwrite used cells styling */
      if (CORE.Cells.Used[CORE.CurrentSheet][currentMaster]) {
        selectSheet.inheritMasterStyling(currentMaster, masterCell, "Color");
      }

      /** Loop through all selected cells */
      for (var ii = 0; ii < selectSheet.SelectedCells.length; ++ii) {
        var letter = CORE.$.numberToAlpha(selectSheet.SelectedCells[ii].letter);
        var cellName = letter + selectSheet.SelectedCells[ii].number;
        /** Update the font color */
        CORE.Cells.Used[CORE.CurrentSheet][letter][cellName].Color = pickers.children[0].style.background;
        /** Immediately update cells font color */
        jumps = CORE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
        if (jumps >= 0) CORE.DOM.Output.children[jumps].style.color = pickers.children[0].style.background;
      }

      /** Dont loose the selection */
      selectSheet.getSelection();

    };

    /** Apply color change */
    picker.addEventListener('colorChange', function(e) {
      _changeFontColor(CORE.$.hexToRgba(e.detail.picker.getHexColor()));
    });

    /** Initialize font color menu */
    CORE.DOM.ChangeFontColor.addEventListener('click', function(e) {

      /** Display the color picker */
      pickers.style.display = "block";
      picker.show();

    });

  };