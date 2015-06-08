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

"use strict";

  /**
   * Do a master selection
   *
   * @method masterSelect
   * @static
   */
  CORE.Selector.prototype.masterSelect = function(name) {

    switch (typeof name) {
      case "string":
        /** Master selected column */
        if (!this.masterSelected.Columns[name]) {
          /** Owns similar properties as a grid cell */
          this.masterSelected.Columns[name] = new CORE.Sheets[CORE.CurrentSheet].Cell();
        }
        break;
      case "number":
        /** Master selected row */
        if (!this.masterSelected.Rows[name]) {
          /** Owns similar properties as a grid cell */
          this.masterSelected.Rows[name] = new CORE.Sheets[CORE.CurrentSheet].Cell();
        }
        break;
    }

    /** Set master selected row or column */
    this.masterSelected.Current = name;

  };

  /**
   * Overwrite cell styling with master styling
   *
   * @method inheritMasterStyling
   * @static
   */
  CORE.Selector.prototype.inheritMasterStyling = function(name, masterCell, property) {

    for (var ii in CORE.Cells.Used[CORE.CurrentSheet][name]) {
      CORE.Cells.Used[CORE.CurrentSheet][name][ii][property] = masterCell[property];
    }

  };