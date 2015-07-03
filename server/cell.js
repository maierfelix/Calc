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
   * Cell class
   * Represents a cell
   */
  function Cell() {
    /**
     * Font color
     *
     * @member {string}
     */
    this.Color = null;
    /**
     * Background color
     *
     * @member {string}
     */
    this.BackgroundColor = null;
    /**
     * Formula
     *
     * @member {string}
     */
    this.Formula = null;
    /**
     * Content
     *
     * @member {string}
     */
    this.Content = null;
    /**
     * Font family
     *
     * @member {string}
     */
    this.Font = null;
    /**
     * Font size
     *
     * @member {string}
     */
    this.FontSize = null;
    /**
     * Font bold
     *
     * @member {boolean}
     */
    this.FontBold = false;
    /**
     * Font italic
     *
     * @member {boolean}
     */
    this.FontItalic = false;
    /**
     * Font underlined
     *
     * @member {boolean}
     */
    this.FontUnderlined = false;
  };

  module.exports = Cell;