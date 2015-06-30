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

  NOVAE_UI.CodeMirror = {
    /** Create a empty codemirror instance */
    instance: CodeMirror(document.body, {
      mode:  "javascript",
      lineNumbers: true,
      readOnly: false,
      theme: "default"
    }),
    visible: false,
    currentScript: null
  };

  NOVAE_UI.CodeMirror.instance.setValue("");

  NOVAE_UI.CodeMirror.instance.getWrapperElement().style.display = "none";

  /** Initialize everything */
  NOVAE_UI.init = function() {

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

      if (!NOVAE.Connector.connected && time >= 750) {
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

    /** Redo menu button */
    NOVAE.DOM.RedoMenuButton.addEventListener('click', function() {
      NOVAE.Sheets[NOVAE.CurrentSheet].Commander.redo();
    });

    /** Undo menu button */
    NOVAE.DOM.UndoMenuButton.addEventListener('click', function() {
      NOVAE.Sheets[NOVAE.CurrentSheet].Commander.undo();
    });

    /** Script Manager */
    NOVAE.DOM.ScriptButton.addEventListener(NOVAE.Events.mouseDown, function() {

      var visibility = NOVAE_UI.CodeMirror.visible || false;

      if (!visibility) {
        NOVAE_UI.CodeMirror.instance.getWrapperElement().style.display = "block";
        NOVAE_UI.CodeMirror.visible = true;
        NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.ScriptEdit = true;
        NOVAE_UI.CodeMirror.instance.focus();
      } else {
        NOVAE_UI.CodeMirror.instance.getWrapperElement().style.display = "none";
        NOVAE_UI.CodeMirror.visible = false;
        NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.ScriptEdit = false;
      }

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

    NOVAE_UI.initCodeMirror();

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

  /** Initialise codemirror */
  NOVAE_UI.initCodeMirror = function() {

    /** Disable grid input on focus */
    NOVAE_UI.CodeMirror.instance.on("focus", function(){
      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.ScriptEdit = true;
    });

    /** Listen for script changes */
    NOVAE_UI.CodeMirror.instance.on("change", function() {

      if (NOVAE_UI.CodeMirror.currentScript) {
        Interpreter.modules[NOVAE_UI.CodeMirror.currentScript].code = NOVAE_UI.CodeMirror.instance.getValue();
      }

    });

    var element = NOVAE_UI.CodeMirror.instance.getWrapperElement();

    NOVAE_UI.CodeMirror.visible = false;

    var button = document.createElement("button");
        button.className = "mui-btn mui-btn-default mui-btn-raised mui-btn-sm editorButtonOk";
        button.innerHTML = '<span class="fa fa-play"></span>';
        button.addEventListener(NOVAE.Events.mouseDown, function() {
          if (NOVAE_UI.CodeMirror.currentScript) {
            Interpreter.run(NOVAE_UI.CodeMirror.currentScript);
          }
        });

    element.appendChild(button);

    button = document.createElement("button")
    button.className = "mui-btn mui-btn-default mui-btn-raised mui-btn-sm editorButtonShortCut";
    button.innerHTML = '<span class="fa fa-key"></span>';
    button.addEventListener(NOVAE.Events.mouseDown, function() {
      console.log("Add shortcut");
    });

    element.appendChild(button);

    button = document.createElement("button")
    button.className = "mui-btn mui-btn-default mui-btn-raised mui-btn-sm editorButtonAdd";
    button.innerHTML = '<span class="fa fa-plus"></span>';
    button.addEventListener(NOVAE.Events.mouseDown, function() {
      console.log("Add script");
    });

    element.appendChild(button);

    var modules = document.createElement("span");
        modules.className = "moduleContainer";

    for (var ii in Interpreter.modules) {
      var item = document.createElement("button");
      item.className = "mui-btn mui-btn-default mui-btn-raised mui-btn-sm editorScript";
      item.innerHTML = ii;
      item.addEventListener(NOVAE.Events.mouseDown, function(e) {
        NOVAE_UI.CodeMirrorLoadScript(e.target.textContent);
      });
      modules.appendChild(item);
    }

    element.appendChild(modules);

  };

  /** Load script into Codemirror */
  NOVAE_UI.CodeMirrorLoadScript = function(name) {

    if (Interpreter.modules[name]) {
      NOVAE_UI.CodeMirror.currentScript = name;
      NOVAE_UI.CodeMirror.instance.setValue(Interpreter.modules[name].original);
    } else {
      NOVAE_UI.CodeMirror.currentScript = null;
    }

  };