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
  NOVAE.Sheets.prototype.addSheet = function(name, isMasterSheet) {

    NOVAE.SheetCount++;

    /** Received no name */
    if (!name || !name.length) {
      name = "Sheet" + NOVAE.SheetCount;
    }

    /** Sheet already exists */
    if (NOVAE.Sheets.hasOwnProperty(name)) return void 0;

    if (name && name.length) {
      NOVAE.CurrentSheet = name;
    } else if (isMasterSheet) {
      NOVAE.MasterSheetCount++;
      NOVAE.CurrentSheet = "MasterSheet" + newSheetNumber;
    } else {
      NOVAE.CurrentSheet = "Sheet" + newSheetNumber;
    }

    ENGEL.CurrentSheet = NOVAE.CurrentSheet;

    /** Initialise sheet */
    NOVAE.$.createSheet(NOVAE.CurrentSheet, false);

    /** Append sheet link to the dom */
    var button = this.createSheetButton(NOVAE.CurrentSheet);

    NOVAE.DOM.Sheets.appendChild(button);

    if (Object.keys(NOVAE.Sheets).length === 1) {
      this.setActiveSheet(NOVAE.CurrentSheet);
    }

  };

  /**
   * Switch to another sheet
   *
   * @method changeSheet
   * @static
   */
  NOVAE.Sheets.prototype.changeSheet = function(name) {

    /** Sheet is already active */
    if (name === NOVAE.CurrentSheet) return void 0;

    NOVAE.CurrentSheet = name;

    ENGEL.CurrentSheet = name;

    NOVAE.Event.resize();

  };

  /**
   * Delete a sheet
   *
   * @method deleteSheet
   * @static
   */
  NOVAE.Sheets.prototype.deleteSheet = function(name) {

    /** Not found or invalid */
    if (!NOVAE.Sheets.hasOwnProperty(name)) return void 0;

    /** Don't delete if there aren't any other sheets */
    if (Object.keys(NOVAE.Sheets).length <= 1) return void 0;

    /** Sheet to switch to, if current active sheet gets deleted */
    var newSheetName;

    /** Check if the current active sheet has to be deleted */
    if (NOVAE.CurrentSheet === name) {
      if (this.killSheetButtonByName(name)) {
        NOVAE.$.killSheet(name);
        this.switchToLatestSheet();
      } else {
        throw new Error("Can't delete " + name + "!");
      }
    } else {
      if (this.killSheetButtonByName(name)) {
        NOVAE.$.killSheet(name);
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

    var button = document.createElement("button");
        button.className = "mdl-button mdl-js-button mdl-button--primary slideUp";

    var span = document.createElement("span");
        span.innerHTML = name;

    var close = document.createElement("span");
        close.className = "closeButton";
        close.innerHTML = "-";

    button.appendChild(span);
    button.appendChild(close);

    /** Click */
    button.addEventListener(NOVAE.Events.mouseDown, function(e) {

      /** Only accept left click */
      if (e.button === 1 || /** Middle click */
          e.button === 2 || /** Right click */
          e.which  === 3 || /** Right click */
          e.which  === 2) { return void 0; }

      var name;

      var deleteSheet = false;

      if (e.target.nodeName === "SPAN") {
        if (e.target.className === "closeButton") {
          deleteSheet = true;
          name = e.target.parentNode.children[0].innerHTML;
        } else {
          name = e.target.innerHTML;
        }
      } else {
        if (e.target.nodeName === "BUTTON") {
          name = e.target.children[0].innerHTML;
        }
      }

      if (!deleteSheet) {
        self.changeSheet(name);
        self.setActiveSheet(name);
      } else {
        self.deleteSheet(name);
      }

    });

    return (button);

  };