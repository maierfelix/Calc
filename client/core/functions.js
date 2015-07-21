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

  /** Create Functions Object */
  NOVAE.$ = {};

  /**
   * Initialise everything
   *
   * @method init
   * @static
   */
  NOVAE.$.init = function() {

    /** Initialize local / session storage api */
    NOVAE.Storage = new NOVAE.Storage();

    /** Detect used browser */
    NOVAE.$.detectBrowser();

    /** Mobile device check */
    NOVAE.$.isMobile();

    /** Detect landscape mode if on mobile device */
    NOVAE.$.alertGoLandscape();

    /** Remind user to add app to his homescreen */
    NOVAE.$.alertAddToHomeScreen();

    /** Prepare platform dependent events */
    NOVAE.$.prepareEvents();

    /** Create resize object if not existing yet */
    if (!NOVAE.Cells.Resized[NOVAE.CurrentSheet]) NOVAE.$.createResizedObject();

    /** Create all object if not existing yet */
    if (!NOVAE.Cells.All[NOVAE.CurrentSheet]) NOVAE.$.createAllObject();

    /** Create master object if not existing yet */
    if (!NOVAE.Cells.Master[NOVAE.CurrentSheet]) NOVAE.$.createMasterObject();

    /** Calculate scroll amount */
    NOVAE.Settings.Scroll.OriginalVertical = NOVAE.Settings.Scroll.Vertical = NOVAE.$.calculateScrollAmount();

    /** Fastclick if we're on mobile */
    if (NOVAE.Settings.Mobile) FastClick.attach(document.body);

    /** Initialize Connector Plugin */
    NOVAE.Connector = new NOVAE.Connector();

    /** Initialize File Plugin */
    NOVAE.File = new NOVAE.File();

    /** Initialize Awakener Plugin */
    NOVAE.Awakener = new NOVAE.Awakener();

    /** Initialize Sheet Plugin */
    NOVAE.Sheets = new NOVAE.Sheets();

    /** Initialize Extender Plugin */
    NOVAE.Extender = new NOVAE.Extender();

    /** Initialize Collector Plguin */
    NOVAE.Collector = new NOVAE.Collector();

    /** Add a new first sheet */
    NOVAE.Sheets.addSheet();

    /** Switch to the first sheet */
    NOVAE.Sheets.changeSheet(NOVAE.CurrentSheet);

    /** Add first sheet to the collector */
    NOVAE.Collector.addSheet(NOVAE.CurrentSheet);

    /** Add select all functionalitity to current cell button */
    NOVAE.$.initCurrentCellButton();

    /** Initialize all event listeners */
    NOVAE.Event.init();

    /** Initialize Selector Plugin for this sheet */
    NOVAE.Sheets[NOVAE.CurrentSheet].Selector = new NOVAE.Selector();

    /** Initialize Commander Plugin for this sheet */
    NOVAE.Sheets[NOVAE.CurrentSheet].Commander = new NOVAE.Commander();

    /** Initialize Injector Plugin */
    NOVAE.Injector = new NOVAE.Injector();

    /** Initialize Styler Plugin */
    NOVAE.Styler = new NOVAE.Styler();

    /** Select first cell in the grid */
    NOVAE.Sheets[NOVAE.CurrentSheet].Selector.selectCell(1, 1);

    /** Try to connect */
    if (NOVAE.Connector.getURL()) NOVAE.Connector.connect();

    /** Initialize Speed test Plugin */
    NOVAE.Speedy = new NOVAE.Speedy();

    /** Initialize ClipBoard Plugin */
    NOVAE.ClipBoard = new NOVAE.ClipBoard();

    /** A direct command creation helper function */
    NOVAE.newCommand = function() {

      return (new NOVAE.Sheets[NOVAE.CurrentSheet].Commander.Command());

    };

    /** Scroll to abolsute top if we're on mobile ios */
    if (NOVAE.Settings.Mobile && NOVAE.Settings.isIOS) {
      window.scrollTo(0, 1);
    }

  };

  /**
   * Check if we're on a mobile device
   *
   * @method isMobile
   * @static
   */
  NOVAE.$.isMobile = function() {

    return (NOVAE.Settings.Mobile);

  };

  /**
   * Prepare platform dependent events
   *
   * @method prepareEvents
   * @static
   */
  NOVAE.$.prepareEvents = function() {

    NOVAE.Events = {
      mouseDown: NOVAE.Settings.Mobile ? "touchstart" : "mousedown",
      mouseUp:   NOVAE.Settings.Mobile ? "touchend"   : "mouseup",
      mouseMove: NOVAE.Settings.Mobile ? "touchmove"  : "mousemove",
      mouseOut:  NOVAE.Settings.Mobile ? "touchleave" : "mouseout"
    };

  };

  /**
   * Initialize current cell button
   *
   * @method initCurrentCellButton
   * @static
   */
  NOVAE.$.initCurrentCellButton = function() {

    NOVAE.DOM.CurrentCell.addEventListener('click', function() {
      NOVAE.Sheets[NOVAE.CurrentSheet].Selector.allSelected = true;
      NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();
    });

  };

  /**
   * Detect browser
   *
   * @method detectBrowser
   * @static
   */
  NOVAE.$.detectBrowser = function() {

    if (/iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent)) {
      NOVAE.Settings.Mobile = true;
      NOVAE.Settings.isWebApp = typeof window.navigator.standalone != 'undefined' && window.navigator.standalone ? true : false;
    }

    NOVAE.Settings.isFirefox = typeof InstallTrigger !== 'undefined' ? true : false;
    NOVAE.Settings.isSafari  = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 ? true : false;
    NOVAE.Settings.isChrome  = !!window.chrome ? true : false;
    NOVAE.Settings.isIE      = /*@cc_on!@*/false || !!document.documentMode ? true : false;
    NOVAE.Settings.isIOS     = navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) ? true : false;
    NOVAE.Settings.isAndroid = navigator.userAgent.match(/Android/i);

  };

  /**
   * Detect landscape on mobile devices
   *
   * @method detectLandscape
   * @static
   */
  NOVAE.$.detectLandscape = function() {

    /** Android orientation */
    if (NOVAE.Settings.isAndroid) {
      if (NOVAE.Settings.Width > NOVAE.Settings.Height) {
        NOVAE.Settings.isLandscape = true;
      } else {
        NOVAE.Settings.isLandscape = false;
      }
      return void 0;
    }

    /** IOS orientation */
    var orientation = window.orientation;

    NOVAE.Settings.isLandscape = false;

    /** Abort, since it seems like its no IOS device */
    if (orientation === undefined || orientation === null) return (NOVAE.Settings.isLandscape = true);

    if (orientation === 0 || orientation === 180) {
      NOVAE.Settings.isLandscape = false;
    } else if (orientation === 90 || orientation === -90) {
      NOVAE.Settings.isLandscape = true;
    }

  };

  /**
   * Alert user to add novaecalc to his home screen
   *
   * @method addToHomeScreen
   * @static
   */
  NOVAE.$.alertAddToHomeScreen = function() {

    var muiButton = "mui-btn mui-btn-primary mui-btn-lg alertButton";
    var title = "<h2>Home Screen</h2><h3>Tap <img class='addHomeScreen' /> and then <b>Add to Home Screen</b>.</h3>";
    var buttons = "<button class='"+muiButton+" alertOk'>Done</button>";

    /** Remind user to add novaecalc to his homescreen */
    if (!NOVAE.Settings.isWebApp) {
      if (NOVAE.Settings.isIOS) {
        if (!NOVAE.Storage.get({ property: "HomeScreen" })) {
          NOVAE_UI.Modal(title, buttons, function() {});
          /** Don't ask again */
          NOVAE.Storage.set({ property: "HomeScreen", value: true });
        }
      }
    }

  };

  /**
   * Alert user to to go into landscape
   *
   * @method alertGoLandscape
   * @static
   */
  NOVAE.$.alertGoLandscape = function() {

    var muiButton = "mui-btn mui-btn-primary mui-btn-lg alertButton";
    var title = "<h2><img class='rotateDevice' /></h2><h3>Rotate your device for the best experience.</h3>";
    var buttons = "<button class='"+muiButton+" alertOk'>All right</button>";

    if (NOVAE.Settings.Mobile && NOVAE.Settings.isIOS && NOVAE.Settings.isWebApp) {

      /** Only remind 1 time per session */
      if (!NOVAE.Storage.get({ property: "Landscape" })) {
        NOVAE.$.detectLandscape();
        /** Remind user */
        if (!NOVAE.Settings.isLandscape) {
          NOVAE_UI.Modal(title, buttons, function() {});
        }
        /** Don't ask again */
        NOVAE.Storage.set({ property: "Landscape", value: true });
      }

    }

  };

  /**
   * Calculate a fine scroll amount
   *
   * @method calculateScrollAmount
   * @static
   */
  NOVAE.$.calculateScrollAmount = function() { 
    return (Math.floor((Math.pow(NOVAE.Settings.Height, Math.floor(Math.log(NOVAE.Settings.Height) / Math.log(NOVAE.Settings.Height))) / 100) / 4));
  };

  /**
   * Number to alphabetical letter conversion
   *
   * @method numberToAlpha
   * @static
   */
  NOVAE.$.numberToAlpha = function(number) {

    /** Charcode for a */
    var a = 65;

    /** Alphabet length */
    var length = 26;

    /** Final letter */
    var letter = 0;

    /** Calculation */
    var newNumber = 0;

    /** Get modulo */
    letter = (a + (number - 1) % length);

    /** Auto validation */
    letter = letter <= a ? "A" : String.fromCharCode(letter);

    /** Get letter length */
    newNumber = parseInt((number - 1) / length);

    /** Recurse to get the following letters */
    if (newNumber > 0) return (NOVAE.$.numberToAlpha(newNumber) + letter);

    return (letter);

  };

  /**
   * Alphabetical letter to number conversion
   *
   * @method alphaToNumber
   * @static
   */
  NOVAE.$.alphaToNumber = function(letter) {

    if (!isNaN(letter)) return void 0;

    var length = letter.length;

    for (var ii = 0, number = 0; ii < length; ++ii) {
      number *= 26;
      number += letter.charCodeAt(ii) - ("A".charCodeAt(0) - 1);
    }

    return (number || 1);

  };

  /**
   * Check if a cell is registered or not
   *
   * @method cellIsRegistered
   * @static
   */
  NOVAE.$.cellIsRegistered = function(object) {

    var letter = NOVAE.$.numberToAlpha(object.letter);
    var number = object.number;

    if (letter && number >= 1) {

      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter]) {
        if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number]) {
          return (true);
        }
      }

      return (false);

    }

    return void 0;

  };

  /**
   * Get a specific cell
   *
   * @method getCell
   * @static
   */
  NOVAE.$.getCell = function(object) {

    var letter = object.letter,
        number = object.number,
        jumps = ((NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y * (letter - 1) ) + number - 1 - NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY) - (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y * NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX);

    if (NOVAE.$.isInView(letter, jumps) && NOVAE.DOM.Output.children[jumps]) return (jumps);

    return void 0;

  };

  /**
   * Check if a cell is in its correct row
   *
   * @method isInView
   * @static
   */
  NOVAE.$.isInView = function(letter, jumps) {

    var row = letter;
        row = row <= 1 ? 1 : row;

    if (jumps < ( (letter * NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y) - NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y) - (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y * NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX) ) return (false);
    else if (jumps >= (letter * NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y) - (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y * NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX) ) return (false);
    return (true);

  };

  /**
   * Check if a cell is selected
   * If not, register it into the cell used stack
   *
   * @method validCell
   * @static
   */
  NOVAE.$.validCell = function() {

    /** Check if a cell is selected */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First.Letter && (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First.Number >= 0) ) {

      var letter = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First.Letter,
          number = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First.Number;

      /** Valid cell selection */
      if (letter && number > 0) {
        /** Cell is not used yet */
        NOVAE.$.registerCell({ letter: letter, number: number });
        /** Cell was successfully registered ? */
        if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][letter + number]) return (true);
      }

    }

    return (false);

  };

  /**
   * Check if multiple cells was selected and each is valid
   * If not, register each into the cell used stack
   *
   * @method validateCells
   * @static
   */
  NOVAE.$.validateCells = function() {

    var name = arguments[0] || NOVAE.CurrentSheet;

    var length = NOVAE.Sheets[name].Selector.SelectedCells.length;

    /** Loop through all selected cells */
    for (var ii = 0; ii < length; ++ii) {
      var letter = NOVAE.$.numberToAlpha(NOVAE.Sheets[name].Selector.SelectedCells[ii].letter);
      var number = NOVAE.Sheets[name].Selector.SelectedCells[ii].number;
      NOVAE.$.registerCell({ letter: letter, number: number, sheet: name });
    }

  };

  /**
   * Register a used cell
   *
   * @method registerCell
   * @static
   */
  NOVAE.$.registerCell = function(object) {

    var sheet = object.sheet || NOVAE.CurrentSheet;
    var letter = object.letter;
    var number = object.number;
    var name = letter + number;

    if (!NOVAE.Cells.Used[sheet][letter]) {
      NOVAE.Cells.Used[sheet][letter] = {};
    }

    if (!NOVAE.Cells.Used[sheet][letter][name]) {
      NOVAE.Cells.Used[sheet][letter][name] = new NOVAE.Grid.Cell(name);
      NOVAE.Cells.Used[sheet][letter][name].inheritStyling();
    }

  };

  /**
   * Clear the selection of all texts in the document
   *
   * @method looseSelection
   * @static
   */
  NOVAE.$.looseSelection = function() {

    if (window.getSelection) {
      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {  // IE?
      document.selection.empty();
    }

  };

  /**
   * Select a specific text in the document
   *
   * @method selectText
   * @static
   */
  NOVAE.$.selectText = function(element) {

    var character = element.textContent.length, 
        select;

    if (document.selection) {
      select = document.selection.createRange();
      select.moveStart('character', character);
      select.select();
    } else {
      select = window.getSelection();
      select.collapse(element.firstChild, character);
    }

  };

  /**
   * Check if string is a json
   *
   * @method isJSON
   * @static
   */
  NOVAE.$.isJSON = function(string) {

    try {
      JSON.parse(string);
    } catch (e) {
      return (false);
    }

    return (true);

  };

  /**
   * Is number a safe integer
   *
   * @method isSafeInteger
   * @static
   */
  NOVAE.$.isSafeInteger = function(number) {

    if (number >= 9E15) {
      if (number >= window.Number.MAX_SAFE_INTEGER) return (Number.MAX_SAFE_INTEGER - 1);
    }

    return (number);

  };

  /**
   * Scan a string for variables, return them as an array
   *
   * @method getVariables
   * @static
   */
  NOVAE.$.getVariables = function(string) {

    return (string.match(NOVAE.REGEX.variable));

  };

  /**
   * Convert hex to rgb
   *
   * Taken from: http://stackoverflow.com/a/12342275
   *
   * @method hexToRgba
   * @static
   */
  NOVAE.$.hexToRgba = function(hex) {

    var h = hex.replace('#', '');

    h = h.match(new RegExp('(.{'+h.length/3+'})', 'g'));

    for (var ii = 0; ii < h.length; ii++) {
      h[ii] = parseInt(h[ii].length==1? h[ii]+h[ii]:h[ii], 16);
    }

    if (typeof opacity != 'undefined')  h.push(opacity);

    return ('rgb('+h.join(',')+')');

  };

  /**
   * Replace a number of a string
   *
   * @method replaceNumbers
   * @static
   */
  NOVAE.$.replaceNumbers = function(text, replace) {

    var inputLength = text.length;

    var letters = {
      string: /[a-zA-Z_!@#$%^&*()+\-=\[\]{};':"\\|,.<>\s]+/g.exec(text)
    };
    letters.start = letters.string.index;

    var numbers = {
      string: /[0-9]+/g.exec(text)
    };
    numbers.start = numbers.string.index;
    numbers.end = inputLength - numbers.string[0].length;

    /** Calculate letter start and end, so we know where to inject the string */
    letters.end = inputLength - numbers.start;

    if (numbers.string[0].length > 1) {
      numbers.end += numbers.string[0].length;
    }

    /** String template */
    var string = letters.string[0];

    /** Create empty string */
    var result = new Array((inputLength) + 1).join(" ");

    result = result.substring(0, numbers.start) + replace + result.substring(numbers.end - 1);
    result = result.substring(0, letters.start) + string + result.substring(letters.end - 1);

    return (result);

  };

  /**
   * Create a new sheet
   *
   * @param {boolean} master Master Sheet
   *
   * @method createSheet
   * @static
   */
  NOVAE.$.createSheet = function(name, master) {

    /** Initialize cell used stack for the new sheet */
    if (!NOVAE.Cells.Used[name]) NOVAE.Cells.Used[name] = {};

    /** Create resize object if not existing yet */
    if (!NOVAE.Cells.Resized[name]) NOVAE.$.createResizedObject();

    /** Create all object if not existing yet */
    if (!NOVAE.Cells.All[name]) NOVAE.$.createAllObject();

    /** Create master object if not existing yet */
    if (!NOVAE.Cells.Master[name]) NOVAE.$.createMasterObject();

    /** Create new cell used stack */
    NOVAE.Sheets[name] = new NOVAE.Grid();

    /** Initialize Selector Plugin for the new sheet */
    NOVAE.Sheets[name].Selector = new NOVAE.Selector();

    /** Initialize Commander Plugin for the new sheet */
    NOVAE.Sheets[name].Commander = new NOVAE.Commander();

    if (master) {
      NOVAE.Sheets[name].Settings.master = true;
    }

    NOVAE.Collector.addSheet(name);

  };

  /**
   * Secure kill a sheet
   *
   * @method killSheet
   * @static
   */
  NOVAE.$.killSheet = function(name) {

    /** If sheet was a master sheet, decrease master sheet count */
    if (NOVAE.Sheets[name].Settings.master) {
      if (NOVAE.MasterSheetCount > 0) NOVAE.MasterSheetCount--;
    }

    for (var ii in NOVAE.Cells.Used[name]) {
      for (var cell in NOVAE.Cells.Used[name][ii]) {
        NOVAE.Cells.Used[name][ii][cell] = null;
        delete NOVAE.Cells.Used[name][ii][cell];
      }
      NOVAE.Cells.Used[name][ii] = null;
      delete NOVAE.Cells.Used[name][ii];
    }

    NOVAE.ClipBoard.copiedCells[name] = [];
    NOVAE.ClipBoard.copiedCells[name] = null;
    delete NOVAE.ClipBoard.copiedCells[name];

    NOVAE.Sheets[name].Selector.SelectedCells = [];
    NOVAE.Sheets[name].Selector.SelectedCells = null;
    delete NOVAE.Sheets[name].Selector.SelectedCells;

    NOVAE.Sheets[name].Selector = null;
    delete NOVAE.Sheets[name].Selector;

    NOVAE.Sheets[name].Commander = null;
    delete NOVAE.Sheets[name].Commander;

    NOVAE.Sheets[name] = null;
    delete NOVAE.Sheets[name];

    NOVAE.Collector.removeSheet(name);

    /** Send sheet change to server */
    if (NOVAE.Connector.connected) {
      NOVAE.Connector.action("deleteSheet", {sheet: name});
    }

  };

  /**
   * Convert coordinates into a selection array
   *
   * @method coordToSelection
   * @static
   */
  NOVAE.$.coordToSelection = function(first, last) {

    var array = [];

    for (var xx = first.letter; xx <= last.letter; ++xx) {
      for (var yy = first.number; yy <= last.number; ++yy) {
        array.push({
          letter: xx,
          number: yy
        });
      }
    }

    return (array);

  };

  /**
   * Get property from cell used stack of a selection array
   *
   * @method getSelectionCellProperty
   * @static
   */
  NOVAE.$.getSelectionCellProperty = function(array, property) {

    var sheet = arguments[2] || NOVAE.CurrentSheet;

    var resultArray = [];

    var length = array.length;

    for (var ii = 0; ii < length; ++ii) {
      var letter = NOVAE.$.numberToAlpha(array[ii].letter);
      var number = array[ii].number;
      var value = null;
      if (NOVAE.Cells.Used[sheet][letter]) {
        if (NOVAE.Cells.Used[sheet][letter][letter + number]) {
          if (value = NOVAE.Cells.Used[sheet][letter][letter + number][property]) {
            resultArray.push({
              name: letter + number,
              value: value
            });
          }
        }
      }
    }

    return (resultArray);

  };

  /**
   * Get range of a selection array
   *
   * @method selectionToRange
   * @static
   */
  NOVAE.$.selectionToRange = function(array) {

    var range = "";

    if (array.length === 1) {
      var letter = NOVAE.$.numberToAlpha(array[0].letter);
      var number = array[0].number;
      range = letter + number + ":" + letter + number;
      return (range);
    }

    var letter = NOVAE.$.numberToAlpha(array[0].letter);
    var number = array[0].number;

    range = letter + number + ":";

    letter = NOVAE.$.numberToAlpha(array[array.length - 1].letter);

    number = array[array.length - 1].number;

    range += letter + number;

    return (range);

  };

  /**
   * Get selection array of a range
   *
   * @method rangeToSelection
   * @static
   */
  NOVAE.$.rangeToSelection = function(range) {

    if (!range.match(":")) return void 0;

    range = range.split(":");

    if (!range || !range[0] || !range[1]) return void 0;

    var first = range[0];
    var last = range[1];

    first = {
      letter: NOVAE.$.alphaToNumber(first.match(NOVAE.REGEX.numbers).join("")),
      number: parseInt(first.match(NOVAE.REGEX.letters).join(""))
    };

    last = {
      letter: NOVAE.$.alphaToNumber(last.match(NOVAE.REGEX.numbers).join("")),
      number: parseInt(last.match(NOVAE.REGEX.letters).join(""))
    };

    var selection = NOVAE.$.coordToSelection(first, last);

    return (selection || void 0);

  };

  /**
   * Get values of a coordinate array
   *
   * @method getValueFromCoordinates
   * @static
   */
  NOVAE.$.getValueFromCoordinates = function(array) {

    var result = 0;

    var length = array.length;

    for (var ii = 0; ii < length; ++ii) {

      var object = array[ii];

      if (object.letter && object.number) {

        var letter = NOVAE.$.numberToAlpha(object.letter);
        var cell = letter + object.number;

        if (NOVAE.Cells.Used[NOVAE.CurrentSheet]) {
          if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter]) {
            if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cell]) {
              result += parseInt(NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cell].Content) || 0;
            }
          }
        }

      }

    }

    return (result || 0);

  };

  /**
   * Create resized object for a sheet
   *
   * @method createResizedObject
   * @static
   */
  NOVAE.$.createResizedObject = function() {

    var name = arguments[0] || NOVAE.CurrentSheet;

    if (!NOVAE.Cells.Resized[name]) {
      /** Create resized object */
      NOVAE.Cells.Resized[name] = {
        /** Save resized columns */
        Columns: {},
        /** Save resized rows */
        Rows: {},
        /** Fast access arrays */
        columnArray: [],
        rowArray: []
      };
    }

  };

  /**
   * Create all object for a sheet
   *
   * @method createAllObject
   * @static
   */
  NOVAE.$.createAllObject = function() {

    var name = arguments[0] || NOVAE.CurrentSheet;

    if (!NOVAE.Cells.All[name]) {
      /** Create resized object */
      NOVAE.Cells.All[name] = {
        /** Cell */
        Cell: new NOVAE.Grid.Cell(),
        Resize: {
          Column: null,
          Row: null
        }
      };
    }

  };

  /**
   * Create master object for a sheet
   *
   * @method createMasterObject
   * @static
   */
  NOVAE.$.createMasterObject = function() {

    var name = arguments[0] || NOVAE.CurrentSheet;

    if (!NOVAE.Cells.Master[name]) {
      /** Create resized object */
      NOVAE.Cells.Master[name] = {
        /** Current selected master cell */
        Current: null,
        Columns: {},
        Rows: {}
      };
    }

  };

  /**
   * Submit a modal
   *
   * @method submitModal
   * @static
   */
  NOVAE.$.submitModal = function(option) {

    var element = document.querySelector("#modal_helper");

    if (element.children) element = element.children[0];
    else element = void 0;

    /** Simulate mouse click */
    if (element) {
      for (var ii = 0; ii < element.children.length; ++ii) {
        if (element.children[ii].nodeName === "DIV") {
          element = element.children[ii];
          break;
        }
      }
      for (var ii = 0; ii < element.children.length; ++ii) {
        if (element.children[ii].nodeName === "BUTTON") {
          if (element.children[ii].getAttribute("name")) {
            /** Take button */
            if (element.children[ii].getAttribute("name") === option) {
              element.children[ii].click();
              NOVAE.Sheets[NOVAE.CurrentSheet].activeModal = false;
              /** Break loop */
              return void 0;
            }
          }
        }
      }
    }

  };

  /**
   * Get index of a child node
   *
   * @method getChildIndex
   * @static
   */
  NOVAE.$.getChildIndex = function(e) {

    var ii = 0;

    while (e = e.previousElementSibling) {
      ii++;
    }

    return (ii);

  };

  /**
   * Get a DOM cell name from a output child's index
   *
   * @method getNameFromDOMCell
   * @static
   */
  NOVAE.$.getNameFromDOMCell = function(e, cellName) {

    var index = null;

    if (e instanceof HTMLElement) {
      index = NOVAE.$.getChildIndex(e);
      index = NOVAE.Sheets[NOVAE.CurrentSheet].cellArray[index];
    } else if (typeof e === "number") {
      index = NOVAE.Sheets[NOVAE.CurrentSheet].cellArray[e];
    }

    var letter = 0;
    var number = 0;

    var left = index.origLeft;
    var top = index.origTop;

    var width = NOVAE.Sheets[NOVAE.CurrentSheet].CellTemplate.Width;
    var height = NOVAE.Sheets[NOVAE.CurrentSheet].CellTemplate.Height;

    switch (true) {
      case (top === 0):
        number = 1;
        break;
      case (top === height):
        number = 2;
        break;
      case (top > height):
        number = top / height + 1;
        break;
    }

    number = Math.floor(number + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY);

    switch (true) {
      case (left === 0):
        letter = 1;
        break;
      case (left === width):
        letter = 2;
        break;
      case (left > width):
        letter = left / width + 1;
        break;
    }

    letter = Math.floor(letter + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX);

    /** Return compiled cell name */
    if (cellName) {
      return (NOVAE.$.numberToAlpha(letter) + number);
    }

    return ({
      letter: letter,
      number: number
    });

  };

  /**
   * Calculate cross browser scrolling
   *
   * @method calculateScroll
   * @static
   */
  NOVAE.$.calculateScroll = function(e) {

    var direction = 0;
    var amount = 0;

    /** IE and Chrome */
    if (e.wheelDelta) {
      if (e.wheelDelta * ( -120 ) > 0) direction = 1;
        amount = Math.floor(e.wheelDelta / 10);
        amount = amount <= 0 ? amount * (-1) : amount;
    /** Chrome, Firefox */
    } else {
      /** Chrome */
      if (e.deltaY > 0) {
        direction = 1;
        amount = Math.floor(e.deltaY);
        amount = amount <= 0 ? amount * (-1) : amount;
      /** Firefox */
      } else if (e.detail * ( -120 ) > 0) {
        direction = 0;
        amount = Math.floor(e.detail * 10);
        amount = amount <= 0 ? amount * (-1) : amount;
      /** Firefox */
      } else if (e.detail * ( -120 ) < 0) {
        direction = 1;
        amount = Math.floor(e.detail * 10);
        amount = amount <= 0 ? amount * (-1) : amount;
      } else direction = 0;
    }

    return ({
      direction: direction,
      amount: amount
    });

  };