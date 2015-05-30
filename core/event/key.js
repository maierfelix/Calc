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

"use strict";

  /**
   * Listen for key presses
   *
   * @method keyPress
   * @static
   */
  CORE.Event.keyPress = function(e) {

    /** Update empty timestamp */
    if (!this.lastKeyPress) this.lastKeyPress = e.timeStamp;

    /** Handle timestamps */
    if (this.lastKeyPress > 0) {

       /** Calculate difference between this and last timestamp */
      var difference = e.timeStamp - this.lastKeyPress;

      /** Prevent too fast key scrolling */
      if (difference && difference <= 100) return void 0;

    }

    /** User edits a live cells url */
    if (CORE.Input.Mouse.LiveCellEdit) return void 0;

    /** Handle arrow keys */
    switch (e.keyCode) {
      /** [UP] */
      case 38:
        /** Dont allow scrolling if user edits a cell */
        if (CORE.Event.inEditMode()) return void 0;
        CORE.Grid.Settings.keyScrolledY -= 1;
        CORE.Grid.Settings.lastScrollY = 1;
        CORE.Selector.selectCellByKeyPress();
        /** Update last key press timestamp */
        this.lastKeyPress = e.timeStamp - 100;
        return void 0;
      /** [DOWN] */
      case 40:
        /** Dont allow scrolling if user edits a cell */
        if (CORE.Event.inEditMode()) return void 0;
        CORE.Grid.Settings.keyScrolledY += 1;
        CORE.Grid.Settings.lastScrollY = 1;
        CORE.Selector.selectCellByKeyPress();
        /** Update last key press timestamp */
        this.lastKeyPress = e.timeStamp - 100;
        return void 0;
      /** [LEFT] */
      case 37:
        /** Dont allow scrolling if user edits a cell */
        if (CORE.Event.inEditMode()) return void 0;
        CORE.Grid.Settings.keyScrolledX -= CORE.Settings.Scroll.Horizontal;
        CORE.Grid.Settings.lastScrollX = CORE.Settings.Scroll.Horizontal;
        CORE.Selector.selectCellByKeyPress();
        /** Update last key press timestamp */
        this.lastKeyPress = e.timeStamp - 100;
        return void 0;
      /** [RIGHT] */
      case 39:
        /** Dont allow scrolling if user edits a cell */
        if (CORE.Event.inEditMode()) return void 0;
        CORE.Grid.Settings.keyScrolledX += CORE.Settings.Scroll.Horizontal;
        CORE.Grid.Settings.lastScrollX = CORE.Settings.Scroll.Horizontal;
        CORE.Selector.selectCellByKeyPress();
        /** Update last key press timestamp */
        this.lastKeyPress = e.timeStamp - 100;
        return void 0;
    }

    /** Prevent line breaks on user input */
    if (e.keyCode === 13) {
      e.preventDefault();
      CORE.Event.pressedEnter(e.keyCode);
    }

    /** User pressed the [SHIFT] key */
    if (e.keyCode === 16) {
      e.preventDefault();
      CORE.Input.Keyboard.Shift = true;
      return void 0;
    }

    /** User pressed the [STRG] key */
    if (e.keyCode === 17) {
      e.preventDefault();
      CORE.Input.Keyboard.Strg = true;
      return void 0;
    }

    /** Check if user edits a cell */
    CORE.Event.sniffCellInput(e.keyCode);

  };

  /**
   * Listen for key leave
   *
   * @method keyUp
   * @static
   */
  CORE.Event.keyUp = function(e) {

    /** User left the [SHIFT] key */
    if (e.keyCode === 16) {
      e.preventDefault();
      CORE.Input.Keyboard.Shift = false;
    }

    /** User left the [STRG] key */
    if (e.keyCode === 17) {
      e.preventDefault();
      CORE.Input.Keyboard.Strg = false;
    }

  };