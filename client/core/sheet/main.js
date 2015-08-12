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
   * Add a sheet, submitted from the DOM
   *
   * @method addSheetEvent
   * @static
   */
  NOVAE.Sheets.prototype.addSheetEvent = function(name, isMasterSheet) {

    NOVAE.SheetCount++;

    /** Received no name */
    if (!name || !name.length) {
      name = "Sheet" + NOVAE.SheetCount;
    }

    var newSheetNumber = 1;

    /** Sheet already exists */
    if (NOVAE.Sheets.hasOwnProperty(name)) {
      /** Try to generate a sheet name */
      while (true) {
        newSheetNumber++;
        if (!NOVAE.Sheets.hasOwnProperty("Sheet" + newSheetNumber)) break;
      }
      name = "Sheet" + newSheetNumber;
    }

    this.addSheet(name);

    /** Auto select sheet, if only 1 sheet exists */
    if (Object.keys(NOVAE.Sheets).length === 1) {
      this.setActiveSheet(NOVAE.CurrentSheet);
    }

    /** Send sheet change to server */
    if (NOVAE.Connector.connected) {
      NOVAE.Connector.action("changeSheet", {sheet: name});
    }

  };


  /**
   * Add a sheet
   *
   * @method addSheet
   * @static
   */
  NOVAE.Sheets.prototype.addSheet = function(name) {

    /** Sheet already exists */
    if (NOVAE.Sheets.hasOwnProperty(name)) return void 0;

    NOVAE.CurrentSheet = name;

    ENGEL.CurrentSheet = name;

    /** Initialise sheet */
    NOVAE.$.createSheet(NOVAE.CurrentSheet, false);

    /** Append sheet button to the dom */
    NOVAE.DOM.Sheets.appendChild(this.createSheetButton(NOVAE.CurrentSheet));

  };

  /**
   * Switch to another sheet
   *
   * @method changeSheet
   * @static
   */
  NOVAE.Sheets.prototype.changeSheet = function(name) {

    NOVAE.CurrentSheet = name;

    ENGEL.CurrentSheet = name;

    this.setActiveSheet(name);

    NOVAE.Event.resize();

  };

  /**
   * Delete a sheet
   *
   * @method deleteSheet
   * @static
   */
  NOVAE.Sheets.prototype.deleteSheet = function(name, strict) {

    var self = this;

    /** Not found or invalid */
    if (!NOVAE.Sheets.hasOwnProperty(name)) return void 0;

    /** Don't delete if there aren't any other sheets */
    if (Object.keys(NOVAE.Sheets).length <= 1) return void 0;

    /** Css class helper */
    var muiButton = "mdl-button mdl-js-button mdl-button--primary";

    /** The modal content */
    var title = "<h1>Do you really want to delete " + name + "?</h1>";
    var buttons = "<button class='"+muiButton+" alertOk' name='ok'>Ok</button><button class='"+muiButton+" alertAbort' name='abort'>Abort</button>";

    /** Check if the current active sheet has to be deleted */
    if (NOVAE.CurrentSheet === name) {
      /** Don't ask to kill the sheet */
      if (strict) {
        self.killSheetButtonByName(name);
        NOVAE.$.killSheet(name);
        self.switchToLatestSheet();
      } else {
        NOVAE_UI.Modal(title, buttons, function(submit) {
          if (submit === "ok") {
            self.killSheetButtonByName(name);
            NOVAE.$.killSheet(name);
            self.switchToLatestSheet();
          }
        });
      }
    } else {
      if (strict) {
        self.killSheetButtonByName(name);
        NOVAE.$.killSheet(name);
      } else {
        NOVAE_UI.Modal(title, buttons, function(submit) {
          if (submit === "ok") {
            self.killSheetButtonByName(name);
            NOVAE.$.killSheet(name);
          }
        });
      }
    }

  };

  /**
   * Automatically switch to the latest created sheet
   *
   * @method switchToLatestSheet
   * @static
   */
  NOVAE.Sheets.prototype.switchToLatestSheet = function() {

    var length = Object.keys(NOVAE.Sheets).length;

    var counter = 0;

    for (var sheet in NOVAE.Sheets) {
      if (NOVAE.Sheets.hasOwnProperty(sheet)) {
        counter++;
      }
      if (counter >= length) {
        this.changeSheet(sheet);
        this.setActiveSheet(sheet);
        break;
      }
    }

  };

  /**
   * Set a sheet name to active (visual only)
   *
   * @method setActiveSheet
   * @static
   */
  NOVAE.Sheets.prototype.setActiveSheet = function(name) {

    var node = NOVAE.DOM.Sheets;

    for (var ii = 0; ii < node.children.length; ++ii) {
      if (node.children[ii] && node.children[ii].children[0]) {
        if (node.children[ii].children[0].nodeName === "SPAN") {
          if (node.children[ii].children[0].innerHTML === name) {
            node.children[ii].classList.add("activeSheet");
          } else {
            node.children[ii].classList.remove("activeSheet");
          }
        }
      }
    }

  };

  /**
   * Kill sheet button by it's name
   *
   * @method killSheetButtonByName
   * @static
   */
  NOVAE.Sheets.prototype.killSheetButtonByName = function(name) {

    var node = NOVAE.DOM.Sheets;

    for (var ii = 0; ii < node.children.length; ++ii) {
      if (node.children[ii] && node.children[ii].children[0]) {
        if (node.children[ii].children[0].nodeName === "SPAN") {
          if (node.children[ii].children[0].innerHTML === name) {
            node.children[ii].parentNode.removeChild(node.children[ii]);
            return (true);
          }
        }
      }
    }

    return (false);

  };

  /**
   * Create a sheet button
   *
   * @method createSheetButton
   * @static
   */
  NOVAE.Sheets.prototype.createSheetButton = function(name) {

    var self = this;

    /** To detect double clicks */
    var singleClick = null;

    var button = document.createElement("button");
        button.className = "mdl-button mdl-js-button mdl-button--primary slideUp";

    var span = document.createElement("span");
        span.innerHTML = name;

    var closeContainer = document.createElement("span");
        closeContainer.className = "closeButton";

    var closeContent = document.createElement("p");
        closeContent.className = "closeLine";

    closeContainer.appendChild(closeContent);

    button.appendChild(span);
    button.appendChild(closeContainer);

    button.setAttribute("clickcount", 0);
    button.setAttribute("autocomplete", "off");
    button.setAttribute("autocorrect", "off");
    button.setAttribute("autocapitalize", "off");
    button.setAttribute("spellcheck", "false");

    button.setAttribute("name", name);

    /** Click */
    button.addEventListener(NOVAE.Events.mouseDown, function(e) {

      /** Only accept left click */
      if (NOVAE.Settings.Mobile &&
          e.button === 1 || /** Middle click */
          e.button === 2 || /** Right click */
          e.which  === 3 || /** Right click */
          e.which  === 2) { return void 0; }

      /** Name of the sheet */
      var name;

      /** User want to delete the sheet */
      var deleteSheet = false;

      var target = self.getParentSheetButton(e);

      /** Get name of the sheet */
      if (e.target.nodeName === "SPAN" || e.target.nodeName === "P") {
        /** Clicked close button */
        if (e.target.className === "closeButton") {
          deleteSheet = true;
          name = e.target.parentNode.children[0].innerHTML;
        /** Clicked close button line */
        } else if (e.target.className === "closeLine") {
          deleteSheet = true;
          name = e.target.parentNode.parentNode.children[0].innerHTML;
          target = e.target.parentNode.parentNode;
        /** Clicked the sheet button */
        } else {
          name = e.target.innerHTML;
        }
        /** Increase click counter */
        target.setAttribute("clickcount", (parseInt(target.getAttribute("clickcount"))) + 1);
      } else {
        if (e.target.nodeName === "BUTTON") {
          name = e.target.children[0].innerHTML;
          /** Increase click counter */
          target.setAttribute("clickcount", (parseInt(target.getAttribute("clickcount"))) + 1);
        }
      }

      var clickCounter = parseInt(target.getAttribute("clickcount"));

      /** Single click, wait for a double click */
      if (clickCounter === 1) {

        clearTimeout(singleClick);

        singleClick = setTimeout(function() {

          singleClick = null;

          target.setAttribute("clickcount", 0);

          target.contentEditable = false;

          /** User edited sheet name and click on the sheet again while editing */
          if (NOVAE.Sheets[NOVAE.CurrentSheet].changeSheetName) {
            self.renameSheetEvent(e, target.getAttribute("name"), name);
            NOVAE.Sheets[NOVAE.CurrentSheet].changeSheetName = false;
            return void 0;
          }

          /** Proceed */
          if (!deleteSheet) {
            self.changeSheet(name);
            self.setActiveSheet(name);
          } else {
            self.deleteSheet(name);
          }

        }, 200);

      } else if (clickCounter === 2) {

        clearTimeout(singleClick);
        singleClick = null;
        target.setAttribute("clickcount", 0);

        target.contentEditable = true;

        NOVAE.Sheets[NOVAE.CurrentSheet].changeSheetName = true;

        NOVAE.CurrentSheetNameEdit = name;

      }

    });

    /** Listen for [ESC] and [ENTER] key */
    button.addEventListener('keydown', function(e) {

      var target = self.getParentSheetButton(e);

      /** [ENTER] or [ESC pressed] */
      if ([13, 27].indexOf(e.keyCode || e.which) >= 0) {

        e.preventDefault();

        var oldName = e.target.getAttribute("name");
        var newName = e.target.children[0].innerHTML;

        if (!NOVAE.Sheets[NOVAE.CurrentSheet].changeSheetName ||
            !oldName.length || !newName.length) { return void 0; }

        e.target.contentEditable = false;

        /** [ENTER] */
        if (e.keyCode === 13) {
          self.renameSheetEvent(e, oldName, newName);
        /** [ESC] */
        } else if (e.keyCode === 27) {
          e.target.setAttribute("name", oldName);
          e.target.children[0].innerHTML = oldName;
        }

        NOVAE.Sheets[NOVAE.CurrentSheet].changeSheetName = false;

      }



    });

    /** Blur */
    button.addEventListener('blur', function(e) {

      var target = self.getParentSheetButton(e);

      if (NOVAE.Sheets[NOVAE.CurrentSheet].changeSheetName) {
        var oldName = e.target.getAttribute("name");
        var newName = e.target.children[0].innerHTML;
        if (oldName.length && newName.length) {
          e.target.contentEditable = false;
          NOVAE.Sheets[NOVAE.CurrentSheet].changeSheetName = false;
          self.renameSheetEvent(e, oldName, newName);
        }
      }

    });

    return (button);

  };

  /**
   * Get parent sheet button of a target
   *
   * @method getParentSheetButton
   * @static
   */
  NOVAE.Sheets.prototype.getParentSheetButton = function(e) {

    var target = Object.prototype.toString.call(e);

    if (["[object MouseEvent]", "[object FocusEvent]", "[object KeyboardEvent]", "[object TouchEvent]"].indexOf(target) >= 0) {
      target = e.target;
    }

    if (target instanceof HTMLElement) {
      switch (target.nodeName) {
        case "SPAN":
          if (!target.className.length || target.className === "closeButton") {
            target = target.parentNode;
          }
        break;
        case "P":
          if (target.className === "closeLine") {
            target = target.parentNode.parentNode;
          }
        break;
      }
    }

    return (target);

  };

  /**
   * Get a sheet button by it's name
   *
   * @method getSheetButtonByName
   * @static
   */
  NOVAE.Sheets.prototype.getSheetButtonByName = function(name) {

    var node = NOVAE.DOM.Sheets;

    for (var ii = 0; ii < node.children.length; ++ii) {
      if (node.children[ii] && node.children[ii].children[0]) {
        if (node.children[ii].children[0].nodeName === "SPAN") {
          if (node.children[ii].children[0].innerHTML === name) {
            return (node.children[ii]);
          }
        }
      }
    }

    return void 0;

  };

  /**
   * Get a sheet button by it's child index
   *
   * @method getSheetButtonByIndex
   * @static
   */
  NOVAE.Sheets.prototype.getSheetButtonByIndex = function(id) {

    var node = NOVAE.DOM.Sheets;

    if (node.children[id]) {
      return (node.children[id]);
    }

    return void 0;

  };

  /**
   * Got a sheet rename, submitted from the DOM
   *
   * @method renameSheetEvent
   * @static
   */
  NOVAE.Sheets.prototype.renameSheetEvent = function(e, oldName, newName) {

    /** Nothing to change */
    if (oldName === newName) return void 0;

    /** Abort if sheet to rename does not exist */
    if (!NOVAE.Sheets.hasOwnProperty(oldName)) {
      return void 0;
    }

    var target = this.getParentSheetButton(e);

    /** Abort, if the choosen sheet name is already taken */
    if (NOVAE.Sheets.hasOwnProperty(newName)) {

      /** Css class helper */
      var muiButton = "mdl-button mdl-js-button mdl-button--primary";

      /** The modal content */
      var title = "<h1>This sheet name is already taken! Please choose another.</h1>";
      var buttons = "<button class='"+muiButton+" alertOk' name='ok'>Ok</button><button class='"+muiButton+" alertAbort' name='abort' style='display:none'></button>";

      /** Delayed, so we prevent instant skipping of warning dialog, if [ENTER] key pressed */
      if (Object.prototype.toString.call(e) === "[object KeyboardEvent]") {
        setTimeout(function() {
          NOVAE_UI.Modal(title, buttons, function() {});
        }, 15);
      /** Undelayed */
      } else {
        NOVAE_UI.Modal(title, buttons, function() {});
      }

      if (target) {
        target.children[0].innerHTML = oldName;
        target.setAttribute("name", oldName);
      }

      return void 0;
    }

    if (!this.validSheetName(newName)) {
      throw new Error("Invalid sheet name!");
    }

    target.setAttribute("name", newName);

    this.renameSheet(oldName, newName);

  };

  /**
   * Rename a sheet
   *
   * @method renameSheet
   * @static
   */
  NOVAE.Sheets.prototype.renameSheet = function(oldName, newName) {

    /** Nothing to change */
    if (oldName === newName) return void 0;

    /** Abort if sheet to rename does not exist */
    if (!NOVAE.Sheets.hasOwnProperty(oldName)) {
      return void 0;
    }

    NOVAE.$.renameSheet(oldName, newName);

    /** User is currently on the renamed sheet */
    if (oldName === NOVAE.CurrentSheet) {
      NOVAE.CurrentSheet = newName;
      ENGEL.CurrentSheet = newName;
    }

    /** Send sheet name change to the server */
    if (NOVAE.Connector.connected) {
      NOVAE.Connector.action("renameSheet", {oldName: oldName, newName: newName});
    }

  };

  /**
   * Check if a sheet name is valid
   *
   * @method validSheetName
   * @static
   */
  NOVAE.Sheets.prototype.validSheetName = function(name) {

    if (!name.length) return (false);

    var obj = {};

    try {
      obj[name] = 1;
      if (!obj.hasOwnProperty(name) || !obj[name]) {
        return (false);
      }
    } catch(e) {
      if (e) {
        return (false);
      }
    }

    return (true);

  };