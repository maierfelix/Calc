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
   * Selection Helper
   *
   * @class Selector
   * @static
   */
  CORE.Selector = function() {

    /** Selected cells converted into usable format */
    this.Selected = {
      /** First selected cell */
      First: {
        Letter: null,
        Number: 0
      },
      /** Last selected cell */
      Last: {
        Letter: null,
        Number: 0
      }
    };

    /** Last selected menu position */
    this.MenuSelection = {
      Horizontal: 0,
      Vertical: 0
    };

    /** Array of all processed and selected cells */
    this.SelectedCells = [];

  };

  CORE.Selector.prototype = CORE.Selector;

  /**
   * Mark cell column in the menu based on selected cells
   *
   * @method updateMenu
   * @static
   */
  CORE.Selector.prototype.menuSelection = function(x, y) {

    y -= CORE.Grid.Settings.scrolledY;

    /** Clean the menu */
    if (this.MenuSelection.Horizontal >= 0 && this.MenuSelection.Vertical >= 0) {

      CORE.DOM.HorizontalMenu.children[this.MenuSelection.Horizontal].classList.add("cell_dark");
      CORE.DOM.HorizontalMenu.children[this.MenuSelection.Horizontal].classList.remove("cell_bright");

      CORE.DOM.VerticalMenu.children[this.MenuSelection.Vertical].classList.add("cell_dark");
      CORE.DOM.VerticalMenu.children[this.MenuSelection.Vertical].classList.remove("cell_bright");

    }

    /** Update the menu */
    this.MenuSelection.Horizontal = x;
    this.MenuSelection.Vertical = y;

    if (CORE.DOM.HorizontalMenu.children[x] && CORE.DOM.HorizontalMenu.children[y]) {

      CORE.DOM.HorizontalMenu.children[x].classList.add("cell_bright");
      CORE.DOM.HorizontalMenu.children[x].classList.remove("cell_dark");

      CORE.DOM.VerticalMenu.children[y].classList.add("cell_bright");
      CORE.DOM.VerticalMenu.children[y].classList.remove("cell_dark");

    }

  };

  /**
   * Add hover effect for all selected cells
   *
   * @method addCellHoverEffect
   * @static
   */
  CORE.Selector.prototype.addCellHoverEffect = function() {

    var letters = null,
        numbers = 0,
        jumps = 0,
        style = this.SelectedCells.length <= 1 ? "single_row_hovered" : "row_hovered";

    /** Add hover effect for all selected cells */
    for (var ii = 0; ii < this.SelectedCells.length; ++ii) {

      if (CORE.Cells.Used[this.SelectedCells[ii]]) {

        /** Check if cell has a custom font */
        if (CORE.Cells.Used[this.SelectedCells[ii]].Font) {
          console.log(CORE.Cells.Used[this.SelectedCells[ii]].Font);
        }

      }

      letters = this.SelectedCells[ii].match(CORE.REGEX.numbers).join("");
      numbers = parseInt(this.SelectedCells[ii].match(CORE.REGEX.letters).join(""));

      if (numbers >= CORE.Grid.Settings.scrolledY) {

      jumps = ( ( CORE.$.alphaToNumber(letters) - 1 ) * CORE.Grid.Settings.y ) + numbers - 1;

      if (CORE.DOM.Output.children[jumps - CORE.Grid.Settings.scrolledY]) CORE.DOM.Output.children[jumps - CORE.Grid.Settings.scrolledY].classList.add(style);

      CORE.DOM.DebugContainer.innerHTML += this.SelectedCells[ii] + ", ";

      }

    }

  };

  /**
   * Delete hover effect for last selected cells
   *
   * @method deleteCellHoverEffect
   * @static
   */
  CORE.Selector.prototype.deleteCellHoverEffect = function() {

    /** No cells found */
    if (!this.SelectedCells.length) return void 0;

    var letters = null,
        numbers = 0,
        jumps = 0,
        style = this.SelectedCells.length <= 1 ? "single_row_hovered" : "row_hovered";

    /** Delete hover effect for all selected cells */
    for (var ii = 0; ii < this.SelectedCells.length; ++ii) {

      letters = this.SelectedCells[ii].match(CORE.REGEX.numbers).join("");
      numbers = parseInt(this.SelectedCells[ii].match(CORE.REGEX.letters).join(""));

      jumps = ( ( CORE.$.alphaToNumber(letters) - 1 ) * CORE.Grid.Settings.y ) + numbers - 1;

      CORE.DOM.Output.children[jumps - CORE.Grid.Settings.scrolledY].classList.remove(style);
      CORE.DOM.Output.children[jumps + CORE.Grid.Settings.scrolledY].classList.remove(style);

      CORE.DOM.Output.children[jumps - CORE.Grid.Settings.scrolledY + 1].classList.remove(style);
      CORE.DOM.Output.children[jumps + CORE.Grid.Settings.scrolledY + 1].classList.remove(style);

      CORE.DOM.Output.children[jumps - CORE.Grid.Settings.scrolledY - 1].classList.remove(style);
      CORE.DOM.Output.children[jumps + CORE.Grid.Settings.scrolledY - 1].classList.remove(style);

    }

  };

  /**
   * Visualize the selection
   *
   * @method getSelection
   * @static
   */
  CORE.Selector.prototype.getSelection = function() {

    /** Delete selection effect of all last selected cells */ 
    this.deleteCellHoverEffect();

    var first = CORE.Cells.Selected.First,
        last = CORE.Cells.Selected.Last;

    /** No cells selected */
    if (!CORE.Cells.Selected.First || !CORE.Cells.Selected.Last) {
      if (!this.SelectedCells.length) return void 0;
      first = this.SelectedCells[0];
      last = this.SelectedCells.length > 1 ? this.SelectedCells[this.SelectedCells.length - 1] : this.SelectedCells[0];
    }

    /** Convert first selected cell into usable format */
    this.Selected.First.Letter = first.match(CORE.REGEX.numbers).join("");
    this.Selected.First.Number = parseInt(first.match(CORE.REGEX.letters).join(""));

    /** Convert last selected cell into usable format */
    this.Selected.Last.Letter = last.match(CORE.REGEX.numbers).join("");
    this.Selected.Last.Number = parseInt(last.match(CORE.REGEX.letters).join(""));

    /** Calculate space between the 2 selected cells */
    var width = CORE.$.alphaToNumber(this.Selected.Last.Letter) - CORE.$.alphaToNumber(this.Selected.First.Letter);

    /** Calculate the height between the 2 selected cells */
    var height = ( this.Selected.Last.Number - this.Selected.First.Number ) + this.Selected.First.Number;

    /** Backup variable to do object inversion */
    var backup = null;

    /** Shorter object access */
    var firstCell = this.Selected.First,
        lastCell = this.Selected.Last;

    /** If width is negative, convert into positive */
    if (width < 0) width = ( ~ width + 1 );

    /** If height is negative, convert into positive */
    if (height < 0) height = ( ~ height + 1 );

    /** Clean everything */
    CORE.Cells.Selected.Last = null;

    /** Clean debug field */
    CORE.DOM.DebugContainer.innerHTML = "";

    /** Clean last selected cells */
    this.SelectedCells = [];

    /** Calculate width and height */
    width = CORE.$.alphaToNumber(lastCell.Letter) - CORE.$.alphaToNumber(firstCell.Letter);

    if (lastCell.Number > firstCell.Number) {
      height = ( lastCell.Number - firstCell.Number ) + firstCell.Number;
    } else {
      height = firstCell.Number;
    }

    /** Vertical selection */
    if (width === 0 && height >= 0) {
      for (var yy = 0; yy < height; ++yy) {
        /** Positive vertical selection */
        if ( ( yy + 1 ) >= firstCell.Number) {
          this.SelectedCells.push(CORE.$.numberToAlpha(CORE.$.alphaToNumber(firstCell.Letter)) + (yy + 1));
        }
        /** Negative vertical selection */
        else if ( ( yy + 1 ) >= lastCell.Number) {
          this.SelectedCells.push((CORE.$.numberToAlpha(CORE.$.alphaToNumber(firstCell.Letter)) + (yy + 1)));
        }
      }
    /** Horizontal selection */
    } else if (width > 0) {
      /** Positive Diagonal horizontal and vertical selection */
      if (firstCell.Number <= lastCell.Number) {
        for (var xx = 0; xx <= width; ++xx) {
          for (var yy = 0; yy < height; ++yy) {
            if ((yy + 1) >= firstCell.Number) {
              this.SelectedCells.push(CORE.$.numberToAlpha(CORE.$.alphaToNumber(firstCell.Letter) + xx) + (yy + 1));
            }
          }
        }
      /** Negative Diagonal horizontal and vertical selection */
      } else {

        /** Inversion START */
        backup = firstCell.Number;
        firstCell.Number = lastCell.Number;
        lastCell.Number = backup;
        /** Inversion END */

        for (var xx = 0; xx <= width; ++xx) {
          for (var yy = 0; yy < height; ++yy) {
            if ((yy + 1) >= firstCell.Number) {
              this.SelectedCells.push(CORE.$.numberToAlpha(CORE.$.alphaToNumber(firstCell.Letter) + xx) + (yy + 1));
            }
          }
        }
      }
    /** Horizontal negative selection */
    } else if (width < 0) {
      /** Fix negative y-axis selection */
      if (firstCell.Number > lastCell.Number) {
        firstCell.Number = (lastCell.Number - firstCell.Number) + firstCell.Number;
      }

      /** Convert negative width into positive */
      width = ( ~ width + 1 );

      /** Inversion START */
      backup = firstCell.Letter;

      firstCell.Letter = lastCell.Letter;
      lastCell.Letter = backup;

      backup = firstCell.Number;

      firstCell.Number = lastCell.Number;
      lastCell.Number = backup;
      /** Inversion END */

      for (var xx = 0; xx <= width; ++xx) {
        for (var yy = 0; yy < height; ++yy) {
          if ((yy + 1) >= lastCell.Number) {
            this.SelectedCells.push(CORE.$.numberToAlpha(CORE.$.alphaToNumber(firstCell.Letter) + xx) + (yy + 1));
          }
        }
      }
    }

    /** Delete selection effect of all last selected cells */ 
    this.deleteCellHoverEffect();

    /** Add selection effect to all selected cells */
    this.addCellHoverEffect();

    /** Update menu items selection */
    this.menuSelection( (CORE.$.alphaToNumber(lastCell.Letter) - 1), (lastCell.Number - 1));

    /** Clean edited cells */
    if (!CORE.Input.Mouse.Edit) CORE.Grid.cleanEditSelection();

  };

}).call(this);