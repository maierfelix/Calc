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
  CORE_UI.initLiveCellMenu = function() {

    /** Initialize live cell container button */
    CORE.DOM.ChangeLiveCell.addEventListener('click', function(e) {

      /** Clean last live cells */
      CORE.DOM.LiveCellOutput.innerHTML = "";

      if (CORE.Selector.SelectedCells.length) CORE.DOM.LiveCellContainer.style.display = "block";

      /** Loop through all selected cells, register each one */
      for (var ii = 0; ii < CORE.Selector.SelectedCells.length; ++ii) {
        /** Make sure all live cells get registered */
        if (!CORE.Cells.Live[CORE.Selector.SelectedCells[ii]]) CORE.registerLiveCell(CORE.Selector.SelectedCells[ii]);
      }

      var input = document.createElement("input");
          input.setAttribute("placeholder", "Enter a url..");
          input.value = "";

      /** Only 1 selected cell */
      if (CORE.Selector.SelectedCells.length === 1) {
        /** Seems like there is already an attached url */
        if (CORE.Cells.Live[CORE.Selector.SelectedCells[0]].Url.length) {
          input.value = CORE.Cells.Live[CORE.Selector.SelectedCells[0]].Url;
        }
      }

      input.addEventListener('input', function() {

        /** Append url for each selected cell */
        for (var ii = 0; ii < CORE.Selector.SelectedCells.length; ++ii) {
          /** Cell exists in cell live stack */
          if (CORE.Cells.Live[CORE.Selector.SelectedCells[ii]]) {
            /** Update live cells url */
            CORE.Cells.Live[CORE.Selector.SelectedCells[ii]].Url = this.value;
          }
        }

        CORE.Awakener.evalLive();
        CORE.Input.Mouse.LiveCellEdit = false;

      });

      CORE.DOM.LiveCellOutput.appendChild(input);

      /** Dont loose the selection */
      CORE.Selector.getSelection();

      CORE.Input.Mouse.LiveCellEdit = true;

    });

    /** Initialize live cell output container */
    CORE.DOM.LiveCellOutput.addEventListener('dblclick', function(e) {

    });

  };

}).call(this);