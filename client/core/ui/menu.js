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

  /** Select and prepare the menu dialog container */
  NOVAE_UI.MENU_DIALOG_CONTAINER = document.querySelector("#menu_dialogs");

  /** Create DOM Object */
  NOVAE_UI.MENU = {};

  /** Select and prepare the edit menu container */
  NOVAE_UI.MENU.Edit = {
    $: document.querySelector("#menu_edit"),
    active: false
  };

  /** Select and prepare the modify menu container */
  NOVAE_UI.MENU.Modify = {
    $: document.querySelector("#menu_modify"),
    active: false
  };

  /** Initialize everything */
  NOVAE_UI.init = function() {

    document.querySelector("#menu_connect").addEventListener('click', function(e) {
      NOVAE.Connector.loginModal();
    });

    NOVAE.DOM.AddSheet.addEventListener(NOVAE.Events.mouseDown, function() {

      this.setAttribute("timestamp", new Date().getTime());

    });

    NOVAE.DOM.AddSheet.addEventListener(NOVAE.Events.mouseUp, function() {

      /** Don't confuse this as a mouse wipe */
      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.Pressed = false;

      /** Get last time the button was pressed */
      var lastPress = parseInt(this.getAttribute("timestamp"));

      /** Calculate mouse press duration */
      var time = (new Date().getTime() - lastPress);

      if (time >= 750) {
        /** Add a master sheet */
        NOVAE.Sheets.addSheet(false, true);
      } else {
        /** Add a slave sheet */
        NOVAE.Sheets.addSheet();
      }

    });

    /** Redo button */
    NOVAE.DOM.RedoButton.addEventListener('click', function() {
      NOVAE.Sheets[NOVAE.CurrentSheet].Commander.redo();
    });

    /** Undo button */
    NOVAE.DOM.UndoButton.addEventListener('click', function() {
      NOVAE.Sheets[NOVAE.CurrentSheet].Commander.undo();
    });

    document.querySelector("#import_file").addEventListener('change', function(e) {

      var input = e.target;

      var reader = new FileReader();

      reader.onload = function(){

        /** Image save file */
        if ((reader.result.substr(11)).match("png")) {

          var img = new Image();
              img.src = reader.result;

          AJAX.POST(img.src, "server/base64ToImage.php", function(response) {

            img = new Image();
            img.src = "server/uploads/" + response;

            JS2PNG.Decode(img, function(data) {
              NOVAE.File.import(data);
            });

          });

        /** Data save file */
        } else {
          NOVAE.File.import(reader.result);
        }

      };

      reader.readAsText(input.files[0]);

    });

    /** Initialize cell style menu */
    NOVAE_UI.initCellStyleMenu();

  };

  /** Close all menus */
  NOVAE_UI.closeAllMenus = function() {

    var menu = document.querySelector("#menu_dialogs");

    /** Hide all menu nodes */
    for (var ii = 0; ii < menu.children.length; ++ii) {
      menu.children[ii].style.display = "none";
    }

    /** Set all menu nodes inactive */
    for (var ii in NOVAE_UI.MENU) {
      NOVAE_UI.MENU[ii].active = false;
    }

  };