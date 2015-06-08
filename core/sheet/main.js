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
    } else newSheetNumber = 1;

    CORE.CurrentSheet = "Sheet" + newSheetNumber;

    if (!CORE.Cells.Used[CORE.CurrentSheet]) CORE.Cells.Used[CORE.CurrentSheet] = {};

    /** Create new cell used stack */
    CORE.Sheets[CORE.CurrentSheet] = new CORE.Grid();

    var button = document.createElement("button");
        button.className = "mui-btn mui-btn-default mui-btn-mini";
        button.setAttribute("style", "color:#fff;background-color:rgba(130, 177, 255, 0.8);");
        button.setAttribute("name", CORE.CurrentSheet);
        button.innerHTML = CORE.CurrentSheet;

    /** Change sheet on click */
    button.addEventListener('click', function(e) {
      CORE.Sheets.changeSheet(e.target.getAttribute("name"));
      CORE.Event.resize();
    });

    /** Insert into the dom */
    CORE.DOM.Sheets.appendChild(button);

  };

  /**
   * Switch between sheets
   *
   * @method changeSheet
   * @static
   */
  CORE.Sheets.prototype.changeSheet = function(name) {

    CORE.CurrentSheet = name;

    /** Initialize Selector Plugin for the new sheet */
    CORE.Sheets[CORE.CurrentSheet].Selector = new CORE.Selector();

  };