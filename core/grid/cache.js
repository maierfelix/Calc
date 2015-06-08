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
  CORE.Grid.prototype.cacheDOM = function() {

    var children = CORE.DOM.Output.children;
    var childLength = CORE.DOM.Output.children.length;

    CORE.DOM.Cache = {};

    /** Used for faster iteration, also preallocate required memory */
    CORE.DOM.CacheArray = new Array(childLength);

    for (var ii = 0; ii < childLength; ++ii) {
      CORE.DOM.Cache[ii] = children[ii];
      CORE.DOM.CacheArray[ii] = children[ii];
    }

  };