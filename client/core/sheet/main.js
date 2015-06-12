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

  /**
   * The Sheets Class
   *
   * @class Sheets
   * @static
   */
  CORE.Sheets = function() {};

  CORE.Sheets.prototype = CORE.Sheets;

  /**
   * Add a sheet
   *
   * @method addSheet
   * @static
   */
  CORE.Sheets.prototype.addSheet = function() {

    var newSheetNumber = 0;

    if (CORE.Sheets) {
      newSheetNumber = Object.keys(CORE.Sheets).length + 1;
    /** No sheets created yet */
    } else newSheetNumber = 1;

    if (arguments[0] && arguments[0].length) {
      CORE.CurrentSheet = arguments[0];
    } else {
      CORE.CurrentSheet = "Sheet" + newSheetNumber;
    }

    if (!CORE.Cells.Used[CORE.CurrentSheet]) CORE.Cells.Used[CORE.CurrentSheet] = {};

    /** Create new cell used stack */
    CORE.Sheets[CORE.CurrentSheet] = new CORE.Grid();

    /** Initialize Selector Plugin for the new sheet */
    CORE.Sheets[CORE.CurrentSheet].Selector = new CORE.Selector();

    var button = document.createElement("button");
        button.className = "mui-btn mui-btn-default mui-btn-mini slideUp";
        button.setAttribute("style", "color:#fff;background-color:rgba(130, 177, 255, 0.8);");
        button.setAttribute("name", CORE.CurrentSheet);
        button.innerHTML = CORE.CurrentSheet;

    /** Change sheet on click */
    button.addEventListener('click', function(e) {
      var name = e.target.getAttribute("name");
      CORE.Sheets.changeSheet(name);
      CORE.Event.resize();
      CORE.DOM.Output.classList.add("fadeIn");
      /** Highlight active sheet */
      CORE.Sheets.setActiveSheet(name);
      setTimeout(function() {
        CORE.DOM.Output.classList.remove("fadeIn");
      }, 275);
    });

    /** Insert into the dom */
    CORE.DOM.Sheets.appendChild(button);

    /** Auto change to the new sheet*/
    CORE.Sheets.changeSheet(CORE.CurrentSheet);

    /** Refresh everything */
    CORE.Event.resize();

    /** Highlight active sheet */
    CORE.Sheets.setActiveSheet(CORE.CurrentSheet);

    CORE.DOM.Output.classList.add("pullDown");

    setTimeout(function() {
      CORE.DOM.Output.classList.remove("pullDown");
    }, 275);

  };

  /**
   * Switch between sheets
   *
   * @method changeSheet
   * @static
   */
  CORE.Sheets.prototype.changeSheet = function(name) {

    CORE.CurrentSheet = name;

    /** Send sheet change to server */
    if (CORE.Connector.connected) {
      CORE.Connector.action("changeSheet", {sheet: name});
    }

  };

  /**
   * Visualize active sheet
   *
   * @method setActiveSheet
   * @static
   */
  CORE.Sheets.prototype.setActiveSheet = function(name) {

    for (var ii = 0; ii < CORE.DOM.Sheets.children.length; ++ii) {
      CORE.DOM.Sheets.children[ii].classList.remove("activeSheet");
      if (CORE.DOM.Sheets.children[ii].getAttribute("name") === name) {
        CORE.DOM.Sheets.children[ii].classList.add("activeSheet");
      }
    }

  };