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
  CORE_UI.MENU_DIALOG_CONTAINER = document.querySelector("#menu_dialogs");

  /** Create DOM Object */
  CORE_UI.MENU = {};

  /** Select and prepare the edit menu container */
  CORE_UI.MENU.Edit = {
    $: document.querySelector("#menu_edit"),
    active: false
  };

  /** Select and prepare the modify menu container */
  CORE_UI.MENU.Modify = {
    $: document.querySelector("#menu_modify"),
    active: false
  };

  /** Initialize everything */
  CORE_UI.init = function() {

    document.querySelector("#menu_connect").addEventListener('click', function(e) {
      CORE.Connector.loginModal();
    });

    CORE.DOM.AddSheet.addEventListener('click', function() {
			CORE.Sheets.addSheet();
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
              CORE.File.import(data);
            });

          });

        /** Data save file */
        } else {
          CORE.File.import(reader.result);
        }

      };

      reader.readAsText(input.files[0]);

    });

    /** Initialize cell style menu */
    CORE_UI.initCellStyleMenu();

  };

  /** Close all menus */
  CORE_UI.closeAllMenus = function() {

    var menu = document.querySelector("#menu_dialogs");

    /** Hide all menu nodes */
    for (var ii = 0; ii < menu.children.length; ++ii) {
      menu.children[ii].style.display = "none";
    }

    /** Set all menu nodes inactive */
    for (var ii in CORE_UI.MENU) {
      CORE_UI.MENU[ii].active = false;
    }

  };