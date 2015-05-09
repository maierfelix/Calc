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
    /** Dont overscroll top axis end */
    } else if ((CORE.Grid.Settings.keyScrolledY + number) >= CORE.Grid.Settings.y + 1) {
      number = CORE.Grid.Settings.y;
      CORE.Grid.Settings.keyScrolledY -= 1;
    /** Update the number */
    } else {
      number = number + CORE.Grid.Settings.keyScrolledY;
    }

    /** Select the new cell */
    this.selectCell(letter + number);

  };

}).call(this);