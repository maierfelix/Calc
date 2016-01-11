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
   * Append all resize column
   *
   * @param {string} [name] Column name
   * @param {number} [value] Resized width value
   * @method allResizeColumn
   * @static
   */
  NOVAE.Styler.prototype.allResizeColumn = function(name, value) {

    if (!name ||!value) return void 0;

    var node = NOVAE.Cells.All[NOVAE.CurrentSheet].Resize;

    if (!node.Column) {
      node.Column = {
        name: null,
        width: 0
      }
    }

    node.Column.name = name;
    node.Column.width = value;

  };

  /**
   * Append all resize row
   *
   * @param {string} [name] Row name
   * @param {number} [value] Resized height value
   * @method allResizeRow
   * @static
   */
  NOVAE.Styler.prototype.allResizeRow = function(name, value) {

    if (!name ||!value) return void 0;

    var node = NOVAE.Cells.All[NOVAE.CurrentSheet].Resize;

    if (!node.Row) {
      node.Row = {
        name: null,
        width: 0
      }
    }

    node.Row.name = name;
    node.Row.width = value;

  };