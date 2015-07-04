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

  /** Create Event Object */
  NOVAE.Event = {};

  /**
   * Initialize event listeners
   *
   * @method init
   * @static
   */
  NOVAE.Event.init = function() {

    /** Mobile platform */
    if (NOVAE.Settings.Mobile) {

      window.addEventListener("resize", NOVAE.Event.resize, false);

      window.addEventListener("touchstart", NOVAE.Event.mouseDown, false);

      window.addEventListener("touchend", NOVAE.Event.mouseUp, false);
      window.addEventListener("touchcancel", NOVAE.Event.mouseUp, false);

      window.addEventListener("touchmove", NOVAE.Event.scroll, false);

      window.addEventListener("keydown", NOVAE.Event.keyPress, false);

    /** Desktop */
    } else {

      window.addEventListener("resize", NOVAE.Event.resize, false);

      window.addEventListener("mousedown", NOVAE.Event.mouseDown, false);

      window.addEventListener("mouseup", NOVAE.Event.mouseUp, false);

      window.addEventListener("mousemove", NOVAE.Event.mouseWipe, false);

      window.addEventListener("mousewheel", NOVAE.Event.scroll, false);
      window.addEventListener("DOMMouseScroll", NOVAE.Event.scroll, false);

      window.addEventListener("keydown", NOVAE.Event.keyPress, false);

      window.addEventListener("keyup", NOVAE.Event.keyUp, false);

    }

  };

  /**
   * Listen for window resizing
   *
   * @method resize
   * @static
   */
  NOVAE.Event.resize = function () {

    NOVAE.Settings.Width = window.innerWidth;

    NOVAE.Settings.Height = window.innerHeight;

    NOVAE.Settings.Scroll.OriginalVertical = NOVAE.Settings.Scroll.Vertical = NOVAE.$.calculateScrollAmount();

    NOVAE.Sheets[NOVAE.CurrentSheet].Input.lastAction.scrollY = false;

    /** Create resize object if not existing yet */
    if (!NOVAE.Cells.Resized[NOVAE.CurrentSheet]) NOVAE.$.createResizedObject();

    /** Create all object if not existing yet */
    if (!NOVAE.Cells.All[NOVAE.CurrentSheet]) NOVAE.$.createAllObject();

    NOVAE.Sheets[NOVAE.CurrentSheet].calculateGrid();

    NOVAE.Sheets[NOVAE.CurrentSheet].generateCells();

    NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("default");

    NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();

    NOVAE.Awakener.reset();

    NOVAE.Awakener.evalLive();

    NOVAE.eval();

    NOVAE.Sheets[NOVAE.CurrentSheet].Input.Keyboard.Strg = false;

  };

  /**
   * Only redraw the grid
   *
   * @method redraw
   * @static
   */
  NOVAE.Event.redraw = function() {

    var sheet = arguments[0] || NOVAE.CurrentSheet;

    NOVAE.Sheets[sheet].Settings.redrawOnZero = false;

    NOVAE.Sheets[sheet].Input.lastAction.scrollY = false;

    NOVAE.Sheets[sheet].calculateGrid();

    NOVAE.Sheets[sheet].generateCells();

    NOVAE.Sheets[sheet].updateWidth("default");

    NOVAE.Sheets[sheet].Selector.getSelection();

  };