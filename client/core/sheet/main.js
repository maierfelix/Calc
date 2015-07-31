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
  NOVAE.Sheets = function() {};

  NOVAE.Sheets.prototype = NOVAE.Sheets;
  NOVAE.Sheets.prototype.constructor = NOVAE.Sheets;

  /**
   * Add a sheet
   *
   * @method addSheet
   * @static
   */
  NOVAE.Sheets.prototype.addSheet = function() {

    /** Increase sheet count */
    NOVAE.SheetCount++;

    var newSheetNumber = NOVAE.SheetCount;

    /** Detect if user wants to create a master sheet */
    var masterSheet = arguments[1] || false;

    /** More than 1 master sheets are not allowed */
    if (masterSheet && (NOVAE.MasterSheetCount + 1) > 1) {

      /** Css class helper */
      var muiButton = "mdl-button mdl-js-button mdl-button--primary";

      /** The modal content */
      var title = "<h1>More than one master sheet isn't allowed!</h1>";
      var buttons = "<button class='"+muiButton+" alertOk' name='ok'>Ok</button><button class='"+muiButton+" alertAbort' name='abort'>Abort</button>";

      /** Alert the user, that more than one master sheets are not allowed */
      NOVAE_UI.Modal(title, buttons, function(submit) {});

      return void 0;
    }

    if (Object.keys(NOVAE.Sheets).length) {
      /** Already exists */
      if (NOVAE.Sheets["Sheet" + newSheetNumber]) {
        while (newSheetNumber++) {
          if (!NOVAE.Sheets["Sheet" + newSheetNumber] && newSheetNumber > NOVAE.SheetCount) break;
        }
      }
    /** No sheets created yet */
    } else newSheetNumber = 1;

    if (arguments[0] && arguments[0].length) {
      NOVAE.CurrentSheet = arguments[0];
    } else if (masterSheet) {
      NOVAE.MasterSheetCount++;
      NOVAE.CurrentSheet = "MasterSheet" + newSheetNumber;
    } else {
      NOVAE.CurrentSheet = "Sheet" + newSheetNumber;
    }

    NOVAE.$.createSheet(NOVAE.CurrentSheet, masterSheet);

    var button = document.createElement("button");
        button.className = "mdl-button mdl-js-button mdl-js-ripple-effect slideUp";
        /** Special background color for master sheets */
        if (masterSheet) button.setAttribute("style", "color:#fff;background-color:rgba(129, 199, 132, 0.8);");
        /** Default background for slave sheets */
        else button.setAttribute("style", "color:#fff;background-color:rgba(130, 177, 255, 0.8);");
        button.setAttribute("name", NOVAE.CurrentSheet);
        button.innerHTML = NOVAE.CurrentSheet;

    var closeButton = document.createElement("button");
        closeButton.innerHTML = "-";
        closeButton.className = "closeButton";

    var usersInRoom = document.createElement("p");
        usersInRoom.className = "usersInRoom";

    var sheetType = document.createElement("p");
        sheetType.className = "sheetType";
        sheetType.style.display = "none";

    /** User wants to add a master sheet */
    if (masterSheet) {
      sheetType.innerHTML = "M";
      sheetType.style.display = "block";
      button.appendChild(sheetType);
    } else {
      sheetType.innerHTML = "S";
      sheetType.style.display = "none";
      button.appendChild(sheetType);
    }

    button.appendChild(closeButton);
    button.appendChild(usersInRoom);

    /** Change sheet on click */
    button.addEventListener('click', function(e) {
      var name = e.target.getAttribute("name");
      if (name && name.length) {
        NOVAE.Sheets.changeSheet(name);
        NOVAE.Event.resize();
        /** Highlight active sheet */
        NOVAE.Sheets.setActiveSheet(name);
      /** Close button pressed ? */
      } else {
        if (e.target.nodeName === "BUTTON") {
          /** Delete button pressed, try to delete the sheet */
          if (name = e.target.parentNode.getAttribute("name")) {
            NOVAE.Sheets.deleteSheet(name);
          }
        }
      }
    });

    /** Insert sheet button into the dom */
    if (masterSheet) NOVAE.DOM.Sheets.insertBefore(button, NOVAE.DOM.Sheets.children[0]);
    else NOVAE.DOM.Sheets.appendChild(button);

    /** Auto change to the new sheet*/
    NOVAE.Sheets.changeSheet(NOVAE.CurrentSheet, 1);

    NOVAE.DOM.Viewport.classList.add("pullDown");

    setTimeout(function() {
      NOVAE.DOM.Viewport.classList.remove("pullDown");
    }, 275);

    /** Refresh everything */
    NOVAE.Event.resize();

    /** Select first cell in the grid */
    NOVAE.Sheets[NOVAE.CurrentSheet].Selector.selectCell(1, 1);

    /** Highlight active sheet */
    NOVAE.Sheets.setActiveSheet(NOVAE.CurrentSheet);

  };

  /**
   * Delete a sheet
   *
   * @method deleteSheet
   * @static
   */
  NOVAE.Sheets.prototype.deleteSheet = function(name) {

    var self = this;

    /** Sheet exists? */
    if (NOVAE.Sheets[name]) {
      /** Are there other sheets, since we need at least 1 open and active sheet */
      if (Object.keys(NOVAE.Sheets).length > 1) {

        /** Css class helper */
        var muiButton = "mdl-button mdl-js-button mdl-button--primary";

        /** The modal content */
        var title = "<h1>Delete Sheet</h1><h2>Do you really want to delete " + name + "?</h2>";
        var buttons = "<button class='"+muiButton+" alertOk' name='ok'>Ok</button><button class='"+muiButton+" alertAbort' name='abort'>Abort</button>";

        NOVAE_UI.Modal(title, buttons, function(submit) {
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
  NOVAE.Sheets.prototype.killSwitchSheet = function(name) {

    /** Delete the current opened sheet */
    if (name === NOVAE.CurrentSheet) {
      var lastSheet = undefined;
      /** First switch to another sheet */
      for (var ii in NOVAE.Sheets) {
        /** Found the current sheet */
        if (ii === name) {
          /** Not the first sheet deleted */
          if (lastSheet) {
            this.changeSheet(lastSheet);
            NOVAE.$.killSheet(name);
            this.setActiveSheet(lastSheet);
          /** First sheet has to be deleted */
          } else {
            NOVAE.$.killSheet(name);
            var newSheet = Object.keys(NOVAE.Sheets)[0];
            this.changeSheet(newSheet);
            this.setActiveSheet(ii);
          }
        }
        lastSheet = ii;
      }
    /** Refresh everything */
    NOVAE.Event.resize();
    /** Sheet to be deleted isnt active */
    } else {
      NOVAE.$.killSheet(name);
      this.changeSheet(NOVAE.CurrentSheet);
      this.setActiveSheet(NOVAE.CurrentSheet);
    }

  };

  /**
   * Switch between sheets
   *
   * @method changeSheet
   * @static
   */
  NOVAE.Sheets.prototype.changeSheet = function(name) {

    NOVAE.CurrentSheet = name;

    ENGEL.CurrentSheet = name;

    if (!arguments[1]) {
      NOVAE.DOM.Viewport.classList.add("fadeIn");

      setTimeout(function() {
        NOVAE.DOM.Viewport.classList.remove("fadeIn");
      }, 275);
    }

    NOVAE.eval();

    /** Send sheet change to server */
    if (NOVAE.Connector.connected) {
      NOVAE.Connector.action("changeSheet", {sheet: name});
    }

  };

  /**
   * Visualize active sheet
   *
   * @method setActiveSheet
   * @static
   */
  NOVAE.Sheets.prototype.setActiveSheet = function(name) {

    var attribute = null;

    var masterSheets = false;

    for (var ii = 0; ii < NOVAE.DOM.Sheets.children.length; ++ii) {
      NOVAE.DOM.Sheets.children[ii].classList.remove("activeSheet", "activeMasterSheet");
      attribute = NOVAE.DOM.Sheets.children[ii].getAttribute("name");
      /** Clean old sheet buttons */
      if (!NOVAE.Sheets[attribute]) {
        NOVAE.DOM.Sheets.children[ii].parentNode.removeChild(NOVAE.DOM.Sheets.children[ii]);
      }
      if (NOVAE.Sheets[attribute] && NOVAE.Sheets[attribute].Settings.master) {
        masterSheets = true;
      }
      /** Active master sheet found, display all slaves sheetType */
      if (masterSheets && NOVAE.Sheets[attribute] && !NOVAE.Sheets[attribute].Settings.master) {
        for (var kk = 0; kk < NOVAE.DOM.Sheets.children[ii].children.length; ++kk) {
          if (NOVAE.DOM.Sheets.children[ii].children[kk].className === "sheetType") {
            NOVAE.DOM.Sheets.children[ii].children[kk].style.display = "block";
          }
        }
      /** Remove sheetType for all slaves */
      } else if (!masterSheets) {
        if (NOVAE.DOM.Sheets.children[ii] && NOVAE.DOM.Sheets.children[ii].children) {
          for (var kk = 0; kk < NOVAE.DOM.Sheets.children[ii].children.length; ++kk) {
            if (NOVAE.DOM.Sheets.children[ii].children[kk].className === "sheetType") {
              NOVAE.DOM.Sheets.children[ii].children[kk].style.display = "none";
            }
          }
        }
      }
      if (attribute === name) {
        /** Detect master sheets */
        if (NOVAE.Sheets[attribute] && NOVAE.Sheets[attribute].Settings.master) {
          masterSheets = true;
          /** Special styling for master sheets */
          NOVAE.DOM.Sheets.children[ii].classList.add("activeMasterSheet");
        } else {
          if (NOVAE.DOM.Sheets.children[ii]) {
            NOVAE.DOM.Sheets.children[ii].classList.add("activeSheet");
          }
        }
      }
    }

  };