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
    /** Customized cells -> Sheet -> Dictionary[a-Z] -> ColumnRow[a-Z] -> Cell[a-Z+0-9] */
    Used: {},
    /** Live cells */
    Live: {}
  };

  /** System speed grade */
  CORE.SystemSpeed = 1;

  /** Language */
  CORE.Language = "en";

  /** Currently open sheet */
  CORE.CurrentSheet = "Sheet1";

  /** Amount of created slave sheets */
  CORE.SheetCount = 0;

  /** Amount of created master sheets, shall not be over 1 */
  CORE.MasterSheetCount = 0;

  /** Mobile detection */
  CORE.Settings.Mobile = false;

  /** iOS detection */
  CORE.Settings.isIOS = false;

  /** Android detection */
  CORE.Settings.isAndroid = false;

  /** Firefox Browser detection */
  CORE.Settings.isFirefox = false;

  /** Chrome Browser detection */
  CORE.Settings.isChrome = false;

  /** Safari Browser detection */
  CORE.Settings.isSafari = false;

  /** IE Browser detection */
  CORE.Settings.isIE = false;

  /** Cells to scroll per scroll */
  CORE.Settings.Scroll = {
    Vertical: 1,
    OriginalVertical: 1,
    Horizontal: 1,
    OriginalHorizontal: 1
  };

  /** Precompile regex operations */
  CORE.REGEX = {
    numbers:  /[^0-9]/g,
    letters:  /[^a-zA-Z]/g,
    variable: /[a-zA-Z_][a-zA-Z0-9_]+/g,
    strings:  /[a-zA-Z_!@#$%^&*()+\-=\[\]{};':"\\|,.<>\s]+/g
  };

  /** Assign it global */
  root.CORE = CORE;