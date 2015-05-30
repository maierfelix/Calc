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
   * Cell Class
   *
   * @class Cell
   * @static
   */
  CORE.Grid.prototype.Cell = function() {

    /**
     * Cell has a custom font color
     *
     * @property Color
     * @type String
     */
    this.Color = null;

    /**
     * Cell has a custom background color
     *
     * @property BackgroundColor
     * @type String
     */
    this.BackgroundColor = null;

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
     * Cell has a custom font family
     *
     * @property Font
     * @type String
     */
    this.Font = null;

    /**
     * Cell has a custom font size
     *
     * @property FontSize
     * @type String
     */
    this.FontSize = null;

    /**
     * Cell font is bold
     *
     * @property FontBold
     * @type String
     */
    this.FontBold = null;

    /**
     * Cell font is italic
     *
     * @property FontItalic
     * @type String
     */
    this.FontItalic = null;

    /**
     * Cell has custom borders
     *
     * @property Border
     * @type Object
     */
    this.Border = {
      /** Top border */
      top: null,
      /** Bottom border */
      bottom: null,
      /** Left border */
      left: null,
      /** Right border */
      right: null,
      /** Full bordered */
      full: null,
      /** Border style */
      style: null,
      /** Border color */
      color: null,
      /** Cell uses a custom border ? */
      used: null
    };

  };