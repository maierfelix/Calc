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
   * Dynamically generate a menu
   *
   * @method generateMenu
   * @static
   */
  NOVAE.Grid.prototype.generateMenu = function() {

    var lastX = 0,
        lastY = 0;

    var width = this.Settings.x,
        height = this.Settings.y - 1;

    /** View fix for the width */
    width += 1;

    /** View fix for the height */
    height += 1;

    this.generateEmptyColumn();

    for (var xx = 0; xx < width; ++xx) {

      for (var yy = 0; yy < height; ++yy) {

        /** Generate columns */
        if (xx > 0 ) {
          if (xx !== lastX) {
            lastX = xx;
            this.generateMenuColumn((lastX + this.Settings.scrolledX));
          }
        }

      }

    }

  };

  /**
   * Update the menu
   *
   * @method updateMenu
   * @static
   */
  NOVAE.Grid.prototype.updateMenu = function() {

  };

  /**
   * Update the menu, dont care about resizes
   *
   * @method updateMenuNoResizement
   * @static
   */
  NOVAE.Grid.prototype.updateMenuNoResizement = function() {

  };