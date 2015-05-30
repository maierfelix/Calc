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
   * LiveCell Class
   *
   * @class LiveCell
   * @static
   */
  CORE.Grid.prototype.LiveCell = function() {

    /**
     * The url to fetch data from
     *
     * @property Url
     * @type String
     */
    this.Url = "";

    /**
     * Data refresh time
     *
     * @property RefreshTime
     * @type Integer
     */
    this.RefreshTime = 2500;

    /**
     * Live cell is active or not
     *
     * @property Active
     * @type Boolean
     */
    this.Active = false;

    /**
     * Save received data
     *
     * @property Data
     * @type String
     */
    this.Data = "";

  };