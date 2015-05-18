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

    /** Initialize live cell container */
    CORE.DOM.ChangeLiveCell.addEventListener('click', function(e) {

      /** Clean last live cells */
      CORE.DOM.LiveCellOutput.innerHTML = "";

      /** Loop through all selected cells */
      for (var ii = 0; ii < CORE.Selector.SelectedCells.length; ++ii) {
        /** Make sure all live cells get registered */
        if (!CORE.Cells.Live[CORE.Selector.SelectedCells[ii]]) CORE.Grid.registerLiveCell(CORE.Selector.SelectedCells[ii]);
        CORE.DOM.LiveCellOutput.innerHTML += "<div name=" + CORE.Selector.SelectedCells[ii] + ">" + CORE.Selector.SelectedCells[ii] + "</div>";
      }

      /** Dont loose the selection */
      CORE.Selector.getSelection();

    });

    /** Initialize live cell output container */
    CORE.DOM.LiveCellOutput.addEventListener('click', function(e) {

      /** Make sure a valid live cell was clicked */
      if (e.target.getAttribute("name") !== "" && e.target.getAttribute("id") !== CORE.DOM.LiveCellOutput.id) {
        /** Remove selection of all other items */
        for (var ii = 0; ii < e.target.parentNode.children.length; ++ii) {
          e.target.parentNode.children[ii].innerHTML = "<div name=" + e.target.parentNode.children[ii].getAttribute("name") + ">" + e.target.parentNode.children[ii].getAttribute("name") + "</div>";
          e.target.parentNode.children[ii].removeAttribute("class");
        }
        /** Set new class for clicked item */
        e.target.className = "g-selected";
      } else {
        /*for (var ii = 0; ii < e.target.parentNode.children.length; ++ii) {
          e.target.parentNode.children[ii].innerHTML = "<div name=" + e.target.parentNode.children[ii].getAttribute("name") + ">" + e.target.parentNode.children[ii].getAttribute("name") + "</div>";
        }*/
      }

    });

    /** Initialize live cell output container */
    CORE.DOM.LiveCellOutput.addEventListener('dblclick', function(e) {

      /** Make sure a valid live cell was clicked */
      if (e.target.getAttribute("name") !== "") {
        /** Remove selection of all other items */
        for (var ii = 0; ii < e.target.parentNode.children.length; ++ii) {

          var currentCell = e.target.parentNode.children[ii];

          if (currentCell.className) currentCell.innerHTML = "<div class='g-selected' name=" + currentCell.getAttribute("name") + ">" + currentCell.getAttribute("name") + "</div>";
          else currentCell.innerHTML = "<div name=" + currentCell.getAttribute("name") + ">" + currentCell.getAttribute("name") + "</div>";

          /** Create dynamic input element */
          var input = document.createElement("textarea");
              input.placeholder = "Enter a url..";

          /** Cell has already an url */
          if (CORE.Cells.Live[currentCell.getAttribute("name")]) {
            /** Valid url */
            if (CORE.Cells.Live[currentCell.getAttribute("name")].Url !== "") {
              input.innerHTML = CORE.Cells.Live[currentCell.getAttribute("name")].Url;
            }
          }

          input.addEventListener('change', function(e) {
            /** Cell exists in cell live stack */
            if (CORE.Cells.Live[e.target.parentNode.getAttribute("name")]) {
              /** Update live cells url */
              CORE.Cells.Live[e.target.parentNode.getAttribute("name")].Url = e.target.value;
            }
            e.target.parentNode.innerHTML = "<div name=" + e.target.parentNode.getAttribute("name") + ">" + e.target.parentNode.getAttribute("name") + "</div>";
          });

          e.target.innerHTML = "";
          e.target.appendChild(input);

        }

        CORE.Input.Mouse.LiveCellEdit = true;

      } else {
        CORE.Input.Mouse.LiveCellEdit = false;
      }

    });

  };

}).call(this);