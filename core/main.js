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

  var root = this;

  /** Static Namespace Class */
  var CORE = CORE || {};

  /** NovaeCalc Version */
  CORE.Version = "0.2";

  /** Create DOM Object */
  CORE.DOM = {};

  /** Create Settings Object */
  CORE.Settings = {
    Width: window.innerWidth,
    Height: window.innerHeight
  };

  /** Cell thingys */
  CORE.Cells = {
    /** Cell Selection Helper */
    Selected: {
      /** First selected cell */
      First: null,
      /** Last selected cell */
      Last:  null
    },
    /** Cell currently edited */
    Edit: null,
    /** Cells with custom content */
    Used: {}
  };

  /** Mobile detection */
  CORE.Settings.Mobile = false;

  /** iOS detection */
  CORE.Settings.isIOS = false;

  /** Android detection */
  CORE.Settings.isAndroid = false;

  /** Cells to scroll per scroll */
  CORE.Settings.Scroll = {
    Vertical: 1,
    Horizontal: 1
  };

  /** Precompile regex operations */
  CORE.REGEX = {
    numbers: /[^0-9]/g,
    letters: /[^a-zA-Z]/gi
  };

  /** Input thingys */
  CORE.Input = {
    Mouse: {
      /** Mouse pressed or not? Also prevent multiple execution of mousedown event */
      Pressed: false,
      /** Prevent multiple execution of mousemove event */
      lastMousePosition: {
        x: 0,
        y: 0
      },
      /** User resizes a cell */
      CellResize: false,
      /** User edits a cell */
      Edit: false
    },
    Keyboard: {
      /** Shift key pressed */
      Shift: false
    }
  };

  /** Alphabet Template */
  CORE.Alphabet = [];

  /** Assign it global */
  root.CORE = CORE;

}).call(this);