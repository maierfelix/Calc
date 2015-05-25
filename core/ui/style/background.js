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
    var pickers = document.querySelector("#background_colorpicker");

    var colorpicker = new EightBitColorPicker({ el: pickers });

    /** Initialize cell background change menu */
    CORE.DOM.ChangeCellBackground.addEventListener('click', function(e) {

      var element = CORE.DOM.ChangeCellBackground.children[1];

      /** Validate all selected cells */
      CORE.$.validateCells();

      /** Loop through all selected cells */
      for (var ii = 0; ii < CORE.Selector.SelectedCells.length; ++ii) {
        var name = CORE.$.numberToAlpha(CORE.Selector.SelectedCells[ii].letter) + CORE.Selector.SelectedCells[ii].number;
        /** Update the cell background color */
        CORE.Cells.Used[name].BackgroundColor = pickers.children[0].style.background;
        /** Immediately update cells background color */
        var jumps = CORE.$.getCell({ letter: CORE.Selector.SelectedCells[ii].letter, number: CORE.Selector.SelectedCells[ii].number });
        if (jumps >= 0) CORE.DOM.Output.children[jumps].style.background = pickers.children[0].style.background;
      }

      /** Dont loose the selection */
      CORE.Selector.getSelection();

    });

  };

}).call(this);