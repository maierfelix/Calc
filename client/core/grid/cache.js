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
   * Chache the whole grid DOM
   *
   * @method cacheDOM
   * @static
   */
  NOVAE.Grid.prototype.cacheDOM = function() {

    var children = NOVAE.DOM.Output.children;
    var childLength = NOVAE.DOM.Output.children.length;

    NOVAE.DOM.Cache = null;
    delete NOVAE.DOM.Cache;

    NOVAE.DOM.Cache = {};

    /** Used for faster iteration, also preallocate required memory */
    NOVAE.DOM.CacheArray = new Array(childLength);

    for (var ii = 0; ii < childLength; ++ii) {
      NOVAE.DOM.Cache[ii] = children[ii];
      NOVAE.DOM.CacheArray[ii] = children[ii];
    }

  };