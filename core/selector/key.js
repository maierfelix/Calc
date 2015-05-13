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
   * Select a specific cell by key press
   *
   * @method selectCellByKeyPress
   * @static
   */
  CORE.Selector.prototype.selectCellByKeyPress = function() {

    var letter = this.parentSelectedCell.match(CORE.REGEX.numbers).join(""),
        number = parseInt(this.parentSelectedCell.match(CORE.REGEX.letters).join(""));

    /** Dont overscroll left axis start */
    if ( (CORE.Grid.Settings.keyScrolledX + CORE.$.alphaToNumber(letter)) <= 0) {
      letter = CORE.$.numberToAlpha(CORE.$.alphaToNumber(letter) + CORE.Grid.Settings.keyScrolledX);
      CORE.Grid.Settings.keyScrolledX += 1;
    /** Dont overscroll left axis end */
    } else if ((CORE.Grid.Settings.keyScrolledX + CORE.$.alphaToNumber(letter)) >= (CORE.Grid.Settings.x + 1)) {
      letter = CORE.$.numberToAlpha(CORE.Grid.Settings.x);
      CORE.Grid.Settings.keyScrolledX -= 1;
    /** Update the letter */
    } else {
      letter = CORE.$.numberToAlpha(CORE.$.alphaToNumber(letter) + CORE.Grid.Settings.keyScrolledX);
    }

    /** Dont overscroll top axis start */
    if ( (CORE.Grid.Settings.keyScrolledY + number) <= 0) {
      number = 1;
      CORE.Grid.Settings.keyScrolledY += 1;
      /** Dont scroll below zero */
      if (CORE.Grid.Settings.scrolledY >= 1) CORE.Grid.Settings.scrolledY -= 1;
      /** Update grid and menu */
      CORE.Grid.updateHeight("up", 1);
      CORE.Grid.generateMenu();
    /** Dont overscroll top axis end */
    } else if ((CORE.Grid.Settings.keyScrolledY + number) >= CORE.Grid.Settings.y + 1) {
      CORE.Grid.Settings.scrolledY += 1;
      number = CORE.Grid.Settings.y + CORE.Grid.Settings.scrolledY;
      CORE.Grid.Settings.keyScrolledY -= 1;
      /** Update grid and menu */
      CORE.Grid.updateHeight("up", 1);
      CORE.Grid.generateMenu();
    /** Update the number */
    } else {
      number = number + (CORE.Grid.Settings.keyScrolledY + CORE.Grid.Settings.scrolledY);
    }

    /** User presses the shift key */
    if (CORE.Input.Keyboard.Shift) {
      this.getSelectionByKeyPress(letter, number);
    }
    /** Select the new cell */
    else this.selectCell(letter + number);

  };

  /**
   * User takes a selection by using the arrow keys
   *
   * @method getSelectionByKeyPress
   * @static
   */
  CORE.Selector.prototype.getSelectionByKeyPress = function(letter, number) {

    /** User presses the shift key */
    if (CORE.Input.Keyboard.Shift) {

      /** Use first selected cell as parent cell selection */
      CORE.Cells.Selected.First = CORE.Cells.Select;

      /** Update last selected cell */
      CORE.Cells.Selected.Last = letter + number;

      /** Proccess the new selection */
      CORE.Selector.getSelection();

    }

  };

}).call(this);