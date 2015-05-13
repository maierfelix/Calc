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

  /** Initialize the background settings menu */
  CORE_UI.initBackgroundChangeMenu = function() {

    /** Initialize color picker */
    ColorPicker(
      document.querySelector("#slide_background"),
      function(hex, hsv, rgb) {
        /** Update background color of background color change menu */
        CORE.DOM.ChangeCellBackground.children[1].style.background = hex;
      }
    );

    /** Initialize cell background change menu */
    CORE.DOM.ChangeCellBackground.addEventListener('click', function(e) {

      var element = CORE.DOM.ChangeCellBackground;

      /** Display menu switch */
      if (element.children[1]) {

        if (element.children[1].getAttribute("hide") === "true") {
          element.children[1].style.display = "block";
          element.children[1].setAttribute("hide", "false");
          element.disabled = true;
        }
        else if (element.children[1].getAttribute("hide") === "false") {
          element.children[1].style.display = "none";
          element.children[1].setAttribute("hide", "true");
        }

      }

      /** Validate all selected cells */
      CORE.$.validateCells();

      /** Loop through all selected cells */
      for (var ii = 0; ii < CORE.Selector.SelectedCells.length; ++ii) {
        /** Update the cell background color */
        CORE.Cells.Used[CORE.Selector.SelectedCells[ii]].BackgroundColor = CORE.DOM.ChangeCellBackground.children[1].style.background;
        /** Immediately update cells background color */
        var jumps = CORE.$.getCell(CORE.Selector.SelectedCells[ii]);
        if (jumps) CORE.DOM.Output.children[jumps].style.background = CORE.DOM.ChangeCellBackground.children[1].style.background;
      }

      /** Dont loose the selection */
      CORE.Selector.getSelection();

    });

  };

}).call(this);