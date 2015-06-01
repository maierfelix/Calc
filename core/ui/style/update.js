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

  /** Update the cell style menu */
  CORE_UI.updateCellStyleMenu = function(cellName) {

    var letter = CORE.$.numberToAlpha(cellName.letter);
    var cell = letter + cellName.number;

    /** Check if cell was registered */
    if (CORE.Cells.Used[letter] && CORE.Cells.Used[letter][cell]) {

      /** Check if cell contains a formula - (higher priority than content!) */
      if (CORE.Cells.Used[letter][cell].Formula) {
        CORE.DOM.CellInput.value = CORE.Cells.Used[letter][cell].Formula;
      /** Check if cell has a custom content */
      } else if (CORE.Cells.Used[letter][cell].Content !== undefined && CORE.Cells.Used[letter][cell].Content !== null) {
        /** Update cell input content */
        CORE.DOM.CellInput.value = CORE.Cells.Used[letter][cell].Content;
      /** Reset cell input content */
      } else CORE.DOM.CellInput.value = "";

      /** Check if cell has a custom font */
      if (CORE.Cells.Used[letter][cell].Font) {
        /** Update font menu value */
        CORE.DOM.ChangeFont.value = CORE.Cells.Used[letter][cell].Font;
      /** Reset font menu value to default */
      } else {
        CORE.DOM.ChangeFont.value = CORE.DOM.ChangeFont.children[0].getAttribute("value");
      }

      /** Check if cell has a custom font size */
      if (CORE.Cells.Used[letter][cell].FontSize) {
        /** Update font size menu value */
        CORE.DOM.ChangeFontSize.value = CORE.Cells.Used[letter][cell].FontSize;
      /** Reset font size menu value to default */
      } else {
        CORE.DOM.ChangeFontSize.value = CORE.DOM.ChangeFontSize.children[6].getAttribute("value");
      }

      /** Check if cell has a custom font color */
      if (CORE.Cells.Used[letter][cell].Color) {
        /** Update font color menu value */
        CORE.DOM.ChangeFontColorPreview.style.color = CORE.Cells.Used[letter][cell].Color;
      /** Reset font color menu value to default */
      } else {
        CORE.DOM.ChangeFontColorPreview.style.color = "#c7c7c7";
      }

      /** Check if cell has font bold */
      if (CORE.Cells.Used[letter][cell].FontBold) {
        /** Update font bold menu color */
        CORE.DOM.ChangeFontBoldPreview.parentNode.style.background = "rgba(124, 59, 153, 0.2)";
        CORE.DOM.ChangeFontBoldPreview.style.color = "#7d7d7d";
      /** Reset font bold menu color to default */
      } else {
        CORE.DOM.ChangeFontBoldPreview.parentNode.style.background = "#fff";
        CORE.DOM.ChangeFontBoldPreview.style.color = "#c7c7c7";
      }

      /** Check if cell has font italic */
      if (CORE.Cells.Used[letter][cell].FontItalic) {
        /** Update font italic menu color */
        CORE.DOM.ChangeFontItalicPreview.parentNode.style.background = "rgba(124, 59, 153, 0.2)";
        CORE.DOM.ChangeFontItalicPreview.style.color = "#7d7d7d";
      /** Reset font italic menu color to default */
      } else {
        CORE.DOM.ChangeFontItalicPreview.parentNode.style.background = "#fff";
        CORE.DOM.ChangeFontItalicPreview.style.color = "#c7c7c7";
      }

      /** Check if cell font is underlined */
      if (CORE.Cells.Used[letter][cell].FontUnderlined) {
        /** Update font italic menu color */
        CORE.DOM.ChangeFontUnderlinePreview.parentNode.style.background = "rgba(124, 59, 153, 0.2)";
        CORE.DOM.ChangeFontUnderlinePreview.style.color = "#7d7d7d";
      /** Reset cell font underlined menu color to default */
      } else {
        CORE.DOM.ChangeFontUnderlinePreview.parentNode.style.background = "#fff";
        CORE.DOM.ChangeFontUnderlinePreview.style.color = "#c7c7c7";
      }

      /** Check if cell has a custom background */
      if (CORE.Cells.Used[letter][cell].BackgroundColor) {
        /** Update cell background color */
        CORE.DOM.ChangeCellBackground.children[0].style.background = CORE.Cells.Used[letter][cell].BackgroundColor;
      /** Reset cell background color to default */
      } else {
        CORE.DOM.ChangeCellBackground.children[0].style.background = "#fff";
      }

    /** Reset the whole menu */
    } else {
      /** Reset cell input */
      CORE.DOM.CellInput.value = "";
      /** Reset font menu */
      CORE.DOM.ChangeFont.value = CORE.DOM.ChangeFont.children[0].getAttribute("value");
      /** Reset font size menu */
      CORE.DOM.ChangeFontSize.value = CORE.DOM.ChangeFontSize.children[6].getAttribute("value");
      /** Reset font color menu */
      CORE.DOM.ChangeFontColorPreview.style.color = "#c7c7c7";
      /** Reset font bold menu color to default */
      CORE.DOM.ChangeFontBoldPreview.style.color = "#c7c7c7";
      /** Reset font bold menu background color to default */
      CORE.DOM.ChangeFontBoldPreview.parentNode.style.background = "#fff";
      /** Reset font italic menu color to default */
      CORE.DOM.ChangeFontItalicPreview.style.color = "#c7c7c7";
      /** Reset font italic menu color to default */
      CORE.DOM.ChangeFontItalicPreview.parentNode.style.background = "#fff";
      /** Reset font underline menu color to default */
      CORE.DOM.ChangeFontUnderlinePreview.style.color = "#c7c7c7";
      /** Reset font underline menu color to default */
      CORE.DOM.ChangeFontUnderlinePreview.parentNode.style.background = "#fff";
      /** Reset cell background color to default */
      CORE.DOM.ChangeCellBackground.children[0].style.background = "#fff";
      /** Reset live cell background color to default */
      CORE.DOM.ChangeLiveCellPreview.parentNode.style.background = "#fff";
    }

    /** Check if cell was registered */
    if (CORE.Cells.Live[cell]) {
      /** Check if cell is active */
      if (CORE.Cells.Live[cell].Active) {
        /** Update live cell menu background */
        CORE.DOM.ChangeLiveCellPreview.parentNode.style.background = "rgba(124, 59, 153, 0.2)";
      /** Reset live cell menu back to default */
      } else {
        CORE.DOM.ChangeLiveCellPreview.parentNode.style.background = "#fff";
      }

    /** Live cell not registered */
    } else {
      CORE.DOM.ChangeLiveCellPreview.parentNode.style.background = "#fff";
    }

  };