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
   * Collection Class
   *
   * @param {object} [dom] DOM fragment
   * @param {number} [x] X coordinate
   * @param {number} [y] Y coordinate
   * @param {number} [sizeX] X size
   * @param {number} [sizeY] Y size
   * @class Collection
   * @static
   */
  NOVAE.Collector.prototype.Collection = function(dom, x, y, sizeX, sizeY) {

    this.dom = dom;

    this.x = x;

    this.y = y;

    this.size = {
      x: sizeX,
      y: sizeY
    };

  };

  NOVAE.Collector.prototype.Collection = NOVAE.Collector.Collection;

  /**
   * Resize a Collection
   * 
   * @class resize
   * @static
   */
  NOVAE.Collector.prototype.Collection.prototype.resize = function() {

    console.log(this);

  };