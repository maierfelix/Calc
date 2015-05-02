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

  /** Initialize the settings menu */
  CORE_UI.initSettingsMenu = function() {

    CORE_UI.initFontChangeMenu();

    /** Initialize color picker */
    ColorPicker(
      document.querySelector("#slide"),
      function(hex, hsv, rgb) {
        /** Update bottom border of font color change menu */
        CORE.DOM.ChangeFontColor.children[0].style.borderBottom = "4px solid " + hex;
        CORE.DOM.ChangeFontColor.disabled = false;
        
      }
    );

  };

  /** Initialize the settings menu */
  CORE_UI.initFontChangeMenu = function() {

    /** Initialize font change menu */
    CORE.DOM.ChangeFont.addEventListener('change', function(e) {

      /** Check if a cell is selected and in the cell used stack */
      if (CORE.$.validCell()) {

        var letter = CORE.Selector.Selected.First.Letter,
            number = CORE.Selector.Selected.First.Number;

        /** Update the font */
        CORE.Cells.Used[letter + number].Font = e.target.value;
        /** Immediately update cells font */
        CORE.DOM.Output.children[(CORE.$.getCell(letter + number))].style.fontFamily = e.target.children[e.target.selectedIndex].getAttribute("value");
      }

      /** Dont loose the selection */
      CORE.Selector.getSelection();

    });

    /** Initialize font size menu */
    CORE.DOM.ChangeFontSize.addEventListener('change', function(e) {

      /** Check if a cell is selected and in the cell used stack */
      if (CORE.$.validCell()) {

        var letter = CORE.Selector.Selected.First.Letter,
            number = CORE.Selector.Selected.First.Number;

        /** Update the font size */
        CORE.Cells.Used[letter + number].FontSize = parseInt(e.target.value);
        /** Immediately update cells font size */
        CORE.DOM.Output.children[(CORE.$.getCell(letter + number))].style.fontSize = e.target.children[e.target.selectedIndex].getAttribute("value") + "px";
      }

      /** Dont loose the selection */
      CORE.Selector.getSelection();

    });

    /** Initialize font color menu */
    CORE.DOM.ChangeFontColor.addEventListener('click', function(e) {

      var element = null;

      if (e.target.id === "change_fontColor") element = e.target;
      else if (e.target.parentNode.id === "change_fontColor") element = e.target.parentNode;

      if (element.parentNode.children[1]) {

        if (element.parentNode.children[1].getAttribute("hide") === "true") {
          element.parentNode.children[1].style.display = "block";
          element.parentNode.children[1].setAttribute("hide", "false");
          element.disabled = true;
        }
        else if (element.parentNode.children[1].getAttribute("hide") === "false") {
          element.parentNode.children[1].style.display = "none";
          element.parentNode.children[1].setAttribute("hide", "true");
        }

      }

      /** Check if a cell is selected and in the cell used stack */
      if (CORE.$.validCell()) {

        var letter = CORE.Selector.Selected.First.Letter,
            number = CORE.Selector.Selected.First.Number;

        /** Update the font color */
        CORE.Cells.Used[letter + number].Color = element.children[0].style.borderBottomColor;
        /** Immediately update cells font color */
        CORE.DOM.Output.children[(CORE.$.getCell(letter + number))].style.color = element.children[0].style.borderBottomColor;
      }

      /** Dont loose the selection */
      CORE.Selector.getSelection();

    });

  };

  /** Update the settings menu */
  CORE_UI.updateSettingsMenu = function(cell) {

    /** Check if cell was registered */
    if (CORE.Cells.Used[cell]) {

      /** Check if cell has a custom font */
      if (CORE.Cells.Used[cell].Font) {
        /** Update font menu value */
        CORE.DOM.ChangeFont.value = CORE.Cells.Used[cell].Font;
      /** Reset font menu value to default */
      } else {
        CORE.DOM.ChangeFont.value = CORE.DOM.ChangeFont.children[0].getAttribute("value");
      }

      /** Check if cell has a custom font size */
      if (CORE.Cells.Used[cell].FontSize) {
        /** Update font size menu value */
        CORE.DOM.ChangeFontSize.value = CORE.Cells.Used[cell].FontSize;
      /** Reset font size menu value to default */
      } else {
        CORE.DOM.ChangeFontSize.value = CORE.DOM.ChangeFontSize.children[6].getAttribute("value");
      }

      /** Check if cell has a custom font color */
      if (CORE.Cells.Used[cell].Color) {
        /** Update font color menu value */
        CORE.DOM.ChangeFontColor.children[0].style.borderBottom = "4px solid " + CORE.Cells.Used[cell].Color;
      /** Reset font color menu value to default */
      } else {
        CORE.DOM.ChangeFontColor.children[0].style.borderBottom = "4px solid #000";
      }

    /** Reset the whole menu */
    } else {
      /** Reset font menu */
      CORE.DOM.ChangeFont.value = CORE.DOM.ChangeFont.children[0].getAttribute("value");
      /** Reset font size menu */
      CORE.DOM.ChangeFontSize.value = CORE.DOM.ChangeFontSize.children[6].getAttribute("value");
      /** Reset font color menu */
      CORE.DOM.ChangeFontColor.children[0].style.borderBottom = "4px solid #000";
    }

  };

}).call(this);