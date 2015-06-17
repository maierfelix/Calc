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
   * Mark cell column in the menu based on selected cells
   *
   * @method updateMenu
   * @static
   */
  CORE.Selector.prototype.menuSelection = function() {

    var x = 0;
    var y = 0;

    if (["verticalPositive", "horizontalPositive", "horizontalNegativePositive"].indexOf(this.selectionMode) >= 0) {
      /** Update menu items selection */
      x = this.Selected.Last.Letter - 1;
      y = this.Selected.Last.Number - 1;
    } else if (["verticalNegative", "horizontalNegative", "horizontalNegativeNegative"].indexOf(this.selectionMode) >= 0) {
      /** Update menu items selection */
      x = this.Selected.First.Letter - 1;
      y = this.Selected.First.Number - 1;
    }

    x -= CORE.Sheets[CORE.CurrentSheet].Settings.scrolledX;
    y -= CORE.Sheets[CORE.CurrentSheet].Settings.scrolledY;

    /** Clean the menu */
    if (this.MenuSelection.Horizontal >= 0 && this.MenuSelection.Vertical >= 0) {

      if (CORE.DOM.HorizontalMenu.children[this.MenuSelection.Horizontal]) {
        CORE.DOM.HorizontalMenu.children[this.MenuSelection.Horizontal].classList.add("cell_dark");
        CORE.DOM.HorizontalMenu.children[this.MenuSelection.Horizontal].classList.remove("cell_bright");
      }

      if (CORE.DOM.VerticalMenu.children[this.MenuSelection.Vertical]) {
        CORE.DOM.VerticalMenu.children[this.MenuSelection.Vertical].classList.add("cell_dark");
        CORE.DOM.VerticalMenu.children[this.MenuSelection.Vertical].classList.remove("cell_bright");
      }

    }

    /** Dont select anything if all selected */
    if (this.allSelected) return void 0;

    /** Update the menu */
    this.MenuSelection.Horizontal = x;
    this.MenuSelection.Vertical = y;

    if (CORE.DOM.HorizontalMenu.children[x]) {
      CORE.DOM.HorizontalMenu.children[x].classList.add("cell_bright");
      CORE.DOM.HorizontalMenu.children[x].classList.remove("cell_dark");
    }

    if (CORE.DOM.VerticalMenu.children[y]) {
      CORE.DOM.VerticalMenu.children[y].classList.add("cell_bright");
      CORE.DOM.VerticalMenu.children[y].classList.remove("cell_dark");
    }

  };