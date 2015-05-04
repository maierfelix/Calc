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
    ColorPicker(
      document.querySelector("#slide"),
      function(hex, hsv, rgb) {
        /** Update color of color change menu */
        CORE.DOM.ChangeFontColorPreview.style.color = hex;
        CORE.DOM.ChangeFontColor.disabled = false;
        
      }
    );

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

    /** Fix selection loss on click */
    CORE.DOM.ChangeFont.addEventListener('click', function(e) {
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

    /** Fix selection loss on click */
    CORE.DOM.ChangeFontSize.addEventListener('click', function(e) {
      /** Dont loose the selection */
      CORE.Selector.getSelection();
    });

    /** Initialize font bold menu item */
    CORE.DOM.ChangeFontBold.addEventListener('click', function(e) {

      /** Check if a cell is selected and in the cell used stack */
      if (CORE.$.validCell()) {

        var letter = CORE.Selector.Selected.First.Letter,
            number = CORE.Selector.Selected.First.Number;

        /** User wants to disable bold property by executing again */
        if (CORE.Cells.Used[letter + number].FontBold) {
          /** Update the font bold */
          CORE.Cells.Used[letter + number].FontBold = false;
          /** Immediately update cells font bold */
          CORE.DOM.Output.children[(CORE.$.getCell(letter + number))].style.fontWeight = "normal";
        } else {
          /** Update the font bold */
          CORE.Cells.Used[letter + number].FontBold = true;
          /** Immediately update cells font bold */
          CORE.DOM.Output.children[(CORE.$.getCell(letter + number))].style.fontWeight = "bold";
        }
      }

      /** Dont loose the selection */
      CORE.Selector.getSelection();

    });

    /** Initialize font italic menu item */
    CORE.DOM.ChangeFontItalic.addEventListener('click', function(e) {

      /** Check if a cell is selected and in the cell used stack */
      if (CORE.$.validCell()) {

        var letter = CORE.Selector.Selected.First.Letter,
            number = CORE.Selector.Selected.First.Number;

        /** User wants to disable italic property by executing again */
        if (CORE.Cells.Used[letter + number].FontItalic) {
          /** Update the font italic */
          CORE.Cells.Used[letter + number].FontItalic = false;
          /** Immediately update cells font italic */
          CORE.DOM.Output.children[(CORE.$.getCell(letter + number))].style.fontStyle = "normal";
        } else {
          /** Update the font italic */
          CORE.Cells.Used[letter + number].FontItalic = true;
          /** Immediately update cells font italic */
          CORE.DOM.Output.children[(CORE.$.getCell(letter + number))].style.fontStyle = "italic";
        }
      }

      /** Dont loose the selection */
      CORE.Selector.getSelection();

    });

    /** Initialize font color menu */
    CORE.DOM.ChangeFontColor.addEventListener('click', function(e) {

      var element = CORE.DOM.ChangeFontColor;

      /** Display menu switch */
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
        CORE.Cells.Used[letter + number].Color = CORE.DOM.ChangeFontColorPreview.style.color;
        /** Immediately update cells font color */
        CORE.DOM.Output.children[(CORE.$.getCell(letter + number))].style.color = CORE.DOM.ChangeFontColorPreview.style.color;
      }

      /** Dont loose the selection */
      CORE.Selector.getSelection();

    });

  };

}).call(this);