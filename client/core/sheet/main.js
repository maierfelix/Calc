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
  CORE.Sheets.prototype.constructor = CORE.Sheets;

  /**
   * Add a sheet
   *
   * @method addSheet
   * @static
   */
  CORE.Sheets.prototype.addSheet = function() {

    /** Increase sheet count */
    CORE.SheetCount++;

    var newSheetNumber = CORE.SheetCount;

    if (Object.keys(CORE.Sheets).length) {
      /** Already exists */
      if (CORE.Sheets["Sheet" + newSheetNumber]) {
        while (newSheetNumber++) {
          if (!CORE.Sheets["Sheet" + newSheetNumber] && newSheetNumber > CORE.SheetCount) break;
        }
      }
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

    var closeButton = document.createElement("button");
        closeButton.innerHTML = "-";
        closeButton.className = "closeButton";

    var usersInRoom = document.createElement("p");
        usersInRoom.className = "usersInRoom";

    button.appendChild(closeButton);
    button.appendChild(usersInRoom);

    /** Change sheet on click */
    button.addEventListener('click', function(e) {
      var name = e.target.getAttribute("name");
      if (name && name.length) {
        CORE.Sheets.changeSheet(name);
        CORE.Event.resize();
        /** Highlight active sheet */
        CORE.Sheets.setActiveSheet(name);
      /** Close button pressed ? */
      } else {
        if (e.target.nodeName === "BUTTON") {
          /** Delete button pressed, try to delete the sheet */
          if (name = e.target.parentNode.getAttribute("name")) {
            CORE.Sheets.deleteSheet(name);
          }
        }
      }
    });

    /** Insert into the dom */
    CORE.DOM.Sheets.appendChild(button);

    /** Auto change to the new sheet*/
    CORE.Sheets.changeSheet(CORE.CurrentSheet, 1);

    CORE.DOM.Output.classList.add("pullDown");

    setTimeout(function() {
      CORE.DOM.Output.classList.remove("pullDown");
    }, 275);

    /** Refresh everything */
    CORE.Event.resize();

    /** Highlight active sheet */
    CORE.Sheets.setActiveSheet(CORE.CurrentSheet);

  };

  /**
   * Delete a sheet
   *
   * @method deleteSheet
   * @static
   */
  CORE.Sheets.prototype.deleteSheet = function(name) {

    var self = this;

    /** Sheet exists? */
    if (CORE.Sheets[name]) {
      /** Are there other sheets, since we need at least 1 open and active sheet */
      if (Object.keys(CORE.Sheets).length > 1) {

        /** Css class helper */
        var muiButton = "mui-btn mui-btn-primary mui-btn-lg alertButton";

        /** The modal content */
        var title = "<h3 class='modalTitle'>Do you really want to delete " + name + "?</h3>";
        var buttons = "<button class='"+muiButton+" alertOk' name='ok'>Ok</button><button class='"+muiButton+" alertAbort' name='abort'>Abort</button>";

        CORE_UI.Modal(title, buttons, function(submit) {
          /** User has to submit */
          if (submit === "ok") {
            /** Delete sheet and directly switch to another if necessary */
            self.killSwitchSheet(name);
          }
        });

      }
    }

  };

  /**
   * Delete a sheet and switch to another
   *
   * @method killSwitchSheet
   * @static
   */
  CORE.Sheets.prototype.killSwitchSheet = function(name) {

    /** Delete the current opened sheet */
    if (name === CORE.CurrentSheet) {
      var lastSheet = undefined;
      /** First switch to another sheet */
      for (var ii in CORE.Sheets) {
        /** Found the current sheet */
        if (ii === name) {
          /** Not the first sheet deleted */
          if (lastSheet) {
            this.changeSheet(lastSheet);
            CORE.$.killSheet(name);
            this.setActiveSheet(lastSheet);
          /** First sheet has to be deleted */
          } else {
            CORE.$.killSheet(name);
            var newSheet = Object.keys(CORE.Sheets)[0];
            this.changeSheet(newSheet);
            this.setActiveSheet(ii);
          }
        }
        lastSheet = ii;
      }
    /** Refresh everything */
    CORE.Event.resize();
    /** Sheet to be deleted isnt active */
    } else {
      CORE.$.killSheet(name);
      this.changeSheet(CORE.CurrentSheet);
      this.setActiveSheet(CORE.CurrentSheet);
    }

  };

  /**
   * Switch between sheets
   *
   * @method changeSheet
   * @static
   */
  CORE.Sheets.prototype.changeSheet = function(name) {

    CORE.CurrentSheet = name;

    if (!arguments[1]) {
      CORE.DOM.Output.classList.add("fadeIn");

      setTimeout(function() {
        CORE.DOM.Output.classList.remove("fadeIn");
      }, 275);
    }

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

    var attribute = null;

    for (var ii = 0; ii < CORE.DOM.Sheets.children.length; ++ii) {
      CORE.DOM.Sheets.children[ii].classList.remove("activeSheet");
      attribute = CORE.DOM.Sheets.children[ii].getAttribute("name");
      /** Clean old sheet buttons */
      if (!CORE.Sheets[attribute]) {
        CORE.DOM.Sheets.children[ii].parentNode.removeChild(CORE.DOM.Sheets.children[ii]);
      }
      if (attribute === name) {
        CORE.DOM.Sheets.children[ii].classList.add("activeSheet");
      }
    }

  };