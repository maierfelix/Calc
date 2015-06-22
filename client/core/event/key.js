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

  /**
   * Listen for key presses
   *
   * @method keyPress
   * @static
   */
  CORE.Event.keyPress = function(e) {

    /** Update empty timestamp */
    if (!CORE.Sheets[CORE.CurrentSheet].Input.lastKeyPress) CORE.Sheets[CORE.CurrentSheet].Input.lastKeyPress = e.timeStamp;

    /** Handle timestamps */
    if (CORE.Sheets[CORE.CurrentSheet].Input.lastKeyPress > 0) {

       /** Calculate difference between this and last timestamp */
      var difference = e.timeStamp - CORE.Sheets[CORE.CurrentSheet].Input.lastKeyPress;

      /** Prevent too fast key scrolling */
      if (difference && difference <= 100) return void 0;

    }

    /** User pressed the [DEL] */
    if (e.keyCode === 46) {
      e.preventDefault();
      /** Delete all cells in the clipboard */
      CORE.Sheets[CORE.CurrentSheet].Selector.deleteCellSelection();
      return void 0;
    }

    /** REDO: [STRG] + [Y] */
    if (e.keyCode === 89) {
      /** [STRG] key pressed ? User is not in edit mode ? */
      if (CORE.Sheets[CORE.CurrentSheet].Input.Keyboard.Strg && !CORE.Event.inEditMode()) {
        e.preventDefault();
        /** Execute undo */
        CORE.Sheets[CORE.CurrentSheet].Commander.redo();
        return void 0;
      }
    }

    /** UNDO: [STRG] + [Z] */
    if (e.keyCode === 90) {
      /** [STRG] key pressed ? User is not in edit mode ? */
      if (CORE.Sheets[CORE.CurrentSheet].Input.Keyboard.Strg && !CORE.Event.inEditMode()) {
        e.preventDefault();
        /** Execute undo */
        CORE.Sheets[CORE.CurrentSheet].Commander.undo();
        return void 0;
      }
    }

    /** COPY: [STRG] + [C] */
    if (e.keyCode === 67) {
      /** [STRG] key pressed ? User is not in edit mode ? */
      if (CORE.Sheets[CORE.CurrentSheet].Input.Keyboard.Strg && !CORE.Event.inEditMode()) {
        e.preventDefault();
        /** Make copy real */
        CORE.ClipBoard.copyCellsToClipBoard();
        return void 0;
      }
    }

    /** PASTE: [STRG] + [V] */
    if (e.keyCode === 86) {
      /** [STRG] key pressed ? User is not in edit mode ? */
      if (CORE.Sheets[CORE.CurrentSheet].Input.Keyboard.Strg && !CORE.Event.inEditMode()) {
        e.preventDefault();
        /** Make paste real */
        CORE.ClipBoard.pasteCellsIntoSheet(CORE.Sheets[CORE.CurrentSheet].Selector.Selected.First);
        return void 0;
      }
    }

    /** COUT OUT: [STRG] + [X] */
    if (e.keyCode === 88) {
      /** [STRG] key pressed ? User is not in edit mode ? */
      if (CORE.Sheets[CORE.CurrentSheet].Input.Keyboard.Strg && !CORE.Event.inEditMode()) {
        e.preventDefault();
        /** Copy selection */
        CORE.ClipBoard.copyCellsToClipBoard();
        /** Delete selection */
        CORE.Sheets[CORE.CurrentSheet].Selector.deleteCellSelection();
        return void 0;
      }
    }

    /** SELECT ALL: [STRG] + [A] */
    if (e.keyCode === 65) {
      /** [STRG] key pressed ? User is not in edit mode ? */
      if (CORE.Sheets[CORE.CurrentSheet].Input.Keyboard.Strg && !CORE.Event.inEditMode()) {
        e.preventDefault();
        /** Set selection to all */
        CORE.Sheets[CORE.CurrentSheet].Selector.allSelected = true;
        CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();
        return void 0;
      }
    }

    /** User edits a live cells url */
    if (CORE.Sheets[CORE.CurrentSheet].Input.Mouse.LiveCellEdit) return void 0;

    /** User opened console, don't touch anything here */
    if (e.keyCode === 123) return void 0;

    /** Prevent line breaks on user input */
    if (e.keyCode === 13) {
      e.preventDefault();
      /** Disable master selection */
      CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Current = null;
      CORE.Event.pressedEnter(e.keyCode);
    }

    /** User pressed the [SHIFT] key */
    if (e.keyCode === 16) {
      e.preventDefault();
      CORE.Sheets[CORE.CurrentSheet].Input.Keyboard.Shift = true;
      return void 0;
    }

    /** User pressed the [STRG] key */
    if (e.keyCode === 17) {
      e.preventDefault();
      CORE.Sheets[CORE.CurrentSheet].Input.Keyboard.Strg = true;
      return void 0;
    }

    /** User pressed the [Tab] key */
    if (e.keyCode === 9) {
      e.preventDefault();
      CORE.Sheets[CORE.CurrentSheet].Input.Keyboard.Tab = true;
      /** Disable master selection */
      CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Current = null;
      CORE.Event.navigateTo("right", 1);
      return void 0;
    }

    /** User pressed the [PAGE_UP] key */
    if (e.keyCode === 33) {
      e.preventDefault();
      /** Disable master selection */
      CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Current = null;
      CORE.Sheets[CORE.CurrentSheet].Selector.jump("up", CORE.Sheets[CORE.CurrentSheet].Settings.y);
      return void 0;
    }

    /** User pressed the [PAGE_DOWN] key */
    if (e.keyCode === 34) {
      e.preventDefault();
      /** Disable master selection */
      CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Current = null;
      CORE.Sheets[CORE.CurrentSheet].Selector.jump("down", CORE.Sheets[CORE.CurrentSheet].Settings.y);
      return void 0;
    }

    /** If user pressed arrow key, abort a all cell selection */
    if (CORE.Event.pressedArrowKey(e.keyCode)) {
      if (CORE.Sheets[CORE.CurrentSheet].Selector.allSelected) {
        CORE.Sheets[CORE.CurrentSheet].Selector.deleteCellHoverEffect();
        CORE.Sheets[CORE.CurrentSheet].Selector.allSelected = false;
        CORE.Sheets[CORE.CurrentSheet].Selector.getSelection();
      }
    }

    /** Handle arrow keys */
    switch (e.keyCode) {
      /** [UP] */
      case 38:
        /** Dont allow scrolling if user edits a cell */
        if (CORE.Event.inEditMode()) return void 0;
        CORE.Sheets[CORE.CurrentSheet].Settings.keyScrolledY -= 1;
        CORE.Sheets[CORE.CurrentSheet].Settings.lastScrollY = 1;
        /** Disable master selection */
        CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Current = null;
        CORE.Sheets[CORE.CurrentSheet].Selector.selectCellByKeyPress();
        /** Update last key press timestamp */
        CORE.Sheets[CORE.CurrentSheet].Input.lastKeyPress = e.timeStamp - 100;
        return void 0;
      /** [DOWN] */
      case 40:
        /** Dont allow scrolling if user edits a cell */
        if (CORE.Event.inEditMode()) return void 0;
        CORE.Sheets[CORE.CurrentSheet].Settings.keyScrolledY += 1;
        CORE.Sheets[CORE.CurrentSheet].Settings.lastScrollY = 1;
        /** Disable master selection */
        CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Current = null;
        CORE.Sheets[CORE.CurrentSheet].Selector.selectCellByKeyPress();
        /** Update last key press timestamp */
        CORE.Sheets[CORE.CurrentSheet].Input.lastKeyPress = e.timeStamp - 100;
        return void 0;
      /** [LEFT] */
      case 37:
        /** Dont allow scrolling if user edits a cell */
        if (CORE.Event.inEditMode()) return void 0;
        CORE.Sheets[CORE.CurrentSheet].Settings.keyScrolledX -= CORE.Settings.Scroll.Horizontal;
        CORE.Sheets[CORE.CurrentSheet].Settings.lastScrollX = CORE.Settings.Scroll.Horizontal;
        /** Disable master selection */
        CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Current = null;
        CORE.Sheets[CORE.CurrentSheet].Selector.selectCellByKeyPress();
        /** Update last key press timestamp */
        CORE.Sheets[CORE.CurrentSheet].Input.lastKeyPress = e.timeStamp - 100;
        CORE.Sheets[CORE.CurrentSheet].Input.lastAction.scrollY = false;
        return void 0;
      /** [RIGHT] */
      case 39:
        /** Dont allow scrolling if user edits a cell */
        if (CORE.Event.inEditMode()) return void 0;
        CORE.Sheets[CORE.CurrentSheet].Settings.keyScrolledX += CORE.Settings.Scroll.Horizontal;
        CORE.Sheets[CORE.CurrentSheet].Settings.lastScrollX = CORE.Settings.Scroll.Horizontal;
        /** Disable master selection */
        CORE.Sheets[CORE.CurrentSheet].Selector.masterSelected.Current = null;
        CORE.Sheets[CORE.CurrentSheet].Selector.selectCellByKeyPress();
        /** Update last key press timestamp */
        CORE.Sheets[CORE.CurrentSheet].Input.lastKeyPress = e.timeStamp - 100;
        CORE.Sheets[CORE.CurrentSheet].Input.lastAction.scrollY = false;
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
      CORE.Sheets[CORE.CurrentSheet].Input.Keyboard.Shift = false;
    }

    /** User left the [STRG] key */
    if (e.keyCode === 17) {
      e.preventDefault();
      CORE.Sheets[CORE.CurrentSheet].Input.Keyboard.Strg = false;
    }

    /** User left the [TAB] key */
    if (e.keyCode === 9) {
      e.preventDefault();
      CORE.Sheets[CORE.CurrentSheet].Input.Keyboard.Tab = false;
    }

  };