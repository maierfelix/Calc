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