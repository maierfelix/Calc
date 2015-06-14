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

  var root = this;

  /** Static Namespace Class */
  var CORE = CORE || {};

  /** NovaeCalc Version */
  CORE.VERSION = "0.3";

  /** Create DOM Object */
  CORE.DOM = {};

  /** Create Settings Object */
  CORE.Settings = {
    Width: window.innerWidth,
    Height: window.innerHeight
  };

  /** Cell thingys */
  CORE.Cells = {
    /** Customized cells -> Sheet -> Dictionary[a-Z] -> [a-Z][a-Z+0-9] */
    Used: {},
    /** Live cells */
    Live: {}
  };

  /** Currently open sheet */
  CORE.CurrentSheet = "Sheet1";

  /** Amount of created sheets */
  CORE.SheetCount = 0;

  /** Mobile detection */
  CORE.Settings.Mobile = false;

  /** iOS detection */
  CORE.Settings.isIOS = false;

  /** Android detection */
  CORE.Settings.isAndroid = false;

  /** Cells to scroll per scroll */
  CORE.Settings.Scroll = {
    Vertical: 1,
    OriginalVertical: 1,
    Horizontal: 1,
    OriginalHorizontal: 1
  };

  /** Precompile regex operations */
  CORE.REGEX = {
    numbers: /[^0-9]/g,
    letters: /[^a-zA-Z]/gi,
    variable: /[a-zA-Z_][a-zA-Z0-9_]+/gi
  };

  /** Assign it global */
  root.CORE = CORE;