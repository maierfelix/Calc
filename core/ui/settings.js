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

  };

  /** Initialize the settings menu */
  CORE_UI.initSettingsMenu = function() {

    /** Initialize font change menu */
    CORE.DOM.ChangeFont.addEventListener('change', function(e) {

      /** Check if a cell is selected */
      if (CORE.Selector.Selected.First.Letter && (CORE.Selector.Selected.First.Number >= 0) ) {

        var letter = CORE.Selector.Selected.First.Letter,
            number = CORE.Selector.Selected.First.Number;

        /** Cell is not used yet */
        if (!CORE.Cells.Used[letter + number]) {
          CORE.Cells.Used[letter + number] = new CORE.Grid.Cell();
        }

        /** Cell was successfully registered ? */
        if (CORE.Cells.Used[letter + number]) {
          CORE.Cells.Used[letter + number].Font = e.target.value;
          /** Immediately update cells font */
          CORE.DOM.Output.children[(CORE.$.getCell(letter + number))].style.fontFamily = e.target.children[e.target.selectedIndex].getAttribute("value");
        }

      }

    });

  };

}).call(this);