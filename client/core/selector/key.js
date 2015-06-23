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
  NOVAE.Selector.prototype.selectCellByKeyPress = function() {

    var letter = this.parentSelectedCell.Letter;
    var number = this.parentSelectedCell.Number;

    /** Dont overscroll left axis start */
    if ( (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.keyScrolledX + letter) <= 0) {
      letter = letter + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.keyScrolledX + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX;
      /** Dont scroll below zero */
      if (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX >= 1) NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX -= 1;
      NOVAE.Sheets[NOVAE.CurrentSheet].Settings.keyScrolledX += 1;
      /** Update grid and menu */
      NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("default");
      NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
    /** Dont overscroll left axis end */
    } else if ((NOVAE.Sheets[NOVAE.CurrentSheet].Settings.keyScrolledX + letter) >= (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.x + 1)) {
      NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX += 1;
      letter = NOVAE.Sheets[NOVAE.CurrentSheet].Settings.x + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX;
      NOVAE.Sheets[NOVAE.CurrentSheet].Settings.keyScrolledX -= 1;
      /** Update grid and menu */
      NOVAE.Sheets[NOVAE.CurrentSheet].updateWidth("default");
      NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
    /** Update the letter */
    } else {
      letter = letter + (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.keyScrolledX + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX);
    }

    /** Dont overscroll top axis start */
    if ( (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.keyScrolledY + number) <= 0) {
      number = 1;
      NOVAE.Sheets[NOVAE.CurrentSheet].Settings.keyScrolledY += 1;
      /** Dont scroll below zero */
      if (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY >= 1) NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY -= 1;
      /** Update grid and menu */
      NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight("up", 1);
      NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
    /** Dont overscroll top axis end */
    } else if ((NOVAE.Sheets[NOVAE.CurrentSheet].Settings.keyScrolledY + number) >= (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y + 1) ) {
      NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY += 1;
      number = NOVAE.Sheets[NOVAE.CurrentSheet].Settings.y + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY;
      NOVAE.Sheets[NOVAE.CurrentSheet].Settings.keyScrolledY -= 1;
      /** Update grid and menu */
      NOVAE.Sheets[NOVAE.CurrentSheet].updateHeight("up", 1);
      NOVAE.Sheets[NOVAE.CurrentSheet].updateMenu();
    /** Update the number */
    } else {
      number = number + (NOVAE.Sheets[NOVAE.CurrentSheet].Settings.keyScrolledY + NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY);
    }

    /** User presses the shift key */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].Input.Keyboard.Shift) {
      this.getSelectionByKeyPress(letter, number);
    }
    /** Select the new cell */
    else {

      this.select = {
        Letter: letter,
        Number: number
      };

      /** Use first selected cell as parent cell selection */
      this.Selected.First = {
        Letter: letter,
        Number: number
      };

      /** Update last selected cell */
      this.Selected.Last = {
        Letter: letter,
        Number: number
      };

      this.getSelection();

    }

  };

  /**
   * User takes a selection by using the arrow keys
   *
   * @method getSelectionByKeyPress
   * @static
   */
  NOVAE.Selector.prototype.getSelectionByKeyPress = function(letter, number) {

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