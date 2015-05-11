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

  /** Select and prepare the menu dialog container */
  CORE_UI.MENU_DIALOG_CONTAINER = document.querySelector("#menu_dialogs");

  /** Create DOM Object */
  CORE_UI.MENU = {};

  /** Select and prepare the file menu container */
  CORE_UI.MENU.File = {
    $: document.querySelector("#menu_file"),
    active: false,
    children: {
      Open: document.querySelector("#open"),
      Save: document.querySelector("#save")
    }
  };

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

  /** Select and prepare the view menu container */
  CORE_UI.MENU.View = {
    $: document.querySelector("#menu_view"),
    active: false
  };

  /** Select and prepare the view menu container */
  CORE_UI.MENU.Debug = {
    $: document.querySelector("#menu_debug"),
    active: false
  };

  /** Initialize everything */
  CORE_UI.init = function() {

    for (var ii in CORE_UI.MENU) {

      /** Add functionality to the menu children */
      if (CORE_UI.MENU[ii].children) {
        for (var ll in CORE_UI.MENU[ii].children) {
          CORE_UI.MENU[ii].children[ll].addEventListener('click', function(e) {

            var actionName = null;

            if (e.target.id) actionName = e.target.id;
            else if (e.target.parentNode.id) actionName = e.target.parentNode.id;

            if (typeof(CORE_UI.ACTION[actionName]) == "function") CORE_UI.ACTION[actionName]();

          });
        }
      }

      /** Menu node click listeners */
      if (CORE_UI.MENU[ii].$.id) {
        CORE_UI.MENU[ii].$.addEventListener('click', function(e) {
          if (e.target.id || e.target.parentNode.id) {
            var target = e.target || e.target.parentNode;
            var menu = document.querySelector("#menu_dialogs");
            for (var kk = 0; kk < menu.children.length; ++kk) {
              if (menu.children[kk].getAttribute("name") === e.target.parentNode.getAttribute("name") ||
                  menu.children[kk].getAttribute("name") ===  e.target.getAttribute("name")) {

                var name = menu.children[kk].getAttribute("name");

                if (CORE_UI.MENU[name]) {

                  if (!CORE_UI.MENU[name].active) {

                    CORE_UI.closeAllMenus();

                    CORE_UI.MENU_DIALOG_CONTAINER.style.display = "block";

                    CORE_UI.MENU[name].active = true;

                    menu.children[kk].style.display = "block";

                  } else {

                    CORE_UI.MENU_DIALOG_CONTAINER.style.display = "none";

                    CORE_UI.MENU[name].active = false;

                    menu.children[kk].style.display = "none";

                  }

                }

              }
            }
          }
        });
      }
    }

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

}).call(this);