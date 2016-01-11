/**
 * This file is part of the Calc project.
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
    this.generateAbsoluteEmptyColumn();

    for (var xx = 0; xx < width; ++xx) {

      for (var yy = 0; yy < height; ++yy) {

        /** Generate columns */
        if (xx > 0 ) {
          if (xx !== lastX) {
            lastX = xx;
            this.generateMenuColumn((lastX + this.Settings.scrolledX));
            this.generateAbsoluteMenuColumn((lastX + this.Settings.scrolledX));
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

    this.updateColumns();

    this.updateRows();

  };

  /**
   * Update columns
   *
   * @method updateColumns
   * @static
   */
  NOVAE.Grid.prototype.updateColumns = function() {

    var scrolled = this.Settings.scrolledX;

    var element;

    var letter = 0;

    var resetValue = NOVAE.Sheets[NOVAE.CurrentSheet].CellTemplate.Width;

    for (var xx = 0; xx < this.Settings.x; ++xx) {
      if (xx > 0) {
        element = NOVAE.DOM.TableHeadAbsolute.children[xx].children[0];
        letter = NOVAE.$.numberToAlpha(scrolled + xx);
        element.innerHTML = letter;
        if (letter = NOVAE.Cells.Resized[NOVAE.CurrentSheet].Columns[letter]) {
          element.style.width = resetValue + letter.Width + "px";
          NOVAE.DOM.ColumnGroupAbsolute.children[xx].style.width = resetValue + letter.Width + "px";
        } else {
          element.style.width = resetValue + "px";
          NOVAE.DOM.ColumnGroupAbsolute.children[xx].style.width = resetValue + "px";
        }
      }
    }

    for (var xx = 0; xx < this.Settings.x; ++xx) {
      if (xx > 0) {
        element = NOVAE.DOM.TableHead.children[xx].children[0];
        letter = NOVAE.$.numberToAlpha(scrolled + xx);
        element.innerHTML = letter;
        if (letter = NOVAE.Cells.Resized[NOVAE.CurrentSheet].Columns[letter]) {
          element.style.width = resetValue + letter.Width + "px";
          NOVAE.DOM.ColumnGroup.children[xx].style.width = resetValue + letter.Width + "px";
        } else {
          element.style.width = resetValue + "px";
          NOVAE.DOM.ColumnGroup.children[xx].style.width = resetValue + "px";
        }
      }
    }

  };

  /**
   * Update rows
   *
   * @method updateRows
   * @static
   */
  NOVAE.Grid.prototype.updateRows = function() {

    var scrolled = this.Settings.scrolledY + 1;

    var element;

    var value = 0;

    var resetValue = NOVAE.Sheets[NOVAE.CurrentSheet].CellTemplate.Height;

    for (var yy = 0; yy < this.Settings.y; ++yy) {
      value = scrolled + yy;
      element = NOVAE.DOM.TableBodyAbsolute.children[yy].children[0].children[0];
      element.innerHTML = value;
      if (value = NOVAE.Cells.Resized[NOVAE.CurrentSheet].Rows[value]) {
        element.style.height = resetValue + value.Height + 1 + "px";
      } else {
        element.style.height = resetValue + 1 + "px";
      }
    }

    for (var yy = 0; yy < this.Settings.y; ++yy) {
      value = scrolled + yy;
      element = NOVAE.DOM.TableBody.children[yy].children[0].children[0];
      element.innerHTML = value;
      if (value = NOVAE.Cells.Resized[NOVAE.CurrentSheet].Rows[value]) {
        element.style.height = resetValue + value.Height + 1 + "px";
      } else {
        element.style.height = resetValue + 1 + "px";
      }
    }

  };