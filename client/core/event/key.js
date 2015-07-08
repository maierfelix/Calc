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
  NOVAE.Event.keyPress = function(e) {

    /** Update empty timestamp */
    if (!NOVAE.Sheets[NOVAE.CurrentSheet].Input.lastKeyPress) NOVAE.Sheets[NOVAE.CurrentSheet].Input.lastKeyPress = e.timeStamp;

    /** Handle timestamps */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.lastKeyPress > 0) {

       /** Calculate difference between this and last timestamp */
      var difference = e.timeStamp - NOVAE.Sheets[NOVAE.CurrentSheet].Input.lastKeyPress;

      /** Slow down key spamming */
      if (difference && difference <= 100) return void 0;

    }

    /** Abort if active modal */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].activeModal) {
      /** [ENTER] key pressed */
      if (e.keyCode === 13) NOVAE.$.submitModal("ok");
      /** [ESC] key pressed */
      else if (e.keyCode === 27) NOVAE.$.submitModal("abort");
      return void 0;
    }

    /** User pressed the [DEL] */
    if (e.keyCode === 46) {
      e.preventDefault();
      /** Delete all cells in the clipboard */
      NOVAE.Sheets[NOVAE.CurrentSheet].Selector.deleteCellSelection();
      return void 0;
    }

    /** REDO: [STRG] + [Y] */
    if (e.keyCode === 89) {
      /** [STRG] key pressed ? User is not in edit mode ? */
      if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Keyboard.Strg && !NOVAE.Event.inEditMode()) {
        e.preventDefault();
        /** Execute undo */
        NOVAE.Sheets[NOVAE.CurrentSheet].Commander.redo();
        return void 0;
      }
    }

    /** UNDO: [STRG] + [Z] */
    if (e.keyCode === 90) {
      /** [STRG] key pressed ? User is not in edit mode ? */
      if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Keyboard.Strg && !NOVAE.Event.inEditMode()) {
        e.preventDefault();
        /** Execute undo */
        NOVAE.Sheets[NOVAE.CurrentSheet].Commander.undo();
        return void 0;
      }
    }

    /** COPY: [STRG] + [C] */
    if (e.keyCode === 67) {
      /** [STRG] key pressed ? User is not in edit mode ? */
      if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Keyboard.Strg && !NOVAE.Event.inEditMode()) {
        e.preventDefault();
        /** Make copy real */
        NOVAE.ClipBoard.copyCellsToClipBoard();
        return void 0;
      }
    }

    /** PASTE: [STRG] + [V] */
    if (e.keyCode === 86) {
      /** [STRG] key pressed ? User is not in edit mode ? */
      if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Keyboard.Strg && !NOVAE.Event.inEditMode()) {
        e.preventDefault();
        /** Make paste real */
        NOVAE.ClipBoard.pasteCellsIntoSheet(NOVAE.Sheets[NOVAE.CurrentSheet].Selector.Selected.First);
        return void 0;
      }
    }

    /** COUT OUT: [STRG] + [X] */
    if (e.keyCode === 88) {
      /** [STRG] key pressed ? User is not in edit mode ? */
      if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Keyboard.Strg && !NOVAE.Event.inEditMode()) {
        e.preventDefault();
        /** Copy selection */
        NOVAE.ClipBoard.copyCellsToClipBoard();
        /** Delete selection */
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.deleteCellSelection();
        return void 0;
      }
    }

    /** SELECT ALL: [STRG] + [A] */
    if (e.keyCode === 65) {
      /** [STRG] key pressed ? User is not in edit mode ? */
      if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Keyboard.Strg && !NOVAE.Event.inEditMode()) {
        e.preventDefault();
        /** Set selection to all */
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.allSelected = true;
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();
        return void 0;
      }
    }

    /** User edits a script */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.ScriptEdit) return void 0;

    /** User opened console, don't touch anything here */
    if (e.keyCode === 123) return void 0;

    /** Prevent line breaks on user input */
    if (e.keyCode === 13) {
      e.preventDefault();
      /** Disable master selection */
      NOVAE.Cells.Master[NOVAE.CurrentSheet].Current = null;
      NOVAE.Event.pressedEnter(e.keyCode);
    }

    /** User pressed the [SHIFT] key */
    if (e.keyCode === 16) {
      e.preventDefault();
      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Keyboard.Shift = true;
      return void 0;
    }

    /** User pressed the [STRG] key */
    if (e.keyCode === 17) {
      e.preventDefault();
      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Keyboard.Strg = true;
      return void 0;
    }

    /** User pressed the [Tab] key */
    if (e.keyCode === 9) {
      e.preventDefault();
      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Keyboard.Tab = true;
      /** Disable master selection */
      NOVAE.Cells.Master[NOVAE.CurrentSheet].Current = null;
      NOVAE.Event.navigateTo("right", 1);
      return void 0;
    }

    /** User pressed the [PAGE_UP] key */
    if (e.keyCode === 33) {
      e.preventDefault();
      /** Disable master selection */
      NOVAE.Cells.Master[NOVAE.CurrentSheet].Current = null;
      NOVAE.Sheets[NOVAE.CurrentSheet].Selector.jump("up", NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y);
      return void 0;
    }

    /** User pressed the [PAGE_DOWN] key */
    if (e.keyCode === 34) {
      e.preventDefault();
      /** Disable master selection */
      NOVAE.Cells.Master[NOVAE.CurrentSheet].Current = null;
      NOVAE.Sheets[NOVAE.CurrentSheet].Selector.jump("down", NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y);
      return void 0;
    }

    /** If user pressed arrow key, abort a all cell selection */
    if (NOVAE.Event.pressedArrowKey(e.keyCode)) {
      if (NOVAE.Sheets[NOVAE.CurrentSheet].Selector.allSelected) {
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.deleteCellHoverEffect();
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.allSelected = false;
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.getSelection();
      }
    }

    /** Handle arrow keys */
    switch (e.keyCode) {
      /** [UP] */
      case 38:
        /** Dont allow scrolling if user edits a cell */
        if (NOVAE.Event.inEditMode()) return void 0;
        NOVAE.Sheets[NOVAE.CurrentSheet].Settings.keyScrolledY -= 1;
        NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY = 1;
        /** Disable master selection */
        NOVAE.Cells.Master[NOVAE.CurrentSheet].Current = null;
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.selectCellByKeyPress();
        /** Update last key press timestamp */
        NOVAE.Sheets[NOVAE.CurrentSheet].Input.lastKeyPress = e.timeStamp - 100;
        return void 0;
      /** [DOWN] */
      case 40:
        /** Dont allow scrolling if user edits a cell */
        if (NOVAE.Event.inEditMode()) return void 0;
        NOVAE.Sheets[NOVAE.CurrentSheet].Settings.keyScrolledY += 1;
        NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollY = 1;
        /** Disable master selection */
        NOVAE.Cells.Master[NOVAE.CurrentSheet].Current = null;
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.selectCellByKeyPress();
        /** Update last key press timestamp */
        NOVAE.Sheets[NOVAE.CurrentSheet].Input.lastKeyPress = e.timeStamp - 100;
        return void 0;
      /** [LEFT] */
      case 37:
        /** Dont allow scrolling if user edits a cell */
        if (NOVAE.Event.inEditMode()) return void 0;
        NOVAE.Sheets[NOVAE.CurrentSheet].Settings.keyScrolledX -= NOVAE.Settings.Scroll.Horizontal;
        NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollX = NOVAE.Settings.Scroll.Horizontal;
        /** Disable master selection */
        NOVAE.Cells.Master[NOVAE.CurrentSheet].Current = null;
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.selectCellByKeyPress();
        /** Update last key press timestamp */
        NOVAE.Sheets[NOVAE.CurrentSheet].Input.lastKeyPress = e.timeStamp - 100;
        NOVAE.Sheets[NOVAE.CurrentSheet].Input.lastAction.scrollY = false;
        return void 0;
      /** [RIGHT] */
      case 39:
        /** Dont allow scrolling if user edits a cell */
        if (NOVAE.Event.inEditMode()) return void 0;
        NOVAE.Sheets[NOVAE.CurrentSheet].Settings.keyScrolledX += NOVAE.Settings.Scroll.Horizontal;
        NOVAE.Sheets[NOVAE.CurrentSheet].Settings.lastScrollX = NOVAE.Settings.Scroll.Horizontal;
        /** Disable master selection */
        NOVAE.Cells.Master[NOVAE.CurrentSheet].Current = null;
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.selectCellByKeyPress();
        /** Update last key press timestamp */
        NOVAE.Sheets[NOVAE.CurrentSheet].Input.lastKeyPress = e.timeStamp - 100;
        NOVAE.Sheets[NOVAE.CurrentSheet].Input.lastAction.scrollY = false;
        return void 0;
    }

    /** Check if user edits a cell */
    NOVAE.Event.sniffCellInput(e.keyCode);

  };

  /**
   * Listen for key leave
   *
   * @method keyUp
   * @static
   */
  NOVAE.Event.keyUp = function(e) {

    /** User left the [SHIFT] key */
    if (e.keyCode === 16) {
      e.preventDefault();
      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Keyboard.Shift = false;
    }

    /** User left the [STRG] key */
    if (e.keyCode === 17) {
      e.preventDefault();
      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Keyboard.Strg = false;
    }

    /** User left the [TAB] key */
    if (e.keyCode === 9) {
      e.preventDefault();
      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Keyboard.Tab = false;
    }

  };