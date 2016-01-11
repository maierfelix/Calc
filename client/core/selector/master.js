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
   * Do a master selection
   *
   * @method masterSelect
   * @static
   */
  NOVAE.Selector.prototype.masterSelect = function(name) {

    switch (typeof name) {
      case "string":
        /** Master selected column */
        if (!NOVAE.Cells.Master[NOVAE.CurrentSheet].Columns[name]) {
          /** Owns similar properties as a grid cell */
          NOVAE.Cells.Master[NOVAE.CurrentSheet].Columns[name] = new NOVAE.Grid.Cell();
        }
        break;
      case "number":
        /** Master selected row */
        if (!NOVAE.Cells.Master[NOVAE.CurrentSheet].Rows[name]) {
          /** Owns similar properties as a grid cell */
          NOVAE.Cells.Master[NOVAE.CurrentSheet].Rows[name] = new NOVAE.Grid.Cell();
        }
        break;
    }

    /** Set master selected row or column */
    NOVAE.Cells.Master[NOVAE.CurrentSheet].Current = name;

  };