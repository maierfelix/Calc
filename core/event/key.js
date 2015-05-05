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

  /**
   * Listen for key presses
   *
   * @method keyPress
   * @static
   */
  CORE.Event.keyPress = function(e) {
    switch (e.keyCode) {
      /** [UP] */
      case 38:
        /** Dont allow scrolling if user edits a cell */
        if (CORE.Event.inEditMode()) return void 0;
        if ( (CORE.Grid.Settings.scrolledY - 1) <= 0) {
          CORE.Grid.Settings.scrolledY = 0;
          CORE.Grid.Settings.lastScrollY = 1;
          CORE.Grid.updateHeight("default", 1);
          CORE.Grid.generateMenu();
          CORE.Selector.getSelection();
        }
        else if ( (CORE.Grid.Settings.scrolledY - 1) >= 0) {
          CORE.Grid.Settings.scrolledY -= 1;
          CORE.Grid.Settings.lastScrollY = 1;
          CORE.Grid.updateHeight("up", 1);
          CORE.Grid.generateMenu();
          CORE.Selector.getSelection();
        }
        return void 0;
      /** [DOWN] */
      case 40:
        /** Dont allow scrolling if user edits a cell */
        if (CORE.Event.inEditMode()) return void 0;
        CORE.Grid.Settings.scrolledY += 1;
        CORE.Grid.Settings.lastScrollY = 1;
        CORE.Grid.updateHeight("down", 1);
        CORE.Grid.generateMenu();
        CORE.Selector.getSelection();
        return void 0;
      /** [LEFT] */
      case 37:
        /** Dont allow scrolling if user edits a cell */
        if (CORE.Event.inEditMode()) return void 0;
        if (CORE.Grid.Settings.scrolledX - CORE.Settings.Scroll.Horizontal <= 0) {
          CORE.Grid.Settings.scrolledX = 0;
          CORE.Grid.Settings.lastScrollX = 0;
          CORE.Grid.updateWidth("default");
          CORE.Grid.generateMenu();
          CORE.Selector.getSelection();
        }
        else if (CORE.Grid.Settings.scrolledX - CORE.Settings.Scroll.Horizontal >= 0) {
          CORE.Grid.Settings.scrolledX -= CORE.Settings.Scroll.Horizontal;
          CORE.Grid.Settings.lastScrollX = CORE.Settings.Scroll.Horizontal;
          CORE.Grid.updateWidth("left");
          CORE.Grid.generateMenu();
          CORE.Selector.getSelection();
        }
        return void 0;
      /** [RIGHT] */
      case 39:
        /** Dont allow scrolling if user edits a cell */
        if (CORE.Event.inEditMode()) return void 0;
        CORE.Grid.Settings.scrolledX += CORE.Settings.Scroll.Horizontal;
        CORE.Grid.Settings.lastScrollX = CORE.Settings.Scroll.Horizontal;
        CORE.Grid.updateWidth("right");
        CORE.Grid.generateMenu();
        CORE.Selector.getSelection();
        return void 0;
    }

    /** Prevent line breaks on user input */
    if (e.keyCode === 13) {
      e.preventDefault();
      CORE.Event.pressedEnter(e.keyCode);
    }

    /** 
     * Check if user edits a cell
     * Delayed to fix some cell input issues
     */
    setTimeout( function() { CORE.Event.sniffCellInput(e.keyCode); }, 1);

  };

}).call(this);