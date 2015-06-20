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

    /** Detect if user wants to create a master sheet */
    var masterSheet = arguments[1] || false;

    /** More than 1 master sheets are not allowed */
    if (masterSheet && (CORE.MasterSheetCount + 1) > 1) {

      /** Css class helper */
      var muiButton = "mui-btn mui-btn-primary mui-btn-lg alertButton";

      /** The modal content */
      var title = "<h3 class='modalTitle'>More than one master sheet isn't allowed!</h3>";
      var buttons = "<button class='"+muiButton+" alertOk' name='ok'>Ok</button>";

      /** Alert the user, that more than one master sheets are not allowed */
      CORE_UI.Modal(title, buttons, function(submit) {});

      return void 0;
    }

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
    } else if (masterSheet) {
      CORE.MasterSheetCount++;
      CORE.CurrentSheet = "MasterSheet" + newSheetNumber;
    } else {
      CORE.CurrentSheet = "Sheet" + newSheetNumber;
    }

    CORE.$.createSheet(CORE.CurrentSheet, masterSheet);

    var button = document.createElement("button");
        button.className = "mui-btn mui-btn-default mui-btn-mini slideUp";
        /** Special background color for master sheets */
        if (masterSheet) button.setAttribute("style", "color:#fff;background-color:rgba(129, 199, 132, 0.8);");
        /** Default background for slave sheets */
        else button.setAttribute("style", "color:#fff;background-color:rgba(130, 177, 255, 0.8);");
        button.setAttribute("name", CORE.CurrentSheet);
        button.innerHTML = CORE.CurrentSheet;

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

    /** Insert sheet button into the dom */
    if (masterSheet) CORE.DOM.Sheets.insertBefore(button, CORE.DOM.Sheets.children[0]);
    else CORE.DOM.Sheets.appendChild(button);

    /** Auto change to the new sheet*/
    CORE.Sheets.changeSheet(CORE.CurrentSheet, 1);

    CORE.DOM.Output.classList.add("pullDown");

    setTimeout(function() {
      CORE.DOM.Output.classList.remove("pullDown");
    }, 275);

    /** Refresh everything */
    CORE.Event.resize();

    /** Select first cell in the grid */
    CORE.Sheets[CORE.CurrentSheet].Selector.selectCell(1, 1);

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

    var masterSheets = false;

    for (var ii = 0; ii < CORE.DOM.Sheets.children.length; ++ii) {
      CORE.DOM.Sheets.children[ii].classList.remove("activeSheet", "activeMasterSheet");
      attribute = CORE.DOM.Sheets.children[ii].getAttribute("name");
      /** Clean old sheet buttons */
      if (!CORE.Sheets[attribute]) {
        CORE.DOM.Sheets.children[ii].parentNode.removeChild(CORE.DOM.Sheets.children[ii]);
      }
      if (CORE.Sheets[attribute] && CORE.Sheets[attribute].Settings.master) {
        masterSheets = true;
      }
      /** Active master sheet found, display all slaves sheetType */
      if (masterSheets && CORE.Sheets[attribute] && !CORE.Sheets[attribute].Settings.master) {
        for (var kk = 0; kk < CORE.DOM.Sheets.children[ii].children.length; ++kk) {
          if (CORE.DOM.Sheets.children[ii].children[kk].className === "sheetType") {
            CORE.DOM.Sheets.children[ii].children[kk].style.display = "block";
          }
        }
      /** Remove sheetType for all slaves */
      } else if (!masterSheets) {
        for (var kk = 0; kk < CORE.DOM.Sheets.children[ii].children.length; ++kk) {
          if (CORE.DOM.Sheets.children[ii].children[kk].className === "sheetType") {
            CORE.DOM.Sheets.children[ii].children[kk].style.display = "none";
          }
        }
      }
      if (attribute === name) {
        /** Detect master sheets */
        if (CORE.Sheets[attribute] && CORE.Sheets[attribute].Settings.master) {
          masterSheets = true;
          /** Special styling for master sheets */
          CORE.DOM.Sheets.children[ii].classList.add("activeMasterSheet");
        } else {
          CORE.DOM.Sheets.children[ii].classList.add("activeSheet");
        }
      }
    }

  };