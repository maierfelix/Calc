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
   * Select a specific cell by key press
   *
   * @method selectCellByKeyPress
   * @static
   */
  CORE.Selector.prototype.selectCellByKeyPress = function() {

    var letter = this.parentSelectedCell.Letter;
    var number = this.parentSelectedCell.Number;

    /** Dont overscroll left axis start */
    if ( (CORE.Sheets[CORE.CurrentSheet].Settings.keyScrolledX + letter) <= 0) {
      letter = letter + CORE.Sheets[CORE.CurrentSheet].Settings.keyScrolledX + CORE.Sheets[CORE.CurrentSheet].Settings.scrolledX;
      /** Dont scroll below zero */
      if (CORE.Sheets[CORE.CurrentSheet].Settings.scrolledX >= 1) CORE.Sheets[CORE.CurrentSheet].Settings.scrolledX -= 1;
      CORE.Sheets[CORE.CurrentSheet].Settings.keyScrolledX += 1;
      /** Update grid and menu */
      CORE.Sheets[CORE.CurrentSheet].updateWidth("default");
      CORE.Sheets[CORE.CurrentSheet].updateMenu();
    /** Dont overscroll left axis end */
    } else if ((CORE.Sheets[CORE.CurrentSheet].Settings.keyScrolledX + letter) >= (CORE.Sheets[CORE.CurrentSheet].Settings.x + 1)) {
      CORE.Sheets[CORE.CurrentSheet].Settings.scrolledX += 1;
      letter = CORE.Sheets[CORE.CurrentSheet].Settings.x + CORE.Sheets[CORE.CurrentSheet].Settings.scrolledX;
      CORE.Sheets[CORE.CurrentSheet].Settings.keyScrolledX -= 1;
      /** Update grid and menu */
      CORE.Sheets[CORE.CurrentSheet].updateWidth("default");
      CORE.Sheets[CORE.CurrentSheet].updateMenu();
    /** Update the letter */
    } else {
      letter = letter + (CORE.Sheets[CORE.CurrentSheet].Settings.keyScrolledX + CORE.Sheets[CORE.CurrentSheet].Settings.scrolledX);
    }

    /** Dont overscroll top axis start */
    if ( (CORE.Sheets[CORE.CurrentSheet].Settings.keyScrolledY + number) <= 0) {
      number = 1;
      CORE.Sheets[CORE.CurrentSheet].Settings.keyScrolledY += 1;
      /** Dont scroll below zero */
      if (CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY >= 1) CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY -= 1;
      /** Update grid and menu */
      CORE.Sheets[CORE.CurrentSheet].updateHeight("up", 1);
      CORE.Sheets[CORE.CurrentSheet].updateMenu();
    /** Dont overscroll top axis end */
    } else if ((CORE.Sheets[CORE.CurrentSheet].Settings.keyScrolledY + number) >= (CORE.Sheets[CORE.CurrentSheet].Settings.y + 1) ) {
      CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY += 1;
      number = CORE.Sheets[CORE.CurrentSheet].Settings.y + CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY;
      CORE.Sheets[CORE.CurrentSheet].Settings.keyScrolledY -= 1;
      /** Update grid and menu */
      CORE.Sheets[CORE.CurrentSheet].updateHeight("up", 1);
      CORE.Sheets[CORE.CurrentSheet].updateMenu();
    /** Update the number */
    } else {
      number = number + (CORE.Sheets[CORE.CurrentSheet].Settings.keyScrolledY + CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY);
    }

    /** User presses the shift key */
    if (CORE.Sheets[CORE.CurrentSheet].Input.Keyboard.Shift) {
      this.getSelectionByKeyPress(letter, number);
    }
    /** Select the new cell */
    else this.selectCell(letter, number);

  };

  /**
   * User takes a selection by using the arrow keys
   *
   * @method getSelectionByKeyPress
   * @static
   */
  CORE.Selector.prototype.getSelectionByKeyPress = function(letter, number) {

    /** Use first selected cell as parent cell selection */
    this.Selected.First = this.Select;

    /** Update last selected cell */
    this.Selected.Last = {
      Letter: letter,
      Number: number
    };

    /** Proccess the new selection */
    this.getSelection();

  };