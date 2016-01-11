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
   * Mark cell column in the menu based on selected cells
   *
   * @method updateMenu
   * @static
   */
  NOVAE.Selector.prototype.menuSelection = function() {

    var x = 0;
    var y = 0;
    var backup;

    if (["verticalPositive", "horizontalPositive"].indexOf(this.selectionMode) >= 0) {
      /** Update menu items selection */
      x = this.Selected.Last.Letter;
      y = this.Selected.Last.Number - 1;
    } else if (["verticalNegative", "horizontalNegative", "horizontalNegativeNegative", "horizontalNegativePositive"].indexOf(this.selectionMode) >= 0) {
      /** Update menu items selection */
      x = this.Selected.First.Letter;
      y = this.Selected.First.Number - 1;
    }

    x -= NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledX;
    y -= NOVAE.Sheets[NOVAE.CurrentSheet].Settings.scrolledY;

    /** Clean the horizontal menu */
    for (var ii = 0; ii < NOVAE.DOM.TableHeadAbsolute.children.length; ++ii) {
      NOVAE.DOM.TableHeadAbsolute.children[ii].children[0].classList.remove("cell_dark");
      NOVAE.DOM.TableHeadAbsolute.children[ii].children[0].classList.remove("cell_bright");
    }

    /** Clean the vertical menu */
    for (var ii = 0; ii < NOVAE.DOM.TableBodyAbsolute.children.length; ++ii) {
      NOVAE.DOM.TableBodyAbsolute.children[ii].children[0].children[0].classList.remove("cell_dark");
      NOVAE.DOM.TableBodyAbsolute.children[ii].children[0].children[0].classList.remove("cell_bright");
    }

    /** Dont select anything if all selected */
    if (this.allSelected) return void 0;

    /** Update the menu */
    this.MenuSelection.Horizontal = x;
    this.MenuSelection.Vertical = y;

    if (NOVAE.DOM.TableHeadAbsolute.children[x]) {
      NOVAE.DOM.TableHeadAbsolute.children[x].children[0].classList.add("cell_bright");
      NOVAE.DOM.TableHeadAbsolute.children[x].children[0].classList.remove("cell_dark");
    }

    if (NOVAE.DOM.TableBodyAbsolute.children[y]) {
      NOVAE.DOM.TableBodyAbsolute.children[y].children[0].children[0].classList.add("cell_bright");
      NOVAE.DOM.TableBodyAbsolute.children[y].children[0].children[0].classList.remove("cell_dark");
    }

  };