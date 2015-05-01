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
   * Cell Class
   *
   * @class Cell
   * @static
   */
  CORE.Grid.prototype.Cell = function() {

    /**
     * Cell has a custom color
     *
     * @property Color
     * @type String
     */
    this.Color = null;

    /**
     * Cell contains a formula
     *
     * @property Formula
     * @type String
     */
    this.Formula = null;

    /**
     * Cell has content
     *
     * @property Content
     * @type String
     */
    this.Content = null;

    /**
     * Cell has a custom font
     *
     * @property Font
     * @type String
     */
    this.Font = null;

  };

}).call(this);