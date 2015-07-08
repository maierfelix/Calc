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

  /** Update the cell style menu */
  NOVAE_UI.updateCellStyleMenu = function(cellName) {

    var letter = NOVAE.$.numberToAlpha(cellName.letter);
    var number = cellName.number;
    var cell = letter + number;

		var hoverColor = "rgba(68, 138, 255, 0.75)";

    var masterColumns = NOVAE.Cells.Master[NOVAE.CurrentSheet].Columns;
    var masterRows = NOVAE.Cells.Master[NOVAE.CurrentSheet].Rows;

    if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter] && NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cell]) {
      /** Check if cell contains a formula - (higher priority than content!) */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cell].Formula) {
        NOVAE.DOM.CellInput.value = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cell].Formula;
      /** Check if cell has a custom content */
      } else if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cell].Content !== undefined && NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cell].Content !== null) {
        /** Update cell input content */
        NOVAE.DOM.CellInput.value = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cell].Content;
      /** Reset cell input content */
      } else NOVAE.DOM.CellInput.value = "";
    } else NOVAE.DOM.CellInput.value = "";

    /** Check if cell was registered */
    if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter] && NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cell]) {

      /** Check if cell has a custom font */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cell].Font) {
        /** Update font menu value */
        NOVAE.DOM.ChangeFont.value = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cell].Font;
      /** Reset font menu value to default */
      } else {
        NOVAE.DOM.ChangeFont.value = "Arial";
      }

      /** Check if cell has a custom font size */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cell].FontSize) {
        /** Update font size menu value */
        NOVAE.DOM.ChangeFontSize.value = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cell].FontSize;
      /** Reset font size menu value to default */
      } else {
        NOVAE.DOM.ChangeFontSize.value = 12;
      }

      /** Check if cell has a custom font color */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cell].Color) {
        /** Update font color menu value */
        NOVAE.DOM.ChangeFontColor.style.background = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cell].Color;
      /** Reset font color menu value to default */
      } else {
        NOVAE.DOM.ChangeFontColor.style.background = "rgba(50, 50, 50, 0.70)";
      }

      /** Check if cell has font bold */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cell].FontBold) {
        /** Update font bold menu color */
        NOVAE.DOM.ChangeFontBold.style.background = hoverColor;
      /** Reset font bold menu color to default */
      } else {
        NOVAE.DOM.ChangeFontBold.style.background = "rgba(50, 50, 50, 0.70)";
      }

      /** Check if cell has font italic */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cell].FontItalic) {
        /** Update font italic menu color */
        NOVAE.DOM.ChangeFontItalic.style.background = hoverColor;
      /** Reset font italic menu color to default */
      } else {
        NOVAE.DOM.ChangeFontItalic.style.background = "rgba(50, 50, 50, 0.70)";
      }

      /** Check if cell font is underlined */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cell].FontUnderlined) {
        /** Update font italic menu color */
        NOVAE.DOM.ChangeFontUnderline.style.background = hoverColor;
      /** Reset cell font underlined menu color to default */
      } else {
        NOVAE.DOM.ChangeFontUnderline.style.background = "rgba(50, 50, 50, 0.70)";
      }

      /** Check if cell has a custom background */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cell].BackgroundColor) {
        /** Update cell background color */
        NOVAE.DOM.ChangeCellBackground.style.background = NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cell].BackgroundColor;
      /** Reset cell background color to default */
      } else {
        NOVAE.DOM.ChangeCellBackground.style.background = "rgba(50, 50, 50, 0.70)";
      }

    /** Master column styling */
    } else if (masterColumns[letter]) {

      /** Column */
      if (masterColumns[letter].BackgroundColor) {
        NOVAE.DOM.ChangeCellBackground.style.background = masterColumns[letter].BackgroundColor;
      } else NOVAE.DOM.ChangeCellBackground.style.background = "rgba(50, 50, 50, 0.70)";

      /** Column */
      if (masterColumns[letter].Font) {
        NOVAE.DOM.ChangeFont.value = masterColumns[letter].Font;
      } else NOVAE.DOM.ChangeFont.value = "Arial";

      /** Column */
      if (masterColumns[letter].FontSize) {
        NOVAE.DOM.ChangeFont.value = masterColumns[letter].FontSize;
      } else NOVAE.DOM.ChangeFontSize.value = 12;

      /** Column */
      if (masterColumns[letter].Color) {
        NOVAE.DOM.ChangeFontColor.style.background = masterColumns[letter].Color;
      } else NOVAE.DOM.ChangeFontColor.style.background = "rgba(50, 50, 50, 0.70)";

      /** Column */
      if (masterColumns[letter].FontBold) {
        NOVAE.DOM.ChangeFontBold.style.background = hoverColor;
      } else {
        NOVAE.DOM.ChangeFontBold.style.background = "rgba(50, 50, 50, 0.70)";
      }

      /** Column */
      if (masterColumns[letter].FontItalic) {
        NOVAE.DOM.ChangeFontBold.style.background = hoverColor;
      } else {
        NOVAE.DOM.ChangeFontBold.style.background = "rgba(50, 50, 50, 0.70)";
      }

      /** Column */
      if (masterColumns[letter].FontUnderlined) {
        NOVAE.DOM.ChangeFontBold.style.background = hoverColor;
      } else {
        NOVAE.DOM.ChangeFontBold.style.background = "rgba(50, 50, 50, 0.70)";
      }

      /** Master row styling */
    } else if (masterRows[number]) {

      /** Row */
      if (masterRows[number].BackgroundColor) {
        NOVAE.DOM.ChangeCellBackground.style.background = masterRows[number].BackgroundColor;
      } else NOVAE.DOM.ChangeCellBackground.style.background = "rgba(50, 50, 50, 0.70)";

      /** Row */
      if (masterRows[number].Font) {
        NOVAE.DOM.ChangeFont.value = masterRows[number].Font;
      } else NOVAE.DOM.ChangeFont.value = NOVAE.DOM.ChangeFont.children[0].getAttribute("value");

      /** Row */
      if (masterRows[number].FontSize) {
        NOVAE.DOM.ChangeFont.value = masterRows[number].FontSize;
      } else NOVAE.DOM.ChangeFontSize.value = NOVAE.DOM.ChangeFontSize.children[6].getAttribute("value");

      /** Row */
      if (masterRows[number].Color) {
        NOVAE.DOM.ChangeFont.value = masterRows[number].Color;
      } else NOVAE.DOM.ChangeFontColorPreview.style.color = "#c7c7c7";

      /** Row */
      if (masterRows[number].FontBold) {
        NOVAE.DOM.ChangeFontBoldPreview.parentNode.style.background = hoverColor;
        NOVAE.DOM.ChangeFontBoldPreview.style.color = "#7d7d7d";
      } else {
        NOVAE.DOM.ChangeFontBoldPreview.parentNode.style.background = "#fff";
        NOVAE.DOM.ChangeFontBoldPreview.style.color = "#c7c7c7";
      }

      /** Row */
      if (masterRows[number].FontItalic) {
        NOVAE.DOM.ChangeFontBoldPreview.parentNode.style.background = hoverColor;
        NOVAE.DOM.ChangeFontBoldPreview.style.color = "#7d7d7d";
      } else {
        NOVAE.DOM.ChangeFontBoldPreview.parentNode.style.background = "#fff";
        NOVAE.DOM.ChangeFontBoldPreview.style.color = "#c7c7c7";
      }

      /** Row */
      if (masterRows[number].FontUnderlined) {
        NOVAE.DOM.ChangeFontBoldPreview.parentNode.style.background = hoverColor;
        NOVAE.DOM.ChangeFontBoldPreview.style.color = "#7d7d7d";
      } else {
        NOVAE.DOM.ChangeFontBoldPreview.parentNode.style.background = "#fff";
        NOVAE.DOM.ChangeFontBoldPreview.style.color = "#c7c7c7";
      }

    /** Reset the whole menu */
    } else {
      /** Reset cell input */
      NOVAE.DOM.CellInput.textContent = "";
      /** Reset font menu */
      NOVAE.DOM.ChangeFont.value = "Arial";
      /** Reset font size menu */
      NOVAE.DOM.ChangeFontSize.value = 12;
      /** Reset font color menu */
      NOVAE.DOM.ChangeFontColor.style.background = "rgba(50, 50, 50, 0.70)";
      /** Reset font bold menu color to default */
      NOVAE.DOM.ChangeFontBold.style.background = "rgba(50, 50, 50, 0.70)";
      /** Reset font italic menu color to default */
      NOVAE.DOM.ChangeFontItalic.style.background = "rgba(50, 50, 50, 0.70)";
      /** Reset font underline menu color to default */
      NOVAE.DOM.ChangeFontUnderline.style.background = "rgba(50, 50, 50, 0.70)";
      /** Reset cell background color to default */
      NOVAE.DOM.ChangeCellBackground.style.background = "rgba(50, 50, 50, 0.70)";
    }

  };