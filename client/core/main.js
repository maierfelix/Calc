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
  var NOVAE = NOVAE || {};

  /** NovaeCalc Version */
  NOVAE.VERSION = "0.4";

  /** Create DOM Object */
  NOVAE.DOM = {};

  /** Create Settings Object */
  NOVAE.Settings = {
    Width: window.innerWidth,
    Height: window.innerHeight
  };

  /** Cell thingys */
  NOVAE.Cells = {
    /** Customized cells */
    Used: {},
    /** Resized columns and rows */
    Resized: {},
    /** All cell */
    All: {},
    /** Live cells */
    Live: {},
    /** Master cells */
    Master: {}
  };

  /** System speed grade */
  NOVAE.SystemSpeed = 1;

  /** Language */
  NOVAE.Language = "en";

  /** Currently open sheet */
  NOVAE.CurrentSheet = "Sheet1";

  /** Amount of created slave sheets */
  NOVAE.SheetCount = 0;

  /** Amount of created master sheets, shall not be over 1 */
  NOVAE.MasterSheetCount = 0;

  /** Mobile detection */
  NOVAE.Settings.Mobile = false;

  /** WebApp detection */
  NOVAE.Settings.isWebApp = false;

  /** iOS detection */
  NOVAE.Settings.isIOS = false;

  /** Android detection */
  NOVAE.Settings.isAndroid = false;

  /** Firefox Browser detection */
  NOVAE.Settings.isFirefox = false;

  /** Chrome Browser detection */
  NOVAE.Settings.isChrome = false;

  /** Safari Browser detection */
  NOVAE.Settings.isSafari = false;

  /** IE Browser detection */
  NOVAE.Settings.isIE = false;

  /** Device landscape detection */
  NOVAE.Settings.isLandscape = false;

  /** Cells to scroll per scroll */
  NOVAE.Settings.Scroll = {
    Vertical: 1,
    OriginalVertical: 1,
    Horizontal: 1,
    OriginalHorizontal: 1
  };

  /** Grid Sizes */
  NOVAE.Settings.GridSizes = {
    Columns: 85,
    Rows: 22
  };

  /** Event helper for mobile and desktop events */
  NOVAE.Events = {};

  /** Precompile regex operations */
  NOVAE.REGEX = {
    numbers:  /[^0-9]/g,
    letters:  /[^a-zA-Z]/g,
    variable: /[a-zA-Z_][a-zA-Z0-9_]+/g,
    strings:  /[a-zA-Z_!@#$%^&*()+\-=\[\]{};':"\\|,.<>\s]+/g
  };

  /** Assign it global */
  root.NOVAE = NOVAE;